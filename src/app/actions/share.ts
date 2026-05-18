"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";

interface ShareMetadata {
  title: string;
  description: string;
  imageUrl: string;
}

const DEFAULT_METADATA: ShareMetadata = {
  title: "Veil",
  description: "당신의 에너지를 분석해보세요.",
  imageUrl: "",
};

interface ContentRow {
  title: string;
  subtitle: string | null;
  thumbnail_url: string | null;
}

interface SessionWithContent {
  contents: ContentRow | null;
}

// share_token 기반으로 OG 메타데이터 조회. layout.tsx에서 generateMetadata에 사용.
export async function getShareMetadata(shareId: string): Promise<ShareMetadata> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("analysis_sessions")
      .select("contents(title, subtitle, thumbnail_url)")
      .eq("share_token", shareId)
      .single();

    if (error || !data) {
      return DEFAULT_METADATA;
    }

    const content = (data as unknown as SessionWithContent).contents;
    if (!content) {
      return DEFAULT_METADATA;
    }

    return {
      title: content.title,
      description: content.subtitle ?? "당신의 에너지를 분석해보세요.",
      imageUrl: content.thumbnail_url ?? "",
    };
  } catch {
    return DEFAULT_METADATA;
  }
}
