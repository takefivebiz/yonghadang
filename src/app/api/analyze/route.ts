import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * POST /api/analyze
 * content intro의 "시작하기" 클릭 시 호출.
 * analysis_sessions row를 생성하고 session_id(UUID)를 반환한다.
 *
 * - content_id는 slug("love-1") 형태로 수신 → contents 테이블에서 UUID 변환
 * - QA mode(?qa=1)에서는 이 API를 호출하지 않는다 (클라이언트에서 skip)
 * - user_id는 소셜 로그인 구현 전까지 null
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = (await req.json()) as { content_id?: string };
    const { content_id } = body;

    if (!content_id || typeof content_id !== "string") {
      return NextResponse.json(
        { error: "content_id가 필요합니다" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();

    // content slug → DB UUID 변환
    // TODO: [백엔드 연동] content intro가 PublicContent 기반으로 바뀌면
    //       content_id가 UUID로 전달되므로 slug 조회 로직을 제거한다.
    const { data: content, error: contentError } = await supabase
      .from("contents")
      .select("id")
      .eq("slug", content_id)
      .eq("is_active", true)
      .single();

    if (contentError || !content) {
      return NextResponse.json(
        { error: `콘텐츠를 찾을 수 없습니다: ${content_id}` },
        { status: 404 },
      );
    }

    // analysis_sessions 생성 (status: pending)
    const { data: session, error: sessionError } = await supabase
      .from("analysis_sessions")
      .insert({
        content_id: content.id as string,
        status: "pending",
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      console.error("[POST /api/analyze] 세션 생성 실패:", sessionError);
      return NextResponse.json(
        { error: "세션 생성에 실패했습니다" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { session_id: session.id as string },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error("[POST /api/analyze] 오류:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
