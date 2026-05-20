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

const getScore = (hiddenState: HiddenState, dimension: string): number =>
  hiddenState[dimension] ?? 0;

const deriveLove1Scene01Signals = (hiddenState: HiddenState): SceneSignal[] => {
  const shakeIntensity = getScore(hiddenState, "shakeIntensity");
  const clarityHunger = getScore(hiddenState, "clarityHunger");
  const actionImminence = getScore(hiddenState, "actionImminence");
  const expressionPressureScore = (clarityHunger + actionImminence) / 2;

  return [
    {
      id: "scene01-anxiety",
      sceneIndex: 1,
      title: "강하게 관찰된 감정 신호",
      template: "donut",
      archetype: "anxiety_vs_stability",
      states: makeIntensityPair("불안 반응", "안정감 기대", shakeIntensity),
      summaryLabel: "불안 우세",
    },
    {
      id: "scene01-expression",
      sceneIndex: 1,
      title: "강하게 관찰된 감정 신호",
      template: "donut",
      archetype: "urge_vs_suppression",
      states: makeIntensityPair(
        "질문 충동",
        "실제 표현",
        expressionPressureScore,
      ),
      summaryLabel: "표현 억제",
    },
  ];
};

export const deriveSceneSignals = ({
  contentId,
  hiddenState,
  sceneIndex,
}: DeriveSceneSignalsParams): SceneSignal[] => {
  if (contentId !== "love-1") return [];
  if (sceneIndex !== 1) return [];

  return deriveLove1Scene01Signals(hiddenState);
};
