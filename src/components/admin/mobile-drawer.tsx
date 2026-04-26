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
        className="p-2 text-foreground/80 transition-colors hover:text-foreground"
      >
        <Menu size={22} />
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* 드로어 패널 — 좌측에서 슬라이드 */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-card shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link
            href="/admin"
            onClick={close}
            className="font-display text-lg font-bold tracking-widest text-primary"
          >
            코어로그 관리
          </Link>
          <button
            onClick={close}
            aria-label="메뉴 닫기"
            className="p-2 text-foreground/80 hover:text-foreground"
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              }`}
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
