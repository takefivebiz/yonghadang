"use client";

import { useState } from "react";
import { verifyGuestOrder } from "@/lib/dummy-orders";
import { grantGuestAccess } from "@/lib/report-access";

interface GuestAuthFormProps {
  orderId: string;
  /** 인증 성공 시 부모에게 알리기 — 부모는 useState 로 뷰 전환 */
  onSuccess: () => void;
}

/**
 * 비회원 리포트 열람 인증 폼 (PRD 6-6).
 * 결제 시 입력했던 휴대폰번호 + 비밀번호로 본인 확인.
 *
 * TODO: [백엔드 연동] verifyGuestOrder 를 POST /api/orders/[id]/verify 로 교체
 */
export const GuestAuthForm = ({ orderId, onSuccess }: GuestAuthFormProps) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 한국식 하이픈 포맷팅 (010-1234-5678)
  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^01[016789]\d{7,8}$/.test(phoneDigits)) {
      setError("올바른 휴대폰번호를 입력해주세요");
      return;
    }
    if (password.length < 4) {
      setError("비밀번호는 4자 이상이어야 해요");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // 잠깐 딜레이를 주어 로딩 UX 자연스럽게
    window.setTimeout(() => {
      const ok = verifyGuestOrder(orderId, phoneDigits, password);
      if (!ok) {
        setError("입력하신 정보가 일치하지 않아요. 다시 확인해주세요.");
        setIsSubmitting(false);
        return;
      }
      grantGuestAccess(orderId);
      onSuccess();
    }, 400);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* 상단 신비로운 심볼 */}
      <div className="mb-8 flex flex-col items-center">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #E8D4F0, #F5D7E8)",
            boxShadow: "0 8px 32px rgba(232, 212, 240, 0.5)",
          }}
          aria-hidden="true"
        >
          <span className="text-2xl">🔐</span>
        </div>
        <h1 className="font-display mb-2 text-2xl font-bold text-deep-purple md:text-3xl">
          주문자 본인 확인
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          결제 시 입력하신 휴대폰번호와 비밀번호를
          <br />
          입력해주세요
        </p>
      </div>

      {/* 주문번호 표시 */}
      <div
        className="mb-5 rounded-2xl px-5 py-4"
        style={{
          backgroundColor: "rgba(232, 212, 240, 0.25)",
          border: "1px solid rgba(74, 59, 92, 0.1)",
        }}
      >
        <p className="mb-1 text-xs text-muted-foreground">주문번호</p>
        <p
          className="font-mono text-xs text-foreground/70"
          title={orderId}
        >
          {orderId}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            border: "1.5px solid rgba(74, 59, 92, 0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* 휴대폰번호 */}
          <div className="mb-5">
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
              className="mt-4 rounded-xl px-3 py-2 text-xs"
              style={{
                backgroundColor: "rgba(212, 165, 165, 0.15)",
                color: "#C04040",
              }}
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={
            isSubmitting
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
          {isSubmitting ? "확인 중..." : "리포트 열람하기 ✦"}
        </button>

        <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
          휴대폰번호나 비밀번호가 기억나지 않으시면
          <br />
          고객센터로 문의해주세요.
        </p>
      </form>
    </div>
  );
};
