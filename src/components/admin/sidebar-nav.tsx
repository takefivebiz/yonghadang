"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BarChart2, ClipboardList, Users, TrendingUp, FileText, Repeat2, History, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "매출 조회", icon: BarChart2, exact: true },
  { href: "/admin/order-list", label: "주문 내역", icon: ClipboardList, exact: false },
  { href: "/admin/user-list", label: "유저 관리", icon: Users, exact: false },
  { href: "/admin/questions", label: "질문 분석", icon: TrendingUp, exact: false },
  { href: "/admin/reports", label: "리포트 분석", icon: FileText, exact: false },
  { href: "/admin/loops", label: "탐색 루프 분석", icon: Repeat2, exact: false },
  { href: "/admin/question-logs", label: "질문 로그", icon: History, exact: false },
] as const;

export const SidebarNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    // admin_auth 쿠키 삭제
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/login");
  };

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col" style={{ borderRight: '1px solid rgba(230, 230, 250, 0.15)', background: 'rgba(27, 0, 63, 0.6)', backdropFilter: 'blur(8px)' }}>
      {/* 로고 */}
      <div className="flex h-16 items-center px-6" style={{ borderBottom: '1px solid rgba(230, 230, 250, 0.15)' }}>
        <Link href="/admin" className="font-display text-xl font-bold tracking-widest" style={{ color: '#F0E6FA' }}>
          코어로그 관리
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? "text-white"
                : ""
            }`}
            style={
              isActive(href, exact)
                ? { background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)' }
                : { color: '#B8A8D8' }
            }
            onMouseEnter={(e) => {
              if (!isActive(href, exact)) {
                e.currentTarget.style.background = 'rgba(100, 149, 237, 0.15)';
                e.currentTarget.style.color = '#D4C5E2';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(href, exact)) {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = '#B8A8D8';
              }
            }}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* 로그아웃 버튼 */}
      <div className="border-t px-3 py-4" style={{ borderColor: 'rgba(230, 230, 250, 0.15)' }}>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          style={{ color: '#B8A8D8' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.color = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = '#B8A8D8';
          }}
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  );
};
