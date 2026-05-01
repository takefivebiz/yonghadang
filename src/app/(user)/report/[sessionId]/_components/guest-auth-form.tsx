"use client";

import { useState } from "react";
import { grantGuestAccess } from "@/lib/report-access";

interface GuestAuthFormProps {
  orderId: string;
  onSuccess: () => void;
}

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const GuestAuthForm = ({ orderId, onSuccess }: GuestAuthFormProps) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    let valid = true;
    setPhoneError(null);
    setPasswordError(null);

    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^01[016789]\d{7,8}$/.test(phoneDigits)) {
      setPhoneError("올바른 휴대폰번호를 입력해");
      valid = false;
    }

    if (!/^\d{4}$/.test(password)) {
      setPasswordError("숫자 4자리 비밀번호를 입력해");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    await new Promise((r) => setTimeout(r, 600));

    // TODO: [백엔드 연동] POST /api/guest/verify 로 전화번호 + 비밀번호 검증
    // 현재는 grantGuestAccess 토큰으로 접근 제어
    try {
      grantGuestAccess(orderId);
      onSuccess();
    } catch (e) {
      console.error('Guest access grant failed:', e);
      setError("인증에 실패했어요. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🔐</div>
          <h1 className="mb-2 text-3xl font-bold" style={{ color: "#F0E6FA" }}>
            본인 확인
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#D4C5E2" }}>
            결제 시 등록한 정보를 입력해줘
          </p>
        </div>

        <div
          className="rounded-2xl p-6 backdrop-blur-sm md:p-8"
          style={{
            background: "rgba(100, 149, 237, 0.1)",
            border: "1px solid rgba(230, 230, 250, 0.2)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="mb-2.5 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#A8D8FF" }}
              >
                전화번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                className="w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1.5px solid rgba(230, 230, 250, 0.3)",
                  color: "#F0E6FA",
                  caretColor: "#A366FF",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "#A366FF";
                  e.currentTarget.style.boxShadow =
                    "0 0 16px rgba(163, 102, 255, 0.3)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor =
                    "rgba(230, 230, 250, 0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
                autoFocus
              />
              {phoneError && (
                <p className="mt-1.5 text-xs" style={{ color: "#FF9999" }}>
                  {phoneError}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2.5 block text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#A8D8FF" }}
              >
                비밀번호 (4자리)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="0000"
                className="w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1.5px solid rgba(230, 230, 250, 0.3)",
                  color: "#F0E6FA",
                  caretColor: "#A366FF",
                  letterSpacing: "0.5em",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "#A366FF";
                  e.currentTarget.style.boxShadow =
                    "0 0 16px rgba(163, 102, 255, 0.3)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor =
                    "rgba(230, 230, 250, 0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                maxLength={4}
                required
              />
              {passwordError && (
                <p className="mt-1.5 text-xs" style={{ color: "#FF9999" }}>
                  {passwordError}
                </p>
              )}
            </div>

            {error && (
              <div
                className="rounded-lg px-3.5 py-2.5 text-xs font-medium"
                style={{
                  background: "rgba(255, 107, 107, 0.15)",
                  border: "1px solid rgba(255, 107, 107, 0.3)",
                  color: "#FF9999",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-2 flex min-h-[52px] w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all hover:shadow-xl disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #6495ED 0%, #A366FF 100%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>확인 중...</span>
                </div>
              ) : (
                <span>확인하기</span>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#B8A8D8" }}>
          🛡️ 안전한 결제 문의는 언제든지
          <br />
          고객 지원팀에 연락해 주세요.
        </p>
      </div>
    </div>
  );
};
