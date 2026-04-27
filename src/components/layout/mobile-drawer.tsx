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
        className="p-2 transition-colors"
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

      {/* 드로어 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm transition-all"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={close}
        />
      )}

      {/* 드로어 패널 — 위에서 아래로 슬라이드 */}
      <div
        className={`fixed left-0 top-0 z-50 w-full shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: "rgba(27, 0, 63, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* 드로어 헤더 */}
        <div
          className="flex h-16 items-center justify-between px-5"
          style={{ borderBottom: "1px solid rgba(230, 230, 250, 0.15)" }}
        >
          <Link
            href="/"
            onClick={close}
            className="font-display text-lg font-bold tracking-widest"
            style={{ color: "#F0E6FA" }}
          >
            Corelog
          </Link>
          <button
            onClick={close}
            aria-label="메뉴 닫기"
            className="p-2 transition-colors"
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

        {/* 메뉴 항목 */}
        <nav
          className="flex flex-col gap-1 px-3 py-4"
          style={{
            borderTop: "1px solid rgba(230, 230, 250, 0.1)",
          }}
        >
          <MobileDrawerAuthNav onClose={close} />
        </nav>
      </div>
    </>
  );
};
