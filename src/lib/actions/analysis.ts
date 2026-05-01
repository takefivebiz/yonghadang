"use server";

import { createClient } from "@/lib/supabase/server";
import { Anthropic } from "@anthropic-ai/sdk";
import {
  AnalysisCategory,
  AnalysisSubcategory,
  QuestionAnswer,
  TraitScores,
} from "@/types/analysis";

/**
 * 마크다운 기호 제거 함수
 */
const cleanText = (text: string): string => {
  if (!text) return text;

  return text
    .replace(/\*\*/g, "") // ** 제거
    .replace(/---/g, "") // --- 제거
    .replace(/^> /gm, "") // > 제거 (각 라인)
    .replace(/```[\s\S]*?```/g, "") // ``` 코드블록 제거
    .replace(/`/g, "") // 백틱 제거
    .replace(/[#*]/g, "") // # * 제거
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // 이모지 제거
    .trim();
};

/**
 * 카테고리 매핑: 프론트엔드 (한글) → Supabase (영문)
 */
const mapCategoryToDb = (category: AnalysisCategory): string => {
  const mapping: Record<AnalysisCategory, string> = {
    연애: "love",
    감정: "emotion",
    인간관계: "relationship",
    "직업/진로": "career",
  };
  return mapping[category];
};

/**
 * 성향 점수 초기값 생성
 */
const getDefaultTraitScores = (): TraitScores => ({
  인지형: 50,
  감정형: 50,
  불안형: 50,
  안정형: 50,
  회피형: 50,
  직면형: 50,
  자기이해형: 50,
  해결형: 50,
  타인중심형: 50,
  자기중심형: 50,
});

/**
 * PRD 5.6: 분석 완료 및 세션 저장
 * - weights 합산 → currentAxis 결정
 * - Supabase에 저장
 */
export const submitAnalysis = async (params: {
  category: AnalysisCategory;
  subcategory?: AnalysisSubcategory;
  answers: QuestionAnswer[];
  questions: Array<{
    id: string;
    options: Array<{ id: string; weights?: Record<string, number> }>;
  }>;
  userId?: string;
  userContext?: string;
}): Promise<{ sessionId: string; currentAxis: 1 | 2 | 3 }> => {
  const supabase = await createClient();

  try {
    // weights 합산
    const traitScores: Record<string, number> = {};

    console.log("[submitAnalysis] 🔍 Debug:", {
      answersCount: params.answers.length,
      questionsCount: params.questions.length,
      firstAnswer: params.answers[0],
      firstQuestion: params.questions[0],
    });

    params.answers.forEach((a) => {
      const q = params.questions.find((q) => q.id === a.questionId);
      console.log(
        `[submitAnalysis] Q:${a.questionId} found:${!!q}, optCount:${q?.options?.length || 0}, selectedIds:${a.selectedOptionIds}`,
      );

      a.selectedOptionIds.forEach((oid) => {
        const opt = q?.options.find((o) => o.id === oid);
        console.log(
          `[submitAnalysis] Opt:${oid} found:${!!opt}, weights:${JSON.stringify(opt?.weights)}`,
        );

        if (opt?.weights) {
          Object.entries(opt.weights).forEach(([t, w]) => {
            traitScores[t] = (traitScores[t] || 0) + w;
          });
        }
      });
    });

    console.log("[submitAnalysis] Final traitScores:", traitScores);

    // 가장 높은 trait → axis 매핑
    const topTrait =
      Object.entries(traitScores).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "감정형";
    const currentAxis = (
      ["감정형", "불안형", "회피형"].includes(topTrait)
        ? 1
        : ["인지형", "자기이해형", "해결형"].includes(topTrait)
          ? 2
          : 3
    ) as 1 | 2 | 3;

    const { data: session, error } = await supabase
      .from("analysis_sessions")
      .insert({
        user_id: params.userId || null,
        category: mapCategoryToDb(params.category),
        subcategory: params.subcategory || null,
        answers: JSON.stringify(params.answers),
        user_type_scores: JSON.stringify(traitScores),
        current_axis: currentAxis,
        loop_depth: 1,
        free_report_status: "pending",
        user_context: params.userContext || null,
      })
      .select()
      .single();

    if (error || !session) throw error || new Error("세션 생성 실패");
    console.log("[submitAnalysis] ✅", {
      sessionId: session.id,
      currentAxis,
      topTrait,
    });
    return { sessionId: session.id, currentAxis };
  } catch (error) {
    console.error("[submitAnalysis] ❌ 예상치 못한 에러:", error);
    throw error;
  }
};

// TODO: userContext 기반 보정 질문 생성 (향후 구현)
// 현재는 단순 템플릿 기반 paidQuestions만 사용
// 추후 Claude API로 동적 생성 예정

/** 유료 리포트 생성 (각 질문별 상세 분석) */
const generatePaidReport = async (
  paidQuestion: string,
  freeReportText: string,
  userContext: string | null,
  axis: "self" | "other" | "future",
  anthropic: Anthropic,
): Promise<{
  headline: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
  finalQuestion: string;
}> => {
  const prompt = `이 질문에 대한 상세한 분석 리포트를 작성하세요.

# 질문
${paidQuestion}

# 무료 리포트 (컨텍스트)
${freeReportText}

${userContext ? `# 사용자 상황\n${userContext}` : ""}

# 리포트 구조

1. headline
   - 질문에 대한 핵심 답 한 줄로 생성

2. sections (4개)
   - 각 섹션 제목: 해당 섹션 내용을 요약한 문장으로 생성 (예: "에너지가 고갈되면서 판단이 한쪽으로 기울고 있어")
   - 각 섹션: 정확히 2문장
   - 무료 리포트와의 연결고리, 상황 구조, 관점 뒤집기, 실제 변화 포함

3. finalQuestion
   - 1문장
   - 반드시 "~일까?" 형태

# 작성 규칙
- 반말만 사용
- 마크다운 기호 절대 금지 (---, **, ##, >, 별표, 이모지)
- 총 길이: 10-15초 분량

# 출력 (JSON only)
{
  "headline": "질문에 대한 핵심 답",
  "sections": [
    { "title": "각 섹션 내용을 요약한 문장", "paragraphs": ["..."] },
    { "title": "각 섹션 내용을 요약한 문장", "paragraphs": ["..."] },
    { "title": "각 섹션 내용을 요약한 문장", "paragraphs": ["..."] },
    { "title": "각 섹션 내용을 요약한 문장", "paragraphs": ["..."] }
  ],
  "finalQuestion": "~일까?"
}`;

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let content = "";
  for (const block of message.content) {
    if (block.type === "text") {
      content += block.text;
    }
  }

  // JSON 파싱 (코드블록 제거 후 순수 JSON만 추출)
  let jsonStr = content;

  // 1. 코드블록 제거 (``` 모두 제거)
  jsonStr = jsonStr.replace(/```json/g, "");
  jsonStr = jsonStr.replace(/```/g, "");

  // 2. trim
  jsonStr = jsonStr.trim();

  // 3. JSON 시작~끝만 추출
  const start = jsonStr.indexOf("{");
  const end = jsonStr.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    jsonStr = jsonStr.slice(start, end + 1);
  }

  // 4. parse
  try {
    const parsed = JSON.parse(jsonStr) as {
      headline: string;
      sections: Array<{
        title: string;
        paragraphs: string[];
      }>;
      finalQuestion: string;
    };
    return parsed;
  } catch (e) {
    console.log("[generatePaidReport] Failed to parse JSON:", content);
    throw e;
  }
};

