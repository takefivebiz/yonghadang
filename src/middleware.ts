import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TODO: [백엔드 연동] Supabase 세션 검증 로직 추가
// - /admin/* : 관리자 세션 검증 → 미인증 시 /admin/login 리다이렉트
// - /mypage/* : 회원 세션 검증 → 미인증 시 /auth 리다이렉트
export const middleware = (request: NextRequest) => {
  return NextResponse.next();
};

export const config = {
  matcher: ['/admin/:path*', '/mypage/:path*'],
};
