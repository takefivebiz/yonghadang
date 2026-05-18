"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * 상단 네비게이션 바 (고정, 전체 너비)
 * - 공통: 홈 로고
 * - 비회원: 로그인 버튼 + 조회 버튼 (/guest 페이지로 이동)
 * - 회원: 마이페이지 버튼
 * - 모바일: 햄버거 메뉴로 우측 메뉴 통합
 */
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-40 h-13 border-b border-surface"
        style={{ backgroundColor: "#232035" }}
        data-mobile-menu-open={isMobileMenuOpen}
      >
        <nav className="mx-auto flex h-full max-w-screen-lg items-center px-4">
          {/* 홈 로고 */}
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.2em] text-highlight transition-opacity hover:opacity-80 font-header"
          >
            VEIL
          </Link>
          {/* 스페이서 */}
          <div className="flex-1" />
          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center sm:hidden"
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <span
              className={`absolute h-px w-4 transition-all duration-200 ${
                isMobileMenuOpen
                  ? "rotate-45 bg-accent"
                  : "-translate-y-1.5 bg-highlight/70"
              }`}
            />
            <span
              className={`absolute h-px w-4 transition-all duration-200 ${
                isMobileMenuOpen ? "opacity-0 bg-accent" : "bg-highlight/70"
              }`}
            />
            <span
              className={`absolute h-px w-4 transition-all duration-200 ${
                isMobileMenuOpen
                  ? "-rotate-45 bg-accent"
                  : "translate-y-1.5 bg-highlight/70"
              }`}
            />
          </button>

          {/* 데스크탑 네비게이션 */}
          <div className="hidden items-center gap-3 sm:flex">
            {isLoggedIn ? (
              <Link
                href="/my-page"
                className="text-sm text-highlight/70 transition-colors hover:text-highlight"
              >
                마이페이지
              </Link>
            ) : (
              <>
                <Link
                  href="/guest"
                  className="text-sm text-highlight/50 transition-colors hover:text-highlight/80"
                >
                  비회원 조회
                </Link>
                <div className="h-3.5 w-px bg-surface" />
                <Link
                  href="/auth"
                  className="rounded-full rounded-lg border border-accent/30 bg-accent/8 text-accent px-4 py-1.5 text-sm  text-accent transition-all hover:border-accent/60 hover:bg-accent/15"
                >
                  로그인
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* 모바일 드롭다운 메뉴 */}
        {isMobileMenuOpen && (
          <div
            className="z-50 border-b border-surface/20 px-4 py-4 sm:hidden"
            style={{ backgroundColor: "#232035" }}
          >
            {isLoggedIn ? (
              <Link
                href="/my-page"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-lg border border-accent/30 bg-accent/8 py-3 text-center text-sm font-medium text-accent transition-all hover:border-accent/60 hover:bg-accent/15"
              >
                마이페이지
              </Link>
            ) : (
              <div className="flex flex-col gap-2 items-center">
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-[80%] rounded-lg border border-accent/30 bg-accent/8 py-4 text-center text-sm font-medium text-accent transition-all hover:border-accent/60 hover:bg-accent/15"
                >
                  로그인
                </Link>
                <Link
                  href="/guest"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-[80%] rounded-lg border border-surface/70 bg-surface/20 py-4 text-center text-sm font-medium text-highlight/70 transition-all hover:border-surface/70 hover:bg-surface/30 hover:text-highlight"
                >
                  비회원 조회
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