/** 리포트 기반 유료 질문 생성 */
export const generatePaidQuestionsFromReport = async (
  freeReportText: string,
  userContext: string | null,
  currentAxis: 1 | 2 | 3,
  anthropic: Anthropic,
): Promise<
  Array<{
    id: string;
    question: string;
    description: string;
    price: number;
    displayOrder: number;
    axis: "self" | "other" | "future";
  }>
> => {
  const prompt = `리포트를 읽고, 리포트에서 미해결된 포인트를 찾아 3개의 유료 추가 질문을 생성하세요.

# 리포트 내용
${freeReportText}

${userContext ? `# 사용자 상황\n${userContext}` : ""}

# 미해결 포인트 추출 규칙
1. 리포트의 갈등/구조/불편함을 읽고, 해결되지 않은 부분 찾기
2. 그 부분을 깊게 탐색하는 질문으로 변환
3. 리포트 → 다음 질문으로 자연스럽게 이어지도록

# 질문 생성 규칙
1. 총 3개 질문 생성 (각각 self, other, future 축) - 반드시 3개!
2. 반드시 "나는 지금" 또는 "이 상태에서" 로 시작
3. 질문은 최대 15단어 (한 문장, 짧고 직관적)
4. 하나의 감정/상태만 물을 것 (두 개 개념 섞지 말 것)
5. 불필요한 수식어 제거
6. "~일까?" 형태로 끝내기 (필수)
7. description: 구분 기준을 1~2단어로 명시 (예: "사람 vs 방식", "확신 vs 두려움")

예시:
❌ 나는 이 사람이 귀찮아진 건지, 아니면 방식이 귀찮은 건지...
✅ 나는 지금 이 관계가 불편한 걸까?
   description: "사람 vs 방식"

# 축 분배
- axis "self": 자신의 감정, 욕망, 이유를 더 깊게 탐색
- axis "other": 상대방의 입장을 고려했을 때의 나의 선택
- axis "future": 지금 상태가 계속될 때의 실제 흐름

# 마크다운 금지 규칙
- --- 사용 금지
- ** 사용 금지
- > 사용 금지
- *, # 등 마크다운 기호 사용 금지
- 이모지 사용 금지
- 위 기호가 하나라도 포함되면 실패로 간주하고 다시 작성할 것

# 출력 (JSON only)
{
  "questions": [
    {
      "axis": "self",
      "question": "나는 지금 ~일까?",
      "description": "구분 기준 (1~2단어)"
    },
    {
      "axis": "other",
      "question": "나는 지금 ~일까?",
      "description": "구분 기준 (1~2단어)"
    },
    {
      "axis": "future",
      "question": "나는 지금 ~일까?",
      "description": "구분 기준 (1~2단어)"
    }
  ]
}`;

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let content = "";
  for (const block of message.content) {
    if (block.type === "text") {
      content += block.text;
    }
  }

  // JSON 파싱 (코드블록 제거 후 순수 JSON만 추출)
  let jsonStr = content;

  // 1. 코드블록 제거 (``` 모두 제거)
  jsonStr = jsonStr.replace(/```json/g, "");
  jsonStr = jsonStr.replace(/```/g, "");

  // 2. trim
  jsonStr = jsonStr.trim();

  // 3. JSON 시작~끝만 추출
  const start = jsonStr.indexOf("{");
  const end = jsonStr.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    jsonStr = jsonStr.slice(start, end + 1);
  }

  // 4. parse
  try {
    const parsed = JSON.parse(jsonStr) as {
      questions: Array<{
        axis: "self" | "other" | "future";
        question: string;
        description?: string;
      }>;
    };

    // 질문 3개 보장: 부족하면 fallback 추가
    const ensureThreeQuestions = () => {
      const axes: ("self" | "other" | "future")[] = [
        "self",
        "other",
        "future",
      ];
      const existingAxes = new Set(parsed.questions.map((q) => q.axis));
      const missingAxes = axes.filter((ax) => !existingAxes.has(ax));

      if (missingAxes.length > 0) {
        const fallbackQuestions: Record<
          "self" | "other" | "future",
          { question: string; description: string }
        > = {
          self: {
            question: "나는 지금 정말 원하는 게 뭘까?",
            description: "욕망의 방향",
          },
          other: {
            question: "내 모습이 상대에겐 어떻게 보일까?",
            description: "상대 vs 나의 관점",
          },
          future: {
            question: "이대로 가면 결국 멀어질까?",
            description: "현재 vs 미래",
          },
        };

        for (const axis of missingAxes) {
          if (parsed.questions.length < 3) {
            parsed.questions.push({
              axis,
              question: fallbackQuestions[axis].question,
              description: fallbackQuestions[axis].description,
            });
          }
        }
      }

      // 정확히 3개만 유지
      return parsed.questions.slice(0, 3);
    };

    const finalQuestions = ensureThreeQuestions();

    return finalQuestions.map((q, i) => ({
      id: `paid_q_${currentAxis}_${i}`,
      question: q.question,
      description: q.description || "",
      axis: q.axis,
      price: 900,
      displayOrder: i + 1,
    }));
  } catch (parseError) {
    console.log(
      "[generatePaidQuestionsFromReport] JSON parse failed:",
      content,
    );

    // fallback: 기본 3개 질문
    return [
      {
        id: `paid_q_${currentAxis}_0`,
        question: "나는 지금 정말 원하는 게 뭘까?",
        description: "욕망의 방향",
        axis: "self" as const,
        price: 900,
        displayOrder: 1,
      },
      {
        id: `paid_q_${currentAxis}_1`,
        question: "내 모습이 상대에겐 어떻게 보일까?",
        description: "상대 vs 나의 관점",
        axis: "other" as const,
        price: 900,
        displayOrder: 2,
      },
      {
        id: `paid_q_${currentAxis}_2`,
        question: "이대로 가면 결국 멀어질까?",
        description: "현재 vs 미래",
        axis: "future" as const,
        price: 900,
        displayOrder: 3,
      },
    ];
  }
};

