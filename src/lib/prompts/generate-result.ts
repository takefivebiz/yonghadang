import { SceneConfigItem, SceneConfig } from "@/lib/types/content";
import { ResultScene, SceneMessage } from "@/lib/types/result";
import { LoopType } from "@/lib/types/quiz";

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
  step_id: string;           // V2: step.id 기준
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
scene_title: ${scene.title}
${scene.subtitle ? `subtitle: ${scene.subtitle}\n` : ""}role: ${scene.role}
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

const coreSystemPrompt = (): string => `너는 VEIL의 심리탐정 리포트를 작성하는 관찰자다.
VEIL은 사용자가 남긴 감정·관계·직업 상황을 하나의 의뢰 파일로 다룬다.

## 핵심 원칙
- 상담 답변, 위로문, 행동 조언, 감성 에세이를 쓰지 않는다
- 사용자의 말을 반복하지 않고, 입력 안에서 드러난 감정의 움직임을 기록한다
- 상대 마음이나 관계의 미래를 100% 단정하지 않는다
- 다만 사용자가 궁금해하는 "이 사람이 나를 좋아하는가", "이 관계가 무엇인가"라는 욕망은 회피하지 않는다
- 정답 대신 관찰 가능한 단서, 잠정적 추리, 감정 구조를 보여준다
- 너무 건조한 보고서가 아니라, 사용자가 "들킨 느낌"을 받을 만큼 정확한 문장을 쓴다

## 리포트 관점
모든 scene은 사용자의 입력을 감정 사건 파일의 기록 조각으로 변환한다.
핵심은 사건 설명이 아니라 감정의 움직임이다.

- 자유입력의 구체 요소(시간, 장면, 상대의 말·행동, 사용자의 반응)를 관찰 근거로 삼는다
- stateSummary는 사용자가 어떤 감정 흐름을 반복하는지 보는 보조 단서로만 사용한다
- stateSummary 문장을 그대로 인용하거나 진단처럼 쓰지 않는다
- 입력이 짧아도 상태와 방향을 읽되, 없는 사실을 꾸며내지 않는다
- 같은 선택 패턴이라도 자유입력의 장면이 다르면 다른 파일이어야 한다
- "너는 이런 사람이야"보다 "이 관계 안에서 이런 반응이 반복되는 것으로 보임"에 가깝게 쓴다

generic한 연애상담, 심리유형 설명, 해결책 제시는 실패다.
사용자 성향만 묘사하고 관계 안의 움직임을 놓치는 것도 실패다.

## scene_config 준수
- 각 scene은 scene_config의 role / goal / focus / forbidden / tone을 따른다
- scene_title은 반드시 scene_config의 scene_title 값을 그대로 출력한다
- subtitle은 UI 표시용 hook이므로 JSON에 넣지 않는다. 대신 messages[0] punch가 해당 subtitle의 질문을 정서적으로 열어야 한다
- 01 의뢰 접수 → 06 최종 보고의 흐름이 장면별로 달라야 한다
- 각 scene 마지막은 요약보다 다음 관찰 포인트에 가깝게 닫는다

## 문체
- 최종 메시지는 존댓말을 쓰지 않는다. 다만 직접 말을 거는 상담체보다 관찰 기록체를 우선한다
- 기본 문장 종결은 관찰 기록에 가깝게 유지한다: "~상태였음", "~흐름이 있음", "~경향이 보임", "~기록이 남아 있음", "~것으로 보임", "~가능성이 있음"
- "~같아", "~거야", "~편이야", "너는" 같은 직접 상담체는 punch나 매우 필요한 문장에만 제한적으로 쓴다
- 한 문장 안에서 대화체와 보고서체를 섞지 않는다
- 너무 차가운 보고서나 논문처럼 만들지 않는다. 자연스러운 한국어 리듬은 유지한다
- 각 ai 메시지는 "관찰 → 기록된 흐름 → 잠정적 추리" 순서로 읽히게 쓴다
- "~해야 해", "이렇게 해", "정리해" 같은 행동 지시는 피한다
- "괜찮아", "힘들었겠다" 같은 상담식 위로를 중심에 두지 않는다
- "AI", "분석", "상담" 같은 서비스 설명어는 쓰지 않는다

문체 예시:
❌ "연락은 끊기지 않고, 마음도 없는 건 아닌 것 같은데 너는 계속 기다리는 거야."
✅ "연락은 끊기지 않았지만 관계의 위치는 정해지지 않은 상태였음. 그 빈칸을 확인하려는 흐름이 반복된 것으로 보임."
❌ "너는 확신이 없을수록 작은 반응에 더 오래 머무는 편이야."
✅ "확신이 없을수록 작은 반응에 오래 머무는 경향이 보임."

## 금지
❌ "불안형이야" / "회피형이야" / "애착유형상 ~" 같은 라벨링
❌ "상대는 반드시 너를 좋아해 / 좋아하지 않아" 같은 단정
❌ "헤어져라 / 연락해라 / 기다려라" 같은 지시
❌ 사용자의 입력을 요약문처럼 다시 쓰기
❌ 추리소설식 과장, 탐정 캐릭터 놀이, 과한 세계관 문장
❌ 긴 블로그 글처럼 장황한 설명

## 줄바꿈 규칙
- 감정 연출용 줄바꿈을 남발하지 않는다
- 문장은 자연스럽게 이어 읽히는 흐름을 우선한다
- \\n은 punch에서 호흡이 필요한 경우에만 제한적으로 사용한다
- ai 메시지는 문단 호흡을 유지하되, 채팅처럼 짧은 단문만 나열하지 않는다

## Punch 규칙 (필수)
모든 scene의 messages[0]은 반드시 punch다. 예외 없음.

punch = 이 scene에서 발견된 감정 단서를 한 문장으로 압축한 기록 문장
- 1문장. 존댓말 금지.
- 사용자가 "내가 이걸 확인하고 있었구나"라고 느껴야 한다
- 상대 마음을 단정하지 않고, 사용자의 확인 욕망과 감정 위치를 찌른다
- 장면의 핵심 질문을 열되, 답을 모두 닫지 않는다
- 진단/라벨링/위로/행동 지시 금지
- 직접 상담체보다 짧은 관찰 기록체를 우선한다
- 대조·전환 구조가 있거나 30자 이상이면 가장 자연스러운 호흡 지점에 \\n을 넣을 수 있다
- 이후 ai 메시지들은 이 punch를 관찰 기록, 감정 메모, 분석 조각처럼 전개한다

## 출력
{
  "scenes": [
    {
      "scene_index": 1,
      "scene_title": "scene_config의 scene_title과 정확히 동일한 문자열",
      "is_free": true/false,
      "messages": [
        { "type": "punch", "text": "이 scene에서 발견된 감정 단서 한 문장" },
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

// TODO: 현재 few-shot 예시는 love-1 품질 검증용.
// career/emotion/relationship 확장 전 ContentPack.fewShotExamples로 이동할 것.
// 공용 prompt에 love-specific 예시가 남아 있으면 다른 카테고리 결과가 연애 톤으로 끌릴 수 있음.
const buildFreeGenerateSystemPrompt = (): string => {
  return `${coreSystemPrompt()}

