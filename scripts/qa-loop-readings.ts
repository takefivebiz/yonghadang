/**
 * Loop Reading QA 스크립트
 *
 * 목적:
 *   - action / standard / evaluate 3개 loopType에 대해
 *     /api/analyze/[session_id]/loop-reading/generate를 직접 호출하여
 *     생성 품질, 반복 금지 준수, loopType별 방향 차이를 검수한다.
 *
 * 사용법:
 *   1) dev 서버 실행 중이어야 함 (npm run dev)
 *   2) .env.local에 ANTHROPIC_API_KEY 설정
 *   3) npx tsx scripts/qa-loop-readings.ts
 *
 * 확인 기준:
 *   - 3개 loopType 각각 생성 성공
 *   - do_not_repeat 항목을 그대로 반복하지 않음
 *   - loopType별 방향이 다르게 나옴 (action=선택지, standard=기준, evaluate=방향성)
 *   - punch가 첫 번째 메시지이고 \n 규칙 적용됨
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import love1Pack from "../src/lib/content-packs/love-1";
import { DUMMY_INPUT_CONFIGS } from "../src/lib/data/dummy-analyze-config";
import { accumulateHiddenState } from "../src/lib/quiz/accumulator";
import { translateStateToSummary } from "../src/lib/quiz/translator";
import type { LoopType, LoopAnswer } from "../src/lib/types/quiz";

// ── 설정 ─────────────────────────────────────────────────────────────
const API_BASE = process.env.QA_API_BASE ?? "http://localhost:3000";
const QA_SESSION_ID = `qa-loop-${Date.now()}`;
const OUTPUT_PATH = resolve(process.cwd(), "scripts/qa-loop-output.json");

// ── 테스트 시나리오: 확인욕구형 (clarityHunger 지배) ─────────────────
const FREE_INPUT =
  "이 사람이 나를 좋아하는지 아닌지가 너무 궁금해. 같이 있을 때는 분명히 특별한 것 같은데, 막상 물어볼 수가 없어. 관계를 정의하면 불편해질까봐. 근데 이 상태로 계속 가면 나만 더 깊어질 것 같아서 이게 뭔지 알고 싶어.";

const SELECTIONS = [
  "need_clear_answer",
  "comfortable_without_progress",
  "holding_back_question",
  "silent_overthinking",
];

// ── State 계산 ────────────────────────────────────────────────────────
const state = accumulateHiddenState(
  SELECTIONS,
  love1Pack.scoreMap,
  love1Pack.dimensions,
);
const stateSummary = translateStateToSummary(
  state,
  love1Pack.translationRules,
  4,
);

// ── Mock sceneInsights (유료 씬 carry_over 시뮬레이션) ────────────────
// 실제 씬 생성 없이 loop 품질만 확인하기 위해 현실적인 carry_over를 직접 정의한다.
const MOCK_SCENE_INSIGHTS = [
  {
    scene_title: "지금 네 마음이 가리키는 것",
    key_insight:
      "확인 욕구가 강하지만 관계가 불편해질까봐 질문 자체를 억누르고 있다",
    do_not_repeat: ["분명한 답을 원한다", "질문을 참고 있다"],
  },
  {
    scene_title: "이 관계의 구조가 보여주는 것",
    key_insight:
      "상대는 관계를 정의하지 않는 게 편한 사람이고, 그 편안함이 너에게 모호함으로 쌓이고 있다",
    do_not_repeat: ["상대가 먼저 하지 않는다", "모호한 상태"],
  },
  {
    scene_title: "흔들림의 방향이 말하는 것",
    key_insight:
      "더 깊어지기 전에 알고 싶다는 것은 자신을 지키려는 신호이기도 하다",
    do_not_repeat: ["나만 더 깊어질 것 같아", "관계 정의"],
  },
];

// ── loopType 목록 ─────────────────────────────────────────────────────
const LOOP_TARGETS: { loopType: LoopType; loopTitle: string }[] = [
  { loopType: "action", loopTitle: "지금 내가 할 수 있는 일" },
  { loopType: "standard", loopTitle: "내 기준을 단단히 세우는 법" },
  { loopType: "evaluate", loopTitle: "이 관계를 더 봐도 되는지" },
];

// ── API 호출 ──────────────────────────────────────────────────────────
const callLoopGenerate = async (
  loopType: LoopType,
  loopTitle: string,
): Promise<LoopAnswer> => {
  const res = await fetch(
    `${API_BASE}/api/analyze/${QA_SESSION_ID}/loop-reading/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loopType,
        loopTitle,
        context: {
          freeInput: FREE_INPUT,
          stateSummary,
          sceneInsights: MOCK_SCENE_INSIGHTS,
        },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText}`);
  }

  return (await res.json()) as LoopAnswer;
};

// ── 품질 체크: do_not_repeat 위반 감지 ───────────────────────────────
const checkRepeatViolations = (answer: LoopAnswer): string[] => {
  const allText = answer.messages.map((m) => m.text).join("\n");
  const violations: string[] = [];
  for (const insight of MOCK_SCENE_INSIGHTS) {
    for (const phrase of insight.do_not_repeat) {
      if (allText.includes(phrase)) {
        violations.push(`"${phrase}" (from [${insight.scene_title}])`);
      }
    }
  }
  return violations;
};

// ── loopType별 방향성 키워드 기대값 ─────────────────────────────────
// 완벽한 자동 검증은 어렵지만, 핵심 개념이 있는지 간단히 체크
const DIRECTION_HINTS: Record<LoopType, string[]> = {
  action: ["선택", "할 수 있", "방향", "행동", "하면", "해보면", "결과"],
  standard: ["기준", "기준이", "내 기준", "나의", "판단", "결정", "기준으로"],
  evaluate: ["계속", "투자", "방향", "더 볼", "가는", "흘러", "의미"],
};

const checkDirectionHints = (answer: LoopAnswer, loopType: LoopType): number => {
  const allText = answer.messages.map((m) => m.text).join("\n");
  const hints = DIRECTION_HINTS[loopType];
  return hints.filter((h) => allText.includes(h)).length;
};

// ── Main ──────────────────────────────────────────────────────────────
const main = async () => {
  console.log("═══════════════════════════════════════════");
  console.log("   Loop Reading QA — love-1 / 확인욕구형");
  console.log("═══════════════════════════════════════════\n");

  console.log(`Session ID : ${QA_SESSION_ID}`);
  console.log(`State      : ${JSON.stringify(state)}`);
  console.log(`Summary    : ${stateSummary.join(" | ")}`);
  console.log(`Insights   : ${MOCK_SCENE_INSIGHTS.length}개 scene\n`);

  const output: Record<string, unknown> = {
    session_id: QA_SESSION_ID,
    free_input: FREE_INPUT,
    state,
    state_summary: stateSummary,
    mock_scene_insights: MOCK_SCENE_INSIGHTS,
    loop_results: {} as Record<string, unknown>,
  };

  let totalPassed = 0;
  let totalFailed = 0;

  for (const { loopType, loopTitle } of LOOP_TARGETS) {
    console.log(`\n${"─".repeat(50)}`);
    console.log(`loopType  : ${loopType}`);
    console.log(`loopTitle : ${loopTitle}`);
    console.log(`${"─".repeat(50)}`);

    try {
      const answer = await callLoopGenerate(loopType, loopTitle);

      // ── 메시지 출력 ──────────────────────────────────────────────
      for (const msg of answer.messages) {
        const label = msg.type === "punch" ? "🎯 PUNCH" : "   AI   ";
        const preview = msg.text.length > 120
          ? msg.text.slice(0, 120) + "…"
          : msg.text;
        console.log(`\n[${label}] ${preview}`);
      }

      // ── 품질 체크 ────────────────────────────────────────────────
      const violations = checkRepeatViolations(answer);
      const directionScore = checkDirectionHints(answer, loopType);
      const hasPunchFirst = answer.messages[0]?.type === "punch";
      const punchHasNewline = answer.messages[0]?.text.includes("\n") ?? false;
      const messageCount = answer.messages.length;

      console.log(`\n── 검증 결과 ──`);
      console.log(`  messages       : ${messageCount}개 (punch 1 + ai ${messageCount - 1})`);
      console.log(`  punch 첫번째   : ${hasPunchFirst ? "✓" : "✗"}`);
      console.log(`  punch \\n 규칙  : ${punchHasNewline ? "✓ 적용됨" : "△ 없음 (단문이면 OK)"}`);
      console.log(`  do_not_repeat  : ${violations.length === 0 ? "✓ 준수" : `✗ 위반 ${violations.length}건`}`);
      if (violations.length > 0) console.log(`    위반: ${violations.join(", ")}`);
      console.log(`  방향성 힌트    : ${directionScore}/${DIRECTION_HINTS[loopType].length}개 감지`);

      const passed =
        hasPunchFirst && violations.length === 0 && messageCount >= 3;
      console.log(`\n  → ${passed ? "✓ PASS" : "✗ FAIL"}`);
      if (passed) totalPassed++; else totalFailed++;

      (output.loop_results as Record<string, unknown>)[loopType] = {
        status: "success",
        message_count: messageCount,
        punch: answer.messages[0]?.text,
        ai_messages: answer.messages.slice(1).map((m) => m.text),
        generatedAt: answer.generatedAt,
        qa: { hasPunchFirst, punchHasNewline, violations, directionScore },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`\n  ✗ FAIL: ${msg}`);
      totalFailed++;
      (output.loop_results as Record<string, unknown>)[loopType] = {
        status: "error",
        error: msg,
      };
    }
  }

  // ── 최종 요약 ────────────────────────────────────────────────────
  console.log(`\n${"═".repeat(50)}`);
  console.log(`최종 결과: ${totalPassed}/${LOOP_TARGETS.length} PASS`);
  if (totalFailed > 0) {
    console.log(`FAIL: ${totalFailed}개`);
  }
  console.log(`${"═".repeat(50)}\n`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`결과 저장: ${OUTPUT_PATH}`);
};

main().catch(console.error);
