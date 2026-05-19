"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountManagementModal = ({
  isOpen,
  onClose,
}: AccountManagementModalProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteAccount = async () => {
    try {
      // TODO: [백엔드 연동] DELETE /api/profiles/me 호출
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/";
      }
    } catch {
      // 오류 처리
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-lg border border-accent/15 bg-background/80 p-6 pb-8">
          {/* 타이틀 섹션 */}
          <div className="mb-12 space-y-3 text-center">
            {/* 아이콘 */}
            <div className="mb-3 flex justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="16"
                  cy="10"
                  r="4"
                  stroke="rgba(143, 122, 216, 0.58)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 8 22 Q 8 18 16 18 Q 24 18 24 22 L 24 26 Q 24 27 23 27 L 9 27 Q 8 27 8 26 Z"
                  stroke="rgba(143, 122, 216, 0.58)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
              계정
              <span style={{ color: "rgba(143, 122, 216, 0.85)" }}>삭제</span>
            </h2>
            <p className="text-xs text-highlight/50">
              계정을 삭제하면 지난 기록이 영구 삭제돼
            </p>
          </div>

          {/* 계정 삭제 섹션 */}
          <div className="mb-12">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full rounded-md border border-accent/15 px-4 py-3 text-xs font-medium text-highlight/70 transition-colors hover:border-accent/28 hover:text-highlight"
              >
                계정 삭제
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-highlight/70">
                  정말 삭제할까? 이 작업은 되돌릴 수 없어
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-xs font-medium text-accent/80 transition-all hover:bg-accent/16"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-md border border-accent/15 px-4 py-3 text-xs font-medium text-highlight/70 transition-colors hover:border-accent/28 hover:text-highlight"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 닫기 버튼 */}
          <div className="border-t border-accent/10 pt-6">
            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-medium text-highlight/50 transition-colors hover:text-highlight"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default AccountManagementModal;
