import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/me
 * - 현재 로그인한 회원 정보 조회
 * - Supabase SSR의 getUser()로 세션 검증
 * - 미인증 시 401 반환
 */
export const GET = async (request: NextRequest) => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase 환경변수 미설정');
    }

    // Supabase SSR 클라이언트
    // (쿠키를 자동으로 파싱함 - sb-...auth-token.0, .1 등 처리)
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // me 조회는 쿠키 설정이 필요 없음 (읽기만 함)
        },
      },
    });

    // getUser()로 현재 세션의 사용자 정보 조회
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('[/api/auth/me] ❌ 미인증:', error?.message || 'user not found');
      return NextResponse.json(
        { error: '미인증 상태입니다' },
        { status: 401 }
      );
    }

    // 회원 프로필 구성
    const profile = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      avatar: user.user_metadata?.avatar_url || null,
      provider: user.app_metadata?.provider || 'unknown',
    };

    console.log('[/api/auth/me] ✅ 회원 정보 반환:', profile.id);

    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    console.error('[/api/auth/me] ❌ 에러:', err);
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다' },
      { status: 500 }
    );
  }
};
