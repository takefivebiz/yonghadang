"use server";

import { createClient } from "@/lib/supabase/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { AnalysisSession, Question } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
const cleanText = (text: string): string => {
  if (!text) return text;

  return text
    .replace(/\*\*/g, "")
    .replace(/---/g, "")
    .replace(/^> /gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`/g, "")
    .replace(/[#*]/g, "")
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .trim();
};
/**
 * 결제 완료 후 실행
 * 1. Supabase order 생성
 * 2. 각 질문별 유료 리포트 생성 (비동기)
 */
export const handlePaymentSuccess = async (params: {
  sessionId: string;
  questionIds: string[];
  isBundle: boolean;
  orderId: string; // Toss에서 받은 orderId
  phoneNumber?: string; // 비회원
  memberId?: string; // 회원
}) => {
  const { sessionId, questionIds, isBundle, orderId, memberId } = params;

  const supabase = await createClient();

  console.log("[PAYMENT SUCCESS] start", {
    sessionId,
    orderId,
    questionIds,
    isBundle,
  });
  console.log("[handlePaymentSuccess] ===== START =====");
  console.log("[PAYMENT SUCCESS] called", {
    sessionId,
    orderId,
    questionIds,
    isBundle,
  });
  console.log("[handlePaymentSuccess] Params:", {
    sessionId,
    questionIds,
    isBundle,
    memberId,
    orderId,
  });

  try {
    // 1. 세션 확인
    const { data: session } = await supabase
      .from("analysis_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (!session) {
      throw new Error("세션을 찾을 수 없습니다");
    }

    console.log("[handlePaymentSuccess] Session found:", {
      sessionId: session.id,
    });

    // 2. Order 생성 (Toss에서 받은 orderId 사용)
    const amount = calculateAmount(questionIds.length, isBundle);

    console.log("[handlePaymentSuccess] Creating order with payload:", {
      id: orderId,
      session_id: sessionId,
      user_id: memberId || null,
      amount,
      status: "completed",
      loop_depth: session.loop_depth,
      is_bundle: isBundle,
      payment_method: "card",
    });

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        session_id: sessionId,
        user_id: memberId || null,
        amount,
        status: "completed",
        loop_depth: session.loop_depth,
        is_bundle: isBundle,
        payment_method: "card", // TODO: Toss에서 실제 결제수단 받기
      })
      .select()
      .single();

    if (orderError) {
      console.error("[handlePaymentSuccess] ❌ Order insert error:", {
        code: orderError.code,
        message: orderError.message,
        details: orderError.details,
      });
      throw orderError;
    }

    if (!order) {
      throw new Error("Order creation returned no data");
    }

    console.log("[PAYMENT SUCCESS] order saved", { orderId });
    console.log("[handlePaymentSuccess] ✅ Order created:", {
      orderId: order.id,
    });

    // 3. report_data에서 선택된 paidQuestions 조회
    console.log("[handlePaymentSuccess] Processing selected questions:", {
      questionIds,
      count: questionIds.length,
    });

    let selectedQuestions: Array<{
      id: string;
      question: string;
      description: string;
      price: number;
      displayOrder: number;
      axis: 1 | 2 | 3;
    }> = [];

    if (session.report_data) {
      try {
        const reportData = JSON.parse(session.report_data) as {
          paidQuestions: Array<{
            id: string;
            question: string;
            description: string;
            price: number;
            displayOrder: number;
            axis: 1 | 2 | 3;
          }>;
        };
        selectedQuestions = reportData.paidQuestions || [];
        console.log(
          "[handlePaymentSuccess] Found paidQuestions in report_data:",
          selectedQuestions.length,
        );
      } catch (parseError) {
        console.warn(
          "[handlePaymentSuccess] Failed to parse report_data:",
          parseError,
        );
      }
    }

    // 4. order_dynamic_questions에 동적 생성 질문 저장
    // (정적 questions 테이블의 질문은 미리 order_questions에 저장되어야 함)
    console.log(
      "[handlePaymentSuccess] Inserting dynamic questions to order_dynamic_questions",
    );

    const dynamicQuestions = questionIds.map((qId, index) => {
      const question = selectedQuestions.find((q) => q.id === qId);
      return {
        order_id: orderId,
        question_payload: question
          ? question
          : { id: qId, error: "Question not found in report_data" },
        display_order: index + 1,
      };
    });

    console.log(
      "[handlePaymentSuccess] order_dynamic_questions payload:",
      dynamicQuestions,
    );

    const { error: odqError } = await supabase
      .from("order_dynamic_questions")
      .insert(dynamicQuestions);

    if (odqError) {
      console.error(
        "[handlePaymentSuccess] ❌ order_dynamic_questions insert error:",
        {
          code: odqError.code,
          message: odqError.message,
          details: odqError.details,
        },
      );
      throw odqError;
    }

    console.log("[handlePaymentSuccess] ✅ order_dynamic_questions created");

    // 5. 각 질문별 유료 리포트 생성 (비동기 시작)
    // 번들 구매: 모든 질문 생성 | 개별 구매: 선택한 질문만 생성
    const questionsToProcess = isBundle
      ? selectedQuestions
      : selectedQuestions.filter((q) => questionIds.includes(q.id));

    console.log("[handlePaymentSuccess] Processing reports:", {
      isBundle,
      selectedCount: questionsToProcess.length,
      totalCount: selectedQuestions.length,
    });

    console.log("[PAYMENT SUCCESS] generating paid reports", {
      sessionId,
      orderId,
      selectedQuestions: questionsToProcess.map((q) => ({
        id: q.id,
        question: q.question,
      })),
    });

    console.log("[PAYMENT SUCCESS] before generate dynamic reports");
    generatePaidReportsForDynamicQuestionsAsync(
      sessionId,
      orderId,
      questionsToProcess,
    );

    console.log("[handlePaymentSuccess] ===== SUCCESS =====\n");
    return { success: true, orderId, amount };
  } catch (error) {
    console.error("[handlePaymentSuccess] ❌ Error:", {
      message: error instanceof Error ? error.message : String(error),
      code: "code" in (error as object) ? (error as any).code : undefined,
    });
    console.log("[handlePaymentSuccess] ===== FAILED =====\n");
    throw error;
  }
};

/**
 * order_dynamic_questions 기반 유료 리포트 생성 (동적 질문용)
 * report_data에서 생성된 paidQuestions에 대해 AI 분석
 */
async function generatePaidReportsForDynamicQuestionsAsync(
  sessionId: string,
  orderId: string,
  selectedQuestions: Array<{
    id: string;
    question: string;
    description: string;
    price: number;
    displayOrder: number;
    axis: 1 | 2 | 3;
  }>,
) {
  const supabase = await createClient();

  console.log("[DYNAMIC REPORTS] start", { sessionId, orderId });

  try {
    console.log("[DYNAMIC PAID REPORTS] start", {
      sessionId,
      orderId,
      selectedQuestions,
    });
    console.log(
      "[generatePaidReportsForDynamicQuestionsAsync] Starting for orderId:",
      orderId,
    );
    console.log(
      "[DYNAMIC PAID REPORTS] selectedQuestions count",
      selectedQuestions.length,
    );
    console.log(
      "[generatePaidReportsForDynamicQuestionsAsync] selectedQuestions validation:",
      {
        count: selectedQuestions.length,
        questions: selectedQuestions.map((q) => ({
          id: q.id,
          question: q.question,
        })),
      },
    );

    const { data: session } = await supabase
      .from("analysis_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (!session) {
      console.warn(
        "[generatePaidReportsForDynamicQuestionsAsync] Session not found:",
        sessionId,
      );
      return;
    }

    console.log("[DYNAMIC REPORTS] selectedQuestions", selectedQuestions);

    // 각 동적 질문별로 paid_report 생성
    for (const dynamicQuestion of selectedQuestions) {
      console.log(
        "[DYNAMIC PAID REPORTS] processing question",
        dynamicQuestion,
      );
      console.log(
        "[generatePaidReportsForDynamicQuestionsAsync] Processing question:",
        {
          id: dynamicQuestion.id,
          question: dynamicQuestion.question,
        },
      );
      console.log("[PAID REPORT INSERT]", {
        sessionId,
        orderId,
        dynamicQuestionId: dynamicQuestion.id,
        dynamicQuestion,
      });

      console.log("[DYNAMIC REPORTS] insert paid_report", {
        dynamicQuestionId: dynamicQuestion.id,
      });

      // paid_report 생성 (status: generating)
      const { data: report, error: reportError } = await supabase
        .from("paid_reports")
        .insert({
          session_id: sessionId,
          question_id: null,
          dynamic_question_id: dynamicQuestion.id,
          order_id: orderId,
          status: "generating",
        })
        .select()
        .single();

      if (reportError || !report) {
        console.error(
          "[generatePaidReportsForDynamicQuestionsAsync] Failed to create paid_report:",
          reportError,
        );
        continue;
      }

      console.log(
        "[generatePaidReportsForDynamicQuestionsAsync] Created paid_report:",
        { reportId: report.id },
      );

      // 비동기로 리포트 생성 (fire-and-forget)
      generateSinglePaidReportForDynamicQuestion(
        sessionId,
        report.id,
        orderId,
        dynamicQuestion,
        session,
      ).catch((err) => {
        console.error(
          `[generatePaidReportsForDynamicQuestionsAsync] Failed to generate paid report ${report.id}:`,
          err,
        );
      });
    }
  } catch (error) {
    console.error(
      "[generatePaidReportsForDynamicQuestionsAsync] Error:",
      error,
    );
  }
}

/**
 * 백그라운드에서 유료 리포트 생성 (기존 정적 질문용)
 * (비동기이므로 응답을 기다리지 않음)
 */
async function generatePaidReportsAsync(
  sessionId: string,
  orderId: string,
  questionIds: string[],
) {
  const supabase = await createClient();

  try {
    const { data: session } = await supabase
      .from("analysis_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (!session) return;

    // 각 질문별로 paid_report 엔트리 생성
    for (const questionId of questionIds) {
      const { data: question } = await supabase
        .from("questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (!question) continue;

      // paid_report 생성 (status: generating)
      const { data: report } = await supabase
        .from("paid_reports")
        .insert({
          session_id: sessionId,
          question_id: questionId,
          order_id: orderId,
          status: "generating",
        })
        .select()
        .single();

      if (!report) continue;

      // 비동기로 리포트 생성 (fire-and-forget)
      generateSinglePaidReport(
        sessionId,
        report.id,
        orderId,
        questionId,
        question,
        session,
      ).catch((err) => {
        console.error(`Failed to generate paid report ${report.id}:`, err);
      });
    }
  } catch (error) {
    console.error("Failed to start paid report generation:", error);
  }
}

/**
 * 동적 질문의 유료 리포트 생성 (report_data에서 생성된 paidQuestions)
 */
async function generateSinglePaidReportForDynamicQuestion(
  sessionId: string,
  reportId: string,
  orderId: string,
  dynamicQuestion: {
    id: string;
    question: string;
    description: string;
    price: number;
    displayOrder: number;
    axis: 1 | 2 | 3;
  },
  session: AnalysisSession,
) {
  const supabase = await createClient();

  try {
    console.log(
      "[generateSinglePaidReportForDynamicQuestion] Starting for reportId:",
      reportId,
    );
    console.log(
      "[generateSinglePaidReportForDynamicQuestion] Question:",
      dynamicQuestion.question,
    );

    // 무료 리포트 내용 파싱
    let freeReportContent = "";
    if (session.report_data) {
      try {
        const reportData = JSON.parse(session.report_data) as {
          freeReport?: any;
        };
        if (typeof reportData.freeReport === "string") {
          freeReportContent = reportData.freeReport;
        } else if (
          reportData.freeReport &&
          typeof reportData.freeReport === "object"
        ) {
          const fr = reportData.freeReport as any;
          freeReportContent = [
            fr.headline,
            ...(fr.sections?.flatMap((s: any) => [s.title, ...s.paragraphs]) ||
              []),
            fr.deficitSentence,
          ]
            .filter(Boolean)
            .join("\n");
        }
      } catch {
        // 파싱 실패해도 무시
      }
    }

    if (!freeReportContent && session.free_report) {
      freeReportContent = session.free_report;
    }

    // 프롬프트 생성
    const prompt = `이 질문에 대한 상세한 분석 리포트를 작성하세요.

# 질문
${dynamicQuestion.question}

# 무료 리포트 (컨텍스트)
${freeReportContent.substring(0, 1500)}

${session.user_context ? `# 사용자 상황\n${session.user_context}` : ""}

# 리포트 구조 (총 8-10문장, 읽는 시간 10-15초)

1. headline
   - 질문에 대한 직접적인 답 한 줄
   - "이 관계는 ~" 같은 포괄적 문장 금지
   - 질문과 다른 방향의 일반적 설명 금지

2. 섹션 1 제목: [내용을 요약한 핵심 1문장]
   - 정확히 2문장
   - 패턴 중심
   - 무료 리포트와 이 질문의 연결고리
   - 제목 예: "에너지가 고갈되면서 판단이 한쪽으로 기울고 있어"

3. 섹션 2 제목: [내용을 요약한 핵심 1문장]
   - 정확히 2문장
   - 감정이 아니라 "상황 구조" 중심
   - 그 패턴을 유지하게 하는 메커니즘 설명
   - 제목 예: "그렇게 선택하는 게 당연해 보이는 이유"

4. 섹션 3 제목: [내용을 요약한 핵심 1문장]
   - 정확히 1문장
   - 핵심
   - 사용자의 기존 생각을 흔드는 한 문장
   - 제목 예: "이건 사람이 아니라 상태 문제일 수도 있어"

5. 섹션 4 제목: [내용을 요약한 핵심 1문장]
   - 정확히 2문장
   - 현재 상태가 계속되면 어떤 변화가 생기는지
   - 구체적 결과만
   - 제목 예: "지금의 선택이 내 기준을 만들어가고 있어"

6. finalQuestion
   - 1문장
   - 반드시 "~일까?" 형태로 끝남

# 금지 사항
- 섹션 제목이 "왜 이 질문이 나왔는지", "현재 구조" 같은 일반 제목 금지
- 섹션 제목이 설명형 금지 (예: "현재 상황을 분석하면...")
- 섹션 제목이 기획서 같은 느낌 금지
- 성향 점수(숫자) 절대 금지
- 안정형, 감정형, 인지형, 불안형, 회피형, 직면형 등 성향 유형명 절대 금지
- Step 1, Step 2 같은 단계별 표현 금지
- 예시와 구체적 행동 제안 금지
- 설명이 아닌 핵심 구조만

# 마크다운 기호 사용 금지
- 구분선 기호 사용 금지
- 강조 기호 사용 금지
- 인용 기호 사용 금지
- 코드블록 표시 기호 사용 금지
- 이모지 사용 금지
- 번호 리스트 사용 금지
- 위 기호가 하나라도 포함되면 실패로 간주하고 다시 작성할 것

# 출력 (JSON only, 마크다운 금지)
{
  "headline": "질문에 대한 직접적인 답 한 줄",
  "sections": [
    { "title": "내용을 요약한 핵심 1문장", "paragraphs": ["2문장"] },
    { "title": "내용을 요약한 핵심 1문장", "paragraphs": ["2문장"] },
    { "title": "내용을 요약한 핵심 1문장", "paragraphs": ["1문장"] },
    { "title": "내용을 요약한 핵심 1문장", "paragraphs": ["2문장"] }
  ],
  "finalQuestion": "~일까?"
}`;

    console.log(
      "[generateSinglePaidReportForDynamicQuestion] Calling Claude API",
    );

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (!content) {
      throw new Error("Empty response from Claude API");
    }

    console.log(
      "[generateSinglePaidReportForDynamicQuestion] Generated content length:",
      content.length,
    );

    // JSON 파싱 후 cleanText 적용
    let cleanedContent;
    try {
      let jsonStr = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const start = jsonStr.indexOf("{");
      const end = jsonStr.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        jsonStr = jsonStr.slice(start, end + 1);
      }
      const parsedReport = JSON.parse(jsonStr) as {
        headline: string;
        sections: Array<{ title: string; paragraphs: string[] }>;
        finalQuestion: string;
      };
      cleanedContent = JSON.stringify({
        headline: cleanText(parsedReport.headline),
        sections: parsedReport.sections.map((s) => ({
          title: cleanText(s.title),
          paragraphs: s.paragraphs.map(cleanText),
        })),
        finalQuestion: cleanText(parsedReport.finalQuestion),
      });
    } catch (e) {
      // JSON 파싱 실패 시 원본 content에 cleanText만 적용
      cleanedContent = cleanText(content);
    }

    // 리포트 저장
    const { error: updateError } = await supabase
      .from("paid_reports")
      .update({
        content: cleanedContent,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (updateError) {
      throw updateError;
    }

    console.log(
      "[generateSinglePaidReportForDynamicQuestion] ✅ Report saved successfully",
    );

    // report_data에 report 필드 추가
    await updateReportDataWithPaidReport(
      supabase,
      sessionId,
      dynamicQuestion.id,
      cleanedContent,
    );

    // 다음 Loop 질문 생성 (비동기, 실패해도 무시)
    generateNextPaidQuestions({
      sessionId,
      paidReportText: cleanedContent,
    }).catch((err) => {
      console.error(
        `[generateSinglePaidReportForDynamicQuestion] Failed to generate next loop questions:`,
        err,
      );
    });
  } catch (error) {
    console.error("[generateSinglePaidReportForDynamicQuestion] ❌ Error:", {
      message: error instanceof Error ? error.message : String(error),
      reportId,
    });

    // 에러 저장
    try {
      await supabase
        .from("paid_reports")
        .update({
          status: "failed",
          error_message:
            error instanceof Error ? error.message : "Unknown error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportId);
    } catch {
      // 저장 실패해도 무시
    }
  }
}

/**
 * 단일 질문의 유료 리포트 생성 (정적 questions 테이블용)
 */
async function generateSinglePaidReport(
  sessionId: string,
  reportId: string,
  orderId: string,
  questionId: string,
  question: Question,
  session: AnalysisSession,
) {
  const supabase = await createClient();

  try {
    const prompt = buildPaidReportPrompt(session, question);

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 리포트 저장
    await supabase
      .from("paid_reports")
      .update({
        content,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);
  } catch (error) {
    console.error(`Failed to generate paid report ${reportId}:`, error);

    // 에러 저장
    try {
      await supabase
        .from("paid_reports")
        .update({
          status: "failed",
          error_message:
            error instanceof Error ? error.message : "Unknown error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportId);
    } catch {
      // 저장 실패해도 무시
    }
  }
}

function buildPaidReportPrompt(
  session: AnalysisSession,
  question: Question,
): string {
  const categoryLabel =
    {
      연애: "연애",
      인간관계: "인간관계",
      "직업/진로": "직업진로",
      감정: "감정",
    }[session.category as string] || session.category;

  return `사용자의 심리 분석을 기반으로 특정 질문에 대한 깊이 있는 유료 확장 리포트를 작성해주세요.

**분석 주제**: ${categoryLabel} ${session.subcategory ? `> ${session.subcategory}` : ""}

**질문 대상**: ${question.title || "(질문)"}

**유료 리포트 작성 방향**:
1. 사용자의 현재 상황과 심리 상태 분석
2. 숨겨진 원인과 패턴 규명
3. 선택과 행동의 메커니즘 설명
4. 실질적인 다음 단계 제시

**톤**:
- 한국어 반말, 단정형
- 분석 중심, 감정적 공감은 절제
- 구조와 패턴에 초점

마크다운 형식으로 작성해주세요.`;
}

/**
 * Claude 생성 content를 ReportSection[] 형태로 변환
 * - markdown 제목(##, ###)을 섹션으로 파싱
 * - 각 섹션의 문단들을 paragraphs 배열로 변환
 */
function parseContentToReportSections(
  content: string,
): Array<{ title: string; paragraphs: string[] }> {
  try {
    let jsonStr = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      jsonStr = jsonStr.slice(start, end + 1);
    }

    const parsed = JSON.parse(jsonStr) as {
      headline?: string;
      sections?: Array<{ title: string; paragraphs: string[] }>;
      finalQuestion?: string;
    };

    const sections =
      parsed.sections?.map((s) => ({
        title: cleanText(s.title),
        paragraphs: s.paragraphs.map(cleanText),
      })) ?? [];

    if (parsed.finalQuestion) {
      sections.push({
        title: "다음 질문",
        paragraphs: [cleanText(parsed.finalQuestion)],
      });
    }

    return sections.length > 0
      ? sections
      : [{ title: "분석 결과", paragraphs: [cleanText(content)] }];
  } catch {
    return [{ title: "분석 결과", paragraphs: [cleanText(content)] }];
  }
}

/**
 * report_data에 생성된 paid report 추가 (JSON 형식)
 * - content: Claude가 생성한 JSON 문자열
 * - 파싱 후 직접 report_data에 저장
 */
async function updateReportDataWithPaidReport(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
  questionId: string,
  content: string,
) {
  try {
    // 현재 report_data 조회
    const { data: session, error: sessionError } = await supabase
      .from("analysis_sessions")
      .select("report_data")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.warn(
        "[updateReportDataWithPaidReport] Session not found:",
        sessionId,
      );
      return;
    }

    const reportData = JSON.parse(session.report_data || "{}") as {
      paidQuestions?: Array<any>;
      [key: string]: any;
    };

    if (!reportData.paidQuestions) {
      console.warn(
        "[updateReportDataWithPaidReport] No paidQuestions found in report_data",
      );
      return;
    }

    // content를 ReportSection[]로 파싱
    const reportSections = parseContentToReportSections(content);

    // questionId와 일치하는 paidQuestion 찾아서 report 필드 추가
    const found = reportData.paidQuestions.some((q: any) => {
      if (q.id === questionId) {
        q.report = reportSections;
        return true;
      }
      return false;
    });

    if (!found) {
      console.warn(
        "[updateReportDataWithPaidReport] Question not found in paidQuestions:",
        questionId,
      );
      return;
    }

    // 업데이트된 report_data 저장
    const { error: updateError } = await supabase
      .from("analysis_sessions")
      .update({
        report_data: JSON.stringify(reportData),
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error(
        "[updateReportDataWithPaidReport] Failed to update report_data:",
        updateError,
      );
      return;
    }

    console.log(
      "[updateReportDataWithPaidReport] ✅ report_data updated with paid report:",
      {
        sessionId,
        questionId,
        sectionCount: reportSections.length,
      },
    );
  } catch (error) {
    console.error("[updateReportDataWithPaidReport] ❌ Error:", {
      message: error instanceof Error ? error.message : String(error),
      questionId,
    });
  }
}

function calculateAmount(questionCount: number, isBundle: boolean): number {
  if (isBundle) {
    return 4900;
  }

  switch (questionCount) {
    case 1:
      return 900;
    case 2:
      return 1600;
    case 3:
      return 2100;
    default:
      throw new Error("Invalid question count");
  }
}

/**
 * Loop별 유료 질문 조회
 * - loopDepth === 1: paidQuestions
 * - loopDepth >= 2: loopQuestions_${loopDepth}
 */
export const getPaidQuestionsForLoop = async (params: {
  sessionId: string;
  loopDepth: number;
}): Promise<{
  questions: Array<{
    id: string;
    question: string;
    description: string;
    price: number;
    displayOrder: number;
    axis: 1 | 2 | 3;
  }>;
}> => {
  const supabase = await createClient();

  try {
    const { data: session, error } = await supabase
      .from("analysis_sessions")
      .select("report_data")
      .eq("id", params.sessionId)
      .single();

    if (error || !session?.report_data) {
      console.warn("[getPaidQuestionsForLoop] Session not found");
      return { questions: [] };
    }

    const reportData = JSON.parse(session.report_data) as {
      paidQuestions?: any[];
      [key: string]: any;
    };

    if (params.loopDepth === 1) {
      return {
        questions: reportData.paidQuestions || [],
      };
    } else {
      const loopKey = `loopQuestions_${params.loopDepth}`;
      return {
        questions: reportData[loopKey] || [],
      };
    }
  } catch (error) {
    console.error("[getPaidQuestionsForLoop] Error:", error);
    return { questions: [] };
  }
};

/**
 * 다음 Loop 유료 질문 생성
 * - paidReportText를 기반으로 새 질문 3개 생성
 * - report_data에 loopQuestions_${loopDepth} 저장
 * - 중복 생성 방지 (이미 있으면 스킵)
 */
async function generateNextPaidQuestions(params: {
  sessionId: string;
  paidReportText: string;
}): Promise<{
  success: boolean;
  loopDepth: number;
  questions: Array<{
    id: string;
    question: string;
    description: string;
    price: number;
    displayOrder: number;
    axis: 1 | 2 | 3;
  }>;
}> {
  const supabase = await createClient();

  try {
    console.log("[generateNextPaidQuestions] Starting for sessionId:", params.sessionId);

    // 1. session 조회
    const { data: session, error: sessionError } = await supabase
      .from("analysis_sessions")
      .select("report_data, loop_depth, user_context, current_axis")
      .eq("id", params.sessionId)
      .single();

    if (sessionError || !session) {
      console.warn("[generateNextPaidQuestions] Session not found");
      return { success: false, loopDepth: 0, questions: [] };
    }

    // 2. report_data 파싱
    let reportData;
    try {
      reportData = JSON.parse(session.report_data || "{}");
    } catch {
      console.warn("[generateNextPaidQuestions] Failed to parse report_data");
      return { success: false, loopDepth: 0, questions: [] };
    }

    // 3. nextLoopDepth 결정 (handlePaymentSuccess에서 이미 loop_depth 증가됨)
    const nextLoopDepth = Math.min(session.loop_depth || 2, 3);

    console.log("[generateNextPaidQuestions] Using loopDepth:", nextLoopDepth);

    // Loop 3을 초과하면 생성 안 함
    if (nextLoopDepth > 3) {
      console.log("[generateNextPaidQuestions] Max loop depth reached (3)");
      return { success: false, loopDepth: nextLoopDepth, questions: [] };
    }

    // 4. 이미 해당 Loop 질문이 있으면 반환 (중복 생성 방지)
    const loopKey = `loopQuestions_${nextLoopDepth}`;
    if (reportData[loopKey] && Array.isArray(reportData[loopKey]) && reportData[loopKey].length > 0) {
      console.log(`[generateNextPaidQuestions] ${loopKey} already exists, skipping generation`);
      return {
        success: true,
        loopDepth: nextLoopDepth,
        questions: reportData[loopKey],
      };
    }

    // 5. generatePaidQuestionsFromReport 호출 (동적 질문 생성)
    console.log("[generateNextPaidQuestions] Generating new questions from paid report text");

    // 동적 질문 생성 (generatePaidQuestionsFromReport는 analysis.ts에서 import)
    const { generatePaidQuestionsFromReport } = await import("./analysis");
    const nextQuestions = await generatePaidQuestionsFromReport(
      params.paidReportText,
      session.user_context || null,
      nextLoopDepth as 1 | 2 | 3,
      anthropic,
    );

    if (!nextQuestions || nextQuestions.length === 0) {
      console.warn("[generateNextPaidQuestions] Failed to generate questions");
      return { success: false, loopDepth: nextLoopDepth, questions: [] };
    }

    console.log("[generateNextPaidQuestions] Generated", nextQuestions.length, "questions");

    // 6. report_data에 저장
    reportData[loopKey] = nextQuestions;

    const { error: updateError } = await supabase
      .from("analysis_sessions")
      .update({
        report_data: JSON.stringify(reportData),
      })
      .eq("id", params.sessionId);

    if (updateError) {
      console.error("[generateNextPaidQuestions] Failed to update report_data:", updateError);
      return { success: false, loopDepth: nextLoopDepth, questions: [] };
    }

    console.log("[generateNextPaidQuestions] ✅ Successfully generated and saved", loopKey);

    return {
      success: true,
      loopDepth: nextLoopDepth,
      questions: nextQuestions,
    };
  } catch (error) {
    console.error("[generateNextPaidQuestions] Error:", error);
    return { success: false, loopDepth: 0, questions: [] };
  }
}
