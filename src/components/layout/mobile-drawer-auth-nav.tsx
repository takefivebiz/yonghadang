"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MobileDrawerAuthNavProps {
  onClose: () => void;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: string;
}

/**
 * 모바일 드로어 내 인증 상태별 메뉴.
 * /api/auth/me에서 현재 사용자 정보를 조회.
 */
export const MobileDrawerAuthNav = ({ onClose }: MobileDrawerAuthNavProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = (await response.json()) as AuthUser;
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("[MobileDrawerAuthNav] 세션 조회 실패:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 로딩 중일 때는 로그인 버튼만 표시
  if (isLoading) {
    return (
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
    );
  }

  // 회원 로그인 상태
  if (user) {
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

  // 비회원 상태
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
