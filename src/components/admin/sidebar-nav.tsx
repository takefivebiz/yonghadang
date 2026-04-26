"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, ClipboardList, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "매출 조회", icon: BarChart2, exact: true },
  { href: "/admin/order-list", label: "주문 내역", icon: ClipboardList, exact: false },
  { href: "/admin/user-list", label: "유저 관리", icon: Users, exact: false },
] as const;

export const SidebarNav = () => {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col border-r border-border bg-card">
      {/* 로고 */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/admin" className="font-display text-xl font-bold tracking-widest text-primary">
          코어로그 관리
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
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
    </aside>
  );
};
