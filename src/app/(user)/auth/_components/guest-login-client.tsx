"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listAllOrders } from "@/lib/dummy-orders";
import { loginAsGuest, grantGuestAccess } from "@/lib/report-access";

type GuestLoginPhase = "idle" | "verifying";

/**
 * PRD 6-9. 비회원 주문 조회 로그인 (/guest-login)
 * - 전화번호 + 비밀번호 입력 폼
 * - "주문 조회" 버튼으로 해당 주문 목록 검증
 * - 성공 시 /guest-check 페이지로 이동 및 게스트 세션 설정
 *
 * TODO: [백엔드 연동] /api/guests/verify 로 교체
 */
export const GuestLoginClient = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phase, setPhase] = useState<GuestLoginPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  // 입력값 한국식 하이픈 포맷팅 (010-1234-5678)
  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "verifying") return;

    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^01[016789]\d{7,8}$/.test(phoneDigits)) {
      setError("올바른 휴대폰번호를 입력해주세요");
      return;
    }
    if (password.length < 1) {
      setError("비밀번호를 입력해주세요");
      return;
    }

    setError(null);
    setPhase("verifying");

    // 로딩 UX를 자연스럽게 하기 위한 딜레이
    window.setTimeout(() => {
      // 주어진 전화번호 + 비밀번호로 비회원 주문 검증
      const allOrders = listAllOrders();
      const matchingOrders = allOrders.filter((order) => {
        if (order.ownerType !== "guest") return false;
        const normalize = (v: string): string => v.replace(/\D/g, "");
        return (
          normalize(order.phoneNumber ?? "") === normalize(phoneDigits) &&
          order.password === password
        );
      });

      if (matchingOrders.length === 0) {
        setError("입력하신 정보와 일치하는 주문이 없어요. 다시 확인해주세요.");
        setPhase("idle");
        return;
      }

      // 게스트 세션 설정 + 각 주문에 대해 열람 권한 부여
      loginAsGuest(phoneDigits);
      matchingOrders.forEach((order) => {
        grantGuestAccess(order.id);
      });
      router.push(`/guest-check`);
    }, 600);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── 배경 — 파스텔 라벤더 그라디언트 ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 55%, #F5F0E8 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.35 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-72 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.3 }}
      />

      {/* 신비로운 별/달 장식 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[45vh]"
      >
        <span className="absolute left-[10%] top-[20%] text-2xl opacity-20">
          ✦
        </span>
        <span className="absolute right-[12%] top-[28%] text-3xl opacity-20">
          🌙
        </span>
        <span className="absolute left-[78%] top-[10%] text-lg opacity-20">
          ✦
        </span>
        <span className="absolute left-[22%] top-[58%] text-xl opacity-15">
          ✦
        </span>
      </div>

      <div
        className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-stretch justify-center px-4 py-12"
        style={{ animation: "authFadeIn 0.6s ease-out" }}
      >
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <p className="font-display mb-2 text-xs uppercase tracking-[0.3em] text-[#9B88AC]">
            Order Lookup
          </p>
          <h1 className="font-display text-2xl font-bold text-[#4A3B5C] sm:text-3xl">
            주문 내역 조회
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4A3B5C]/70">
            결제 시 등록한 휴대폰번호와 비밀번호로
            <br />
            주문 내역을 확인해보세요.
          </p>
        </header>

        {/* 로그인 카드 */}
        <section
          aria-labelledby="guest-login-heading"
          className="relative overflow-hidden rounded-3xl border border-[#E8D4F0] bg-white px-6 py-8 shadow-sm sm:px-8"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 55%, #F9F2FB 100%)",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-5 text-5xl opacity-10"
          >
            ✦
          </span>

          <h2 id="guest-login-heading" className="sr-only">
            비회원 주문 조회
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 휴대폰번호 */}
            <div>
              <label
                htmlFor="guest-phone"
                className="mb-2 block text-sm font-medium text-foreground/80"
              >
                휴대폰번호 <span className="text-rose-400">*</span>
              </label>
              <input
                id="guest-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value));
                  if (error) setError(null);
                }}
                placeholder="010-0000-0000"
                className="w-full rounded-xl border px-4 py-3 text-sm text-foreground outline-none transition-colors"
                style={{
                  borderColor: "rgba(74, 59, 92, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                }}
                required
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label
                htmlFor="guest-password"
                className="mb-2 block text-sm font-medium text-foreground/80"
              >
                비밀번호 <span className="text-rose-400">*</span>
              </label>
              <input
                id="guest-password"
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="결제 시 설정한 비밀번호"
                className="w-full rounded-xl border px-4 py-3 text-sm text-foreground outline-none transition-colors"
                style={{
                  borderColor: "rgba(74, 59, 92, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                }}
                required
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p
                className="rounded-xl px-3 py-2 text-xs"
                style={{
                  backgroundColor: "rgba(212, 165, 165, 0.15)",
                  color: "#C04040",
                }}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={phase === "verifying"}
              className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={
                phase === "verifying"
                  ? {
                      backgroundColor: "rgba(74, 59, 92, 0.12)",
                      color: "#9B88AC",
                      cursor: "not-allowed",
                    }
                  : {
                      backgroundColor: "#4A3B5C",
                      color: "#F5F0E8",
                      boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
                    }
              }
            >
              {phase === "verifying" ? "조회 중..." : "주문 조회 ✦"}
            </button>

            <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
              휴대폰번호나 비밀번호가 기억나지 않으시면
              <br />
              고객센터로 문의해주세요.
            </p>
          </form>
        </section>

        {/* 회원 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#4A3B5C]/60">
            계정이 있으신가요?{" "}
            <Link
              href="/auth"
              className="font-semibold text-[#4A3B5C] underline-offset-2 hover:underline"
            >
              로그인 / 회원가입
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes authFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
