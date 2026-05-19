import { SceneConfig } from "@/lib/types/content";
import { getContentDefinition } from "@/lib/content-definitions";

// TODO: [백엔드 연동] GET /api/contents/[id] 응답의 scene_config로 교체
// 각 콘텐츠는 고유한 narrative progression을 가진다.
// Claude는 scene별 role/goal/focus/tone을 참고해 결과를 생성한다.

const LEGACY_SCENE_CONFIGS: Record<string, SceneConfig> = {};

// ── 기본 템플릿 (설정되지 않은 콘텐츠용) ────────────────────────────
const DEFAULT_SCENE_CONFIG: SceneConfig = {
  free_scene_count: 2,
  paid_scene_count: 4,
  scenes: [
    {
      index: 1,
      title: "현재 감정 인식",
      role: "state_definition",
      goal: "사용자가 현재 경험하는 감정과 상황을 명확히 인식하게 한다",
      focus: ["현재 상태", "발생 맥락", "감정의 강도"],
      tone: "판단 없이, 현재 상태를 있는 그대로 인정한다",
      is_free: true,
    },
    {
      index: 2,
      title: "감정 패턴 자각",
      role: "pattern_recognition",
      goal: "반복되는 감정 또는 행동 패턴을 인식시킨다",
      focus: ["반복 패턴", "공통 자극", "패턴의 지속 기간"],
      tone: "패턴을 인식시키되, 의지 문제가 아님을 암시한다",
      is_free: true,
    },
    {
      index: 3,
      title: "왜 반복되는지",
      role: "mechanism_reveal",
      goal: "패턴이 반복되는 구조적 이유를 드러낸다",
      focus: ["반복 구조", "과거 학습", "패턴의 기원"],
      tone: "과거를 탓하지 않고, 구조로 설명한다",
      is_free: false,
    },
    {
      index: 4,
      title: "관계 구조",
      role: "relationship_dynamic",
      goal: "사용자의 감정이 타인 또는 상황과 어떻게 상호작용하는지를 보여준다",
      focus: ["상호작용 패턴", "의도와 결과의 간극", "관계 내 위치"],
      tone: "비판 없이, 구조를 보여주는 방식으로",
      is_free: false,
    },
    {
      index: 5,
      title: "이후 흐름",
      role: "future_projection",
      goal: "현재 패턴이 바뀌지 않으면 어떤 결과가 올지를 명확히 한다",
      focus: ["패턴의 이식성", "변화 없을 때의 결과", "자각의 의미"],
      tone: "예측은 하되, 변화 가능성으로 마무리한다",
      is_free: false,
    },
    {
      index: 6,
      title: "선택 기준",
      role: "action_direction",
      goal: "다음에 같은 상황이 올 때 할 수 있는 최소 행동 하나를 제시한다",
      focus: ["즉각 실행 가능한 행동", "작은 시작", "선택의 의미"],
      tone: "크게 바꾸려 하지 말고, 작은 것부터. 가볍고 실천 가능하게",
      is_free: false,
    },
  ],
};

// TODO: [백엔드 연동] content_id로 GET /api/contents/[id]를 호출해 scene_config 반환
export const getSceneConfig = (contentId: string): SceneConfig => {
  return (
    getContentDefinition(contentId)?.sceneConfig ??
    LEGACY_SCENE_CONFIGS[contentId] ??
    DEFAULT_SCENE_CONFIG
  );
};
