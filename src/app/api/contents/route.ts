import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PublicContent, SceneConfig } from "@/lib/types/content";

// 성공 응답: PublicContent[]  (내부 설계 데이터 제외)
// 실패 응답: { error: string }

type ContentsSuccessResponse = PublicContent[];
type ContentsErrorResponse = { error: string };
export type ContentsResponse = ContentsSuccessResponse | ContentsErrorResponse;

export async function GET(): Promise<NextResponse<ContentsResponse>> {
  try {
    const supabase = createServiceRoleClient();

    // scene_config는 insights 파생에만 사용하고 응답에서는 제거한다.
    // input_config, estimated_minutes 등 내부 필드는 SELECT에서도 제외한다.
    const { data, error } = await supabase
      .from("contents")
      .select("id, slug, title, subtitle, category, thumbnail_url, scene_config, sort_order")
      .eq("is_active", true)
      .order("category")
      .order("sort_order", { nullsFirst: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // insights: scene_config.scenes[].title만 파생. scene_config 원본은 응답에 포함하지 않는다.
    // 카드 preview 문구가 scene 제목과 달라져야 하는 시점에는
    // DB에 card_previews 컬럼을 별도 추가하고 이 파생 로직을 제거해야 한다.
    const contents: PublicContent[] = (data ?? []).map((row) => ({
      id: row.id as string,
      slug: row.slug as string | null,
      title: row.title as string,
      subtitle: row.subtitle as string | null,
      category: row.category as PublicContent["category"],
      thumbnail_url: row.thumbnail_url as string | null,
      insights: (row.scene_config as SceneConfig)?.scenes?.map((s) => s.title) ?? [],
    }));

    return NextResponse.json(contents);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
