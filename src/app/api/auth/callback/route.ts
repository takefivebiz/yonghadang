import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * PRD 11.3 A. OAuth 콜백 처리
 * - Supabase SSR이 PKCE를 자동으로 처리
 * - code → session 교환
 * - Set-Cookie를 redirect response에 포함
 * - ?next= 파라미터로 리다이렉트
 */
export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get('code');
  const nextPath = request.nextUrl.searchParams.get('next') || '/my-page';

  console.log('[/api/auth/callback] ✅ OAuth 콜백:', { code: !!code, nextPath });

  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=no_code', request.url));
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase 환경변수 미설정');
    }

    // 1. 먼저 리다이렉트 response 생성
    const response = NextResponse.redirect(new URL(nextPath, request.url));

    // 2. Supabase SSR 클라이언트 (PKCE 자동 처리)
    // response.cookies에 직접 쓰도록 설정
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 개발 환경에서는 secure: false로 오버라이드
            // (localhost/HTTP에서도 쿠키 저장되도록)
            const finalOptions = {
              ...options,
              secure: process.env.NODE_ENV === 'production',
            };
            response.cookies.set(name, value, finalOptions);
          });
        },
      },
    });

    // 3. code → session 교환 (PKCE 자동 검증)
    // 이때 setAll이 호출되어 response.cookies에 세션 쿠키가 설정됨
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[/api/auth/callback] ❌ 세션 교환 실패:', error.message);
      return NextResponse.redirect(new URL('/auth?error=auth_failed', request.url));
    }

    // 🔍 Debugging: Set-Cookie 헤더 확인
    const setCookieHeaders = response.headers.getSetCookie();
    console.log('[/api/auth/callback] ✅ 세션 교환 완료');
    console.log('[/api/auth/callback] 🍪 Set-Cookie 헤더 개수:', setCookieHeaders.length);
    setCookieHeaders.forEach((cookie, idx) => {
      console.log(`[/api/auth/callback] 🍪 Cookie ${idx + 1}:`, cookie.substring(0, 100) + '...');
    });

    // 4. response 반환 (Set-Cookie 헤더 포함)
    return response;
  } catch (err) {
    console.error('[/api/auth/callback] ❌ 에러:', err);
    return NextResponse.redirect(new URL('/auth?error=server_error', request.url));
  }
};
