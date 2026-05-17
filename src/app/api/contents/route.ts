import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Content, SceneConfig } from "@/lib/types/content";

// 성공 응답: Content[]
// 실패 응답: { error: string }

type ContentsSuccessResponse = Content[];
type ContentsErrorResponse = { error: string };
export type ContentsResponse = ContentsSuccessResponse | ContentsErrorResponse;

export async function GET(): Promise<NextResponse<ContentsResponse>> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("contents")
      .select(
        "id, slug, title, subtitle, category, thumbnail_url, estimated_minutes, input_config, scene_config, is_active, sort_order, created_at, updated_at",
      )
      .eq("is_active", true)
      .order("category")
      .order("sort_order", { nullsFirst: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // insights: scene_config.scenes[].title에서 파생한다.
    // scene_config가 scene 제목의 authoritative source이므로 별도 DB 저장 없이 여기서 계산한다.
    // 단, 카드 preview 문구가 scene 제목과 달라져야 하는 요구사항이 생기면
    // DB에 card_previews 컬럼을 추가하고 이 파생 로직을 제거해야 한다.
    const contents: Content[] = (data ?? []).map((row) => ({
      ...(row as Omit<Content, "insights">),
      insights:
        (row.scene_config as SceneConfig)?.scenes?.map((s) => s.title) ?? [],
    }));

    return NextResponse.json(contents);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
