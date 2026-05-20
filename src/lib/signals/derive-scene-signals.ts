import type { HiddenState } from "@/lib/types/quiz";
import type { SceneSignal, SceneSignalState } from "@/lib/types/scene-signal";

type DeriveSceneSignalsParams = {
  contentId: string;
  hiddenState: HiddenState;
  sceneIndex: number;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const normalizeStrongIntensity = (score: number, maxScore = 8): number => {
  const normalized = score / maxScore;
  return clamp(normalized, 0.65, 0.9);
};

const normalizeDonutIntensity = (score: number, rank: number): number => {
  const normalized = clamp(score / 8, 0, 1);
  const baseIntensity = 0.68 + normalized * 0.24;
  const rankAdjustment = rank === 0 ? 0.02 : -0.08;

  return clamp(baseIntensity + rankAdjustment, 0.68, rank === 0 ? 0.92 : 0.86);
};

const makeIntensityPair = (
  strongLabel: string,
  weakLabel: string,
  score: number,
): [SceneSignalState, SceneSignalState] => {
  const strongIntensity = normalizeStrongIntensity(score);
  const weakIntensity = 1 - strongIntensity;

  return [
    { label: strongLabel, intensity: strongIntensity },
    { label: weakLabel, intensity: weakIntensity },
  ];
};

const makeIntensityPairFromStrongIntensity = (
  strongLabel: string,
  weakLabel: string,
  strongIntensity: number,
): [SceneSignalState, SceneSignalState] => {
  const normalizedStrongIntensity = clamp(strongIntensity, 0.68, 0.92);

  return [
    { label: strongLabel, intensity: normalizedStrongIntensity },
    { label: weakLabel, intensity: 1 - normalizedStrongIntensity },
  ];
};

const getScore = (hiddenState: HiddenState, dimension: string): number =>
  hiddenState[dimension] ?? 0;

type Love1HiddenDimension =
  | "shakeIntensity"
  | "clarityHunger"
  | "interpretiveLoop"
  | "actionImminence"
  | "expectationFold"
  | "emotionalFatigue";

type Love1SignalPreset = {
  dimension: Love1HiddenDimension;
  priority: number;
  id: string;
  archetype: SceneSignal["archetype"];
  primaryLabel: string;
  secondaryLabel: string;
  summaryLabel: string;
};

const love1Scene01Presets: Love1SignalPreset[] = [
  {
    dimension: "shakeIntensity",
    priority: 0,
    id: "scene01-shake-intensity",
    archetype: "anxiety_vs_stability",
    primaryLabel: "불안 반응",
    secondaryLabel: "안정감 기대",
    summaryLabel: "불안 우세",
  },
  {
    dimension: "clarityHunger",
    priority: 1,
    id: "scene01-clarity-hunger",
    archetype: "certainty_vs_confusion",
    primaryLabel: "확인 욕구",
    secondaryLabel: "확신 부족",
    summaryLabel: "확신 탐색",
  },
  {
    dimension: "actionImminence",
    priority: 2,
    id: "scene01-action-imminence",
    archetype: "urge_vs_suppression",
    primaryLabel: "질문 충동",
    secondaryLabel: "실제 표현",
    summaryLabel: "표현 억제",
  },
  {
    dimension: "interpretiveLoop",
    priority: 3,
    id: "scene01-interpretive-loop",
    archetype: "certainty_vs_confusion",
    primaryLabel: "반응 해석",
    secondaryLabel: "확신 부족",
    summaryLabel: "해석 반복",
  },
  {
    dimension: "expectationFold",
    priority: 4,
    id: "scene01-expectation-fold",
    archetype: "expectation_vs_resignation",
    primaryLabel: "기대 잔존",
    secondaryLabel: "체념 시도",
    summaryLabel: "기대 잔존",
  },
  {
    dimension: "emotionalFatigue",
    priority: 5,
    id: "scene01-emotional-fatigue",
    archetype: "hope_vs_exhaustion",
    primaryLabel: "감정 소모",
    secondaryLabel: "유지 의지",
    summaryLabel: "피로 누적",
  },
];

const love1Scene02Presets: Love1SignalPreset[] = [
  {
    dimension: "interpretiveLoop",
    priority: 0,
    id: "scene02-interpretive-loop",
    archetype: "certainty_vs_confusion",
    primaryLabel: "말투·행동\n의미 재해석",
    secondaryLabel: "그냥 지나가지 못함",
    summaryLabel: "해석 반복",
  },
  {
    dimension: "clarityHunger",
    priority: 1,
    id: "scene02-clarity-hunger",
    archetype: "certainty_vs_confusion",
    primaryLabel: "확답 없는\n반응 확인",
    secondaryLabel: "애매함을 남겨둠",
    summaryLabel: "확인 욕구",
  },
  {
    dimension: "actionImminence",
    priority: 2,
    id: "scene02-action-imminence",
    archetype: "urge_vs_suppression",
    primaryLabel: "묻고 싶은 말\n보류",
    secondaryLabel: "질문을 삼킴",
    summaryLabel: "표현 보류",
  },
  {
    dimension: "expectationFold",
    priority: 3,
    id: "scene02-expectation-fold",
    archetype: "expectation_vs_resignation",
    primaryLabel: "남은 가능성\n붙잡음",
    secondaryLabel: "기대를 접지 못함",
    summaryLabel: "가능성 보존",
  },
  {
    dimension: "emotionalFatigue",
    priority: 4,
    id: "scene02-emotional-fatigue",
    archetype: "hope_vs_exhaustion",
    primaryLabel: "생각 줄이기\n시도",
    secondaryLabel: "해석 피로",
    summaryLabel: "감정 피로",
  },
  {
    dimension: "shakeIntensity",
    priority: 5,
    id: "scene02-shake-intensity",
    archetype: "anxiety_vs_stability",
    primaryLabel: "작은 반응에\n감정 흔들림",
    secondaryLabel: "안정감 기대",
    summaryLabel: "반응 흔들림",
  },
];

const selectTopPresets = (
  hiddenState: HiddenState,
  presets: Love1SignalPreset[],
  fallbackIds: string[],
  options: { avoidSameArchetype?: boolean } = {},
): Array<Love1SignalPreset & { score: number }> => {
  const scored = presets
    .map((preset) => ({
      ...preset,
      score: getScore(hiddenState, preset.dimension),
    }))
    .sort((a, b) => {
      const scoreGap = Math.abs(b.score - a.score);
      if (scoreGap < 1) return a.priority - b.priority;
      return b.score - a.score;
    });

  const fallback = fallbackIds
    .map((id) => scored.find((preset) => preset.id === id))
    .filter((preset): preset is Love1SignalPreset & { score: number } =>
      Boolean(preset),
    );

  if ((scored[0]?.score ?? 0) <= 0) return fallback;

  const selected: Array<Love1SignalPreset & { score: number }> = [];

  for (const preset of scored) {
    const hasSameLabel = selected.some(
      (item) => item.primaryLabel === preset.primaryLabel,
    );
    const hasSameArchetype =
      options.avoidSameArchetype &&
      selected.some((item) => item.archetype === preset.archetype);

    if (hasSameLabel || hasSameArchetype) continue;

    selected.push(preset);
    if (selected.length === 2) break;
  }

  for (const preset of fallback) {
    if (selected.length === 2) break;
    if (selected.some((item) => item.id === preset.id)) continue;
    selected.push(preset);
  }

  return selected.slice(0, 2);
};

const deriveLove1Scene01Signals = (hiddenState: HiddenState): SceneSignal[] => {
  return selectTopPresets(
    hiddenState,
    love1Scene01Presets,
    ["scene01-shake-intensity", "scene01-action-imminence"],
    { avoidSameArchetype: true },
  ).map((preset, index) => {
    const strongIntensity = normalizeDonutIntensity(preset.score, index);

    return {
      id: preset.id,
      sceneIndex: 1,
      title: "강하게 관찰된 감정 신호",
      template: "donut",
      archetype: preset.archetype,
      states: makeIntensityPairFromStrongIntensity(
        preset.primaryLabel,
        preset.secondaryLabel,
        strongIntensity,
      ),
      summaryLabel: preset.summaryLabel,
    };
  });
};

const deriveLove1Scene02Signals = (hiddenState: HiddenState): SceneSignal[] => {
  return selectTopPresets(
    hiddenState,
    love1Scene02Presets,
    ["scene02-interpretive-loop", "scene02-action-imminence"],
  ).map((preset) => ({
    id: preset.id,
    sceneIndex: 2,
    title: "반복 관찰된 감정 신호",
    template: "editorial_infographic",
    archetype: preset.archetype,
    states: makeIntensityPair(
      preset.primaryLabel,
      preset.secondaryLabel,
      preset.score,
    ),
    summaryLabel: preset.summaryLabel,
  }));
};

export const deriveSceneSignals = ({
  contentId,
  hiddenState,
  sceneIndex,
}: DeriveSceneSignalsParams): SceneSignal[] => {
  if (contentId !== "love-1") return [];
  if (sceneIndex === 1) return deriveLove1Scene01Signals(hiddenState);
  if (sceneIndex === 2) return deriveLove1Scene02Signals(hiddenState);

  return [];
};
