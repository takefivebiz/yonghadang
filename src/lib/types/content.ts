// ── 카테고리 ────────────────────────────────────────────────────────
export type Category = "love" | "relationship" | "career" | "emotion";

export const CATEGORY_LABELS: Record<Category, string> = {
  love: "연애·결혼",
  relationship: "인간관계",
  career: "직업·진로",
  emotion: "감정",
};

// ── 입력 설정 (input_config JSONB) ──────────────────────────────────

export interface InputConfigOption {
  label: string;
  value: string;
  reaction?: string;
}

// ── V2 step 타입 (version 2부터 questions 배열 대신 steps 배열 사용) ──

export interface InputStepFreeText {
  id: string;
  type: "freeText";
  question: string;
  placeholder: string;
  example_inputs?: string[];
  required: boolean;
}

export interface InputStepSingleChoice {
  id: string;
  type: "singleChoice";
  question: string;
  options: InputConfigOption[];
  required: boolean;
}

export interface InputStepMultiChoice {
  id: string;
  type: "multiChoice";
  question: string;
  options: InputConfigOption[];
  required: boolean;
}

export type InputStep =
  | InputStepFreeText
  | InputStepSingleChoice
  | InputStepMultiChoice;

export interface InputConfig {
  version: 2;
  steps: InputStep[];
}

// ── Scene 설정 (scene_config JSONB) ─────────────────────────────────

export interface SceneConfigItem {
  index: number;
  /** 프론트에 노출되는 scene 제목 */
  title: string;
  /** Claude가 이해할 내부 역할 (예: "state_definition", "pattern_recognition") */
  role: string;
  /** 이 scene이 반드시 밝혀야 하는 목적 */
  goal: string;
  /** 생성 시 포함해야 할 핵심 포인트 */
  focus: string[];
  /** 이 scene에서 특히 지켜야 할 문장 방향 */
  forbidden?: string[];
  tone: string;
  is_free: boolean;
  /** 레거시 단일 프롬프트 (선택적, 신규 콘텐츠는 goal+focus+tone으로 대체) */
  prompt?: string;
}

export interface SceneConfig {
  free_scene_count: number;
  paid_scene_count: number;
  scenes: SceneConfigItem[];
}

// ── Public listing API 응답 타입 (GET /api/contents) ─────────────────
// input_config / scene_config 등 내부 설계 데이터는 절대 포함하지 않는다.
export interface PublicContent {
  id: string;
  slug: string | null;
  title: string;
  subtitle: string | null;
  category: Category;
  thumbnail_url: string | null;
  insights: string[];
}

// ── 콘텐츠 전체 타입 (서버 내부 및 dummy data 전용) ───────────────────
export interface Content {
  id: string;
  /** URL slug이자 콘텐츠 고유 식별자 (예: "love-1"). id(UUID)가 아니라 slug 기준으로 필터링할 것.
   *  DB에서 조회한 경우 항상 값이 있다. 코드 source(contents.ts)에서는 생략 가능. */
  slug?: string | null;
  title: string;
  subtitle: string | null;
  category: Category;
  thumbnail_url: string | null;
  estimated_minutes: number | null;
  input_config: InputConfig;
  scene_config: SceneConfig;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
  // scene_config.scenes[].title에서 파생한다.
  // 카드 표시용 preview 문구가 scene 제목과 달라지는 시점에는
  // DB에 card_previews: string[] 컬럼을 별도 추가하고 이 파생 로직을 제거해야 한다.
  insights?: string[];
}
