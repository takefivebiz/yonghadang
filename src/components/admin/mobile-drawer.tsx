"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BarChart2,
  ClipboardList,
  Users,
  TrendingUp,
  FileText,
  Repeat2,
  History,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "매출 조회", icon: BarChart2, exact: true },
  {
    href: "/admin/order-list",
    label: "주문 내역",
    icon: ClipboardList,
    exact: false,
  },
  { href: "/admin/user-list", label: "유저 관리", icon: Users, exact: false },
  {
    href: "/admin/questions",
    label: "질문 분석",
    icon: TrendingUp,
    exact: false,
  },
  {
    href: "/admin/reports",
    label: "리포트 분석",
    icon: FileText,
    exact: false,
  },
  {
    href: "/admin/loops",
    label: "탐색 루프 분석",
    icon: Repeat2,
    exact: false,
  },
  {
    href: "/admin/question-logs",
    label: "질문 로그",
    icon: History,
    exact: false,
  },
] as const;

export const AdminMobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* 메뉴 열기 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
        className="p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEAEDB]/50"
        style={{ color: "rgba(255, 255, 255, 0.6)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
        }}
      >
        <Menu size={22} />
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm transition-all"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={close}
        />
      )}

      {/* 드로어 패널 — 모바일/태블릿 최적화 */}
      <div
        className={`fixed left-0 top-0 z-50 h-dvh w-[70vw] max-w-[280px] transition-transform duration-300 shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #1a0f35a6 0%, #2d1b4ebe 100%)",
        }}
      >
        {/* 헤더 */}
        <div
          className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(230, 230, 250, 0.2)" }}
        >
          <Link
            href="/admin"
            onClick={close}
            className="font-display text-base sm:text-lg font-bold tracking-widest transition-colors hover:text-[#E0D4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEAEDB]/50 rounded px-1"
            style={{ color: "#F0E6FA" }}
          >
            코어로그
          </Link>
          <button
            onClick={close}
            aria-label="메뉴 닫기"
            className="p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEAEDB]/50 rounded"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 네비게이션 */}
        <nav
          className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-3 py-3 sm:py-4"
          style={{
            background: "rgba(39, 19, 70, 0.064)",
            borderTop: "1px solid rgba(230, 230, 250, 0.1)",
            borderBottom: "1px solid rgba(230, 230, 250, 0.1)",
          }}
        >
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A366FF]/60 whitespace-nowrap sm:whitespace-normal`}
                style={
                  isActive(href, exact)
                    ? {
                        background:
                          "linear-gradient(135deg, #6495ED 0%, #A366FF 100%)",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 12px rgba(164, 102, 255, 0.25)",
                      }
                    : {
                        background: "rgba(31, 30, 84, 0.631)",
                        color: "#F0E6FA",
                        border: "1px solid rgba(230, 230, 250, 0.25)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive(href, exact)) {
                    e.currentTarget.style.background =
                      "rgba(100, 149, 237, 0.2)";
                    e.currentTarget.style.color = "#F0E6FA";
                    e.currentTarget.style.borderColor =
                      "rgba(230, 230, 250, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(href, exact)) {
                    e.currentTarget.style.background =
                      "rgba(100, 149, 237, 0.2)";
                    e.currentTarget.style.color = "#F0E6FA";
                    e.currentTarget.style.borderColor =
                      "rgba(230, 230, 250, 0.25)";
                  }
                }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden text-base">{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* 푸터 */}
        <div
          className="px-4 py-2 sm:py-3 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(230, 230, 250, 0.15)" }}
        >
          <p className="text-xs text-center" style={{ color: "#9B8BB5" }}>
            관리자 패널
          </p>
        </div>
      </div>
    </>
  );
};
