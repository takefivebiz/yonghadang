export type SignalTemplateType =
  | "donut"
  | "pulse_timeline"
  | "editorial_infographic"
  | "balance_meter"
  | "stacked_accumulation"
  | "threshold_gauge"
  | "constellation_map";

export type EmotionalArchetype =
  | "anxiety_vs_stability"
  | "urge_vs_suppression"
  | "attachment_vs_detachment"
  | "hope_vs_exhaustion"
  | "certainty_vs_confusion"
  | "distance_vs_attachment"
  | "expectation_vs_resignation";

export type SceneVisualRoleType =
  | "current_pressure"
  | "repeated_response"
  | "conflict_structure"
  | "accumulated_pressure"
  | "threshold_state"
  | "summary_map";

export type SceneSignalState = {
  label: string;
  intensity: number;
};

export type SceneSignal = {
  id: string;
  sceneIndex: number;
  title: string;
  template: SignalTemplateType;
  archetype: EmotionalArchetype;
  states: [SceneSignalState, SceneSignalState];
  summaryLabel?: string;
};

export type SceneVisualRole = {
  sceneIndex: number;
  role: SceneVisualRoleType;
  preferredTemplate: SignalTemplateType;
  allowedArchetypes: EmotionalArchetype[];
};
