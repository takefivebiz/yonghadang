import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * 클라이언트 컴포넌트용 Supabase 인스턴스
 * - anon 키로 OAuth 호출 가능 (인증 불필요)
 * - 클라이언트 사이드 렌더링에서만 사용
 */
export const createClientComponentClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[supabase/client] Supabase 환경변수 미설정');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
