"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCw } from "lucide-react";

/**
 * PRD 5.8 500 에러 페이지.
 * 서비스 일시적 오류 발생 시.
 *
 * TODO: [백엔드 연동] 500 에러 발생 시 관리자 텔레그램 알림 발송
 */
const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // 자동 재시도 (5초 후 한 번만)
  useEffect(() => {
    if (autoRetryCount === 0) {
      const timer = setTimeout(() => {
        setAutoRetryCount(1);
        setIsRetrying(true);
        reset();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [autoRetryCount, reset]);

  const handleRetry = () => {
    setIsRetrying(true);
    reset();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0F0420 0%, #1A0B3F 100%)",
      }}
    >
      {/* 배경 장식 */}
      <div
        className="pointer-events-none fixed top-1/4 left-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-1/3 right-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.12 }}
        aria-hidden="true"
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 max-w-md text-center">
        {/* 에러 아이콘 */}
        <div className="mb-6 flex justify-center">
          <div
            className="rounded-full p-4"
            style={{ background: "rgba(255, 107, 107, 0.1)" }}
          >
            <AlertCircle size={48} style={{ color: "#FF6B6B" }} />
          </div>
        </div>

        {/* 메시지 */}
        <h1
          className="mb-3 text-2xl font-bold"
          style={{ color: "#F0E6FA" }}
        >
          서비스에 일시적 오류가 발생했어요
        </h1>

        {/* 부제 */}
        <p
          className="mb-6 text-sm"
          style={{ color: "#B8A8D8" }}
        >
          잠시 후 다시 시도해주세요
        </p>

        {/* 안내 텍스트 */}
        <div
          className="mb-8 rounded-lg p-4 text-xs leading-relaxed"
          style={{
            background: "rgba(100, 149, 237, 0.1)",
            border: "1px solid rgba(100, 149, 237, 0.2)",
            color: "#D8C9E8",
          }}
        >
          {isRetrying ? (
            <p>페이지를 다시 로드하는 중입니다...</p>
          ) : (
            <>
              <p className="mb-2">
                몇 초 후 자동으로 새로고침을 시도하거나,
              </p>
              <p>아래 버튼을 눌러 지금 바로 시도할 수 있습니다.</p>
            </>
          )}
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: isRetrying
                ? "rgba(100, 149, 237, 0.3)"
                : "linear-gradient(135deg, #6495ED 0%, #A366FF 100%)",
            }}
          >
            <RotateCw size={16} className={isRetrying ? "animate-spin" : ""} />
            {isRetrying ? "재시도 중..." : "다시 시도"}
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all hover:bg-opacity-80"
            style={{
              background: "rgba(100, 149, 237, 0.15)",
              color: "#D8C9E8",
              border: "1px solid rgba(100, 149, 237, 0.3)",
            }}
          >
            메인으로
          </Link>
        </div>

        {/* 오류 정보 (개발 환경에서만 표시) */}
        {process.env.NODE_ENV === "development" && (
          <div
            className="mt-8 rounded-lg p-4 text-left text-xs"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 107, 107, 0.2)",
              color: "#FF6B6B",
            }}
          >
            <p className="font-mono mb-2">오류 정보:</p>
            <p className="text-xs break-words">{error.message}</p>
            {error.digest && (
              <p className="mt-2 text-xs opacity-60">ID: {error.digest}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
