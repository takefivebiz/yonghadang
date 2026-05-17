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
import { INPUT_CONFIGS } from "../src/lib/data/input-configs";
import { getSceneConfig } from "../src/lib/data/scene-configs";
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
  // ── confession_imminent ────────────────────────────────────────────
  // 목표 차원: actionImminence ≥ 4 + clarityHunger ≥ 3
  // q1 clarity_and_decide (cH:3, aI:2)
  // q2 signal_without_commitment (iL:2, cH:1)
  // q3 one_more_check_then_decide+holding_back_question (aI:3+cH:2, cH:2+aI:1)
  // q4 pressure_to_decide_soon (aI:3, cH:1)
  // q5 want_to_act_and_decide (aI:3, cH:2)
  // 예상: actionImminence≈12, clarityHunger≈11
  {
    subtype: "confession_imminent",
    freeText:
      "이 사람이랑 분위기가 계속 좋은데, 확인을 안 하면 나만 깊어질 것 같아. 한 번만 더 좋은 반응 오면 솔직하게 말하려고. 근데 그게 계속 미뤄지고 있어. 이제 진짜 뭔가 정리해야 할 것 같아.",
    selections: {
      q1: "clarity_and_decide",
      q2: "signal_without_commitment",
      q3: ["one_more_check_then_decide", "holding_back_question"],
      q4: "pressure_to_decide_soon",
      q5: "want_to_act_and_decide",
    },
  },

  // ── interpretive_loop + clarity_hungry ────────────────────────────
  // 목표 차원: interpretiveLoop ≥ 4 + clarityHunger ≥ 4
  // q1 replaying_conversations (iL:3, sI:1)
  // q2 emotion_without_clarity (cH:2, iL:1)
  // q3 looping_inside+holding_back_question (iL:2+sI:1, cH:2+aI:1)
  // q4 exhausted_by_my_own_interpretation (iL:2, eF:3)
  // q5 want_to_know_their_heart (iL:2, cH:2)
  // 예상: interpretiveLoop≈10, clarityHunger≈6
  {
    subtype: "interpretive_loop+clarity_hungry",
    freeText:
      "그날 헤어지면서 했던 말이 계속 머릿속에 돌아. 어떤 의미인지 알고 싶은데 물어볼 수가 없어. 마음이 있는 건지 아닌지 정확히 알고 싶어. 그 사람이 나를 어떻게 생각하는지 모르겠어서 너무 힘들어.",
    selections: {
      q1: "replaying_conversations",
      q2: "emotion_without_clarity",
      q3: ["looping_inside", "holding_back_question"],
      q4: "exhausted_by_my_own_interpretation",
      q5: "want_to_know_their_heart",
    },
  },

  // ── folding_expectation + burnout ─────────────────────────────────
  // 목표 차원: expectationFold ≥ 4 + emotionalFatigue ≥ 4
  // q1 fading_with_fatigue (eF:3, emF:2)
  // q2 fading_response (emF:2, eF:2)
  // q3 trying_to_detach (eF:2, emF:1)
  // q4 cant_move_on (eF:3, sI:2)
  // q5 want_time_to_fold (eF:3, emF:2)
  // 예상: expectationFold≈13, emotionalFatigue≈7
  {
    subtype: "folding_expectation+burnout",
    freeText:
      "기대를 접어야 한다는 건 알아. 이미 많이 지쳤고, 이 관계가 어디로 가는지도 모르겠어. 근데 완전히 포기하면 또 다시 돌아올 것 같아서 그것도 못 하겠어. 그냥 시간이 좀 필요한 것 같아.",
    selections: {
      q1: "fading_with_fatigue",
      q2: "fading_response",
      q3: ["trying_to_detach"],
      q4: "cant_move_on",
      q5: "want_time_to_fold",
    },
  },
];

// ── Helper: question_text/labels 매핑 (V2: steps 기반) ─────────────────
const inputConfig = INPUT_CONFIGS["love-1"];

// choiceSteps: freeText step을 제외한 선택형 steps (순서대로 q1~q5)
const choiceSteps = inputConfig.steps.filter(
  (s) => s.type === "singleChoice" || s.type === "multiChoice",
);

const findLabel = (stepId: string, value: string): string => {
  const step = inputConfig.steps.find((s) => s.id === stepId);
  if (!step || step.type === "freeText") return value;
  return step.options.find((o) => o.value === value)?.label ?? value;
};

const buildAnswers = (sel: Scenario["selections"]) => {
  return [
    {
      step_id: choiceSteps[0].id,
      question_text: choiceSteps[0].question,
      values: [sel.q1],
      labels: [findLabel(choiceSteps[0].id, sel.q1)],
    },
    {
      step_id: choiceSteps[1].id,
      question_text: choiceSteps[1].question,
      values: [sel.q2],
      labels: [findLabel(choiceSteps[1].id, sel.q2)],
    },
    {
      step_id: choiceSteps[2].id,
      question_text: choiceSteps[2].question,
      values: sel.q3,
      labels: sel.q3.map((v) => findLabel(choiceSteps[2].id, v)),
    },
    {
      step_id: choiceSteps[3].id,
      question_text: choiceSteps[3].question,
      values: [sel.q4],
      labels: [findLabel(choiceSteps[3].id, sel.q4)],
    },
    {
      step_id: choiceSteps[4].id,
      question_text: choiceSteps[4].question,
      values: [sel.q5],
      labels: [findLabel(choiceSteps[4].id, sel.q5)],
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
  const sceneConfig = getSceneConfig("love-1") as SceneConfig;
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
