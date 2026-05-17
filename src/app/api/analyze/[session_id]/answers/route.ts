import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Answer } from "@/lib/types/analyze";

interface AnswersRequestBody {
  free_input: string;
  answers: Answer[];
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/analyze/[session_id]/answers
 * correction questions 완료 시 session_answers 저장 + status="answered" 업데이트.
 *
 * - free_input은 step_id="free_input"으로 함께 저장
 * - upsert(onConflict: session_id+step_id)로 중복 호출 멱등성 보장
 * - QA mode에서는 클라이언트가 이 API를 호출하지 않는다
 */
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> },
): Promise<NextResponse> => {
  try {
    const { session_id } = await params;

    if (!UUID_REGEX.test(session_id)) {
      return NextResponse.json(
        { error: "유효하지 않은 session_id 형식입니다" },
        { status: 400 },
      );
    }

    const body = (await req.json()) as AnswersRequestBody;
    const { free_input, answers } = body;

    if (typeof free_input !== "string" || free_input.trim() === "") {
      return NextResponse.json(
        { error: "free_input이 필요합니다" },
        { status: 400 },
      );
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "answers 배열이 필요합니다" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();

    // 세션 존재 여부 확인
    const { data: session, error: sessionFetchError } = await supabase
      .from("analysis_sessions")
      .select("id, status")
      .eq("id", session_id)
      .single();

    if (sessionFetchError || !session) {
      return NextResponse.json(
        { error: `세션을 찾을 수 없습니다: ${session_id}` },
        { status: 404 },
      );
    }

    // free_input row + correction answer rows 조립
    const rows = [
      {
        session_id,
        step_id: "free_input",
        question_text: "지금 네 상황을 편하게 말해줘",
        answer_text: free_input,
        answer_options: null,
      },
      ...answers.map((a) => ({
        session_id,
        step_id: a.step_id,
        question_text: a.question_text,
        answer_text: a.answer_text ?? null,
        answer_options:
          Array.isArray(a.answer_options) && a.answer_options.length > 0
            ? a.answer_options
            : null,
      })),
    ];

    // session_answers upsert (session_id + step_id unique)
    const { error: upsertError } = await supabase
      .from("session_answers")
      .upsert(rows, { onConflict: "session_id,step_id" });

    if (upsertError) {
      console.error("[POST /answers] session_answers upsert 실패:", upsertError);
      return NextResponse.json(
        { error: "답변 저장에 실패했습니다" },
        { status: 500 },
      );
    }

    // analysis_sessions status → "answered"
    const { error: updateError } = await supabase
      .from("analysis_sessions")
      .update({ status: "answered" })
      .eq("id", session_id);

    if (updateError) {
      // 답변 저장은 성공했으므로 status 업데이트 실패는 경고만 기록
      console.warn(
        "[POST /answers] status 업데이트 실패 (answered 저장은 완료):",
        updateError,
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error("[POST /answers] 오류:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
