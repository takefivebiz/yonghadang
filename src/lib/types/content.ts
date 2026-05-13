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

export interface InputConfigQuestion {
  index: number;
  text: string;
  type: "single" | "multiple";
  options: InputConfigOption[];
}

export interface InputConfig {
  placeholder: string;
  example_inputs: string[];
  questions: InputConfigQuestion[];
}

// ── Scene 설정 (scene_config JSONB) ─────────────────────────────────

export interface SceneConfigItem {
  index: number;
  /** 프론트에 노출되는 scene 제목 */
  title: string;
  /** 장면 진입 직전의 감정 흐름. 사용자를 다음 장면 안으로 끌어들이는 문장 */
  intro?: string;
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

// ── 콘텐츠 (API GET /api/contents 응답 타입과 일치) ──────────────────
export interface Content {
  id: string;
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
  // TODO: [백엔드 연동] scene_config.scenes[].title에서 파생 예정. 현재는 프론트 전용 필드.
  insights?: string[];
}
