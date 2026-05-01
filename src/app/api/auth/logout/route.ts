import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * - Supabase auth 세션 삭제 (signOut)
 * - 모든 sb-*-auth-token.* 쿠키 삭제
 * - JSON 응답 반환
 */
export const POST = async (request: NextRequest) => {
  try {
    console.log('[/api/auth/logout] 로그아웃 처리 시작');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase 환경변수 미설정');
    }

    // Supabase SSR 클라이언트 - 쿠키를 수정하기 위해 setAll 구현
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 이건 사용하지 않음 (signOut에서 자체 처리)
          });
        },
      },
    });

    // Supabase 인증 세션 삭제
    await supabase.auth.signOut();
    console.log('[/api/auth/logout] supabase.auth.signOut() 완료');

    // 응답 생성
    const response = NextResponse.json(
      { success: true, message: '로그아웃되었습니다' },
      { status: 200 }
    );

    // 모든 sb-*-auth-token.* 형태의 쿠키 삭제
    // (sb-ecnoxnbiduwmgzpcfygc-auth-token, .0, .1, -code-verifier 등)
    const cookies = request.cookies.getAll();
    cookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')) {
        console.log(`[/api/auth/logout] 쿠키 삭제: ${cookie.name}`);
        response.cookies.set(cookie.name, '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 0, // 즉시 삭제
          path: '/',
        });
      }
    });

    // 기타 인증 관련 쿠키도 정리
    response.cookies.set('admin_auth', '', {
      httpOnly: false,
      maxAge: 0,
      path: '/',
    });

    console.log('[/api/auth/logout] 모든 쿠키 삭제 완료');
    return response;
  } catch (err) {
    console.error('[/api/auth/logout] 예상치 못한 에러:', err);
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
};

/**
 * GET /api/auth/logout
 * - GET도 지원 (일부 클라이언트에서 GET 사용)
 * - POST와 동일한 처리
 */
export const GET = (request: NextRequest) => POST(request);