/**
 * 무료 리포트 생성 및 저장 (+ paidQuestions 함께 저장)
 * - Server Action에서 직접 Claude API 호출
 * - report_data JSON에 paidQuestions도 포함하여 저장
 */
export const generateAndSaveFreeReport = async (
  sessionId: string,
): Promise<void> => {
  const supabase = await createClient();

  try {
    console.log(
      "[generateAndSaveFreeReport] Starting for sessionId:",
      sessionId,
    );

    // 1. 상태를 'generating'으로 업데이트
    await supabase
      .from("analysis_sessions")
      .update({ free_report_status: "generating" })
      .eq("id", sessionId);

    // 2. 세션 데이터 조회
    const { data: session, error: sessionError } = await supabase
      .from("analysis_sessions")
      .select(
        "id, category, user_context, user_type_scores, current_axis, free_report_status, created_at",
      )
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error("세션을 찾을 수 없습니다");
    }

    // 3. 카테고리 변환
    const categoryLabels: Record<string, string> = {
      love: "연애",
      emotion: "감정",
      relationship: "인간관계",
      career: "직업/진로",
    };
    const categoryLabel = categoryLabels[session.category] || session.category;

    // 4. Anthropic API 초기화
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    const anthropic = new Anthropic({ apiKey });
    console.log("[generateAndSaveFreeReport] Anthropic initialized");

    // 5. Claude API로 무료 리포트 생성
    const hasUserContext = !!session.user_context?.trim();
    const prompt = `당신은 사람의 심리 패턴과 선택 구조를 읽는 심리 분석가입니다.
사용자의 이야기를 듣고, 그 상황을 깊이 있게 이해해주는 사람처럼 말하세요.

# 사용자 정보
- 분석 카테고리: ${categoryLabel}
- 사용자 상황: ${session.user_context || "(상황 설명 없음)"}

# 핵심 원칙
1. 성향 점수나 심리 유형명("감정형", "인지형" 등)은 절대 노출 금지
2. 위로나 조언이 아니라 "상황을 정확히 이해받는 느낌"을 최우선으로
3. 관계의 구조, 갈등의 본질, 흐름을 읽는 것이 목표

${
  hasUserContext
    ? `
# 상황 입력 기반 분석 규칙
- 사용자 입력(user_context)을 최우선으로 반영하되, 그대로 복붙하지 말 것
- 선택 데이터는 참고 정보일 뿐, user_context가 주도하는 분석
`
    : `
# 선택만으로 하는 일반적 분석 규칙
- 선택 데이터로 상황을 추정하되, 확신하는 표현은 피할 것
- "~일 수도 있어", "~처럼 보여", "~인 것 같아" 등 유보적 표현 사용
- 분석의 깊이를 의도적으로 낮추고, 일반적인 수준에서 접근
- "정확한 분석은 상황 설명이 있을 때 가능하다"는 뉘앙스 포함 가능
`
}

# 리포트 구조 (총 5개 섹션)

1. headline
   - 지금 상황을 한 구로 표현 (예: "양쪽 다 포기할 수 없는 상태", "미루는 것도 선택이 되어버렸네")
   - 짧고, 사용자의 상황을 정확히 이름 붙이기

2. sections (4개)
   섹션 제목은 [대괄호] 기호로 표시

   - [현재 상황] - 사용자가 입력한 상황을 자신의 말로 요약 (2-3문장)

   - [핵심 갈등] - 이 상황에서 충돌하는 것이 무엇인지 명확히 (2-3문장)

   - [놓친 관점] - 사용자의 기존 생각을 뒤집는 한 문장을 반드시 포함 (2-3문장)
     선택적 소제목: [숨겨진 심리 메커니즘] → 한 발을 못 내딛는 진짜 이유
     규칙:
     * 반드시 약간 불편하지만 납득되는 문장 1개 포함
     * "아…?" 하는 느낌이 들게 만들 것
     * 이것이 리포트에서 가장 중요한 포인트

   - [이 흐름의 끝] - 지금 상태가 계속되면 어떻게 될 것인가 (2-3문장)

3. deficitSentence
   - 마지막 한 문장 질문으로 사용자의 다음 발걸음을 촉구
   - "~일까?"로 끝내기 (완결형 금지)

# 작성 규칙
- 반말만 사용
- 마크다운 기호 절대 금지 (---, **, ##, >, 별표, 이모지 포함)
- 일반 문장 형태로만 작성
- 줄바꿈만 사용해서 구조 표현
- 한 문단 최대 2-3문장
- 설명 톤이 아니라 대화 톤: "~이다" → "~야", "~하기 때문에" → "~이기도 해"
- 출력 결과에 마크다운 기호가 포함되면 실패로 간주하고 다시 작성할 것

응답은 JSON만 반환:
{
  "headline": "상황을 정확히 이름 붙인 한 구",
  "sections": [
    { "title": "현재 상황", "paragraphs": ["..."] },
    { "title": "핵심 갈등", "paragraphs": ["..."] },
    { "title": "놓친 관점", "paragraphs": ["..."] },
    { "title": "이 흐름의 끝", "paragraphs": ["..."] }
  ],
  "deficitSentence": "마지막 질문으로 끝나는 한 문장"
}`;

    console.log("[generateAndSaveFreeReport] Creating message stream...");
    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // 6. 응답 수집
    let fullContent = "";
    for (const block of message.content) {
      if (block.type === "text") {
        fullContent += block.text;
      }
    }

    console.log(
      "[generateAndSaveFreeReport] Generated report length:",
      fullContent.length,
    );

    // 7. paidQuestions 생성 (리포트 기반)
    const currentAxis = (session.current_axis || 1) as 1 | 2 | 3;
    const paidQuestions = await generatePaidQuestionsFromReport(
      fullContent,
      session.user_context,
      currentAxis,
      anthropic,
    );
    console.log(
      "[generateAndSaveFreeReport] Generated paidQuestions:",
      paidQuestions.length,
    );

    // 8. report_data (JSON)에 모든 정보 저장
    const reportData = {
      freeReport: fullContent,
      paidQuestions,
      currentAxis,
      generatedAt: new Date().toISOString(),
    };

    // 9. Supabase에 저장 (free_report + report_data)
    await supabase
      .from("analysis_sessions")
      .update({
        free_report: fullContent,
        free_report_status: "completed",
        report_data: JSON.stringify(reportData),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    console.log(
      "[generateAndSaveFreeReport] Report saved successfully with paidQuestions",
    );
  } catch (error) {
    console.error("[generateAndSaveFreeReport] Error:", error);

    // 5. 실패 상태 저장
    try {
      await supabase
        .from("analysis_sessions")
        .update({
          free_report_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    } catch {
      // 무시
    }

    throw error;
  }
};
