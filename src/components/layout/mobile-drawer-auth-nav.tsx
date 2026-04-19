"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isMemberLoggedIn, AUTH_CHANGE_EVENT } from "@/lib/report-access";

interface MobileDrawerAuthNavProps {
  onClose: () => void;
}

/**
 * 모바일 드로어 내 인증 상태별 메뉴.
 * localStorage 기반 세션을 클라이언트에서 읽고, 로그인/로그아웃 커스텀 이벤트를 구독.
 *
 * TODO: [백엔드 연동] Supabase 세션 쿠키 기반으로 교체
 */
export const MobileDrawerAuthNav = ({ onClose }: MobileDrawerAuthNavProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isMemberLoggedIn());

    const sync = () => setIsLoggedIn(isMemberLoggedIn());
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, sync);
  }, []);

  if (isLoggedIn) {
    return (
      <Link
        href="/my-page"
        onClick={onClose}
        className="rounded-md px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        마이페이지
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/guest-login"
        onClick={onClose}
        className="rounded-md px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        비회원 주문 조회
      </Link>
      <Link
        href="/auth"
        onClick={onClose}
        className="mt-2 rounded-md bg-primary px-3 py-3 text-center text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        로그인
      </Link>
    </>
  );
};
