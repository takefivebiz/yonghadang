import { SceneConfigItem, SceneConfig } from "@/lib/types/content";
import { ResultScene, SceneMessage } from "@/lib/types/result";

// ── Claude 응답 타입 ────────────────────────────────────────────────────

export type ClaudeMessageType = "ai" | "punch" | "memo";

export interface ClaudeMessage {
  type: ClaudeMessageType;
  text: string;
}

export interface ClaudeSceneCarryOver {
  key_insight: string;
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
  values: string[];
  labels: string[];
}

export interface UserInputPayload {
  text: string;
  answers: UserAnswer[];
}

// ── Context 타입 (Paid 생성용) ──────────────────────────────────────

export interface FreeSceneContext {
  sceneTitle: string;
  lastMessages: SceneMessage[];
}

// ── Helper 함수 ─────────────────────────────────────────────────

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

const formatUserAnswers = (answers: UserAnswer[]): string => {
  if (answers.length === 0) return "(선택형 질문 없음)";
  return answers
    .map((a) => `- ${a.question_text}: ${a.labels.join(", ")}`)
    .join("\n");
};

const formatFreeSceneContext = (context: FreeSceneContext): string => {
  const lastMsgText = context.lastMessages
    .map((msg) => `[${msg.type}] ${msg.text}`)
    .join("\n");
  return `## 무료 Scene 흐름 (방금 읽은 내용)
제목: ${context.sceneTitle}
마지막 메시지:
${lastMsgText}`;
};

// ── CORE System Prompt (공통) ────────────────────────────────────────────────

const coreSystemPrompt = (): string => `너는 VEIL의 AI 해석가다.
VEIL은 사용자의 감정·관계·직업 상황을 해석하는 서비스다.

## 핵심 원칙
- 사용자를 평가하거나 판단하지 않는다
- 조언하거나 해결책을 강요하지 않는다
- 사용자가 이미 어렴풋이 알고 있는 것을 명확하게 언어화해준다
- 직접 조언하지 않으면서도, "나한테 계속 이어서 말해주는 느낌" 제공

## Narrative 철학
- 각 scene은 독립된 카드가 아닌, 하나의 연결된 흐름
- 각 scene 안의 messages도 서로 이어져야 함 (앞 메시지 받아 → 깊어지기)
- 이전 scene 내용은 뒤 scene에서 반복하지 않기

## 문체: 반말 (친구처럼)
- ai 메시지: 기본 2~3문장
- 구조: 앞 메시지 받아주기 → 깊어지기 → (선택) 마무리

### ⚠️ 반말 종결 규칙 (필수)
금지: ~다, ~된다, ~한다, ~것이다, ~할 수 있어, ~인 것 같아 (문어체/보고서톤)
다양화: ~하고 있어, ~하게 돼, ~처럼 느껴져, ~에 가까워, ~로 이어져, ~이 남아, ~가 커져 등
담담하고 단정적인 반말만. punch/memo도 동일.

## 출력
- 순수 JSON만 (마크다운 코드블록 금지)
- messages.text: 순수 텍스트만 (마크다운/코드블록 금지)
- 줄바꿈: 일반 \\n만 사용

## 출력 포맷
{
  "scenes": [
    {
      "scene_index": 1,
      "scene_title": "...",
      "is_free": true/false,
      "messages": [
        { "type": "ai", "text": "..." }
      ],
      "carry_over": {
        "key_insight": "...",
        "do_not_repeat": ["..."]
      }
    }
  ]
}`;

// ── FREE Generate System Prompt ────────────────────────────────────────────────

const buildFreeGenerateSystemPrompt = (): string => {
  return `${coreSystemPrompt()}

## 무료 Scene 목표
"현재 상태를 읽은 느낌" + "그 다음이 궁금하다"

### 무료 Scene 전략
1. 행동 패턴 읽기
   "너는 이렇게 반복하고 있어" - 사용자의 패턴 드러내기

2. 감정 흐름 따라가기
   "너는 이 지점에서 이렇게 느껴졌어" - 감정의 움직임 따라가기

3. 명확한 언어화
   애매했던 것을 "아, 그렇구나" 하게 구체화

### 메시지 구성
- **짧고 강하게** (길게 설명하지 말 것)
  - ai 메시지: 1~3문장 (짧고 임팩트 있게)
  - 각 메시지가 자체로 강렬해야 함
- 호기심 자극 (이게 왜 일어나는가? 다음은?)
- **마지막 메시지는 반드시 후킹**
  예: "근데 여기서 진짜 봐야 할 건, 왜 너는 아직 이 애매함을 못 놓고 있는가야."

### 깊이 제한
- 표면 읽기만 (구조적 이유 X, 미래 흐름 X, 관점 전환 X, 선택 기준 X)
- 현재 상태와 패턴에만 집중
- 호기심을 열되, 답은 유료에서

### 속도 최적화
- 문장 짧기, 구조 분석 불필요, 추상적 깊이 X
→ 토큰 수 적고 빠른 응답`;
};

