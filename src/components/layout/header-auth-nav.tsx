"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isMemberLoggedIn, AUTH_CHANGE_EVENT } from "@/lib/report-access";

/**
 * 로그인 상태에 따라 헤더 우측 네비게이션을 동적으로 렌더링.
 * localStorage 기반 세션을 클라이언트에서 읽고, 로그인/로그아웃 커스텀 이벤트를 구독.
 *
 * TODO: [백엔드 연동] Supabase 세션 쿠키 기반으로 교체 시 서버 컴포넌트로 전환 가능
 */
export const HeaderAuthNav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 하이드레이션 불일치 방지: 마운트 후에만 localStorage 읽기
    setIsLoggedIn(isMemberLoggedIn());

    // 로그인/로그아웃 이벤트 구독 → 헤더 즉시 갱신
    const sync = () => setIsLoggedIn(isMemberLoggedIn());
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, sync);
  }, []);

  if (isLoggedIn) {
    return (
      <Link
        href="/my-page"
        className="rounded-md px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
      >
        마이페이지
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/guest-login"
        className="rounded-md px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
      >
        비회원 주문 조회
      </Link>
      <Link
        href="/auth"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        로그인
      </Link>
    </>
  );
};
