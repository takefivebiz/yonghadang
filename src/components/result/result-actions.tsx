"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTENTS } from "@/lib/data/contents";

interface ResultActionsProps {
  contentId: string;
  // share_token 기반 공유 URL. null이면 공유 버튼 비활성 (로딩 중 또는 fetch 실패).
  shareToken: string | null;
}

const ResultActions = ({ contentId, shareToken }: ResultActionsProps) => {
  const [copyToast, setCopyToast] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION || "https://veil.app";
  // share_token이 없으면 공유 버튼 비활성
  const shareUrl = shareToken ? `${baseUrl}/share/${shareToken}` : null;

  // 카카오 공유
  const handleShareKakao = () => {
    if (!shareUrl) return;
    // TODO: [공유 기능] 카카오 SDK 연동
    window.open(shareUrl, "_blank");
  };

  // X 공유
  const handleShareX = () => {
    if (!shareUrl) return;
    const content = CONTENTS.find((c) => c.id === contentId);
    const shareText = content
      ? `${content.title.replace(/\n/g, " ")} ${content.subtitle}`
      : "내 에너지를 분석해봤어요";
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(xUrl, "_blank", "width=550,height=420");
  };

  // 링크 복사
  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    }
  };

  const btnStyle = shareUrl
    ? "opacity-50 hover:opacity-80"
    : "opacity-20 cursor-not-allowed";

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-3 space-y-8 mb-10">
      {/* 복사 완료 토스트 */}
      {copyToast && (
        <div
          data-testid="copy-toast"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in"
        >
          <div
            className="px-4 py-2 rounded-lg text-xs font-medium"
            style={{
              background: "rgba(209,109,172,0.2)",
              color: "rgba(209,109,172,0.9)",
              border: "1px solid rgba(209,109,172,0.3)",
            }}
          >
            링크가 복사되었어요
          </div>
        </div>
      )}

      {/* 공유 버튼들 */}
      <div className="flex items-center justify-center gap-2">
        {/* 카카오 */}
        <button
          data-testid="share-btn-kakao"
          onClick={handleShareKakao}
          disabled={!shareUrl}
          className={`p-3 transition-opacity duration-200 ${btnStyle}`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "rgba(249,249,229,0.7)" }}
          >
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.19 4.85 3.1 6.29-.13 1.61-.98 3.99-2.1 4.71 1.32-.39 3.85-1.24 5.57-2.71.73.12 1.5.18 2.33.18 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
          </svg>
        </button>

        {/* X */}
        <button
          data-testid="share-btn-x"
          onClick={handleShareX}
          disabled={!shareUrl}
          className={`p-3 transition-opacity duration-200 ${btnStyle}`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "rgba(249,249,229,0.7)" }}
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.947 6.75h-3.315l7.73-8.835L2.42 2.25h6.787l4.682 6.191 5.555-6.191zM17.15 18.75h1.828L5.293 3.75H3.32l13.83 15z" />
          </svg>
        </button>

        {/* 링크 복사 */}
        <button
          data-testid="share-btn-copy"
          onClick={handleCopyLink}
          disabled={!shareUrl}
          className={`p-3 transition-opacity duration-200 ${btnStyle}`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "rgba(249,249,229,0.7)" }}
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>

      {/* 다른 콘텐츠 보기 */}
      <div>
        <Link
          data-testid="other-contents-link"
          href="/"
          className="text-center block py-3 text-xs transition-opacity duration-200 opacity-40 hover:opacity-70"
          style={{ color: "rgba(249,249,229,0.6)" }}
        >
          다른 콘텐츠 보기
        </Link>
      </div>
    </div>
  );
};

export default ResultActions;
