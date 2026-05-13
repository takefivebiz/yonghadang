import { SceneConfigItem, SceneConfig } from "@/lib/types/content";
import { ResultScene, SceneMessage } from "@/lib/types/result";

// ── Claude 응답 타입 ────────────────────────────────────────────────────
// carry_over는 Claude가 scene 간 일관성을 유지하기 위한 내부 필드.
// 프론트엔드에 노출하지 않고, 개발·검수 용도로만 사용한다.

export type ClaudeMessageType = "ai" | "punch" | "memo";

export interface ClaudeMessage {
  type: ClaudeMessageType;
  text: string;
}

export interface ClaudeSceneCarryOver {
  /** 이 scene의 핵심 인사이트 한 줄 (다음 scene이 이어받을 내용) */
  key_insight: string;
  /** 이후 scene에서 반복하지 말아야 할 표현/개념 목록 */
  do_not_repeat: string[];
}

export interface ClaudeGeneratedScene {
  scene_index: number;
  scene_title: string;
  is_free: boolean;
  messages: ClaudeMessage[];
  carry_over: ClaudeSceneCarryOver;
}

export interface ClaudeGeneratedResult {
  scenes: ClaudeGeneratedScene[];
}

// ── 사용자 입력 타입 ───────────────────────────────────────────────────

export interface UserAnswer {
  question_index: number;
  question_text: string;
  /** 선택된 option의 value 목록 */
  values: string[];
  /** 선택된 option의 label 목록 (Claude에게 전달할 한국어 라벨) */
  labels: string[];
}

export interface UserInputPayload {
  /** 사용자가 자유 텍스트로 입력한 내용 */
  text: string;
  /** 선택형 질문 답변 목록 */
  answers: UserAnswer[];
}

// ── 프롬프트 빌더 ─────────────────────────────────────────────────────

/**
 * scene_config의 각 scene을 Claude가 이해할 수 있는 instruction 블록으로 변환한다.
 * role/goal/focus/tone을 각각 명확히 전달하여 narrative 방향을 고정한다.
 */
const formatSceneInstructions = (scenes: SceneConfigItem[]): string => {
  return scenes
    .map((scene) => {
      const freeLabel = scene.is_free ? "[무료 공개]" : "[유료]";
      const focusLines = scene.focus.map((f) => `  - ${f}`).join("\n");

      return `### Scene ${scene.index}: ${scene.title} ${freeLabel}
role: ${scene.role}
goal: ${scene.goal}
focus:
${focusLines}
tone: ${scene.tone}`;
    })
    .join("\n\n");
};

/**
 * 사용자 답변을 Claude에게 전달할 포맷으로 변환한다.
 */
const formatUserAnswers = (answers: UserAnswer[]): string => {
  if (answers.length === 0) return "(선택형 질문 없음)";

  return answers
    .map((a) => `- ${a.question_text}: ${a.labels.join(", ")}`)
    .join("\n");
};

/**
 * 콘텐츠 정보 + 사용자 입력 + scene_config를 받아
 * Claude single-call용 시스템 프롬프트와 유저 메시지를 생성한다.
 */