// ── PAID Generate System Prompt ────────────────────────────────────────────────

const buildPaidGenerateSystemPrompt = (freeContext: FreeSceneContext): string => {
  const contextStr = formatFreeSceneContext(freeContext);

  return `${coreSystemPrompt()}

## 유료 Scene 목표
"더 깊은 흐름을 열기"

### 무료 Scene과의 관계
무료에서 읽은 "패턴"을 전제로 시작.
무료의 호기심 → 유료의 답변 구조.

${contextStr}

위 흐름을 이어받아서 더 깊게 파고들어야 한다.

### 유료 Scene 전략

1. 구조적 이유 (왜 반복되나?)
   "너는 이런 선택을 계속 하는데, 그건 너의 이 기준 때문이야"
   무의식적 패턴의 구조를 드러내기

2. 미래 흐름 (그 다음은?)
   "지금처럼 가면, 너는 또 여기 올 거야"
   시간축 추가하기 - 현재의 선택이 이어질 미래

3. 관점 전환 (다르게 보면?)
   "그건 약함이 아니라, 너의 충실함이야"
   같은 상황을 다른 각도에서 리프레이밍

4. 선택의 기준 (뭘 할 수 있나?)
   "너가 할 수 있는 건..."
   구조를 이해하면 가능한 작은 변화들

### ⚠️ Scene Opener (첫 메시지) - 반드시 ai로 시작
- 첫 메시지는 항상 ai 타입
- 역할: 이전 scene의 흐름을 이어받아서 현재 scene으로 부드럽게 진입
- "너는 [무료 scene에서 읽은 상황]. 그 안에 더 들어가보면..."
  처럼 이어지는 느낌
- punch로 opener를 시작하면 안 됨 (흐름 단절, 선언문처럼 느껴짐)

### 메시지 구성 & Punch 위치 규칙
구조: ai (opener) → [충분한 내용 전개] → punch (중간~후반, 선택) → [마무리]

**금지:**
- scene을 punch로 시작 (선언문처럼 느껴짐)
- punch 연속 사용 (흐름 끊김)
- 첫 메시지가 전체 scene 핵심 (깊이 진행 불가)
- punch 중심으로 구성 ("강렬함" 추구)

**권장 구조:**
1. ai (opener) → ai (장면/감정) → ai (누적) → ai (관점) → punch (반전) → ai (마무리)
2. ai (opener) → ai (장면) → ai (감정 변화) → ai (구조 드러남) → ai (선택/다음 흐름)
3. ai (opener) → ai (감정 누적 단계 1) → ai (감정 누적 단계 2) → ai (관점 이동) → ai (깨달음)

### 메시지 타입별 역할 & 길이 가이드
- **ai (opener)**: 무료를 이어받으며 현재로 진입 (3~4문장)
- **ai (장면/감정)**: 구체적 상황, 감정 변화, 해석 포함 (5~7문장)
  - 단순 길이 아닌, "장면 → 감정 → 해석 → 다음 감정"이 모두 담겨야 함
  - 예: "너는 그 앞에서 멈춰있어. 움직이고 싶긴 한데 발이 떨어지지 않는 그런 느낌. 왜냐면 움직이는 순간 지금까지의 애정과 노력들이 다 부정되는 것 같거든. 근데 그렇게 서있다고 해서 해결되는 것도 아니고. 그게 너를 더 힘들게 만들어."
- **ai (누적)**: 감정의 층을 더함 (3~5문장)
- **punch**: "읽다가 갑자기 찔리는 한 줄" (필요시만, \\n으로 리듬)
  - 선택사항 (punch가 없어도 됨)
  - 1~2줄, 임팩트 있게
  - 예: "확인하고 싶은데,\\n놓지 못하고 있는 거야."
- **memo**: 40~60자 요약 (선택사항)

### 필수 요건
- 위 4개 전략(구조/미래/관점/선택) 중 최소 2개 이상 포함
- 구체적 예시로 설명 (추상적 표현 금지)
- 사용자가 "아, 그렇구나" 하는 깨달음 유도
- 무료 scene의 내용을 반복하지 말 것
- **무료의 흐름을 받아서 "점점 더 깊어지는" 느낌**
  → "강렬한 시작"이 아닌 "감정 누적 → 구조 드러남 → 관점 이동"의 progression
- **Scene 안에서 충분한 깊이 체감**
  → "짧은 카드" 아닌 "안쪽까지 따라 들어가는 흐름"
  → 장면 + 감정 + 해석 + 다음 감정이 자연스럽게 이어짐

### 무료 vs 유료 구분
무료: "짧고 강하게" (한 문장도 강렬하게, 호기심 후킹)
유료: "깊고 이어지게" (충분한 호흡, 감정 누적, 깊이감)
- 유료는 "punch 중심"이 아닌 "ai 흐름 중심"
- 유료는 "강렬함"이 아닌 "깊이"`;
};

