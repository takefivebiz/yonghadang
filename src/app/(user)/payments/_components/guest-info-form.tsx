"use client";

import { GuestCheckoutInfo } from "@/types/payment";

interface GuestInfoFormProps {
  value: GuestCheckoutInfo;
  onChange: (next: GuestCheckoutInfo) => void;
  /** 필드별 에러 메시지 — null이면 정상 */
  phoneError: string | null;
  passwordError: string | null;
}

/** 한국 휴대폰 번호 포맷터 (010-1234-5678) */
const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

/**
 * PRD 6-5: 비회원 결제 시 전화번호 + 비밀번호 입력 폼.
 * PRD 6-11: 결제 완료 시 이 정보로 guests 레코드가 생성되어
 * 추후 비회원 주문 조회(/guest/lookup)에 사용된다.
 */
export const GuestInfoForm = ({
  value,
  onChange,
  phoneError,
  passwordError,
}: GuestInfoFormProps) => {
  return (
    <div
      className="rounded-2xl p-5 backdrop-blur-md"
      style={{
        background:
          "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
        border: "1.5px solid rgba(230, 230, 250, 0.15)",
      }}
    >
      <div className="mb-4">
        <h3 className="mb-1 text-sm font-semibold" style={{ color: "#F0E6FA" }}>
          비회원 리포트 조회
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "#D4C5E2" }}>
          결제 완료 후 이 전화번호와 비밀번호로 주문 내역을 조회할 수 있어.
        </p>
      </div>

      <div className="space-y-4">
        {/* 전화번호 */}
        <div>
          <label
            htmlFor="guest-phone"
            className="mb-2 block text-sm font-medium"
            style={{ color: "#F0E6FA" }}
          >
            전화번호 <span className="text-red-400">*</span>
          </label>
          <input
            id="guest-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="010-0000-0000"
            value={value.phoneNumber}
            aria-invalid={phoneError !== null}
            aria-describedby={phoneError ? "guest-phone-error" : undefined}
            onChange={(e) =>
              onChange({ ...value, phoneNumber: formatPhone(e.target.value) })
            }
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200"
            style={{
              borderColor: phoneError ? "#EF4444" : "rgba(230, 230, 250, 0.2)",
              backgroundColor: "rgba(100, 149, 237, 0.08)",
              color: "#F0E6FA",
            }}
            onFocus={(e) => {
              if (!phoneError) {
                e.currentTarget.style.borderColor = "#BEAEDB";
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = phoneError
                ? "#EF4444"
                : "rgba(230, 230, 250, 0.2)";
            }}
          />
          {phoneError && (
            <p
              id="guest-phone-error"
              className="mt-1.5 rounded-lg px-3 py-2 text-xs font-medium"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444",
              }}
              role="alert"
            >
              {phoneError}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label
            htmlFor="guest-password"
            className="mb-2 block text-sm font-medium"
            style={{ color: "#F0E6FA" }}
          >
            비밀번호 <span className="text-red-400">*</span>
          </label>
          <input
            id="guest-password"
            type="password"
            autoComplete="new-password"
            placeholder="4자 이상 입력"
            value={value.password}
            aria-invalid={passwordError !== null}
            aria-describedby={
              passwordError ? "guest-password-error" : undefined
            }
            onChange={(e) => onChange({ ...value, password: e.target.value })}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200"
            style={{
              borderColor: passwordError
                ? "#EF4444"
                : "rgba(230, 230, 250, 0.2)",
              backgroundColor: "rgba(100, 149, 237, 0.08)",
              color: "#F0E6FA",
            }}
            onFocus={(e) => {
              if (!passwordError) {
                e.currentTarget.style.borderColor = "#BEAEDB";
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = passwordError
                ? "#EF4444"
                : "rgba(230, 230, 250, 0.2)";
            }}
          />
          {passwordError && (
            <p
              id="guest-password-error"
              className="mt-1.5 rounded-lg px-3 py-2 text-xs font-medium"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444",
              }}
              role="alert"
            >
              {passwordError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
