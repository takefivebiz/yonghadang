import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // 관리자 경로 보호 (/login 제외)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/login')) {
    const adminAuth = request.cookies.get('admin_auth');

    if (!adminAuth) {
      // admin_auth 쿠키 없으면: 일반 회원인지 비로그인인지 확인
      // user_session 쿠키를 확인해서 회원 여부 판단
      const userSession = request.cookies.get('user_session');

      if (userSession) {
        // 일반 회원이 /admin 접근 시도 → /my-page로 리다이렉트
        url.pathname = '/my-page';
        return NextResponse.redirect(url);
      } else {
        // 비로그인 → /login으로 리다이렉트
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }
  }

  // TODO: [백엔드 연동] Supabase JWT 세션 검증 로직
  // - 쿠키값 존재 여부 → JWT 서명 검증으로 교체
  // - 세션 만료 체크 (24h) 추가
  // - 관리자 권한(role === 'admin') 검증 추가

  return NextResponse.next();
};

export const config = {
  matcher: ['/admin/:path*', '/mypage/:path*'],
};
