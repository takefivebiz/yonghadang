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
}): { system: string; userMessage: string } => {
  const { contentTitle, category, userInput, sceneConfig } = params;
  const sceneInstructions = formatSceneInstructions(sceneConfig.scenes);
  const formattedAnswers = formatUserAnswers(userInput.answers);
  const totalScenes = sceneConfig.scenes.length;

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
- 반말 (편한 존댓말 아닌, 친구처럼 말 놓는 투)
- 짧은 문장과 긴 문장을 섞어라. ai 메시지는 보통 2~3문장으로 자연스럽게 이어지게 한다.
  * 첫 문장: 앞 메시지를 받아주기 (문제는, 그 다음이, 그래서, 여기서, 결국 등)
  * 두 번째: 한 단계 더 깊이 들어가기
  * 필요하면 세 번째: 짧게 마무리하기
  * punch만 짧고 단정적으로 끊기
- "~할 수 있어", "~인 것 같아" 같은 애매한 표현 금지.
- 사실처럼 말하되, 보고서처럼 단정하지 말 것. 사용자의 흐름을 따라가며 말한다.
- ⚠️ 단, 상대방의 내면 상태(기분, 의도, 감정)를 추측하거나 미래를 명확히 예측하지 않는다. ("상대는 진심으로 좋아하는 것 같아" 같은 추측 금지)

### ⚠️ 반말 종결 규칙 (매우 중요)
- 절대 하지 말 것: ~다, ~된다, ~한다, ~시작된다, ~행동이다, ~것이다, ~할 수 있어, ~일 수 있어 (문어체/보고서 톤/애매함/투명성 부족)
- **종결 방식을 반드시 다양화할 것. 같은 종결을 반복하지 말 것:**
  - ~하고 있어
  - ~하게 돼
  - ~처럼 느껴져
  - ~에 가까워
  - ~로 이어져
  - ~부터 시작돼
  - ~을 보게 돼
  - ~이 남아
  - ~가 커져
  - ~흔들려 / ~흔들리고 있어
  - ~넘어서게 돼
  - ~흐르게 돼
- 과하게 친근하거나 귀엽지 않게. 담담하고 단정적인 반말만 사용.
- punch와 memo도 동일한 반말 규칙 적용.

## 출력 규칙
- 반드시 JSON만 출력한다. 마크다운 코드블록('''json) 없이 순수 JSON만.
- ⚠️ messages.text에는 순수 텍스트만 포함. 절대 마크다운/코드블록 금지:
  * \`\`\`txt, \`\`\`markdown, \`\`\` 같은 fenced code block 금지
  * 줄바꿈은 일반 \\n만 사용 (백틱이나 코드블록 문법 사용 금지)

### ai 메시지 (모든 scene)
- 기본은 한 줄로 이어진 형태
- 긴 메시지(90자 이상)에서는 의미 단위로 줄바꿈(\n) 가능
- 감정/호흡이 바뀌는 지점에서 끊기 (모든 긴 메시지를 억지로 줄바꿈하지 말 것)
- 예: "확신을 받고 싶은 마음 뒤에는,\n사실 안정감에 대한 욕구가 있어."

### 무료 Scene (is_free: true)
- messages 3~4개
- 짧고 명확하게. 현재 상태를 직관적으로 전달.
- **메시지 간에도 자연스러운 흐름이 있어야 한다.** 앞 메시지를 받아주며 이어가되, 간결성을 유지할 것.
- type 비율: ai 70% / punch 20% / memo 10%
- **마지막 메시지 (매우 중요):**
  * "설명 완료"로 끝나지 말 것
  * 새로운 층위/질문/관점을 열어야 한다
  * 다음 유료 scene으로 자연스럽게 진행되는 느낌
  * 예: "근데 여기서 진짜 봐야 할 건, 왜 너는 아직 이 애매함을 못 놓고 있느냐야."
  * 예: "문제는 상대보다, 네가 아직 이 가능성을 놓지 못하고 있다는 거야."
  * 사용자가 "그 다음은?" "더 깊이 들어가고 싶은" 마음이 생기게 할 것

### 유료 Scene (is_free: false) - 반드시 더 깊게
- messages **최소 5개 이상**
- 그중 **최소 1개는 80~140자의 긴 버블** (단순 요약이 아닌 깊이 있는 분석)
- type 비율: ai 75% / punch 15% / memo 10%
- punch: 씬의 핵심. 짧고 강렬하게. 씬당 최대 1개.
  * 필요할 경우 감정 리듬을 살리기 위해 줄바꿈(\n) 사용 가능 (최대 2줄)
  * 모든 punch를 억지로 2줄로 만들지 말 것. 감정 흐름이 필요할 때만 사용
  * 줄바꿈은 "강조 포인트"에서 끊을 때만 사용
  * 예: "txt 확인하고 싶은데, 티는 내고 싶지 않아.\n기다리는 게 아니라, 가능성을 못 놓고 있는 거야."
- memo: 선택적. 있다면 40~60자. **절대 긴 문장 금지, 단어 나열이나 짧은 문구 중심.**
- **메시지끼리 감정 호흡이 있어야 한다.** 길이만 늘리는 것이 아니라 각 메시지가 이전 메시지를 받으며 차근차근 깊어지는 흐름.
- **유료 scene은 단순히 현재 상황을 다시 설명하지 말고**, 아래 중 하나를 반드시 수행:
  * 왜 이 상태에서 못 벗어나는지 (구조적 이유)
  * 지금 흐름이 계속되면 어떻게 되는지 (미래 예측)
  * 질문의 관점을 어떻게 바꿔야 하는지 (인식의 전환)
  * 결국 어떤 기준 앞에 서게 되는지 (선택의 기준)

- carry_over는 Claude 내부 검수용 필드다. 프론트에 노출되지 않는다.
  key_insight: 이 scene에서 확정된 핵심 사실 한 줄
  do_not_repeat: 이후 scene에서 반복하면 안 되는 표현·개념 목록

## Scene 분리 규칙 (중요)
각 scene은 **하나의 층위만 다룬다.**
- 이전 scene에서 다룬 현재 상태/행동 패턴/미래 흐름을 다음 scene에서 다시 설명하지 않는다.
- carry_over.do_not_repeat 항목은 반드시 다음 scene에서 회피할 것.
- 각 scene이 새로운 깊이로 들어가야 narrative가 진행된다.

## Messages 연결성 (매우 중요)
각 message는 독립적이 아니라 서로 이어져야 한다:

❌ 나쁜 예:
- 상대가 애매하게 행동하고 있어.
- 너는 그걸 계속 해석하고 있어.
- 그래서 마음이 흔들려.

⭕ 좋은 예:
- 상대가 애매하게 행동하면, 너는 그걸 그냥 넘기지 못해.
- 문제는 그 다음이야. 그 작은 반응 하나가 기준이 되고, 그 기준에 맞지 않는 순간부터 마음이 흔들리기 시작해.
- 그래서 이 관계는 상대가 뭘 했는지보다, 네가 그걸 어떻게 붙잡고 있는지가 더 중요해져.

## 무료 → 유료 Scene 전환 (프로그레션)
**무료 scene이 끝나고 유료 scene이 새로 시작하는 느낌이 아니어야 한다.**
**각 무료 scene의 마지막 메시지는 다음 유료 scene을 자연스럽게 불러와야 한다.**

규칙:
- 무료 scene 2의 마지막 메시지는 다음 유료 scene 3의 주제를 암시
- 현재 상태 설명을 넘어, 새로운 질문/관점/층위를 열어주기
- 사용자가 "더 알고 싶다" "깊이 들어가야 한다"는 자연스러운 욕구 유발
- 감정 흐름이 끊기지 않고 progression으로 느껴지도록

예시:
- 무료 2가 "패턴 발견"에서 끝나면
  → 유료 3은 "그 패턴의 본질 이해"로 이어진다
- 무료 2의 마지막: "근데 이 패턴 뒤에 있는 진짜 이유는 뭘까?"
- 유료 3의 첫 메시지: "그건 이 부분을 봐야 해..."

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
