"use client"

import { useState } from "react"
import Link from "next/link"
import GuestVerifyModal from "@/components/modals/guest-verify-modal"

/**
 * 상단 네비게이션 바 (고정, 전체 너비)
 * - 공통: 홈 로고
 * - 비회원: 로그인 버튼 + 조회 버튼 (GuestVerifyModal 트리거)
 * - 회원: 마이페이지 버튼
 * - 모바일: 햄버거 메뉴로 우측 메뉴 통합
 */
const Navbar = () => {
  // TODO: [백엔드 연동] Supabase useUser() 훅으로 실제 로그인 상태 교체
  const isLoggedIn = false
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleGuestModalOpen = () => {
    setIsMobileMenuOpen(false)
    setIsGuestModalOpen(true)
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 h-14 border-b border-surface bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex h-full max-w-screen-lg items-center justify-between px-4">
          {/* 홈 로고 */}
          <Link
            href="/"
            className="text-xl font-bold tracking-widest text-highlight transition-opacity hover:opacity-80"
          >
            VEIL
          </Link>

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
                <button
                  onClick={() => setIsGuestModalOpen(true)}
                  className="text-sm text-highlight/50 transition-colors hover:text-highlight/80"
                >
                  비회원 조회
                </button>
                <div className="h-3.5 w-px bg-surface" />
                <Link
                  href="/auth"
                  className="rounded-full border border-highlight/30 px-4 py-1.5 text-sm text-highlight transition-colors hover:border-highlight hover:bg-highlight/5"
                >
                  로그인
                </Link>
              </>
            )}
          </div>

          {/* 모바일 햄버거 버튼 — absolute 포지셔닝으로 3개 span 동일 축 고정 */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative h-5 w-5 sm:hidden"
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <span
              className={`absolute left-0 top-1/2 h-px w-5 bg-highlight/70 transition-all duration-200 ${
                isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-5 bg-highlight/70 transition-all duration-200 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-5 bg-highlight/70 transition-all duration-200 ${
                isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </nav>

        {/* 모바일 드롭다운 메뉴 */}
        {isMobileMenuOpen && (
          <div className="border-b border-surface bg-background/95 px-4 py-4 sm:hidden">
            {isLoggedIn ? (
              <Link
                href="/my-page"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full rounded-lg border border-surface py-3 text-center text-sm text-highlight/70 transition-colors hover:border-highlight/30 hover:text-highlight"
              >
                마이페이지
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full rounded-lg border border-surface py-3 text-center text-sm text-highlight/70 transition-colors hover:border-highlight/30 hover:text-highlight"
                >
                  로그인
                </Link>
                <button
                  onClick={handleGuestModalOpen}
                  className="w-full rounded-lg border border-surface py-3 text-center text-sm text-highlight/70 transition-colors hover:border-accent hover:text-accent"
                >
                  비회원 주문조회
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <GuestVerifyModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </>
  )
}

export default Navbar
