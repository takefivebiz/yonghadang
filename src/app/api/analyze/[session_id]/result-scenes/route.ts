import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { ResultScene, SceneMessage } from "@/lib/types/result";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ResultSceneRow {
  scene_index: number;
  scene_title: string;
  messages: unknown;
  preview_messages: unknown;
  is_free: boolean;
}

/**
 * GET /api/analyze/[session_id]/result-scenes
 * result_scenes 테이블에서 completed 상태의 scenes를 조회한다.
 *
 * - DB 내부 id/status/session_id는 응답에 노출하지 않는다.
 * - ResultScene shape으로 복원하여 { scenes: ResultScene[] } 형태로 반환한다.
 * - result page의 localStorage fallback에서만 호출된다. (커밋 B)
 * - 유료씬 DB 조회는 커밋 C 범위다.
 */
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> },
): Promise<NextResponse> => {
  const { session_id } = await params;

  if (!UUID_REGEX.test(session_id)) {
    return NextResponse.json(
      { error: "유효하지 않은 session_id 형식입니다" },
      { status: 400 },
    );
  }

  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("result_scenes")
      .select("scene_index, scene_title, messages, preview_messages, is_free")
      .eq("session_id", session_id)
      .eq("status", "completed")
      .order("scene_index", { ascending: true });

    if (error) {
      console.error(
        `[GET /result-scenes] DB 조회 실패 session=${session_id}:`,
        error,
      );
      return NextResponse.json({ error: "DB 조회 실패" }, { status: 500 });
    }

    const scenes: ResultScene[] = (data as ResultSceneRow[]).map((row) => ({
      id: `${session_id}-scene-${row.scene_index}`,
      scene_index: row.scene_index,
      scene_title: row.scene_title,
      is_free: row.is_free,
      is_unlocked: false,
      messages:
        Array.isArray(row.messages) && (row.messages as unknown[]).length > 0
          ? (row.messages as SceneMessage[])
          : null,
      preview_messages:
        Array.isArray(row.preview_messages) &&
        (row.preview_messages as unknown[]).length > 0
          ? (row.preview_messages as SceneMessage[])
          : null,
    }));

    return NextResponse.json({ scenes }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error(
      `[GET /result-scenes] 오류 session=${session_id}:`,
      message,
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
