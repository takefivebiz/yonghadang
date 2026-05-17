import { createClient } from "@supabase/supabase-js";

/**
 * service_role 클라이언트 — 서버 사이드 전용.
 * RLS를 우회하므로 절대 클라이언트 번들에 포함되지 않아야 한다.
 */
export const createServiceRoleClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("SUPABASE_URL env var is not configured");
  }
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is not configured");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
};
