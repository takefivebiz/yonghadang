import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // supabaseResponse는 setAll 내부에서 재할당될 수 있다.
  // Supabase 공식 패턴: request 쿠키 갱신 → 새 response 생성 → response 쿠키 갱신
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // 1. request 쿠키 먼저 갱신해야 이후 Server Component에서 새 토큰을 읽을 수 있다.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        // 2. 갱신된 request로 새 response 생성
        supabaseResponse = NextResponse.next({ request });
        // 3. 브라우저에 전달할 response 쿠키에도 반영
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser()를 반드시 호출해야 세션 토큰이 갱신된다.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const memberOnlyRoutes = ["/my-page"];
  const adminRoutes = ["/admin"];

  const isMemberOnlyRoute = memberOnlyRoutes.some((r) =>
    pathname.startsWith(r)
  );
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));

  if (isMemberOnlyRoute && !user) {
    const redirectUrl = new URL(
      `/auth?next=${encodeURIComponent(pathname)}`,
      request.url
    );
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // redirect 시에도 세션 쿠키를 유지해야 토큰이 증발하지 않는다.
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) =>
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      );
    return redirectResponse;
  }

  if (isAdminRoute && !user) {
    const redirectResponse = NextResponse.redirect(
      new URL("/auth", request.url)
    );
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) =>
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      );
    return redirectResponse;
  }

  return supabaseResponse;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
