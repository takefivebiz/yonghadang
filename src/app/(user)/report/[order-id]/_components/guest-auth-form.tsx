'use client';

import { useState } from 'react';
import { verifyGuestOrder } from '@/lib/dummy-orders';
import { grantGuestAccess } from '@/lib/report-access';

interface GuestAuthFormProps {
  orderId: string;
  onSuccess: () => void;
}

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

/**
 * 비회원 리포트 열람 인증 폼 — PRD 5.3
 * 결제 시 입력한 전화번호 + 비밀번호로 본인 확인.
 * TODO: [백엔드 연동] POST /api/orders/[id]/verify 로 교체
 */
export const GuestAuthForm = ({ orderId, onSuccess }: GuestAuthFormProps) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    await new Promise((r) => setTimeout(r, 600));

    const ok = verifyGuestOrder(orderId, phone);
    if (ok) {
      grantGuestAccess(orderId);
      onSuccess();
    } else {
      setError('일치하는 기록을 찾을 수 없어요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold" style={{ color: '#2D3250' }}>
        본인 확인
      </h1>
      <p className="mb-8 text-sm text-foreground/60">
        결제 시 입력한 전화번호와 비밀번호로 확인해주세요.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            전화번호
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm outline-none focus:border-[#C4B5D4]"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/80">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              if (/^\d{0,4}$/.test(e.target.value)) setPassword(e.target.value);
            }}
            placeholder="숫자 4자리"
            maxLength={4}
            inputMode="numeric"
            className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm outline-none focus:border-[#C4B5D4]"
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl text-sm font-medium text-white disabled:opacity-40"
          style={{ backgroundColor: '#2D3250' }}
        >
          {isSubmitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            '확인하기'
          )}
        </button>
      </form>
    </div>
  );
};
