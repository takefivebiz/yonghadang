import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * service_role 클라이언트 — 서버 사이드 전용.
 * RLS를 우회하므로 절대 클라이언트 번들에 포함되지 않아야 한다.
 */
export const createServiceRoleClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다");
  }
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
};

/**
 * anon key 기반 서버 Supabase 클라이언트 (cookie 세션 연동).
 * Route Handler / Server Action / Server Component에서 사용.
 * RLS를 따르므로 로그인한 사용자 본인 데이터에만 접근 가능하다.
 */
export const createSupabaseServerClient = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다");
  if (!anonKey)
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다");

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component에서는 cookies().set()이 불가.
          // Route Handler / Server Action에서만 실제로 쓰이므로 무시한다.
        }
      },
    },
  });
};
