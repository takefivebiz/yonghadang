import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // 현재 사용자 확인 (Supabase Auth 세션)
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 회원 전용 라우트 (로그인 필수)
  const memberOnlyRoutes = ['/my-page'];
  const isMemberOnlyRoute = memberOnlyRoutes.some(route => pathname.startsWith(route));

  // 관리자 전용 라우트 (로그인 필수)
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // 회원 전용 경로 보호
  if (isMemberOnlyRoute && !user) {
    return NextResponse.redirect(new URL(`/auth?next=${encodeURIComponent(pathname)}`, request.url));
  }

  // 관리자 경로 보호
  // TODO: [백엔드 연동] 관리자 라우트(/admin) 보호를 Supabase RLS + 역할 기반으로 전환
  // user.user_metadata?.role === 'admin' 확인으로 관리자 판단
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // /analyze, /report는 비회원도 접근 가능 (로그인 요구 없음)

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
