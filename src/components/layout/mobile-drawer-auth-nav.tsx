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
        className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
        style={{
          color: "#D8C9E8",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(100, 149, 237, 0.15)";
          e.currentTarget.style.color = "#F0E6FA";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "";
          e.currentTarget.style.color = "#D8C9E8";
        }}
      >
        마이페이지
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/guest/lookup"
        onClick={onClose}
        className="rounded-lg px-4 py-3 text-sm font-medium transition-colors"
        style={{
          color: "#D8C9E8",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(100, 149, 237, 0.15)";
          e.currentTarget.style.color = "#F0E6FA";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "";
          e.currentTarget.style.color = "#D8C9E8";
        }}
      >
        비회원 리포트 조회
      </Link>
      <Link
        href="/auth"
        onClick={onClose}
        className="mt-2 rounded-lg px-4 py-3 text-center text-sm font-medium transition-all"
        style={{
          background: "linear-gradient(135deg, #6495ED 0%, #A366FF 100%)",
          color: "#FFFFFF",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(100, 149, 237, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "";
        }}
      >
        로그인
      </Link>
    </>
  );
};
