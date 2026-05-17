/**
 * @server-only
 * Server Component 및 Server Action 전용.
 * 내부 HTTP fetch 없이 Supabase를 직접 조회한다.
 */
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PublicContent, SceneConfig } from "@/lib/types/content";

/**
 * contents 테이블을 서버에서 직접 조회해 PublicContent[] 반환.
 * 오류 시 빈 배열을 반환한다.
 */
export const fetchContents = async (): Promise<PublicContent[]> => {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("contents")
      .select(
        "id, slug, title, subtitle, category, thumbnail_url, scene_config, sort_order",
      )
      .eq("is_active", true)
      .order("category")
      .order("sort_order", { nullsFirst: false });

    if (error) {
      console.error("[fetchContents] Supabase 오류:", error.message);
      return [];
    }

    // insights: scene_config.scenes[].title에서 파생. scene_config 원본은 노출하지 않는다.
    return (data ?? []).map((row) => ({
      id: row.id as string,
      slug: row.slug as string | null,
      title: row.title as string,
      subtitle: row.subtitle as string | null,
      category: row.category as PublicContent["category"],
      thumbnail_url: row.thumbnail_url as string | null,
      insights:
        (row.scene_config as SceneConfig)?.scenes?.map((s) => s.title) ?? [],
    }));
  } catch (err) {
    console.error(
      "[fetchContents] 예외 발생:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
};