export const buildGenerateResultPrompt = (params: {
  contentTitle: string;
  category: string;
  userInput: UserInputPayload;
  sceneConfig: SceneConfig;
}): { system: string; userMessage: string } => {
  const { contentTitle, category, userInput, sceneConfig } = params;
  const sceneInstructions = formatSceneInstructions(sceneConfig.scenes);
  const formattedAnswers = formatUserAnswers(userInput.answers);
  const totalScenes = sceneConfig.scenes.length;

  // ── 시스템 프롬프트 ────────────────────────────────────────────────
  const system = `너는 VEIL의 AI 분석가다.
VEIL은 사용자의 감정·관계·직업 상황을 분석하는 서비스다.
사용자가 입력한 상황을 기반으로, 아래 scene 구조에 따라 결과를 생성한다.

## 핵심 원칙
- 사용자를 평가하거나 판단하지 않는다.
- 조언하거나 해결책을 강요하지 않는다.
- 사용자가 이미 어렴풋이 알고 있는 것을 명확하게 언어화해준다.
- 각 scene은 독립된 카드가 아닌, 하나의 흐름(narrative) 안에서 연결된다.
- 앞 scene에서 다룬 내용은 뒤 scene에서 반복하지 않는다.

## 문체 규칙
- 반말 (편한 존댓말 아닌, 친구처럼 말 놓는 투)
- 짧고 간결한 문장. 한 문장에 하나의 생각만.
- "~할 수 있어", "~인 것 같아" 같은 애매한 표현 금지.
- 사실처럼 말한다. 사용자가 반박할 수 없을 만큼 정확하게.

## 출력 규칙
- 반드시 JSON만 출력한다. 마크다운 코드블록('''json) 없이 순수 JSON만.
- 각 scene은 3~5개의 messages를 포함한다.
- message type 비율: ai 70% / punch 20% / memo 10%
  - ai: 주 분석 문장 (사실처럼 묘사)
  - punch: 씬의 핵심 한 줄. 짧고 강렬하게. 씬당 최대 1개. (예: "반복만 해도 익숙해져")
  - memo: 손글씨 메모처럼 짧은 관찰. 1문장, 40자 이내. 씬당 최대 1개. 선택적. (예: "뇌는 반복을 기억해")
- carry_over는 Claude 내부 검수용 필드다. 프론트에 노출되지 않는다.
  key_insight: 이 scene에서 확정된 핵심 사실 한 줄
  do_not_repeat: 이후 scene에서 반복하면 안 되는 표현·개념 목록

## 출력 포맷
{
  "scenes": [
    {
      "scene_index": 1,
      "scene_title": "scene의 title 그대로",
      "is_free": true,
      "messages": [
        { "type": "ai", "text": "..." },
        { "type": "punch", "text": "..." }
      ],
      "carry_over": {
        "key_insight": "...",
        "do_not_repeat": ["...", "..."]
      }
    }
  ]
}`;

  // ── 유저 메시지 ───────────────────────────────────────────────────
  const userMessage = `## 콘텐츠 정보
제목: ${contentTitle}
카테고리: ${category}

## 사용자 입력
${userInput.text}

## 사용자 선택 답변
${formattedAnswers}

## 생성할 Scene 목록 (총 ${totalScenes}개)
아래 각 scene의 role / goal / focus / tone을 정확히 따른다.
scene 순서대로 narrative가 이어져야 한다. 앞 scene의 carry_over.do_not_repeat 항목은 뒤 scene에서 반복하지 않는다.

${sceneInstructions}

위 ${totalScenes}개 scene을 모두 생성하라. JSON만 출력한다.`;

  return { system, userMessage };
};

/**
 * Claude 응답 JSON 문자열을 파싱한다.
 * Claude가 JSON 앞뒤에 텍스트를 추가하거나 코드블록으로 감싸는 경우도 처리한다.
 */
export const parseClaudeResult = (raw: string): ClaudeGeneratedResult => {
  // 전략 1: 응답에서 첫 번째 JSON 오브젝트 블록 추출 (가장 안전)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude 응답에서 JSON을 찾을 수 없습니다");
  }

  const parsed = JSON.parse(jsonMatch[0]) as ClaudeGeneratedResult;

  if (!Array.isArray(parsed.scenes)) {
    throw new Error("Claude 응답에 scenes 배열이 없습니다");
  }

  // 각 scene의 필수 필드 검증
  for (const scene of parsed.scenes) {
    if (typeof scene.scene_index !== "number") {
      throw new Error(`scene_index가 숫자가 아닙니다: ${JSON.stringify(scene)}`);
    }
    if (!Array.isArray(scene.messages)) {
      throw new Error(`scene ${scene.scene_index}의 messages가 배열이 아닙니다`);
    }
  }

  return parsed;
};

/**
 * Claude 생성 결과를 프론트엔드 ResultScene 배열로 변환한다.
 * - id: sessionId + scene_index로 생성
 * - is_unlocked: false로 초기화 (result 페이지의 unlockedScenes가 관리)
 * - preview_messages: 유료 scene은 첫 3개 메시지를 미리보기로 노출
 * - carry_over: 의도적으로 제외 (프론트 노출 없음)
 */
export const mapClaudeToResultScenes = (
  sessionId: string,
  claudeScenes: ClaudeGeneratedScene[]
): ResultScene[] => {
  return claudeScenes.map((scene) => {
    // carry_over를 제외한 messages만 SceneMessage[]로 매핑
    const messages: SceneMessage[] = scene.messages.map((m) => ({
      type: m.type,
      text: m.text,
    }));

    // 유료 scene: 첫 3개를 preview로 제공 (blur 처리는 SceneContent에서)
    const preview_messages: SceneMessage[] | null = !scene.is_free
      ? messages.slice(0, 3)
      : null;

    return {
      id: `${sessionId}-scene-${scene.scene_index}`,
      scene_index: scene.scene_index,
      scene_title: scene.scene_title,
      is_free: scene.is_free,
      is_unlocked: false,
      // MVP: 모든 messages를 내려보내고 잠금은 result 페이지의 is_unlocked로 제어
      // TODO: [백엔드 연동] 결제 검증 후 유료 scene은 messages: null로 서버 사이드 잠금 적용
      messages,
      preview_messages,
    };
  });
};
