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

/**
 * stateSummary 배열을 Claude userMessage에 삽입할 섹션 문자열로 변환.
 * 비어있거나 undefined면 빈 문자열 반환 (섹션 자체를 생략).
 */
const formatStateSummary = (summary: string[] | undefined): string => {
  if (!summary || summary.length === 0) return "";
  const lines = summary.map((s) => `- ${s}`).join("\n");
  return `\n## 사용자 내면 상태 (선택 패턴에서 추론)\n${lines}\n\n`;
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
- 사용자를 모호하게 위로하지 않는다
- 관계의 미래를 예언하거나 상대 마음을 단정하지 않는다
- 대신 현재 드러난 감정 반응과 행동 패턴은 선명하게 해석한다
- 사용자가 “맞다/뜨끔하다” 느낄 만큼 직접적으로 말한다
- 결론을 대신 내려주지는 않지만, 가능한 방향과 감정의 결과는 보여준다

## 사용자 내면 상태 반영 (가장 중요한 핵심)
같은 자유 입력이라도, stateSummary가 다르면 강조점·해석 방향·문장 결이 명확히 달라져야 한다.
stateSummary는 narrative의 핵심 분기 기준이다.

state "연락 하나에도 하루 기분이 달라진다" → 답장 타이밍이 하루를 좌우하는 구체적 장면으로 풀어낸다
state "나만 더 좋아하는 것 같다는 생각이 반복된다" → 불균형 민감도가 어떤 행동으로 이어지는지 중심으로 풀어낸다

같은 입력 + 다른 stateSummary = 다른 사람의 이야기처럼 느껴져야 한다.

scene 생성 시 반드시 중심 흐름으로 반영한다:
- 무엇에 예민하게 반응하는지
- 어떤 확신을 원하고 있는지
- 어디에서 감정이 흔들리는지

상태 문장을 그대로 반복하거나 진단하지 않는다.
상태가 장면 속에서 자연스럽게 드러나도록 서술한다.

generic한 감정 위로/연애상담처럼 작성하는 것은 실패다.

## Narrative 철학
- 각 scene은 하나의 연결된 흐름
- 이전 scene 내용을 반복하지 않기

## 문체: 반말
- 최종 메시지는 자연스러운 반말로 쓴다
- 너무 조심스러운 표현을 남발하지 않는다
- “~일 수도 있어”, “~인 것 같아”, “~에 가까워”를 반복하지 않는다
- 필요하면 “너는 ~하는 편이야”, “너는 ~할수록 ~하게 돼”처럼 직접 말한다

행동 패턴 직접 언어화: 허용
✅ "너는 확신이 없을수록 작은 반응에 더 오래 머무는 편이야."
✅ "너는 ~할수록 ~하게 돼." / "너는 ~보다 ~에 더 가까워."

라벨링: 금지
❌ "불안형이야" / "회피형이야" / "불안도가 높아" / "애착유형상 ~"
심리 유형 라벨은 금지. 행동 패턴을 직접 말하는 건 허용.

## 줄바꿈 규칙
- 감정 연출용으로 남발하지 않는다
- 문장은 자연스럽게 이어 읽히는 흐름을 우선한다
- 짧은 문장 여러 개보다 자연스러운 호흡의 문장을 선호한다
- \\n은 정말 필요한 경우만 사용한다

❌ "답장을 기다리는 게 아니라,\n아직 끝나지 않았다는\n확신을 기다리고 있는 거야."
✅ "답장을 기다리는 게 아니라, 아직 끝나지 않았다는 확신을 기다리고 있는 거야."

## Punch 규칙 (필수)
모든 scene의 messages[0]은 반드시 punch다. 예외 없음.

punch = 이 scene에서 사용자가 "맞다/뜨끔하다"고 느낄 감정 압축 문장
- 1문장. 반말.
- 줄바꿈 규칙 — 아래 중 하나라도 해당하면 반드시 \n 삽입. 예외 없음.
  ① 대조·전환 구조 (A가 아니라 B / A보다 B / A지만 B / A인 게 아니라 B)가 있으면,
     전환 접속어 직전(콤마 포함 시 콤마 뒤)에서 반드시 \n.
  ② 서술형이어도 문장 전체가 30자 이상이면 가장 자연스러운 호흡 지점에서 \n.
  ③ 30자 미만 단문만 \n 생략 허용.
  ✅ "이 사람은 마음이 없는 게 아니라,\n마음을 행동으로 옮길 이유를 아직 못 찾은 거야."
  ✅ "확신이 없을수록\n작은 반응에 더 오래 머무는 편이야."
  ❌ "확신이 없을수록 작은 반응에 더 오래 머무는 편이야." (30자 이상이면 반드시 \n 삽입)
- scene title 바로 아래 subtitle. scene 전체의 감정 core.
- 진단/라벨링/위로 금지. 행동·감정 패턴을 직접 짚는다.
- 이후 ai 메시지들이 이 punch를 전개한다. 내용을 미리 spoil하지 않는다.

## 출력
{
  "scenes": [
    {
      "scene_index": 1,
      "scene_title": "...",
      "is_free": true/false,
      "messages": [
        { "type": "punch", "text": "이 scene의 감정을 압축한 한 문장" },
        { "type": "ai", "text": "..." },
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
읽자마자 "내 패턴을 들킨 느낌"이 들어야 한다.
사용자가 입력한 상황을 요약하지 않는다. 그 상황 안에서 사용자가 어떻게 반응하는 사람인지를 언어화한다.

✅ "너는 확신이 없을수록 작은 반응에 더 오래 머무는 편이야."
✅ "상대가 뭘 했는지보다, 그 반응이 너를 어디까지 흔드는지가 더 크게 남아."
✅ "답장을 보는 게 아니라, 아직 가능성이 남아 있는지 확인하고 있는 쪽에 가까워."

❌ "불안형이야" (심리 유형 라벨링 금지)
❌ 입력한 감정/상황을 그대로 반복
❌ 긴 상황 묘사 / 분위기 설명
❌ 구조적 이유, 미래, 관점 전환 (그건 유료)

## 무료 Scene 구성
- scene_config의 goal / focus / forbidden을 반드시 따른다
- ai 버블: 중간 길이 (2~4문장). 너무 짧으면 들킨 느낌이 안 난다
- 마지막 메시지는 유료로 연결하는 hook

## 무료 Scene 마지막 메시지 규칙 (매우 중요)

무료 마지막 메시지는:
- 사용자가 가장 궁금해할 다음 질문을 남겨야 한다
- 답을 완전히 닫지 않는다
- 사용자가 스스로 다음 해석을 보고 싶게 만들어야 한다
- 특정 결론을 단정하지 않는다
- 하지만 현재 상황에서 가장 핵심적인 의문이나 긴장감은 분명하게 남긴다

핵심:
- 유저가 실제로 궁금해하는 질문이어야 한다
- 유료 scene에서 실제로 이어서 풀어줄 수 있는 질문이어야 한다
- 낚시처럼 특정 결론을 과장해서 암시하면 안 된다
- 사용자가 "그래서 그게 무슨 의미인데?"를 궁금해하게 만들어야 한다

## Punch 구체 지침 (무료 scene)
messages[0]은 punch. 무료 scene의 패턴 포착을 한 문장으로 압축한다.
"들킨 느낌"이 나야 한다. ai 버블들이 이 punch를 전개하는 구조다.
`;
};

// ── PAID Generate System Prompt ────────────────────────────────────────────────

const buildPaidGenerateSystemPrompt = (
  freeContext: FreeSceneContext,
): string => {
  const contextStr = formatFreeSceneContext(freeContext);

  return `${coreSystemPrompt()}

## 유료 Scene 목표
"내 이야기를 깊게 읽어준다"는 느낌.
짧은 통찰이 아니라 충분한 해석 밀도가 필요하다.

무료에서 "패턴"을 읽었다면, 유료에서는 이것을 구체적으로 풀어낸다:
- 지금 사용자가 무엇에 묶여 있는지
- 왜 그 감정이 반복되는지
- 그 감정이 어떤 방향으로 흘러가는지
- 사용자가 놓치고 있는 기준이 무엇인지

${contextStr}

## 핵심 전략: 의미 전환 (Reinterpretation)
"사용자가 뭘 하고 있는지" → "그게 실제로 뭘 의미하는지"

❌ "너는 답장을 다시 읽고 있어. 상대를 붙잡으려는 심리 때문이야."
✅ "답장을 다시 읽는 게 아니라, 아직 끝나지 않았다는 증거를 찾고 있는 거야."

"아, 그게 그런 의미였구나"를 느끼게 해야 한다.

## 구성 원칙
1. 무료에서 이미 읽은 내용 반복 금지. 통찰을 위해 필요한 최소한만 사용
2. Scene당 1~2개의 의미 전환 포인트
3. 짧은 관찰 → 의미 재해석 → 구조 드러내기

## 메시지 구성
- punch (messages[0]): 유료 scene의 핵심 의미 전환을 한 문장으로. 줄바꿈 규칙은 위 Punch 규칙과 동일하게 반드시 적용. 이후 ai들이 이 punch를 전개한다.
- ai opener: punch를 이어받으며 강한 해석으로 진입 (3~5문장)
- ai main: 감정 반응, 반복 행동, 붙잡는 이유, 앞으로의 방향을 충분히 풀어낸다 (5~8문장)
- ai closing: 사용자가 가져갈 기준이나 다음 질문을 2~4문장으로 남긴다.

유료 ai 버블은 길어도 된다. 4,900원을 결제한 사용자가 “충분히 읽혔다”고 느껴야 한다.

무료: 읽힘 (패턴 포착) / 유료: 통찰 (왜, 실제로 뭘 의미하는지, 그 흐름의 구조)`;
};

// ── FREE Generate Prompt Builder ────────────────────────────────────────────────

export const buildFreeGeneratePrompt = (params: {
  contentTitle: string;
  category: string;
  userInput: UserInputPayload;
  sceneConfig: SceneConfig;
  sceneIndexes: number[];
  /** 선택 패턴에서 추론한 사용자 내면 상태 문장 배열. 없으면 섹션 생략. */
  stateSummary?: string[];
}): { system: string; userMessage: string } => {
  const {
    contentTitle,
    category,
    userInput,
    sceneConfig,
    sceneIndexes,
    stateSummary,
  } = params;

  const scenesToGenerate = sceneConfig.scenes.filter((s) =>
    sceneIndexes.includes(s.index),
  );

  const sceneInstructions = formatSceneInstructions(scenesToGenerate);
  const formattedAnswers = formatUserAnswers(userInput.answers);
  const totalScenes = scenesToGenerate.length;
  const formattedStateSummary = formatStateSummary(stateSummary);

  const system = buildFreeGenerateSystemPrompt();

  const userMessage = `## 콘텐츠 정보
제목: ${contentTitle}
카테고리: ${category}

## 사용자 입력
${userInput.text}

## 사용자 선택 답변
${formattedAnswers}
${formattedStateSummary}
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
  /** 선택 패턴에서 추론한 사용자 내면 상태 문장 배열. 없으면 섹션 생략. */
  stateSummary?: string[];
}): { system: string; userMessage: string } => {
  const {
    contentTitle,
    category,
    userInput,
    sceneConfig,
    sceneIndexes,
    freeSceneContext,
    stateSummary,
  } = params;

  const scenesToGenerate = sceneConfig.scenes.filter((s) =>
    sceneIndexes.includes(s.index),
  );

  const sceneInstructions = formatSceneInstructions(scenesToGenerate);
  const formattedAnswers = formatUserAnswers(userInput.answers);
  const totalScenes = scenesToGenerate.length;
  const formattedStateSummary = formatStateSummary(stateSummary);

  const system = buildPaidGenerateSystemPrompt(freeSceneContext);

  const userMessage = `## 콘텐츠 정보
제목: ${contentTitle}
카테고리: ${category}

## 사용자 입력
${userInput.text}

## 사용자 선택 답변
${formattedAnswers}
${formattedStateSummary}
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
  // Claude가 JSON 내 줄바꿈을 \\n (리터럴 두 글자)로 출력한 경우 실제 개행으로 복원.
  // 이미 실제 개행(\n 한 글자)인 경우에는 이 치환이 영향을 주지 않는다.
  sanitized = sanitized.replace(/\\n/g, "\n");
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
      // \\n (리터럴 두 글자) → 실제 개행으로 복원. 이미 실제 개행이면 영향 없음.
      scene_title: scene.scene_title.replace(/\\n/g, "\n"),
      intro,
      is_free: scene.is_free,
      is_unlocked: false,
      messages,
      preview_messages,
    };
  });
};
