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
      const forbiddenLines = scene.forbidden
        ? scene.forbidden.map((f) => `  - ${f}`).join("\n")
        : "";

      let sceneBlock = `### Scene ${scene.index}: ${scene.title} ${freeLabel}
role: ${scene.role}
goal: ${scene.goal}
focus:
${focusLines}
tone: ${scene.tone}`;

      if (forbiddenLines) {
        sceneBlock += `\nforbidden (이것을 피하라):
${forbiddenLines}`;
      }

      return sceneBlock;
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
  sceneIndexes?: number[];  // 선택적: 이 indexes에 해당하는 scenes만 생성
}): { system: string; userMessage: string } => {
  const { contentTitle, category, userInput, sceneConfig, sceneIndexes } = params;

  // sceneIndexes가 있으면 해당 scenes만 필터링
  const scenesToGenerate = sceneIndexes
    ? sceneConfig.scenes.filter(s => sceneIndexes.includes(s.index))
    : sceneConfig.scenes;

  const sceneInstructions = formatSceneInstructions(scenesToGenerate);
  const formattedAnswers = formatUserAnswers(userInput.answers);
  const totalScenes = scenesToGenerate.length;

  // ── 시스템 프롬프트 ────────────────────────────────────────────────
  const system = `너는 VEIL의 AI 해석가다.
VEIL은 사용자의 감정·관계·직업 상황을 해석하는 서비스다.
사용자가 입력한 상황을 기반으로, 아래 scene 구조에 따라 결과를 생성한다.

## 핵심 원칙
- 사용자를 평가하거나 판단하지 않는다.
- 조언하거나 해결책을 강요하지 않는다.
- 사용자가 이미 어렴풋이 알고 있는 것을 명확하게 언어화해준다.
- 각 scene은 독립된 카드가 아닌, 하나의 흐름(narrative) 안에서 연결된다.
- 앞 scene에서 다룬 내용은 뒤 scene에서 반복하지 않는다.
- **각 scene 안의 messages도 서로 이어져야 한다.** 앞 메시지를 받아 다음 메시지가 자연스럽게 이어지는 흐름.
- 직접 조언하지 않으면서도, 사용자가 읽을 때 "나한테 계속 이어서 말해주는 느낌"이 있어야 한다.

## 문체 규칙
- 반말 (친구처럼). ai 메시지는 2~3문장: 앞 메시지 받아주기 → 깊어지기 → (선택) 마무리.
- 금지: "~할 수 있어", "~인 것 같아", 상대방 마음/의도 추측.
- 사실처럼, 보고서처럼은 아니게. 사용자 흐름을 따라가기.

### ⚠️ 반말 종결 규칙
- 금지: ~다, ~된다, ~한다, ~시작된다, ~것이다, ~할 수 있어, ~일 수 있어 (문어체/보고서톤/애매함)
- 종결 다양화: ~하고 있어, ~하게 돼, ~처럼 느껴져, ~에 가까워, ~로 이어져, ~이 남아, ~가 커져 등
- 담담하고 단정적인 반말만. punch/memo도 동일 규칙.

## 출력 규칙
- 반드시 JSON만 출력한다. 마크다운 코드블록('''json) 없이 순수 JSON만.
- ⚠️ messages.text에는 순수 텍스트만 포함. 절대 마크다운/코드블록 금지:
  * \`\`\`txt, \`\`\`markdown, \`\`\` 같은 fenced code block 금지
  * 줄바꿈은 일반 \\n만 사용 (백틱이나 코드블록 문법 사용 금지)

### ai 메시지
- 기본은 한 줄. 긴 메시지는 호흡이 필요할 때 줄바꿈(\n) 사용.

### 무료 Scene (is_free: true)
- 현재 상태를 직관적으로. 마지막 메시지는 새로운 층위를 열어 다음 scene을 자연스럽게 불러올 것.
- 예: "근데 여기서 진짜 봐야 할 건, 왜 너는 아직 이 애매함을 못 놓고 있는가야."

### 유료 Scene (is_free: false)
- 무료 scene보다 더 깊게. 단순 현재 상황 재설명 금지.
- 구조적 이유 / 미래 흐름 / 관점 전환 / 선택의 기준 중 하나 이상 다루기.
- punch: 씬의 핵심. 필요시 줄바꿈(\n)으로 리듬 살리기. 예: "확인하고 싶은데,\n놓지 못하고 있는 거야."
- memo: 40~60자, 짧은 문구 중심.
- carry_over (프론트 미노출): key_insight (확정된 핵심 한 줄), do_not_repeat (반복 금지 항목)

## Scene Progression (중요)
- 각 scene은 새로운 층위. 이전 scene 내용 반복 금지.
- do_not_repeat 항목은 다음 scene에서 회피. 감정 흐름이 끊기지 않는 progression.

## Message 흐름 (매우 중요)
- 각 message는 이어져야 함. 앞 메시지를 받고 깊어지는 구조.
- 예: 상대가 애매함 → 너는 그걸 못 놓음 → 그 기준이 더 중요해짐.

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

// message.text 정제 (마크다운/코드블록 제거)
const sanitizeMessageText = (text: string): string => {
  // 줄 시작의 "txt ", "markdown " 등 제거
  let sanitized = text.replace(/^(txt|markdown|json|code)\s+/gm, "");
  // 코드블록 제거
  sanitized = sanitized.replace(/^```[\s\S]*?```$/gm, "");
  return sanitized.trim();
};

/**
 * Claude 응답 JSON 문자열을 파싱한다.
 * Claude가 JSON 앞뒤에 텍스트를 추가하거나 코드블록으로 감싸는 경우도 처리한다.
 */
export const parseClaudeResult = (raw: string): ClaudeGeneratedResult => {
  // 전략 1: 응답에서 첫 번째 JSON 오브젝트 블록 추출 (가장 안전)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("[parseClaudeResult] JSON을 찾을 수 없습니다. 원본 응답:", raw.slice(0, 500));
    throw new Error("Claude 응답에서 JSON을 찾을 수 없습니다");
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as ClaudeGeneratedResult;

    if (!Array.isArray(parsed.scenes)) {
      throw new Error("Claude 응답에 scenes 배열이 없습니다");
    }

    // 각 scene의 필수 필드 검증 및 text 정제
    for (const scene of parsed.scenes) {
      if (typeof scene.scene_index !== "number") {
        throw new Error(
          `scene_index가 숫자가 아닙니다: ${JSON.stringify(scene)}`,
        );
      }
      if (!Array.isArray(scene.messages)) {
        throw new Error(
          `scene ${scene.scene_index}의 messages가 배열이 아닙니다`,
        );
      }
      // 각 message의 text 정제
      for (const msg of scene.messages) {
        msg.text = sanitizeMessageText(msg.text);
      }
    }

    return parsed;
  } catch (parseErr) {
    console.error("[parseClaudeResult] JSON 파싱 또는 검증 실패");
    console.error("추출된 JSON 첫 1000자:", jsonMatch[0].slice(0, 1000));
    console.error("파싱 에러:", parseErr);
    throw new Error(
      `Claude JSON 처리 실패: ${parseErr instanceof Error ? parseErr.message : "알 수 없는 에러"}`
    );
  }
};

/**
 * Claude 생성 결과를 프론트엔드 ResultScene 배열로 변환한다.
 * - id: sessionId + scene_index로 생성
 * - intro: sceneConfig에서 각 scene의 intro 가져오기
 * - is_unlocked: false로 초기화 (result 페이지의 unlockedScenes가 관리)
 * - preview_messages: 유료 scene은 첫 3개 메시지를 미리보기로 노출
 * - carry_over: 의도적으로 제외 (프론트 노출 없음)
 */
export const mapClaudeToResultScenes = (
  sessionId: string,
  claudeScenes: ClaudeGeneratedScene[],
  sceneConfig: SceneConfig,
): ResultScene[] => {
  return claudeScenes.map((scene) => {
    // scene_config에서 해당 index의 intro 가져오기
    const configScene = sceneConfig.scenes.find(
      (s) => s.index === scene.scene_index,
    );
    const intro = configScene?.intro;

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
      intro,
      is_free: scene.is_free,
      is_unlocked: false,
      // MVP: 모든 messages를 내려보내고 잠금은 result 페이지의 is_unlocked로 제어
      // TODO: [백엔드 연동] 결제 검증 후 유료 scene은 messages: null로 서버 사이드 잠금 적용
      messages,
      preview_messages,
    };
  });
};
