"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BarChart2, ClipboardList, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "매출 조회", icon: BarChart2, exact: true },
  { href: "/admin/order-list", label: "주문 내역", icon: ClipboardList, exact: false },
  { href: "/admin/user-list", label: "유저 관리", icon: Users, exact: false },
] as const;

export const AdminMobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
        className="p-2 transition-colors"
        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
        }}
      >
        <Menu size={22} />
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm transition-all"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={close}
        />
      )}

      {/* 드로어 패널 — 좌측에서 슬라이드 */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 transition-transform duration-300 shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: 'rgba(27, 0, 63, 0.95)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex h-16 items-center justify-between px-5" style={{ borderBottom: '1px solid rgba(230, 230, 250, 0.15)' }}>
          <Link
            href="/admin"
            onClick={close}
            className="font-display text-lg font-bold tracking-widest"
            style={{ color: '#F0E6FA' }}
          >
            코어로그 관리
          </Link>
          <button
            onClick={close}
            aria-label="메뉴 닫기"
            className="p-2 transition-colors"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors`}
              style={
                isActive(href, exact)
                  ? { background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)', color: '#FFFFFF' }
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
      </div>
    </>
  );
};
