"use client";

import { useEffect, useState } from "react";
import { clearPendingOrder, readPendingOrder } from "@/lib/payment";
import { saveLocalOrder } from "@/lib/dummy-orders";
import { Order } from "@/types/order";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";

interface PaymentSuccessClientProps {
  paymentKey: string;
  orderId: string;
  amount: string;
}

type ConfirmStatus = "idle" | "confirming" | "success" | "error";

/**
 * 결제 승인 진행 상태 표시 클라이언트 컴포넌트.
 *
 * TODO: [백엔드 연동] 아래 useEffect 내부 목업 로직을 실제 fetch 로 교체.
 *       fetch("/api/payments/confirm", { method: "POST",
 *         body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) })
 *       }) → 200 OK 시 status=success, 실패 시 status=error + 실패 사유 저장.
 *       pending sessionStorage 는 승인 성공 시에만 clear.
 */
export const PaymentSuccessClient = ({
  paymentKey,
  orderId,
  amount,
}: PaymentSuccessClientProps) => {
  const [status, setStatus] = useState<ConfirmStatus>("idle");

  useEffect(() => {
    let cancelled = false;

    const confirmPayment = async () => {
      setStatus("confirming");
      try {
        // TODO: [백엔드 연동] 아래 setTimeout 을 fetch("/api/payments/confirm") 로 교체
        await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;

        // 데모 — 항상 성공 처리
        setStatus("success");

        // 결제 전 sessionStorage 에 저장된 pending order 정보 + toss orderId 로
        // localStorage 에 Order 레코드를 생성 → /report/[orderId] 에서 조회 가능.
        // TODO: [백엔드 연동] 서버에서 orders 레코드 생성되므로 이 블록 제거
        const pending = readPendingOrder();
        const content = pending
          ? DUMMY_CONTENTS.find((c) => c.slug === pending.contentSlug)
          : null;

        if (pending && content) {
          const isGuest = !!pending.guestPhone;
          const order: Order = {
            id: orderId,
            contentSlug: pending.contentSlug,
            category: pending.category,
            amount: Number(amount),
            // 결제 직후에는 AI 리포트 생성 중 상태로 진입
            status: "generating",
            ownerType: isGuest ? "guest" : "member",
            phoneNumber: pending.guestPhone,
            password: pending.guestPassword,
            createdAt: new Date().toISOString(),
          };
          saveLocalOrder(order);

          // AI 생성 완료 시뮬레이션 — 실제 백엔드 연동 전 데모 UX 용
          // TODO: [백엔드 연동] 서버에서 상태 전환되므로 제거
          setTimeout(() => {
            saveLocalOrder({ ...order, status: "done" });
          }, 4000);
        }

        clearPendingOrder();
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    confirmPayment();
    return () => {
      cancelled = true;
    };
  }, [paymentKey, orderId, amount]);

  if (status === "confirming" || status === "idle") {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm"
        style={{
          backgroundColor: "rgba(232, 212, 240, 0.35)",
          border: "1px solid rgba(74, 59, 92, 0.1)",
          color: "#4A3B5C",
        }}
        aria-live="polite"
      >
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-deep-purple/30 border-t-deep-purple"
          aria-hidden="true"
        />
        결제 승인 확인 중...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="rounded-2xl px-5 py-4 text-sm"
        style={{
          backgroundColor: "#FEE",
          border: "1px solid #F5B5B5",
          color: "#C04040",
        }}
        role="alert"
      >
        결제 승인 확인에 실패했어요. 잠시 후 다시 시도해주세요.
      </div>
    );
  }

  // success
  return (
    <div
      className="flex items-center gap-2 rounded-2xl px-5 py-4 text-sm font-medium"
      style={{
        backgroundColor: "#E8F5E9",
        border: "1px solid #A5D6A7",
        color: "#2E7D32",
      }}
      aria-live="polite"
    >
      <span aria-hidden="true">✓</span>
      결제 승인이 완료되었습니다
    </div>
  );
};