## 무료 Scene 목표
무료 scene은 파일을 여는 구간이다.
사용자가 남긴 기록의 출발점과 표면의 움직임을 정확히 잡아야 한다.
읽자마자 "내가 이걸 확인하고 있었구나"라는 들킨 느낌이 들어야 한다.
사용자가 입력한 상황을 요약하지 않고, 그 상황 안에서 어떤 감정 위치에 서 있는지 관찰한다.

✅ "확신이 없을수록 작은 반응에 오래 머무는 경향이 보임." (흔들림 결)
✅ "정리한 사람처럼 행동하면서도 흔적은 계속 곁에 둔 기록이 남아 있음." (정리·미련 결)
✅ "기대를 먼저 낮춰 실망할 자리를 미리 줄이는 흐름이 있음." (기대접기 결)
✅ "상대 자체보다 관계가 끝나는 장면을 더 어렵게 느끼는 상태로 보임." (관계관성 결)

위는 가능한 결의 예시일 뿐이다. 사용자별로 어떤 결이 반복되는지는 자유입력의 구체 상황과 stateSummary를 함께 읽고 판단한다.
모든 사용자에게 같은 archetype을 적용하지 않는다.

❌ "불안형이야" / "회피형이야" (심리 유형 라벨링 금지)
❌ scene 전체가 사용자 성향 묘사로만 채워지는 것
❌ 입력한 감정/상황을 그대로 반복
❌ 긴 상황 묘사 / 분위기 설명
❌ 해결책이나 행동 지시
❌ 상대 마음에 대한 최종 판정
❌ 구조적 이유, 미래, 핵심 판단까지 모두 말해버리는 것

