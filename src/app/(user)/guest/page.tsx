"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserSessions,
  DUMMY_SESSION_ANSWERS,
} from "@/lib/data/dummy-sessions";
import { DUMMY_CONTENTS } from "@/lib/data/dummy-contents";
import { simulateGuestVerification } from "@/lib/data/dummy-guest-credentials";
import { formatDate, formatCategoryName } from "@/lib/utils";
import type { AnalyzeAnswers } from "@/lib/types/analyze";

type Step = 1 | 2;

interface GuestSessionInfo {
  session_id: string;
  content_id: string;
  content_title: string;
  category: string;
  created_at: string;
  view_state: string;
}

export default function GuestPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<GuestSessionInfo[]>([]);
  const [guestId, setGuestId] = useState<string>("");
  const [fadeOut, setFadeOut] = useState(false);

  // 전화번호 포맷팅 (010-1234-5678)
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
    setError("");
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
    setError("");
  };

  const getViewState = (): string => {
    // TODO: [백엔드 연동] 실제 열람 상태를 서버에서 조회
    // 현재는 더미: 모든 세션을 "장면 2까지 열람"으로 표시
    return "장면 2까지 열람";
  };

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);

    try {
      // TODO: [백엔드 연동] 더미 함수를 실제 POST /api/guest/verify 호출로 교체
      const phoneDigits = phone.replace(/\D/g, "");
      const result = simulateGuestVerification(phoneDigits, pin);

      if (!result.success) {
        setError("전화번호 또는 비밀번호가 일치하지 않습니다.");
        setIsLoading(false);
        return;
      }

      const verifiedGuestId = result.guest_id!;
      setGuestId(verifiedGuestId);

      // 비회원이 접근 가능한 세션 목록 조회
      const userSessions = getUserSessions(null, verifiedGuestId);

      if (userSessions.length === 0) {
        setError("조회 가능한 기록이 없습니다.");
        setIsLoading(false);
        return;
      }

      // 세션 정보 구성
      const sessionInfos: GuestSessionInfo[] = userSessions.map((session) => {
        const content = DUMMY_CONTENTS.find((c) => c.id === session.content_id);
        return {
          session_id: session.id,
          content_id: session.content_id,
          content_title: content?.title || "제목 없음",
          category: content?.category || "unknown",
          created_at: session.created_at,
          view_state: getViewState(),
        };
      });

      setSessions(sessionInfos);

      // Step 2로 fade 전환
      setFadeOut(true);
      setTimeout(() => {
        setStep(2);
        setFadeOut(false);
      }, 300);
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    // TODO: [백엔드 연동] 실제 세션 데이터를 서버에서 조회해서 localStorage에 저장
    if (typeof window !== "undefined") {
      const userSession = getUserSessions(null, guestId).find(
        (s) => s.id === sessionId,
      );
      if (userSession) {
        const answers = DUMMY_SESSION_ANSWERS[sessionId] || [];
        const analyzeData: AnalyzeAnswers = {
          session_id: sessionId,
          content_id: userSession.content_id,
          free_input: answers[0]?.answer_text || "",
          answers,
          created_at: userSession.created_at,
        };
        localStorage.setItem(
          `veil_analysis_${sessionId}`,
          JSON.stringify(analyzeData),
        );
        sessionStorage.setItem("guest_token", guestId);
      }
    }

    router.push(`/result/${sessionId}`);
  };

  const handleBack = () => {
    setFadeOut(true);
    setTimeout(() => {
      setStep(1);
      setFadeOut(false);
      setSessions([]);
      setGuestId("");
      setPhone("");
      setPin("");
    }, 300);
  };

  return (
    <div className="flex min-h-[750px] items-start justify-center px-6 pt-17 pb-32">
      <div className="w-full max-w-md">
        <div
          className={`transition-opacity duration-300 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {step === 1 ? (
            <StepOne
              phone={phone}
              pin={pin}
              error={error}
              isLoading={isLoading}
              onPhoneChange={handlePhoneChange}
              onPinChange={handlePinChange}
              onVerify={handleVerify}
            />
          ) : (
            <StepTwo
              sessions={sessions}
              onSelectSession={handleSelectSession}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: 인증 ──────────────────────────────────────────────────
function StepOne({
  phone,
  pin,
  error,
  isLoading,
  onPhoneChange,
  onPinChange,
  onVerify,
}: {
  phone: string;
  pin: string;
  error: string;
  isLoading: boolean;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
}) {
  const isValid = /^010-\d{4}-\d{4}$/.test(phone) && pin.length === 4;

  return (
    <>
      <style>{`
        .veil-guest-input::placeholder {
          color: rgba(249, 249, 229, 0.2);
        }
        .veil-guest-input:focus {
          background-color: rgba(209, 109, 172, 0.12);
          border-color: rgba(209, 109, 172, 0.4);
        }
      `}</style>
      <div className="space-y-12">
        {/* 제목 */}
        <div className="space-y-2 sm:space-y-3 text-center">
          {/* 아이콘 */}
          <div className="flex justify-center mb-3">
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
                stroke="rgba(209, 109, 172, 0.6)"
                strokeWidth="1.5"
              />
              <path
                d="M 8 22 Q 8 18 16 18 Q 24 18 24 22 L 24 26 Q 24 27 23 27 L 9 27 Q 8 27 8 26 Z"
                stroke="rgba(209, 109, 172, 0.6)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-semibold leading-tight"
            style={{ color: "#d16daccc" }}
          >
            비회원 <span style={{ color: "#f9f9e5d8" }}>조회</span>
            <br />
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#f9f9e57a" }}>
            이전에 입력했던 정보로 확인할 수 있어요
          </p>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-7 mx-auto w-[85%]">
          {/* 전화번호 */}
          <div className="space-y-2">
            <label
              className="block text-xs font-normal"
              style={{ color: "rgba(249, 249, 229, 0.6)" }}
            >
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={onPhoneChange}
              placeholder="010-0000-0000"
              disabled={isLoading}
              className="veil-guest-input w-full rounded px-4 py-3 text-sm transition-colors duration-200 focus:outline-none"
              style={{
                backgroundColor: "rgba(209, 109, 172, 0.08)",
                border: "1px solid rgba(209, 109, 172, 0.285)",
                color: "rgba(249, 249, 229, 0.85)",
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? "not-allowed" : "text",
              }}
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label
              className="block text-xs font-normal"
              style={{ color: "rgba(249, 249, 229, 0.6)" }}
            >
              비밀번호 (4자리)
            </label>
            <input
              type="password"
              value={pin}
              onChange={onPinChange}
              placeholder="••••"
              inputMode="numeric"
              disabled={isLoading}
              maxLength={4}
              className="veil-guest-input w-full rounded px-4 py-3 text-sm transition-colors duration-200 focus:outline-none"
              style={{
                backgroundColor: "rgba(209, 109, 172, 0.08)",
                border: "1px solid rgba(209, 109, 172, 0.285)",
                color: "rgba(249, 249, 229, 0.85)",
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? "not-allowed" : "text",
              }}
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div
            className="text-sm leading-relaxed"
            style={{ color: "rgba(249, 249, 229, 0.6)" }}
          >
            {error}
          </div>
        )}

        {/* 버튼 */}
        <button
          onClick={onVerify}
          disabled={!isValid || isLoading}
          className="mx-auto block w-[85%] py-3 px-4 text-sm font-normal rounded transition-all duration-200 -mt-2 -mb-32"
          style={{
            backgroundColor:
              isValid && !isLoading
                ? "rgba(209, 109, 172, 0.422)"
                : "rgba(209, 109, 172, 0.102)",
            color:
              isValid && !isLoading
                ? "rgba(249, 249, 229, 0.85)"
                : "rgba(249, 249, 229, 0.32)",
            cursor: isValid && !isLoading ? "pointer" : "not-allowed",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "확인 중..." : "확인"}
        </button>
      </div>
    </>
  );
}

// ── Step 2: 기록 선택 ────────────────────────────────────────────────
function StepTwo({
  sessions,
  onSelectSession,
  onBack,
}: {
  sessions: GuestSessionInfo[];
  onSelectSession: (sessionId: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="space-y-2">
        <h2
          className="text-2xl font-semibold leading-tight"
          style={{ color: "rgba(249, 249, 229, 0.85)" }}
        >
          지난 기록
        </h2>
      </div>

      {/* 기록 목록 */}
      <div className="space-y-5">
        {sessions.map((session) => (
          <div
            key={session.session_id}
            onClick={() => onSelectSession(session.session_id)}
            className="group cursor-pointer transition-opacity duration-200 hover:opacity-70"
          >
            <div
              className="space-y-2 pb-5"
              style={{ borderBottom: "1px solid rgba(209, 109, 172, 0.15)" }}
            >
              <h3
                className="text-sm font-normal leading-snug whitespace-pre-wrap"
                style={{ color: "rgba(249, 249, 229, 0.85)" }}
              >
                {session.content_title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-x-3 flex items-center text-xs">
                  <span style={{ color: "rgba(249, 249, 229, 0.5)" }}>
                    {formatCategoryName(session.category)}
                  </span>
                  <span style={{ color: "rgba(249, 249, 229, 0.3)" }}>•</span>
                  <span style={{ color: "rgba(249, 249, 229, 0.5)" }}>
                    {formatDate(session.created_at)}
                  </span>
                </div>
              </div>
              <p
                className="text-xs font-normal"
                style={{ color: "rgba(249, 249, 229, 0.4)" }}
              >
                {session.view_state}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack}
        className="w-full py-3 px-4 text-sm font-normal transition-colors duration-200"
        style={{ color: "rgba(249, 249, 229, 0.4)" }}
      >
        다시 입력
      </button>
    </div>
  );
}