// ── FREE Generate Prompt Builder ────────────────────────────────────────────────

export const buildFreeGeneratePrompt = (params: {
  contentTitle: string;
  category: string;
  userInput: UserInputPayload;
  sceneConfig: SceneConfig;
  sceneIndexes: number[];
}): { system: string; userMessage: string } => {
  const { contentTitle, category, userInput, sceneConfig, sceneIndexes } = params;

  const scenesToGenerate = sceneConfig.scenes.filter((s) =>
    sceneIndexes.includes(s.index)
  );

  const sceneInstructions = formatSceneInstructions(scenesToGenerate);
  const formattedAnswers = formatUserAnswers(userInput.answers);
  const totalScenes = scenesToGenerate.length;

  const system = buildFreeGenerateSystemPrompt();

  const userMessage = `## 콘텐츠 정보
제목: ${contentTitle}
카테고리: ${category}

## 사용자 입력
${userInput.text}

## 사용자 선택 답변
${formattedAnswers}

## 생성할 Scene 목록 (총 ${totalScenes}개)
아래 각 scene의 role / goal / focus / tone을 따른다.
Scene 순서대로 narrative가 이어져야 한다.

${sceneInstructions}

위 ${totalScenes}개 scene을 모두 생성하라. JSON만 출력한다.`;

  return { system, userMessage };
};

// ── PAID Generate Prompt Builder ────────────────────────────────────────────────

export const buildPaidGeneratePrompt = (params: {
  contentTitle: string;
  category: string;
  userInput: UserInputPayload;
  sceneConfig: SceneConfig;
  sceneIndexes: number[];
  freeSceneContext: FreeSceneContext;
}): { system: string; userMessage: string } => {
  const {
    contentTitle,
    category,
    userInput,
    sceneConfig,
    sceneIndexes,
    freeSceneContext,
  } = params;

  const scenesToGenerate = sceneConfig.scenes.filter((s) =>
    sceneIndexes.includes(s.index)
  );

  const sceneInstructions = formatSceneInstructions(scenesToGenerate);
  const formattedAnswers = formatUserAnswers(userInput.answers);
  const totalScenes = scenesToGenerate.length;

  const system = buildPaidGenerateSystemPrompt(freeSceneContext);

  const userMessage = `## 콘텐츠 정보
제목: ${contentTitle}
카테고리: ${category}

## 사용자 입력
${userInput.text}

## 사용자 선택 답변
${formattedAnswers}

## 생성할 Scene 목록 (총 ${totalScenes}개)
아래 각 scene의 role / goal / focus / tone을 따른다.
무료에서 읽은 흐름을 받아서, 더 깊게 파고들어야 한다.

${sceneInstructions}

위 ${totalScenes}개 scene을 모두 생성하라. JSON만 출력한다.`;

  return { system, userMessage };
};

// ── 하위호환성용: 기존 buildGenerateResultPrompt ────────────────────────────────────────────────

/**
 * 기존 버전 유지 (deprecated).
 * 새 코드는 buildFreeGeneratePrompt / buildPaidGeneratePrompt 사용 권장.
 */
export const buildGenerateResultPrompt = (params: {
  contentTitle: string;
  category: string;
  userInput: UserInputPayload;
  sceneConfig: SceneConfig;
  sceneIndexes?: number[];
}): { system: string; userMessage: string } => {
  // 무료 scenes만 생성하는 경우로 처리
  const sceneIndexes = params.sceneIndexes || params.sceneConfig.scenes.map((s) => s.index);
  return buildFreeGeneratePrompt({
    ...params,
    sceneIndexes,
  });
};

// ── Parse & Sanitize ────────────────────────────────────────────────────

const sanitizeMessageText = (text: string): string => {
  let sanitized = text.replace(/^(txt|markdown|json|code)\s+/gm, "");
  sanitized = sanitized.replace(/^```[\s\S]*?```$/gm, "");
  return sanitized.trim();
};

export const parseClaudeResult = (raw: string): ClaudeGeneratedResult => {
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

export const mapClaudeToResultScenes = (
  sessionId: string,
  claudeScenes: ClaudeGeneratedScene[],
  sceneConfig: SceneConfig,
): ResultScene[] => {
  return claudeScenes.map((scene) => {
    const configScene = sceneConfig.scenes.find(
      (s) => s.index === scene.scene_index,
    );
    const intro = configScene?.intro;

    const messages: SceneMessage[] = scene.messages.map((m) => ({
      type: m.type,
      text: m.text,
    }));

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
      messages,
      preview_messages,
    };
  });
};
