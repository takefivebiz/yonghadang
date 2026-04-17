import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TODO: [백엔드 연동] Supabase 세션 검증 로직 추가
// - /admin/* : 관리자 세션 검증 → 미인증 시 /admin/login 리다이렉트
// - /my-page : 회원 세션 검증 → 미인증 시 /auth 리다이렉트
// - /guest-check : 비회원 세션 쿠키 검증 → 미인증 시 /guest-login 리다이렉트
export const middleware = (_request: NextRequest) => {
  return NextResponse.next();
};

export const config = {
  matcher: ['/admin/:path*', '/my-page', '/guest-check'],
};
