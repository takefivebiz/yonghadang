import { ResultScene, SceneMessage } from "@/lib/types/result";
import { SceneConfig } from "@/lib/types/content";

/**
 * 유료 scenes placeholder 생성
 * - scene title: sceneConfig에서 가져오기
 * - messages: null (잠금 상태)
 * - preview_messages: mock bubble messages
 * - is_unlocked: false
 */
export const createPaidScenePlaceholders = (
  sessionId: string,
  sceneConfig: SceneConfig
): ResultScene[] => {
  const paidScenes = sceneConfig.scenes.filter((s) => !s.is_free);

  return paidScenes.map((configScene) => {
    const mockPreview = getMockPreviewMessages(configScene.index);

    return {
      id: `${sessionId}-scene-${configScene.index}`,
      scene_index: configScene.index,
      scene_title: configScene.title,
      is_free: false,
      is_unlocked: false,
      messages: null,  // 잠금 상태: messages null
      preview_messages: mockPreview,  // mock preview
    };
  });
};

/**
 * Scene index 기반 mock preview messages
 * 각 유료 scene의 특성을 암시하는 2~3개 bubble
 *
 * 목표: "잠긴 장면이지만 흐름이 있다"는 느낌
 * - 실제 내용 미노출
 * - 다음 layer를 암시
 * - 2~3개 짧은 문장
 */
const getMockPreviewMessages = (sceneIndex: number): SceneMessage[] => {
  const mockBubbles: Record<number, SceneMessage[]> = {
    // love-1 series: scenes 3-6
    3: [
      { type: "ai", text: "문제는 여기서부터야." },
      { type: "ai", text: "패턴은 생각보다 일찍 시작돼." },
      { type: "ai", text: "한번 기다려봐, 무언가 보일 거야." },
    ],
    4: [
      { type: "ai", text: "관계의 온도가 맞지 않으면" },
      { type: "ai", text: "애쓸수록 더 멀어져." },
      { type: "ai", text: "여기서 깨달아야 할 게 있어." },
    ],
    5: [
      { type: "ai", text: "이 패턴은 이 사람이 아니야." },
      { type: "ai", text: "다음에도 반복될 거야." },
      { type: "ai", text: "하지만 그게 나쁜 건 아니야." },
    ],
    6: [
      { type: "ai", text: "크게 바꾸려 하면 못 간다." },
      { type: "ai", text: "작은 간격부터 만들어봐." },
      { type: "ai", text: "선택하는 사람이 되는 거야." },
    ],

    // love-2 series: scenes 3-6 (각 content별로 별도 처리)
    // 범용 fallback으로 처리됨
  };

  // 기본 fallback: 범용 mock messages
  const defaultMock: SceneMessage[] = [
    { type: "ai", text: "여기는 흐름이 깊어지는 곳이야." },
    { type: "ai", text: "지금 보는 게 다가 아니야." },
    { type: "ai", text: "더 들어가봐." },
  ];

  return mockBubbles[sceneIndex] || defaultMock;
};
