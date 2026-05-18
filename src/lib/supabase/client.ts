import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저 전용 Supabase 클라이언트 (anon key 기반).
 * cookie를 통해 세션을 관리하므로 'use client' 컴포넌트에서만 호출한다.
 */
export const createSupabaseBrowserClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다");
  if (!anonKey)
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다");

  return createBrowserClient(url, anonKey);
};
