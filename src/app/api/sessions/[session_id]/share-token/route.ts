import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/sessions/[session_id]/share-token
 * result 페이지의 ResultActions가 공유 URL을 만들 때 사용.
 *
 * - session_id(UUID) → analysis_sessions.share_token 반환
 * - 인증 없이 조회 (share_token은 공개 식별자)
 */
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> },
): Promise<NextResponse> => {
  const { session_id } = await params;

  if (!UUID_REGEX.test(session_id)) {
    return NextResponse.json(
      { error: "유효하지 않은 session_id 형식" },
      { status: 400 },
    );
  }

  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("analysis_sessions")
      .select("share_token")
      .eq("id", session_id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "세션을 찾을 수 없어" },
        { status: 404 },
      );
    }

    const shareToken = (data as { share_token: string | null }).share_token;

    if (!shareToken) {
      return NextResponse.json(
        { error: "share_token이 존재하지 않아" },
        { status: 404 },
      );
    }

    return NextResponse.json({ share_token: shareToken }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("[GET /sessions/share-token] 오류:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
