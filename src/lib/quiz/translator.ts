import type { HiddenState, StateTranslationRule } from "@/lib/types/quiz";

/**
 * hidden state 점수를 Claude에게 전달할 사용자 상태 산문 문장 배열로 변환한다.
 * threshold 조건을 통과한 규칙 중 priority 순으로 최대 maxStatements개를 선택한다.
 *
 * 두 가지 규칙 형식을 지원한다:
 *   - SingleDimensionRule: 단일 차원 + threshold (양극 dimension 지원, ± 분기)
 *   - CompoundRule: 여러 차원 조건의 AND 조합 (subtype 식별용)
 *
 * threshold 부호 분기:
 *   threshold >= 0 → score >= threshold  ("+" 방향 강한 상태)
 *   threshold <  0 → score <= threshold  ("−" 방향 강한 상태)
 *
 * @returns Claude 프롬프트의 "사용자 내면 상태" 섹션에 삽입할 문장 배열
 */
export const translateStateToSummary = (
  state: HiddenState,
  rules: StateTranslationRule[],
  maxStatements: number = 4,
): string[] => {
  // threshold 조건 통과한 규칙만 추림 (single은 단일 차원, compound는 모든 조건 AND)
  const matched = rules.filter((rule) => {
    if (isCompoundRule(rule)) {
      // compound: 모든 condition이 충족되어야 통과
      return rule.conditions.every((cond) =>
        matchThreshold(state[cond.dimension] ?? 0, cond.threshold),
      );
    }
    // single dimension (기존 동작)
    return matchThreshold(state[rule.dimension] ?? 0, rule.threshold);
  });

  // priority 오름차순 정렬 후 dedup
  const sorted = matched.sort((a, b) => a.priority - b.priority);
  const deduplicated = dedupRules(sorted);

  return deduplicated.slice(0, maxStatements).map((r) => r.statement);
};

/** threshold 부호에 따라 매칭 방향 분기 */
const matchThreshold = (score: number, threshold: number): boolean =>
  threshold >= 0 ? score >= threshold : score <= threshold;

/** discriminated union 타입 가드 */
const isCompoundRule = (
  rule: StateTranslationRule,
): rule is Extract<StateTranslationRule, { conditions: unknown[] }> =>
  "conditions" in rule;

/**
 * 통과된 규칙 중 중복을 제거한다.
 *   - SingleDimensionRule: 같은 dimension 중 threshold 절댓값이 가장 큰 것 (신호 강도 우선)
 *   - CompoundRule: 같은 groupKey 중 priority 가장 높은 것 (정렬된 입력에서 첫 번째)
 *
 * single과 compound는 서로 다른 키 공간을 사용하므로 충돌하지 않는다.
 */
const dedupRules = (
  rules: StateTranslationRule[],
): StateTranslationRule[] => {
  const seen = new Map<string, StateTranslationRule>();

  for (const rule of rules) {
    const key = isCompoundRule(rule)
      ? `compound:${rule.groupKey}`
      : `dim:${rule.dimension}`;
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, rule);
      continue;
    }

    // single dimension: 신호 강도(threshold 절댓값)가 더 큰 것으로 교체
    if (!isCompoundRule(rule) && !isCompoundRule(existing)) {
      if (Math.abs(rule.threshold) > Math.abs(existing.threshold)) {
        seen.set(key, rule);
      }
    }
    // compound: 정렬된 입력에서 먼저 등장한 것(=priority 가장 높음)이 우선이므로 유지
  }

  return rules.filter((r) => {
    const key = isCompoundRule(r)
      ? `compound:${r.groupKey}`
      : `dim:${r.dimension}`;
    return seen.get(key) === r;
  });
};
