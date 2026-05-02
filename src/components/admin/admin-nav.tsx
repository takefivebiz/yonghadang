"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/admin", label: "매출 조회" },
  { href: "/admin/order-list", label: "주문 내역" },
  { href: "/admin/user-list", label: "유저 리스트" },
  { href: "/admin/contents", label: "콘텐츠 관리" },
] as const

/**
 * 관리자 좌측 사이드바 네비게이션
 * usePathname으로 현재 경로 감지 → 활성 메뉴 하이라이트
 */
const AdminNav = () => {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-52 flex-shrink-0 flex-col border-r border-surface bg-background">
      {/* 로고 영역 */}
      <div className="px-5 py-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-widest text-highlight transition-opacity hover:opacity-80"
        >
          VEIL
        </Link>
        <p className="mt-1 text-xs text-highlight/40">관리자</p>
      </div>

      {/* 네비게이션 링크 */}
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label }) => {
          // /admin 정확히 일치 또는 하위 경로 활성화 (단, /admin 자체는 정확히 일치만)
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-surface text-highlight"
                  : "text-highlight/50 hover:bg-surface/50 hover:text-highlight"
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminNav
