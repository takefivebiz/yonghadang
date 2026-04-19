"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MobileDrawerAuthNav } from "./mobile-drawer-auth-nav";

export const MobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
        className="p-2 text-foreground/80 transition-colors hover:text-foreground"
      >
        <Menu size={22} />
      </button>

      {/* 드로어 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* 드로어 패널 — 위에서 아래로 슬라이드 */}
      <div
        className={`fixed left-0 top-0 z-50 w-full bg-background/95 shadow-lg backdrop-blur-md transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* 드로어 헤더 */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            onClick={close}
            className="font-display text-xl font-bold tracking-widest text-primary"
          >
            용하당
          </Link>
          <button
            onClick={close}
            aria-label="메뉴 닫기"
            className="p-2 text-foreground/80 transition-colors hover:text-foreground"
          >
            <X size={22} />
          </button>
        </div>

        {/* 메뉴 항목 */}
        <nav className="flex flex-col border-t border-border/40 px-4 py-4">
          <MobileDrawerAuthNav onClose={close} />
        </nav>
      </div>
    </>
  );
};
