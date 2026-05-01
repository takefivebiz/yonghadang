"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OrderStatus } from "@/types/order";

interface ReportStatusProps {
  orderId: string;
  initialStatus: OrderStatus;
  errorMessage?: string;
  /** status 가 "done" 으로 전환되면 호출 → 상위에서 리포트 뷰로 전환 */
  onDone: () => void;
}

/** 프로그레스 시각 효과 — 3초 간격 폴링 + 부드럽게 증가하는 퍼센트 */
const MAX_POLL_MS = 10 * 60 * 1000; // PRD 6-6: 최대 10분 타임아웃
const POLL_INTERVAL_MS = 3000;
/** 연속 fetch 실패가 이 횟수를 초과하면 네트워크 에러로 전환 */
const MAX_CONSECUTIVE_ERRORS = 3;

/**
 * PRD 6-6. AI 생성 상태 UI.
 * - pending / generating: 프로그레스 바 + 폴링
 * - error: 실패 안내 + 재시도/고객센터 링크
 * - timeout: 10분 초과 안내 (에러와 별도 분기)
 * - networkError: 연속 3회 fetch 실패 시 안내
 */
export const ReportStatus = ({
  orderId,
  initialStatus,
  errorMessage,
  onDone,
}: ReportStatusProps) => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [progress, setProgress] = useState(8);
  const [elapsedMs, setElapsedMs] = useState(0);
  /** 폴링 타임아웃(10분) 초과 여부 */
  const [isTimeout, setIsTimeout] = useState(false);
  /** 네트워크 불안정으로 인한 에러 여부 */
  const [isNetworkError, setIsNetworkError] = useState(false);
  /** 잘못된 세션(404) */
  const [isInvalidSession, setIsInvalidSession] = useState(false);
  /** 서버 에러(500) */
  const [isServerError, setIsServerError] = useState(false);
  const consecutiveErrorsRef = useRef(0);

  // 3초 간격 폴링 — 서버에서 status=done 으로 전환되면 상위에 알림
  useEffect(() => {
    if (status === "done" || status === "error") return;

    const start = Date.now();

    const poll = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/sessions/${orderId}/status`);

        // 상태 코드별 처리
        if (response.status === 404) {
          setIsInvalidSession(true);
          setStatus("error");
          clearInterval(poll);
          return;
        }

        if (response.status === 500) {
          setIsServerError(true);
          setStatus("error");
          return;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json() as { status: OrderStatus };
        // 성공 시 연속 에러 카운터 리셋
        consecutiveErrorsRef.current = 0;

        setElapsedMs(Date.now() - start);

        if (data.status === "done") {
          setStatus("done");
          onDone();
          return;
        }
        if (data.status === "error") {
          setStatus("error");
          return;
        }

        // 타임아웃 도달 — 에러로 전환하고 타임아웃 플래그 설정
        if (Date.now() - start > MAX_POLL_MS) {
          setIsTimeout(true);
          setStatus("error");
        }
      } catch {
        // 연속 실패 카운터 증가
        consecutiveErrorsRef.current += 1;
        if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
          setIsNetworkError(true);
          setStatus("error");
        }
      }
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(poll);
  }, [orderId, status, onDone]);

  // 프로그레스 자연스러운 시각 증가 — 실제 서버 상태와 무관한 UX 장치
  useEffect(() => {
    if (status !== "pending" && status !== "generating") return;

    const tick = window.setInterval(() => {
      setProgress((p) => (p >= 92 ? 92 : p + Math.random() * 3));
    }, 800);

    return () => window.clearInterval(tick);
  }, [status]);

  /** 페이지 이탈 없이 폴링을 재시작하는 재시도 핸들러 */
  const handleRetry = () => {
    consecutiveErrorsRef.current = 0;
    setIsTimeout(false);
    setIsNetworkError(false);
    setIsInvalidSession(false);
    setIsServerError(false);
    setProgress(8);
    setElapsedMs(0);
    // status를 pending으로 되돌려 폴링 useEffect 재실행
    setStatus("pending");
  };

  // ── 에러 메시지 분기 ───────────────────────────────────────
  const errorTitle = isInvalidSession
    ? "세션을 찾을 수 없어요"
    : isServerError
    ? "서버 오류가 발생했어요"
    : isTimeout
    ? "리포트 생성 시간이 초과됐어요"
    : isNetworkError
    ? "네트워크 연결이 불안정해요"
    : "리포트 생성에 실패했어요";

  const errorDesc = isInvalidSession
    ? "분석 세션을 찾을 수 없어요. 홈으로 돌아가 다시 분석해주세요."
    : isServerError
    ? "서버에 일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요."
    : isTimeout
    ? "10분이 지나도 리포트가 완성되지 않았어요. 잠시 후 다시 시도하시거나 고객센터로 문의해주세요."
    : isNetworkError
    ? "서버와의 연결이 3회 이상 실패했어요. 네트워크 상태를 확인 후 다시 시도해주세요."
    : (errorMessage ?? "AI 분석 중 일시적인 오류가 발생했어요. 다시 시도하시거나 고객센터로 문의해주세요.");

  // ── 에러 상태 ──────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="mx-auto w-full max-w-md py-20 text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #F5D7D7, #F5E0E0)",
            boxShadow: "0 8px 32px rgba(212, 165, 165, 0.3)",
          }}
          aria-hidden="true"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C04040"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 className="font-display mb-2 text-xl font-bold text-deep-purple">
          {errorTitle}
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {errorDesc}
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "#4A3B5C",
              color: "#F5F0E8",
              boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
            }}
          >
            다시 시도하기
          </button>
          <Link
            href="/"
            className="block w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // ── pending / generating 상태 ─────────────────────────────
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const progressPct = Math.min(Math.round(progress), 99);

  return (
    <div className="mx-auto w-full max-w-md py-16 text-center">
      {/* 심플한 스피너 */}
      <div className="mb-8 flex items-center justify-center">
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .spinner-spin { animation: spin 2.5s linear infinite; }
        `}</style>
        <div className="relative h-20 w-20" aria-hidden="true">
          {/* 회전 링 */}
          <svg className="spinner-spin absolute inset-0 h-full w-full" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#A366FF" strokeWidth="2.5" opacity="0.2" />
            <circle cx="40" cy="40" r="35" fill="none" stroke="url(#spinGradReport)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="55 220" />
            <defs>
              <linearGradient id="spinGradReport" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#F5D7E8"}} />
                <stop offset="100%" style={{stopColor: "#A366FF"}} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <h2 className="font-display mb-2 text-xl font-bold text-deep-purple md:text-2xl">
        당신만의 리포트를 생성하고 있어요
      </h2>
      <p className="mb-10 text-sm text-muted-foreground">
        AI가 데이터를 분석하는 중입니다
        <br />
        보통 3분 이내에 완료돼요
      </p>

      {/* 프로그레스 바 */}
      <div className="mb-4">
        <style>{`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .progress-shimmer {
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>
        <div
          className="relative h-3 w-full overflow-hidden rounded-full"
          style={{
            backgroundColor: "rgba(74, 59, 92, 0.15)",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 8px rgba(196, 174, 216, 0.2)",
          }}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full progress-shimmer transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #C4AED8, #F5D7E8, #C4AED8, #F5D7E8)",
              boxShadow: `0 0 16px #F5D7E8, inset 0 1px 2px rgba(255, 255, 255, 0.4)`,
              backgroundPosition: "-1000px 0",
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{progressPct}%</span>
        <span>{elapsedSec}초 경과</span>
      </div>

      {/* 진행 단계 안내 */}
      <ul className="mt-10 space-y-2 text-left">
        {["입력 정보 분석", "AI 해석 생성", "리포트 정리"].map((step, i) => {
          const active = progressPct > i * 33;
          return (
            <li
              key={i}
              className="flex items-center gap-3 text-sm"
              style={{ color: active ? "#4A3B5C" : "#9B88AC" }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                style={{
                  backgroundColor: active
                    ? "#F5D7E8"
                    : "rgba(74, 59, 92, 0.08)",
                  color: active ? "#4A3B5C" : "#9B88AC",
                }}
                aria-hidden="true"
              >
                {active ? "✓" : i + 1}
              </span>
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
