/**
 * QA 스크립트 (임시) — love-1 state model 재설계 후 subtype별 narrative 차이 확인용.
 *
 * 목적:
 *   - 3개 흔들림 subtype(고백 전 확인형 / 반복 해석형 / 미련형)의 selected option으로
 *     accumulator → translator → /api/analyze/[session_id]/generate를 호출하고,
 *     scene별 title / punch / 첫 ai message를 비교 가능한 형태로 출력한다.
 *   - subtype별로 narrative가 갈리는지, scene 1·4·5의 결 차이가 살아나는지 검수하기 위한 일회성 도구.
 *
 * 사용법:
 *   1) 별도 터미널에서 dev 서버 실행: `npm run dev`
 *   2) .env.local에 ANTHROPIC_API_KEY 설정되어 있어야 함
 *   3) `npx tsx scripts/qa-love1.ts`
 *
 * 결과:
 *   - 콘솔에 3개 subtype 비교 출력
 *   - scripts/qa-love1-output.json 에 전체 응답 저장 (.gitignore 추가 권장)
 *
 * 주의:
 *   - 이 스크립트는 production 코드에 영향이 없는 임시 QA 도구다. 검수 후 삭제 가능.
 *   - 무료 scene(1·2) → 유료 scene(3~6) 순서로 2단계 호출한다 (route.ts 분리 호출 규약).
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import love1Pack from "../src/lib/content-packs/love-1";
import { DUMMY_INPUT_CONFIGS } from "../src/lib/data/dummy-analyze-config";
import { DUMMY_SCENE_CONFIGS } from "../src/lib/data/scene-configs";
import { accumulateHiddenState } from "../src/lib/quiz/accumulator";
import { translateStateToSummary } from "../src/lib/quiz/translator";
import type { SceneConfig } from "../src/lib/types/content";
import type { ResultScene, SceneMessage } from "../src/lib/types/result";

// ── 설정 ─────────────────────────────────────────────────────────────
const API_BASE = process.env.QA_API_BASE ?? "http://localhost:3000";
const CONTENT_TITLE = "이 사람, 나를 정말 좋아하는 걸까요?";
const CATEGORY = "love";
const OUTPUT_PATH = resolve(process.cwd(), "scripts/qa-love1-output.json");

// ── 시나리오 정의 ────────────────────────────────────────────────────
// 각 시나리오는 Q1~Q5의 selected option value와 자유입력 텍스트로 구성된다.
// 자유입력은 subtype의 narrative anchoring을 위한 구체 상황을 담는다.
interface Scenario {
  subtype: string;
  freeText: string;
  selections: {
    q1: string;
    q2: string;
    q3: string[]; // multiple
    q4: string;
    q5: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    subtype: "고백 전 확인형",
    freeText:
      "한 달 정도 자주 만나고 있는 사람이 있어. 다음 주에 둘이 여행을 가기로 했는데, 그 전에 내 마음 정리해서 고백할까 고민 중이야. 근데 막상 말 꺼내려고 하면, 이 사람이 어떻게 받을지 한 번만 더 확인하고 싶어져.",
    selections: {
      q1: "last_check_before_action",
      q2: "emotion_without_clarity",
      q3: ["one_more_check_then_decide", "holding_back_question"],
      q4: "pressure_to_decide_soon",
      q5: "want_to_act_and_decide",
    },
  },
  {
    subtype: "반복 해석형",
    freeText:
      "어제 만났을 때 헤어지면서 그 사람이 '오늘 진짜 좋았어'라고 했는데, 그게 그냥 인사인지 진심인지 자꾸 생각하게 돼. 메시지 답도 평소보다 5분 늦어졌는데 그게 무슨 의미일까 하루 종일 곱씹고 있어.",
    selections: {
      q1: "replaying_conversations",
      q2: "signal_without_commitment",
      q3: ["rechecking_signals", "silent_overthinking"],
      q4: "exhausted_by_my_own_interpretation",
      q5: "want_to_know_their_heart",
    },
  },
  {
    subtype: "미련형",
    freeText:
      "두 달 전에 자연스럽게 멀어졌어. 마지막에 '바쁘니까 다음에 보자'고 했는데 그 뒤로 연락이 없어. 머리로는 끝났다고 정리했는데, 어제 길에서 비슷한 향수 냄새 맡고 또 마음이 흔들렸어.",
    selections: {
      q1: "cant_let_go_after_end",
      q2: "fading_response",
      q3: ["unwanted_recurrence", "trying_to_detach"],
      q4: "mind_keeps_returning",
      q5: "want_possibility",
    },
  },
];

// ── Helper: question_text/labels 매핑 ────────────────────────────────
const inputConfig = DUMMY_INPUT_CONFIGS["love-1"];

const findLabel = (qIndex: number, value: string): string => {
  const q = inputConfig.questions.find((q) => q.index === qIndex);
  return q?.options.find((o) => o.value === value)?.label ?? value;
};

const buildAnswers = (sel: Scenario["selections"]) => {
  return [
    {
      question_text: inputConfig.questions[0].text,
      values: [sel.q1],
      labels: [findLabel(1, sel.q1)],
    },
    {
      question_text: inputConfig.questions[1].text,
      values: [sel.q2],
      labels: [findLabel(2, sel.q2)],
    },
    {
      question_text: inputConfig.questions[2].text,
      values: sel.q3,
      labels: sel.q3.map((v) => findLabel(3, v)),
    },
    {
      question_text: inputConfig.questions[3].text,
      values: [sel.q4],
      labels: [findLabel(4, sel.q4)],
    },
    {
      question_text: inputConfig.questions[4].text,
      values: [sel.q5],
      labels: [findLabel(5, sel.q5)],
    },
  ];
};

const flattenSelections = (sel: Scenario["selections"]): string[] => [
  sel.q1,
  sel.q2,
  ...sel.q3,
  sel.q4,
  sel.q5,
];

// ── Generate API 호출 ────────────────────────────────────────────────
interface GenerateResponse {
  session_id: string;
  result_scenes: ResultScene[];
}

const callGenerate = async (
  sessionId: string,
  body: Record<string, unknown>,
): Promise<GenerateResponse> => {
  const res = await fetch(`${API_BASE}/api/analyze/${sessionId}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`generate ${res.status}: ${errText}`);
  }

  return (await res.json()) as GenerateResponse;
};

// ── 시나리오 단일 실행 ──────────────────────────────────────────────
interface ScenarioResult {
  subtype: string;
  selections: string[];
  hidden_state: Record<string, number>;
  state_summary: string[];
  result_scenes: ResultScene[];
}

const runScenario = async (scenario: Scenario): Promise<ScenarioResult> => {
  const sessionId = `qa-${Date.now()}-${scenario.subtype.replace(/\s/g, "")}`;
  const selectedValues = flattenSelections(scenario.selections);

  // 1) hidden state 계산
  const state = accumulateHiddenState(
    selectedValues,
    love1Pack.scoreMap,
    love1Pack.dimensions,
  );

  // 2) state_summary 생성
  const stateSummary = translateStateToSummary(
    state,
    love1Pack.translationRules,
    4,
  );

  // 3) generate 호출용 공통 payload
  const sceneConfig = DUMMY_SCENE_CONFIGS["love-1"] as SceneConfig;
  const userInput = {
    text: scenario.freeText,
    answers: buildAnswers(scenario.selections),
  };
  const baseBody = {
    content_title: CONTENT_TITLE,
    category: CATEGORY,
    user_input: userInput,
    scene_config: sceneConfig,
    state_summary: stateSummary,
  };

  // 4) 무료 scene 생성 (scene 1, 2)
  const freeIndexes = sceneConfig.scenes
    .filter((s) => s.is_free)
    .map((s) => s.index);

  console.log(`  [${scenario.subtype}] 무료 scene 생성 중...`);
  const freeRes = await callGenerate(sessionId, {
    ...baseBody,
    scene_indexes: freeIndexes,
  });

  // 5) 유료 scene 생성 (scene 3~6) — free_scene_context 필수
  const lastFreeScene = freeRes.result_scenes[freeRes.result_scenes.length - 1];
  const freeSceneContext = {
    sceneTitle: lastFreeScene.scene_title,
    lastMessages: (lastFreeScene.messages ?? []).slice(-3) as SceneMessage[],
  };
  const paidIndexes = sceneConfig.scenes
    .filter((s) => !s.is_free)
    .map((s) => s.index);

  console.log(`  [${scenario.subtype}] 유료 scene 생성 중...`);
  const paidRes = await callGenerate(sessionId, {
    ...baseBody,
    scene_indexes: paidIndexes,
    free_scene_context: freeSceneContext,
  });

  // 6) 무료 + 유료 합쳐서 정렬
  const allScenes = [...freeRes.result_scenes, ...paidRes.result_scenes].sort(
    (a, b) => a.scene_index - b.scene_index,
  );

  return {
    subtype: scenario.subtype,
    selections: selectedValues,
    hidden_state: state,
    state_summary: stateSummary,
    result_scenes: allScenes,
  };
};

// ── 비교 출력 포맷터 ────────────────────────────────────────────────
const firstAiMessage = (messages: SceneMessage[] | null): string => {
  const m = messages?.find((x) => x.type === "ai");
  return m ? m.text : "(ai 메시지 없음)";
};

const firstPunch = (messages: SceneMessage[] | null): string => {
  const m = messages?.find((x) => x.type === "punch");
  return m ? m.text : "(punch 없음)";
};

const printComparison = (results: ScenarioResult[]): void => {
  const div = "═".repeat(80);
  const sub = "─".repeat(80);

  for (const r of results) {
    console.log("\n" + div);
    console.log(`SUBTYPE: ${r.subtype}`);
    console.log(div);

    console.log("\n● selected values:");
    console.log("  " + r.selections.join(", "));

    console.log("\n● hidden state:");
    for (const [k, v] of Object.entries(r.hidden_state)) {
      console.log(`  ${k}: ${v}`);
    }

    console.log("\n● state_summary (Claude 입력):");
    r.state_summary.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

    for (const scene of r.result_scenes) {
      console.log("\n" + sub);
      console.log(`Scene ${scene.scene_index} — ${scene.scene_title}`);
      console.log(sub);
      console.log("punch:    " + firstPunch(scene.messages));
      console.log("ai (1st): " + firstAiMessage(scene.messages));
    }
  }

  // 추가: scene 1 / 4 / 5 가로 비교 요약
  console.log("\n" + div);
  console.log("CROSS COMPARE — scene 1 / 4 / 5 (subtype별 결 차이 검수)");
  console.log(div);
  for (const sceneIdx of [1, 4, 5]) {
    console.log(`\n[Scene ${sceneIdx}]`);
    for (const r of results) {
      const s = r.result_scenes.find((x) => x.scene_index === sceneIdx);
      console.log(`  • ${r.subtype}`);
      console.log(`      title : ${s?.scene_title}`);
      console.log(`      punch : ${firstPunch(s?.messages ?? null)}`);
    }
  }
};

// ── main ────────────────────────────────────────────────────────────
const main = async (): Promise<void> => {
  console.log(`API_BASE: ${API_BASE}`);
  console.log(`총 ${SCENARIOS.length}개 시나리오 실행\n`);

  const results: ScenarioResult[] = [];
  for (const scenario of SCENARIOS) {
    console.log(`▶ ${scenario.subtype} 시작`);
    try {
      const r = await runScenario(scenario);
      results.push(r);
      console.log(`✓ ${scenario.subtype} 완료\n`);
    } catch (err) {
      console.error(`✗ ${scenario.subtype} 실패:`, err);
    }
  }

  if (results.length === 0) {
    console.error("\n생성된 결과가 없어 비교 출력을 건너뜁니다.");
    process.exit(1);
  }

  printComparison(results);

  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n전체 응답 저장: ${OUTPUT_PATH}`);
};

main().catch((err) => {
  console.error("스크립트 실패:", err);
  process.exit(1);
});
