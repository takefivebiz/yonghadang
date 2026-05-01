"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: string;
}

/**
 * 로그인 상태에 따라 헤더 우측 네비게이션을 동적으로 렌더링.
 * /api/auth/me에서 현재 사용자 정보를 조회.
 */
export const HeaderAuthNav = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 마운트 시 현재 세션 조회
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
        console.error("[HeaderAuthNav] 세션 조회 실패:", error);
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
        className="rounded-md px-4 py-2 text-sm font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{
          background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
          color: "white",
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
        className="rounded-md px-4 py-2 text-sm transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ color: "#BEAEDB" }}
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
        className="rounded-md px-4 py-2 text-sm transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ color: "#BEAEDB" }}
      >
        비회원 조회
      </Link>
      <Link
        href="/auth"
        className="rounded-md px-4 py-2 text-sm font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{
          background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
          color: "white",
        }}
      >
        로그인
      </Link>
    </>
  );
};
