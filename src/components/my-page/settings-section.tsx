"use client";

import { useState } from "react";
import AccountManagementModal from "./account-management-modal";
const SettingsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    // 서버 Route Handler에서 signOut → httpOnly refresh_token 쿠키까지 만료
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <section className="space-y-2">
        {/* 계정 관리 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="block w-full rounded-lg border border-surface/30 bg-surface/20 p-3 transition-all hover:border-accent/40 hover:bg-surface/40"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* 설정 아이콘 */}
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-md bg-surface/30">
                <svg className="w-5 h-5 text-highlight/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              {/* 텍스트 */}
              <p className="text-sm font-medium text-highlight">
                계정 관리
              </p>
            </div>

            {/* 우측 화살표 */}
            <div className="shrink-0">
              <svg className="w-4 h-4 text-highlight/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="block w-full rounded-lg border border-surface/30 bg-surface/20 p-3 transition-all hover:border-accent/40 hover:bg-surface/40"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* 로그아웃 아이콘 */}
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-md bg-surface/30">
                <svg className="w-5 h-5 text-highlight/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>

              {/* 텍스트 */}
              <p className="text-sm font-medium text-highlight">
                로그아웃
              </p>
            </div>

            {/* 우측 화살표 */}
            <div className="shrink-0">
              <svg className="w-4 h-4 text-highlight/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </section>

      {/* 계정 관리 모달 */}
      <AccountManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default SettingsSection;
