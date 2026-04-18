"use client";

import { useState } from "react";

interface ReportShareProps {
  headline: string;
  title: string;
}

/**
 * 리포트 하단 공유 UI (PRD 6-6).
 * - 링크 복사 (Clipboard API)
 * - 카카오톡 / X(트위터) / 페이스북 공유
 */
export const ReportShare = ({ headline, title }: ReportShareProps) => {
  const [copied, setCopied] = useState(false);

  const getCurrentUrl = (): string =>
    typeof window === "undefined" ? "" : window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 미지원 환경 무시
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${title} — "${headline}"`);
    const url = encodeURIComponent(getCurrentUrl());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(getCurrentUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareKakao = async () => {
    // 카카오톡 공식 SDK 가 없을 때의 폴백 — 링크 복사 후 안내
    // TODO: [백엔드 연동] Kakao JavaScript SDK 초기화 후 Kakao.Share.sendDefault 로 교체
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      alert("링크가 복사되었어요. 카카오톡에 붙여넣어 공유해주세요.");
    } catch {
      alert("링크를 수동으로 복사해 카카오톡에 공유해주세요.");
    }
  };

  const buttonBase =
    "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-110";

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Share
      </p>

      <div className="flex items-center gap-3">
        {/* 링크 복사 */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="링크 복사"
          className={buttonBase}
          style={{
            backgroundColor: copied ? "#C4E8D4" : "rgba(255,255,255,0.85)",
            border: "1.5px solid rgba(74, 59, 92, 0.12)",
            color: copied ? "#2E7D32" : "#4A3B5C",
          }}
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>

        {/* 카카오톡 */}
        <button
          type="button"
          onClick={handleShareKakao}
          aria-label="카카오톡으로 공유"
          className={buttonBase}
          style={{
            backgroundColor: "#FEE500",
            border: "1.5px solid rgba(74, 59, 92, 0.08)",
          }}
        >
          <span className="text-base font-bold" style={{ color: "#3C1E1E" }}>
            K
          </span>
        </button>

        {/* X (Twitter) */}
        <button
          type="button"
          onClick={handleShareTwitter}
          aria-label="X(트위터)로 공유"
          className={buttonBase}
          style={{
            backgroundColor: "#000000",
            border: "1.5px solid rgba(74, 59, 92, 0.12)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={handleShareFacebook}
          aria-label="페이스북으로 공유"
          className={buttonBase}
          style={{
            backgroundColor: "#1877F2",
            border: "1.5px solid rgba(74, 59, 92, 0.12)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      </div>

      {copied && (
        <p className="text-xs text-[#2E7D32]" role="status">
          링크가 복사되었어요
        </p>
      )}
    </div>
  );
};
