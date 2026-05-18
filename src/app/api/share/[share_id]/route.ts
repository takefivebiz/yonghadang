import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ResultScene, SceneMessage } from "@/lib/types/result";

interface SessionQueryRow {
  id: string;
  contents: { slug: string } | null;
}

interface ResultSceneRow {
  scene_index: number;
  scene_title: string;
  messages: unknown;
  preview_messages: unknown;
}

/**
 * GET /api/share/[share_id]
 * share_token 기반 공개 조회. share 페이지 전용.
 *
 * - share_id = analysis_sessions.share_token
 * - is_free=true, status=completed 씬만 반환
 * - 유료씬 messages는 절대 응답에 포함하지 않는다
 * - 인증 불필요 (공개 endpoint)
 */
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ share_id: string }> },
): Promise<NextResponse> => {
  const { share_id } = await params;

  if (!share_id || share_id.length < 8) {
    return NextResponse.json(
      { error: "유효하지 않은 share_id" },
      { status: 400 },
    );
  }

  try {
    const supabase = createServiceRoleClient();

    // share_token으로 session + content slug 조회
    const { data: session, error: sessionError } = await supabase
      .from("analysis_sessions")
      .select("id, contents(slug)")
      .eq("share_token", share_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "공유된 결과를 찾을 수 없어" },
        { status: 404 },
      );
    }

    const row = session as unknown as SessionQueryRow;
    const contentSlug = row.contents?.slug;

    if (!contentSlug) {
      return NextResponse.json(
        { error: "콘텐츠 정보를 찾을 수 없어" },
        { status: 404 },
      );
    }

    // is_free=true AND status=completed 씬만 조회
    // 유료씬은 SELECT 대상 자체가 아니다 — 클라이언트 필터에 의존하지 않는다
    const { data: sceneRows, error: scenesError } = await supabase
      .from("result_scenes")
      .select("scene_index, scene_title, messages, preview_messages")
      .eq("session_id", row.id)
      .eq("is_free", true)
      .eq("status", "completed")
      .order("scene_index", { ascending: true });

    if (scenesError) {
      console.error("[GET /api/share] scenes 조회 실패:", scenesError.message);
      return NextResponse.json({ error: "씬 조회 실패" }, { status: 500 });
    }

    const freeScenes: ResultScene[] = (sceneRows as ResultSceneRow[]).map((s) => ({
      id: `${row.id}-scene-${s.scene_index}`,
      scene_index: s.scene_index,
      scene_title: s.scene_title,
      is_free: true,
      is_unlocked: true,
      messages:
        Array.isArray(s.messages) && (s.messages as unknown[]).length > 0
          ? (s.messages as SceneMessage[])
          : null,
      preview_messages:
        Array.isArray(s.preview_messages) &&
        (s.preview_messages as unknown[]).length > 0
          ? (s.preview_messages as SceneMessage[])
          : null,
    }));

    return NextResponse.json(
      {
        session_id: row.id,
        content_id: contentSlug,
        free_scenes: freeScenes,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("[GET /api/share] 오류:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