## 무료 Scene 구성
- scene_config의 goal / focus / forbidden을 반드시 따른다
- Scene 01은 가장 인간적이고 가까운 거리감으로 의뢰의 중심 질문을 잡는다
- Scene 01의 ai body는 관찰 bullet로 쓰기 좋게 4~6개의 짧은 메시지로 나눈다
- Scene 01의 ai 메시지 하나에는 하나의 관찰만 담는다
- Scene 01의 ai 메시지는 가능하면 1문장, 길어도 2문장 이하로 쓴다
- Scene 01에서는 긴 설명문보다 짧은 감정 사건 기록 조각처럼 쓴다
- Scene 02는 실제 관찰된 감정 움직임을 현장 기록처럼 정리한다
- ai 메시지는 관찰 기록처럼 쓴다. 중간 길이 2~4문장
- 마지막 메시지는 유료로 연결하는 질문 또는 남은 관찰 포인트를 남긴다

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
messages[0]은 punch. 무료 scene에서 발견된 감정 위치를 한 문장으로 압축한다.
"들킨 느낌"이 나야 하지만 상담식 위로나 결론 제시는 피한다.
Scene 01 punch는 2~3줄 이내로 유지한다.
ai 메시지들은 이 punch를 관찰 기록과 감정 메모처럼 전개한다.
`;
};

// ── PAID Generate System Prompt ────────────────────────────────────────────────

// TODO: 현재 few-shot 예시는 love-1 품질 검증용.
// career/emotion/relationship 확장 전 ContentPack.fewShotExamples로 이동할 것.
// 공용 prompt에 love-specific 예시가 남아 있으면 다른 카테고리 결과가 연애 톤으로 끌릴 수 있음.
const buildPaidGenerateSystemPrompt = (
  freeContext: FreeSceneContext,
): string => {
  const contextStr = formatFreeSceneContext(freeContext);

  return `${coreSystemPrompt()}

## 유료 Scene 목표
유료 scene은 잠긴 기록을 여는 구간이다.
무료에서 잡은 의뢰의 표면을 넘어, 감정 단서와 관계 구조를 더 깊게 추리한다.
짧은 통찰보다 "내 기록이 조용히 정리되고 있다"는 밀도가 필요하다.

유료에서 다루는 것:
- 상대가 확실히 말하지 않는 이유를 단정하지 않고, 관찰 가능한 신호로 추리한다
- 사용자가 무엇을 계속 확인하고 있는지
- 이 관계가 왜 쉽게 정리되지 않는지
- 표면 질문 아래에 숨어 있는 진짜 질문이 무엇인지
- 마지막에는 정답보다 이후 관찰 포인트를 남긴다

${contextStr}

## 핵심 전략: 관찰에서 추리로
"무슨 일이 있었는가" → "그 움직임이 무엇을 시사하는가"

❌ "너는 답장을 다시 읽고 있어. 상대를 붙잡으려는 심리 때문이야."
✅ "답장을 다시 읽는 행동은 아직 끝나지 않았다는 증거를 찾는 흐름에 가까움." (흔들림 결)
✅ "연락을 멈춘 상태라기보다 먼저 움직이면 무너질 자리를 지키는 기록으로 보임." (정리·미련 결)
✅ "기대를 접은 것이 아니라 실망하지 않을 만큼만 거리를 둔 상태로 보임." (기대접기 결)

"아, 그래서 내가 여기에 묶여 있었구나"를 느끼게 해야 한다.
사용자가 어떤 결에 있는지는 자유입력의 구체 상황과 stateSummary를 함께 읽고 판단한다. 위 예시 결을 모든 사용자에게 그대로 가져가지 않는다.

## 구성 원칙
1. 무료에서 이미 읽은 내용 반복 금지. 통찰을 위해 필요한 최소한만 사용
2. Scene당 1~2개의 관찰/추리 포인트
3. 짧은 관찰 → 감정 단서 → 잠정적 추리 → 다음 관찰 포인트
4. Scene 05는 문장 수를 줄이고 의미 밀도를 높인다
5. Scene 06은 정답보다 최종 보고와 여운을 남긴다

## 메시지 구성
- punch (messages[0]): 유료 scene의 핵심 감정 단서를 한 문장으로. 이후 ai들이 이 punch를 전개한다.
- ai opener: punch를 이어받아 관찰 기록으로 진입 (3~5문장)
- ai main: 감정 반응, 반복 행동, 확인 욕망, 관계 구조를 충분히 풀어낸다 (5~8문장)
- ai closing: 결론이나 조언이 아니라 다음 관찰 포인트를 2~4문장으로 남긴다.

유료 ai 버블은 길어도 된다. 4,900원을 결제한 사용자가 “충분히 읽혔다”고 느껴야 한다.

