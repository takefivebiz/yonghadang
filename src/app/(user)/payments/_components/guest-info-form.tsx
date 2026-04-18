"use client";

import { GuestCheckoutInfo } from "@/types/payment";

interface GuestInfoFormProps {
  value: GuestCheckoutInfo;
  onChange: (next: GuestCheckoutInfo) => void;
  error: string | null;
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
 * 추후 비회원 주문 조회(/guest-login)에 사용된다.
 */
export const GuestInfoForm = ({ value, onChange, error }: GuestInfoFormProps) => {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "rgba(255,255,255,0.8)",
        border: "1.5px solid rgba(74, 59, 92, 0.1)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="mb-4">
        <h3 className="mb-1 text-sm font-semibold text-deep-purple">
          비회원 주문 조회 정보
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          결제 완료 후 이 전화번호와 비밀번호로 주문 내역을 조회할 수 있어요.
        </p>
      </div>

      <div className="space-y-4">
        {/* 전화번호 */}
        <div>
          <label
            htmlFor="guest-phone"
            className="mb-2 block text-sm font-medium text-foreground/80"
          >
            전화번호 <span className="text-rose-400">*</span>
          </label>
          <input
            id="guest-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="010-0000-0000"
            value={value.phoneNumber}
            onChange={(e) =>
              onChange({ ...value, phoneNumber: formatPhone(e.target.value) })
            }
            className="w-full rounded-xl border px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-[#C4AED8]"
            style={{
              borderColor: "rgba(74, 59, 92, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
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
            autoComplete="new-password"
            placeholder="4자 이상 입력"
            value={value.password}
            onChange={(e) => onChange({ ...value, password: e.target.value })}
            className="w-full rounded-xl border px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-[#C4AED8]"
            style={{
              borderColor: "rgba(74, 59, 92, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p
            className="rounded-lg px-3 py-2 text-xs font-medium"
            style={{ backgroundColor: "#FEE", color: "#C04040" }}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
