import { SceneConfigItem, SceneConfig } from "@/lib/types/content";
import { ResultScene, SceneMessage } from "@/lib/types/result";

// ── Claude 응답 타입 ────────────────────────────────────────────────────

export type ClaudeMessageType = "ai" | "punch";

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

## Narrative 철학
- 각 scene은 하나의 연결된 흐름
- 이전 scene 내용을 반복하지 않기

## 문체: 반말 (친구처럼)
### ⚠️ 반말 종결 규칙 (필수)
금지: ~다, ~된다, ~한다, ~것이다, ~할 수 있어, ~인 것 같아
다양화: ~하고 있어, ~하게 돼, ~처럼 느껴져, ~에 가까워, ~로 이어져, ~이 남아, ~가 커져 등

## 줄바꿈 규칙 (매우 중요)
- 줄바꿈은 감정 연출용으로 남발하지 않는다
- 문장은 자연스럽게 이어 읽히는 흐름을 우선한다
- 의미 없는 짧은 개행 금지
- 조사/어미가 다음 줄로 떨어지지 않게 한다
- 한 문장을 여러 줄로 잘게 끊지 않는다
- 짧은 문장 여러 개보다 자연스러운 호흡의 문장을 선호한다
- \\n은 정말 필요한 경우만 사용한다

좋은 예:
"답장을 기다리는 게 아니라, 아직 끝나지 않았다는 확신을 기다리고 있는 거야."

나쁜 예:
"답장을 기다리는 게 아니라,\n아직 끝나지 않았다는\n확신을 기다리고 있는 거야."


## 출력
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
}
순수 JSON만. 마크다운/코드블록 금지.`;

// ── FREE Generate System Prompt ────────────────────────────────────────────────

const buildFreeGenerateSystemPrompt = (): string => {
  return `${coreSystemPrompt()}

## 무료 Scene 목표
짧고 강하게. 읽고 바로 다음이 궁금해지는 느낌.

무료는:
- 현재 상태를 요약하지 않는다
- 사용자가 이미 말한 내용을 반복하지 않는다
- 긴 설명이 아니라 "짧은 의미 전환"
- 읽힘 + 흐름 발견 + 패턴 포착

좋은 방향 (짧은 통찰):
✅ "답장을 기다리는 게 아니라, 확신이 오길 기다리고 있는 거야."
✅ "상대를 읽고 있는 것 같지만, 사실은 가능성이 끝났는지 확인하고 있는 거야."
✅ "매번 같은 질문을 하는데, 실제로는 다른 답을 기다리는 거야."

피해야 할 것:
❌ "너는 불안해하고 있어" (상태 진단)
❌ 입력한 감정을 그대로 반복
❌ 긴 상황 묘사 / 분위기 설명
❌ 구조적 이유, 미래, 관점 전환 (그건 유료)

## 무료 Scene 구성
- scene_config의 goal / focus / forbidden을 반드시 따른다
- 메시지는 짧고 선명하게
- 필요하면 메시지 수를 줄여도 괜찮다
- 한 메시지 1~2문장 (짧은 임팩트)
- 마지막 메시지는 반드시 유료로 연결하는 hook

마지막 메시지 (Hook) 규칙:
- 설명보다 질문에 가까워야 한다
- 결론을 닫지 않는다
- 사용자가 스스로 이어 생각하게 만들어야 한다
- "뭔가 더 있다"를 느끼게 해야 한다
- 구조 설명보다 감정적 불편함을 남긴다

좋은 Hook 예:
✅ "근데 네가 계속 확인하고 있는 건, 상대 마음이 아닐 수도 있어."
✅ "문제는 답장이 아니라, 네가 아직 어떤 가능성을 포기 못하고 있다는 거야."
✅ "근데 네가 붙잡고 있는 건, 진짜 이 사람일까?"

나쁜 Hook 예:
❌ "그 안에는 네가 아직 답을 받을 준비가 안 된 마음이 있어."
❌ "이건 결국 네가 불안해서 생기는 반복이야."
❌ "그래서 너는 계속 단서를 모으고 있는 거야."
`;
};

// ── PAID Generate System Prompt ────────────────────────────────────────────────

const buildPaidGenerateSystemPrompt = (
  freeContext: FreeSceneContext,
): string => {
  const contextStr = formatFreeSceneContext(freeContext);

  return `${coreSystemPrompt()}

## 유료 Scene 목표
"짧은 통찰과 관점 이동"

무료에서는 "패턴"을 읽었다면,
유료에서는 그 패턴이 "무엇을 의미하는지" 드러낸다.

${contextStr}

### 핵심 전략: 의미 전환 (Reinterpretation)

유료의 역할:
"사용자가 뭘 하고 있는지" → "그게 실제로 뭘 의미하는지"