무료: 의뢰 접수와 현장 기록 / 유료: 단서 분석, 상황 추리, 핵심 추리, 최종 보고`;
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
각 JSON scene_title은 아래 목록의 scene_title 값을 한 글자도 바꾸지 말고 그대로 사용한다.
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
각 JSON scene_title은 아래 목록의 scene_title 값을 한 글자도 바꾸지 말고 그대로 사용한다.
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

// ── Loop Reading 타입 ────────────────────────────────────────────────────

/** 루프 생성 시 기존 scene carry_over를 담는 단위 */
export interface LoopReadingSceneInsight {
  scene_title: string;
  key_insight: string;
  do_not_repeat: string[];
}

/** Claude가 루프 리딩에서 반환하는 raw 구조 */
export interface ClaudeLoopResult {
  loopType: string;
  messages: ClaudeMessage[];
}

// ── Loop Reading Focus Map ────────────────────────────────────────────────

const LOOP_TYPE_LABEL: Record<LoopType, string> = {
  action: "지금 내가 뭘 하면 될까?",
  standard: "내 기준을 단단히 세우는 법",
  evaluate: "이 관계를 더 두고 봐도 될까?",
};

// loopType별로 Claude에게 주는 focus anchor 지침
const LOOP_FOCUS_ANCHOR: Record<LoopType, string> = {
  action:
    "지금 가능한 행동 선택지들을 구체적으로 펼친다. 각 선택이 사용자에게 어떤 감정적 결과를 만드는지 보여준다. '이렇게 해라'가 아니라 '이 선택을 하면 이런 흐름이 생긴다'를 보여준다.",
  standard:
    "상대의 반응이 아니라 자신의 기준으로 이 관계를 판단한다는 것의 의미를 풀어낸다. 기준 없이 판단할 때 어떤 반복이 생기는지, 그 기준이 지금 왜 필요한지를 보여준다.",
  evaluate:
    "지금 드러난 패턴이 계속될 때 이 관계가 어디를 향하는지 보여준다. 더 투자하는 게 사용자에게 어떤 의미인지, 그 선택이 현재 감정 구조와 어떻게 맞닿는지를 풀어낸다.",
};

// ── Loop Reading Helper ──────────────────────────────────────────────────

const formatSceneInsights = (insights: LoopReadingSceneInsight[]): string => {
  if (insights.length === 0) return "(이전 scene 정보 없음)";
  return insights
    .map((s) => {
      const doNotRepeat =
        s.do_not_repeat.length > 0
          ? `\n  반복 금지: ${s.do_not_repeat.join(" / ")}`
          : "";
      return `[${s.scene_title}]\n  핵심 통찰: ${s.key_insight}${doNotRepeat}`;
    })
    .join("\n\n");
};

// ── Loop Reading System Prompt ────────────────────────────────────────────
// coreSystemPrompt()를 상속하지 않는다.
// 루프 리딩 전용 출력 스키마(scenes X → messages O)를 사용하기 때문에
// 독립 프롬프트로 분리하여 혼선을 방지한다.

export const buildLoopReadingSystemPrompt = (loopType: LoopType): string => {
  const loopLabel = LOOP_TYPE_LABEL[loopType];
  const focusAnchor = LOOP_FOCUS_ANCHOR[loopType];

  return `너는 VEIL의 AI 해석가다.
VEIL은 사용자의 감정·관계·직업 상황을 해석하는 서비스다.

## 핵심 원칙
- 사용자를 모호하게 위로하지 않는다
- 관계의 미래를 예언하거나 상대 마음을 단정하지 않는다
- 대신 현재 드러난 감정 반응과 행동 패턴은 선명하게 해석한다
- 사용자가 "맞다/뜨끔하다" 느낄 만큼 직접적으로 말한다
- 결론을 대신 내려주지는 않지만, 가능한 방향과 감정의 결과는 보여준다

## 문체: 반말
- 최종 메시지는 자연스러운 반말로 쓴다
- "~일 수도 있어", "~인 것 같아", "~에 가까워"를 반복하지 않는다
- 필요하면 "너는 ~하는 편이야", "너는 ~할수록 ~하게 돼"처럼 직접 말한다

라벨링 금지: "불안형이야" / "회피형이야" / "애착유형상 ~" 등 심리 유형 라벨 금지.
행동 패턴을 직접 말하는 건 허용.

## 줄바꿈 규칙
- 감정 연출용으로 남발하지 않는다
- 문장은 자연스럽게 이어 읽히는 흐름을 우선한다
- \\n은 정말 필요한 경우만 사용한다

