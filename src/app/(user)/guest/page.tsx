"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatCategoryName } from "@/lib/utils";
import type { AnalyzeAnswers } from "@/lib/types/analyze";
import type { ResultScene } from "@/lib/types/result";
import type { GuestSessionData, GuestVerifyResponse } from "@/app/api/guest/verify/route";

type Step = 1 | 2;

// Step 2 목록 표시용 (무거운 scenes/answers는 제외)
interface GuestSessionInfo {
  session_id: string;
  content_title: string;
  category: string;
  created_at: string;
  unlocked_count: number;
}

export default function GuestPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<GuestSessionInfo[]>([]);
  // 세션 선택 시 localStorage 채우기 위한 전체 데이터 보관
  const [apiSessions, setApiSessions] = useState<GuestSessionData[]>([]);
  const [guestId, setGuestId] = useState<string>("");
  const [fadeOut, setFadeOut] = useState(false);

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

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/guest/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ""), pin }),
      });

      const data = (await res.json()) as
        | GuestVerifyResponse
        | { error: string };

      if (!res.ok) {
        setError(
          (data as { error: string }).error ??
            "전화번호 또는 비밀번호가 일치하지 않아",
        );
        return;
      }

      const result = data as GuestVerifyResponse;

      if (result.sessions.length === 0) {
        setError("조회 가능한 기록이 없어");
        return;
      }

      setGuestId(result.guest_id);
      setApiSessions(result.sessions);

      const sessionInfos: GuestSessionInfo[] = result.sessions.map((s) => ({
        session_id: s.session_id,
        content_title: s.content_title,
        category: s.content_category,
        created_at: s.created_at,
        unlocked_count: s.unlocked_scene_indexes.length,
      }));
      setSessions(sessionInfos);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("guest_id", result.guest_id);
      }

      setFadeOut(true);
      setTimeout(() => {
        setStep(2);
        setFadeOut(false);
      }, 300);
    } catch {
      setError("오류가 발생했어. 다시 시도해줘");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    const sessionData = apiSessions.find((s) => s.session_id === sessionId);
    if (!sessionData || typeof window === "undefined") return;

    // ── localStorage 채우기 ────────────────────────────────────────────
    const analyzeData: AnalyzeAnswers = {
      session_id: sessionData.session_id,
      content_id: sessionData.content_id,
      free_input: sessionData.free_input,
      answers: sessionData.answers,
      created_at: sessionData.created_at,
    };
    localStorage.setItem(
      `veil_analysis_${sessionId}`,
      JSON.stringify(analyzeData),
    );

    // 유료씬 unlock 여부에 따라 캐시 키 분기
    const hasPaidUnlocked = sessionData.scenes.some(
      (sc: ResultScene) => !sc.is_free && sc.messages !== null,
    );
    if (hasPaidUnlocked) {
      localStorage.setItem(
        `veil_all_scenes_${sessionId}`,
        JSON.stringify(sessionData.scenes),
      );
    } else {
      const freeScenes = sessionData.scenes.filter((sc: ResultScene) => sc.is_free);
      localStorage.setItem(
        `veil_free_scenes_${sessionId}`,
        JSON.stringify(freeScenes),
      );
    }

    localStorage.setItem(
      `veil_unlocked_scenes_${sessionId}`,
      JSON.stringify(sessionData.unlocked_scene_indexes),
    );

    sessionStorage.setItem("guest_token", guestId);

    const redirectTo = sessionStorage.getItem("redirect_to");
    if (redirectTo) {
      sessionStorage.removeItem("redirect_to");
      window.location.href = redirectTo;
    } else {
      window.location.href = `/result/${sessionId}`;
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("guest_id");
      sessionStorage.removeItem("guest_token");
    }

    setFadeOut(true);
    setTimeout(() => {
      setStep(1);
      setFadeOut(false);
      setSessions([]);
      setApiSessions([]);
      setGuestId("");
      setPhone("");
      setPin("");
    }, 300);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden flex min-h-[750px] items-start justify-center px-6 pt-17 pb-32">
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
              router={router}
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
            이전에 입력했던 정보로 확인할 수 있어
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
              className="veil-guest-input w-full rounded px-4 py-3 text-[16px] transition-colors duration-200 focus:outline-none"
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
              className="veil-guest-input w-full rounded px-4 py-3 text-[16px] transition-colors duration-200 focus:outline-none"
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
            className="text-xs leading-relaxed text-center"
            style={{ color: "rgba(249, 249, 229, 0.5)" }}
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
  router,
}: {
  sessions: GuestSessionInfo[];
  onSelectSession: (sessionId: string) => void;
  onBack: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="space-y-12">
      {/* 헤더 */}
      <div className="space-y-2 sm:space-y-3 text-center">
        {/* 아이콘 */}
        <div className="flex justify-center mb-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 8 10 L 16 4 L 24 10 L 24 26 Q 24 27 23 27 L 9 27 Q 8 27 8 26 Z"
              stroke="rgba(209, 109, 172, 0.6)"
              strokeWidth="1.5"
              fill="none"
            />
            <line
              x1="16"
              y1="14"
              x2="16"
              y2="22"
              stroke="rgba(209, 109, 172, 0.6)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-semibold leading-tight"
          style={{ color: "#d16daccc" }}
        >
          지난 <span style={{ color: "#f9f9e5d8" }}>기록</span>
          <br />
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#f9f9e57a" }}>
          입력했던 정보로 확인된 결과야
        </p>
      </div>

      {/* 기록 목록 */}
      <div className="space-y-2 mx-auto w-[95%]">
        {sessions.map((session) => (
          <div
            key={session.session_id}
            data-testid="guest-session-item"
            onClick={() => onSelectSession(session.session_id)}
            className="cursor-pointer transition-all duration-200 rounded-lg px-3 py-4"
            style={{
              backgroundColor: "rgba(209, 109, 172, 0.06)",
              border: "1px solid rgba(209, 109, 172, 0.10)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(209, 109, 172, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(209, 109, 172, 0.06)";
            }}
          >
            <h3
              className="text-sm font-normal leading-snug line-clamp-2 mb-3"
              style={{ color: "rgba(249, 249, 229, 0.85)" }}
            >
              {session.content_title}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span style={{ color: "rgba(249, 249, 229, 0.4)" }}>
                {formatCategoryName(session.category)}
              </span>
              <span style={{ color: "rgba(249, 249, 229, 0.2)" }}>•</span>
              <span style={{ color: "rgba(249, 249, 229, 0.4)" }}>
                {formatDate(session.created_at)}
              </span>
              <span style={{ color: "rgba(249, 249, 229, 0.2)" }}>•</span>
              <span style={{ color: "rgba(249, 249, 229, 0.3)" }}>
                {`장면 ${session.unlocked_count}개 열람`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3 mx-auto w-[95%]">
        <button
          onClick={() => router.push("/")}
          className="w-full cursor-pointer transition-all duration-200 rounded-lg px-3 py-3 text-center text-xs font-normal"
          style={{
            backgroundColor: "transparent",
            border: "1px solid rgba(209, 109, 172, 0.25)",
            color: "rgba(209, 109, 172, 0.638)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(209, 109, 172, 0.497)";
            e.currentTarget.style.color = "rgba(209, 109, 172, 0.821)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(209, 109, 172, 0.25)";
            e.currentTarget.style.color = "rgba(209, 109, 172, 0.6)";
          }}
        >
          다른 콘텐츠 보기
        </button>
        <div className="text-center">
          <button
            onClick={onBack}
            className="text-xs font-normal transition-colors duration-200"
            style={{ color: "rgba(249, 249, 229, 0.3)" }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
