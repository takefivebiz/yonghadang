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
  // ── 강한 흔들림형 ──────────────────────────────────────────────────
  {
    subtype: "강한흔들림형",
    freeText:
      "어제 카페에서 만났는데 헤어질 때 '다음에 또 보자'고 했어. 근데 오늘 인스타 스토리에 다른 친구랑 찍은 사진 올라왔거든. 그 사진 보고 나서 아침부터 계속 생각이 멈추질 않아. 카톡 읽씹인지 아닌지 계속 확인하게 되고, 아무것도 안 잡혀.",
    selections: {
      q1: "just_started_shaking",
      q2: "inconsistent_interest",
      q3: ["mood_swings_by_signal", "rechecking_signals"],
      q4: "confirmed_one_sided",
      q5: "want_expression",
    },
  },
  // ── 확인 욕구형 ────────────────────────────────────────────────────
  {
    subtype: "확인욕구형",
    freeText:
      "이 사람이 나를 좋아하는지 아닌지가 너무 궁금해. 같이 있을 때는 분명히 특별한 것 같은데, 막상 물어볼 수가 없어. 관계를 정의하면 불편해질까봐. 근데 이 상태로 계속 가면 나만 더 깊어질 것 같아서 이게 뭔지 알고 싶어.",
    selections: {
      q1: "need_clear_answer",
      q2: "comfortable_without_progress",
      q3: ["holding_back_question", "silent_overthinking"],
      q4: "prolonged_ambiguity",
      q5: "want_direction",
    },
  },
  // ── 기대 접기형 ────────────────────────────────────────────────────
  {
    subtype: "기대접기형",
    freeText:
      "처음엔 진짜 기대했어. 근데 몇 달 지나면서 이 사람은 절대 먼저 안 한다는 걸 알게 됐어. 연락도 내가 먼저, 만남도 내가 먼저. 이제는 기대를 줄여야 한다는 걸 알겠는데, 완전히 닫지는 못하겠어. 그냥 이대로 흘러가는 게 맞는 건지.",
    selections: {
      q1: "slowly_lowering_expectation",
      q2: "comfortable_without_progress",
      q3: ["trying_to_detach", "silent_overthinking"],
      q4: "failing_to_let_go",
      q5: "want_time_to_fold",
    },
  },

  // ── 소진형 ────────────────────────────────────────────────────────
  {
    subtype: "소진형",
    freeText:
      "솔직히 지쳤어. 이 사람이 좋은지 아닌지도 이제 잘 모르겠어. 신호 찾고, 해석하고, 기다리는 걸 너무 오래 반복했더니 감정이 무뎌진 것 같아. 그냥 끝내고 싶은데 실제로 연락 끊으면 또 후회할까봐 그것도 못 하겠어.",
    selections: {
      q1: "worn_out_from_shaking",
      q2: "fading_response",
      q3: ["trying_to_detach", "unwanted_recurrence"],
      q4: "exhausted_by_my_own_interpretation",
      q5: "want_time_to_fold",
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