예시:
❌ "너는 답장을 다시 읽고 있어. 상대를 붙잡으려는 심리 때문이야."
✅ "답장을 다시 읽는 게 아니라, 아직 끝나지 않았다는 증거를 찾고 있는 거야."

❌ "너는 기다리고 있어. 미래를 두려워하기 때문이야."
✅ "기다리는 게 아니라, 끝나는 순간을 미루고 있는 거야."

핵심:
짧지만 의미가 뒤집히는 문장.
"아, 그게 그런 의미였구나"를 느끼게 해야 한다.

### 구성 원칙

1. 상황 설명은 최소한만
   - 무료에서 이미 읽은 내용 반복 금지
   - 통찰을 위해 필요한 만큼만 사용
   - "감정 에세이" 느낌 금지

2. Scene 당 1~2개의 의미 전환 포인트
   한 scene 안에서 사용자의 시선이 바뀌는 지점이 있어야 한다.
   예: "상대를 붙잡는 게 아니라 가능성을 붙잡는 상태"
   예: "확인이 아니라 확신 확인 욕구"

3. 구조: 짧은 관찰 → 의미 재해석 → 구조 드러남
   - 행동/패턴 관찰 (간단히)
   - 그게 실제로 뭐인지 의미 전환
   - 왜 그렇게 되는지 구조 드러내기

### 메시지 구성
- **ai (opener)**: 무료를 이어받으며 의미 전환으로 진입 (3~4문장)
  예: "너는 [무료에서 읽은 패턴]. 근데 그건 실제로는..."

- **ai**: 의미 전환이 핵심 (2~4문장)
  길이가 아니라 의미 깊이가 중요.
  상황 설명 > 의미 재해석 (X)
  짧은 관찰 > 의미 재해석 (O)

- **punch**: 의미 전환의 정점 (필요시만, 1~2줄)
  예: "확인하고 싶은데,\n놓지 못하고 있는 거야."

### 필수 요건
- 긴 감정 설명 / 분위기 묘사 금지
- 사용자가 이미 알고 있는 상태 재설명 금지
- "아, 그게 그런 의미였구나" 하는 깨달음 필수
- 무료 scene과 내용 겹치지 않기
- Scene마다 새로운 의미 전환 포인트 제시
- 짧지만 관점이 바뀌는 표현

### 무료 vs 유료 최종 정리
무료: 읽힘 (감정 흐름 발견, 패턴 포착)
유료: 통찰 (왜 그런지, 실제로 뭘 의미하는지, 그 흐름의 구조)

유료는 "잘 쓴 감정 에세이" ❌
유료는 "읽다가 관점이 바뀌는 해석" ⭕`;
};

// ── FREE Generate Prompt Builder ────────────────────────────────────────────────

export const buildFreeGeneratePrompt = (params: {
  contentTitle: string;
  category: string;
  userInput: UserInputPayload;
  sceneConfig: SceneConfig;
  sceneIndexes: number[];
}): { system: string; userMessage: string } => {
  const { contentTitle, category, userInput, sceneConfig, sceneIndexes } =
    params;

  const scenesToGenerate = sceneConfig.scenes.filter((s) =>
    sceneIndexes.includes(s.index),
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
    sceneIndexes.includes(s.index),
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
  const sceneIndexes =
    params.sceneIndexes || params.sceneConfig.scenes.map((s) => s.index);
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
  console.log(`[parseClaudeResult] 입력 문자열 길이: ${raw.length}`);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error(
      "[parseClaudeResult] JSON을 찾을 수 없습니다. 원본 응답:",
      raw.slice(0, 500),
    );
    throw new Error("Claude 응답에서 JSON을 찾을 수 없습니다");
  }

  console.log(`[parseClaudeResult] 추출된 JSON 길이: ${jsonMatch[0].length}`);

  try {
    const parsed = JSON.parse(jsonMatch[0]) as ClaudeGeneratedResult;

    if (!Array.isArray(parsed.scenes)) {
      throw new Error("Claude 응답에 scenes 배열이 없습니다");
    }

    console.log(`[parseClaudeResult] Scene 개수: ${parsed.scenes.length}`);

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

    console.log(`[parseClaudeResult] 파싱 성공`);
    return parsed;
  } catch (parseErr) {
    console.error("[parseClaudeResult] JSON 파싱 또는 검증 실패");
    console.error("추출된 JSON 길이:", jsonMatch[0].length);
    console.error("추출된 JSON 첫 1000자:", jsonMatch[0].slice(0, 1000));
    console.error("추출된 JSON 마지막 300자:", jsonMatch[0].slice(-300));
    console.error("파싱 에러:", parseErr);
    throw new Error(
      `Claude JSON 처리 실패: ${parseErr instanceof Error ? parseErr.message : "알 수 없는 에러"}`,
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
