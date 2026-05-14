import type { HiddenState, StateTranslationRule } from "@/lib/types/quiz";

/**
 * hidden state 점수를 Claude에게 전달할 사용자 상태 산문 문장 배열로 변환한다.
 * threshold 이상인 규칙 중 priority 순으로 최대 maxStatements개를 선택한다.
 *
 * 같은 dimension에 threshold가 다른 규칙이 여러 개 있을 경우,
 * 가장 높은 threshold를 만족하는 규칙(더 강한 상태 표현)이 priority 낮으면 먼저 선택된다.
 * priority가 같으면 먼저 정의된 규칙이 선택된다.
 *
 * @returns Claude 프롬프트의 "사용자 내면 상태" 섹션에 삽입할 문장 배열
 */
export const translateStateToSummary = (
  state: HiddenState,
  rules: StateTranslationRule[],
  maxStatements: number = 4,
): string[] => {
  // threshold 조건 통과한 규칙만 추림
  const matched = rules.filter(
    (rule) => (state[rule.dimension] ?? 0) >= rule.threshold,
  );

  // priority 오름차순 정렬 후 최대 개수만큼 slice
  const sorted = matched.sort((a, b) => a.priority - b.priority);

  // 동일 dimension에서 여러 규칙이 통과된 경우, 가장 threshold 높은 것(강한 상태)만 남김
  const deduplicated = dedupByDimension(sorted);

  return deduplicated.slice(0, maxStatements).map((r) => r.statement);
};

/**
 * 같은 dimension의 규칙이 여러 개 통과됐을 때 threshold가 높은 규칙(강한 상태)만 남긴다.
 * priority 정렬 후 호출하므로, 같은 dimension에서 먼저 나온 것(=priority 낮음)을 우선한다.
 * 단, 같은 dimension에서 threshold가 더 높은 규칙이 있으면 그것으로 대체한다.
 */
const dedupByDimension = (rules: StateTranslationRule[]): StateTranslationRule[] => {
  const seen = new Map<string, StateTranslationRule>();

  for (const rule of rules) {
    const existing = seen.get(rule.dimension);
    if (!existing || rule.threshold > existing.threshold) {
      seen.set(rule.dimension, rule);
    }
  }

  // priority 순서 유지
  return rules.filter((r) => seen.get(r.dimension) === r);
};
