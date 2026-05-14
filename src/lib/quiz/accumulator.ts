import type { HiddenDimension, HiddenState, ScoreDelta, AdditionalReading } from "@/lib/types/quiz";

/**
 * 사용자가 선택한 option value 목록과 scoreMap을 받아 hidden state를 계산한다.
 * 순수 함수. 클라이언트/서버 양쪽에서 사용 가능.
 *
 * @param selectedValues - 사용자가 선택한 모든 option value 배열 (단일/복수 선택 합산)
 * @param scoreMap       - option value → ScoreDelta 맵 (ContentPack에서 가져옴)
 * @param dimensions     - 이 콘텐츠가 사용하는 차원 목록 (초기값 0으로 세팅)
 */
export const accumulateHiddenState = (
  selectedValues: string[],
  scoreMap: Record<string, ScoreDelta>,
  dimensions: HiddenDimension[],
): HiddenState => {
  // 모든 차원을 0으로 초기화
  const state: HiddenState = Object.fromEntries(
    dimensions.map((d) => [d, 0]),
  );

  for (const value of selectedValues) {
    const delta = scoreMap[value];
    if (!delta) continue;

    for (const [dim, score] of Object.entries(delta)) {
      if (dim in state && score !== undefined) {
        state[dim] += score;
      }
    }
  }

  return state;
};

/**
 * hidden state 점수 기반으로 Additional Readings 우선순위를 결정한다.
 *
 * 정렬 기준:
 * 1. trigger_dimension 점수가 trigger_threshold 이상인 항목 → 점수 내림차순
 * 2. trigger는 있지만 threshold 미달인 항목
 * 3. trigger 없는 항목 (항상 노출 후보, 정의 순서 유지)
 *
 * 결과 페이지에서 상위 N개만 노출하거나 전체를 보여줄 때 모두 사용 가능.
 */
export const prioritizeAdditionalReadings = (
  state: HiddenState,
  readings: AdditionalReading[],
): AdditionalReading[] => {
  const score = (reading: AdditionalReading): number => {
    if (!reading.trigger_dimension) return -1; // trigger 없음 → 최하단
    return state[reading.trigger_dimension] ?? 0;
  };

  const isAboveThreshold = (reading: AdditionalReading): boolean => {
    if (!reading.trigger_dimension || reading.trigger_threshold === undefined) return false;
    return (state[reading.trigger_dimension] ?? 0) >= reading.trigger_threshold;
  };

  const aboveThreshold = readings
    .filter(isAboveThreshold)
    .sort((a, b) => score(b) - score(a));

  const belowThreshold = readings
    .filter((r) => r.trigger_dimension && !isAboveThreshold(r));

  const noTrigger = readings.filter((r) => !r.trigger_dimension);

  return [...aboveThreshold, ...belowThreshold, ...noTrigger];
};
