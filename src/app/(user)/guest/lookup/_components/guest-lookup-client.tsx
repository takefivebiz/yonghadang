'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { verifyGuestOrder, listAllOrders } from '@/lib/dummy-orders';

/** PRD 5.3: 비회원 기록 조회 — 전화번호 + 비밀번호 조합으로 세션 찾기 */
export const GuestLookupClient = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failCount, setFailCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLocked) return;

      setError('');
      setIsLoading(true);

      // TODO: [백엔드 연동] POST /api/guest/lookup 으로 교체 (비밀번호 bcrypt 검증은 서버에서)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const orders = listAllOrders().filter((o) => o.ownerType === 'guest');
      const matched = orders.find((o) => verifyGuestOrder(o.id, phoneNumber));

      setIsLoading(false);

      if (matched) {
        router.push(`/report/${matched.id}`);
        return;
      }

      const next = failCount + 1;
      setFailCount(next);

      if (next >= 3) {
        setError('3회 실패했어요. 1분 후 다시 시도해주세요.');
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setFailCount(0);
          setError('');
        }, 60_000);
      } else {
        setError('일치하는 기록을 찾을 수 없어요.');
      }
    },
    [phoneNumber, password, failCount, isLocked, router],
  );

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1
        className="mb-2 text-2xl font-bold"
        style={{ color: '#F0E6FA' }}
      >
        비회원 기록 조회
      </h1>
      <p className="mb-8 text-sm" style={{ color: '#D4C5E2' }}>
        결제 시 입력한 전화번호와 비밀번호로 리포트를 찾을 수 있어요.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: '#F0E6FA' }}>
            전화번호
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
            style={{
              borderColor: "rgba(230, 230, 250, 0.2)",
              backgroundColor: "rgba(100, 149, 237, 0.08)",
              color: '#F0E6FA',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#BEAEDB";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(230, 230, 250, 0.2)";
            }}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium" style={{ color: '#F0E6FA' }}>
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
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
            style={{
              borderColor: "rgba(230, 230, 250, 0.2)",
              backgroundColor: "rgba(100, 149, 237, 0.08)",
              color: '#F0E6FA',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#BEAEDB";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(230, 230, 250, 0.2)";
            }}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || isLocked || phoneNumber.length < 10 || password.length < 4}
          className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40"
          style={{
            background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
          }}
        >
          {isLoading ? (
            <span
              className="h-5 w-5 animate-spin rounded-full border-2"
              style={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                borderTopColor: "white",
              }}
            />
          ) : (
            '기록 조회'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs" style={{ color: '#B8A8D8' }}>
        비밀번호는 결제 시 직접 설정한 4자리 숫자예요.
      </p>
    </div>
  );
};