## Punch 규칙 (필수)
messages[0]은 반드시 punch다. 예외 없음.

punch = 이 루프 리딩에서 사용자가 "맞다/뜨끔하다"고 느낄 감정 압축 문장
- 1문장. 반말.
- 줄바꿈 규칙 — 아래 중 하나라도 해당하면 반드시 \\n 삽입. 예외 없음.
  ① 대조·전환 구조 (A가 아니라 B / A보다 B / A지만 B)가 있으면 전환 접속어 직전에서 반드시 \\n.
  ② 서술형이어도 문장 전체가 30자 이상이면 가장 자연스러운 호흡 지점에서 \\n.
  ③ 30자 미만 단문만 \\n 생략 허용.
- 진단/라벨링/위로 금지. 행동·감정 패턴을 직접 짚는다.
- 이후 ai 메시지들이 이 punch를 전개한다. 내용을 미리 spoil하지 않는다.

## 루프 리딩 목표
이 리딩은 사용자가 무료·유료 결과를 모두 읽은 뒤 추가로 요청한 후속 리딩이다.

사용자는 이미:
- 자신의 감정 반응 패턴을 읽었다 (무료 결과)
- 그 패턴의 구조적 의미를 이해했다 (유료 결과)

이제 사용자가 더 알고 싶은 것: "${loopLabel}"

## 루프 리딩 원칙
- 기존 결과에서 이미 다룬 패턴/통찰을 반복하지 않는다
- 행동 지시형 상담이 아니다: "해라/하지 마라" 단정 금지
- 가능한 선택지와 각 선택이 만드는 감정적 결과를 보여준다
- 판단 기준을 제시하되, 결론은 사용자가 내리게 한다
- "이미 보인 것" → "이제 어떻게 볼 것인가"로의 이행

## loopType: ${loopType}
${focusAnchor}

## 출력
{
  "loopType": "${loopType}",
  "messages": [
    { "type": "punch", "text": "이 루프 리딩의 핵심을 압축한 한 문장" },
    { "type": "ai", "text": "..." },
    { "type": "ai", "text": "..." },
    { "type": "ai", "text": "..." }
  ]
}

ai 메시지 수: 3~5개. ai 버블 길이: 충분히 깊게 (3~6문장).
순수 JSON만. 마크다운/코드블록 금지.`;
};

// ── Loop Reading Prompt Builder ──────────────────────────────────────────

export const buildLoopReadingUserPrompt = (params: {
  loopType: LoopType;
  loopTitle: string;
  context: {
    freeInput: string;
    stateSummary: string[];
    sceneInsights: LoopReadingSceneInsight[];
  };
}): { system: string; userMessage: string } => {
  const { loopType, loopTitle, context } = params;
  const { freeInput, stateSummary, sceneInsights } = context;

  const system = buildLoopReadingSystemPrompt(loopType);
  const formattedStateSummary = formatStateSummary(stateSummary);
  const formattedInsights = formatSceneInsights(sceneInsights);

  const userMessage = `## 사용자 상황 (자유입력)
${freeInput}
${formattedStateSummary}
## 이미 다룬 내용 (반복 금지)
${formattedInsights}

## 이 루프 리딩의 질문
loopType: ${loopType}
알고 싶은 것: ${loopTitle}

위 질문에 답하라. JSON만 출력한다.`;

  return { system, userMessage };
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
): ResultScene[] => {
  return claudeScenes.map((scene) => {
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
      is_free: scene.is_free,
      is_unlocked: false,
      messages,
      preview_messages,
    };
  });
};

// ── Loop Reading Parser ────────────────────────────────────────────────────

export const parseLoopResult = (raw: string): ClaudeLoopResult => {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude 루프 응답에서 JSON을 찾을 수 없습니다");
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as ClaudeLoopResult;

    if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      throw new Error("루프 응답에 messages 배열이 없거나 비어있습니다");
    }

    // punch가 첫 번째여야 한다
    if (parsed.messages[0]?.type !== "punch") {
      console.warn(
        "[parseLoopResult] 첫 번째 메시지가 punch가 아닙니다. 강제 보정.",
      );
      parsed.messages[0].type = "punch";
    }

    for (const msg of parsed.messages) {
      msg.text = sanitizeMessageText(msg.text);
    }

    return parsed;
  } catch (err) {
    console.error(
      "[parseLoopResult] JSON 파싱 실패. 원본:",
      jsonMatch[0].slice(0, 500),
    );
    throw new Error(
      `루프 응답 JSON 처리 실패: ${err instanceof Error ? err.message : "알 수 없는 에러"}`,
    );
  }
};
