import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase OAuth callback handler.
 * Google이 Supabase를 거쳐 이 경로로 code를 전달한다.
 * code를 세션으로 교환한 뒤 next 파라미터 경로로 redirect.
 */
export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // 오픈 리다이렉트 방지: next는 반드시 상대경로여야 한다.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=oauth_no_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] 세션 교환 실패:", error.message);
    return NextResponse.redirect(`${origin}/auth?error=oauth_failed`);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
};
