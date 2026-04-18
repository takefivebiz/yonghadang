"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadTossPayments,
  ANONYMOUS,
  type TossPaymentsWidgets,
  type WidgetPaymentMethodWidget,
  type WidgetAgreementWidget,
} from "@tosspayments/tosspayments-sdk";
import { Content } from "@/types/content";
import { PendingOrderInput } from "@/types/payment";
import {
  TOSS_CLIENT_KEY,
  generateOrderId,
  readPendingOrder,
  savePendingOrder,
} from "@/lib/payment";
import { OrderSummary } from "./order-summary";
import { GuestInfoForm } from "./guest-info-form";

interface PaymentClientProps {
  content: Content;
}

type CheckoutMode = "guest" | "member";

/**
 * 결제 페이지 메인 클라이언트 컴포넌트.
 *
 * ※ 주의: SDK 초기화 + 위젯 렌더링을 하나의 useEffect 안에서 처리한다.
 *   두 개로 분리하면 React Strict Mode(개발 환경)에서 effect 가 2회 실행될 때
 *   동일 DOM 요소에 위젯이 이중 마운트되어 Toss SDK 내부 에러가 발생한다.
 *
 * TODO: [백엔드 연동] "결제하기" 클릭 시 Server Action(createOrder)으로
 *       orders 레코드를 선생성(status=pending)하고, 서버 toss_order_id 를 requestPayment 에 사용.
 */
export const PaymentClient = ({ content }: PaymentClientProps) => {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [mode, setMode] = useState<CheckoutMode>("guest");
  const [pendingInput, setPendingInput] = useState<PendingOrderInput | null>(null);
  const [guestInfo, setGuestInfo] = useState({ phoneNumber: "", password: "" });
  const [guestError, setGuestError] = useState<string | null>(null);

  // 위젯 인스턴스 ref — cleanup 에서 destroy() 호출용
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const paymentMethodWidgetRef = useRef<WidgetPaymentMethodWidget | null>(null);
  const agreementWidgetRef = useRef<WidgetAgreementWidget | null>(null);

  // orderId 는 컴포넌트 마운트 시 1회 생성
  const orderIdRef = useRef<string>("");
  if (!orderIdRef.current) orderIdRef.current = generateOrderId();

  // /start 에서 sessionStorage 로 전달된 입력 정보 복원
  useEffect(() => {
    const saved = readPendingOrder();
    if (saved && saved.contentSlug === content.slug) {
      setPendingInput(saved);
    }
  }, [content.slug]);

  /**
   * SDK 로드 → widgets 초기화 → setAmount → renderPaymentMethods → renderAgreement
   * React Strict Mode 에서 2회 실행되므로 cleanup 에서 반드시 위젯 인스턴스를 destroy.
   */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        if (cancelled) return;

        // 비회원은 ANONYMOUS, 회원은 실제 customerKey 사용
        // TODO: [백엔드 연동] 로그인 세션에서 회원 customerKey 주입
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        widgetsRef.current = widgets;

        // renderPaymentMethods 호출 전에 금액 반드시 설정
        await widgets.setAmount({ currency: "KRW", value: content.price });
        if (cancelled) return;

        // 결제수단 UI 렌더링
        const paymentMethodWidget = await widgets.renderPaymentMethods({
          selector: "#toss-payment-methods",
          variantKey: "DEFAULT",
        });
        if (cancelled) {
          await paymentMethodWidget.destroy();
          return;
        }
        paymentMethodWidgetRef.current = paymentMethodWidget;

        // 이용약관 UI 렌더링
        const agreementWidget = await widgets.renderAgreement({
          selector: "#toss-agreement",
          variantKey: "DEFAULT",
        });
        if (cancelled) {
          await paymentMethodWidget.destroy();
          await agreementWidget.destroy();
          return;
        }
        agreementWidgetRef.current = agreementWidget;

        setIsWidgetReady(true);
      } catch (err) {
        if (!cancelled) {
          console.error("토스 위젯 초기화 실패:", err);
        }
      }
    };

    init();

    // cleanup: React Strict Mode 2차 실행 또는 언마운트 시 인스턴스 제거
    return () => {
      cancelled = true;
      paymentMethodWidgetRef.current?.destroy().catch(() => {});
      agreementWidgetRef.current?.destroy().catch(() => {});
      paymentMethodWidgetRef.current = null;
      agreementWidgetRef.current = null;
      widgetsRef.current = null;
      setIsWidgetReady(false);
    };
  // content.price 변경 시 금액 재설정이 필요하므로 의존성에 포함
  }, [content.price]);

  /** 비회원 폼 검증 — 전화번호(한국 휴대폰) + 비밀번호(4자 이상) */
  const validateGuest = (): boolean => {
    if (mode !== "guest") return true;

    const phoneDigits = guestInfo.phoneNumber.replace(/\D/g, "");
    if (!/^01[016789]\d{7,8}$/.test(phoneDigits)) {
      setGuestError("올바른 전화번호를 입력해주세요");
      return false;
    }
    if (guestInfo.password.length < 4) {
      setGuestError("비밀번호는 4자 이상이어야 합니다");
      return false;
    }
    setGuestError(null);
    return true;
  };

  const handleRequestPayment = async () => {
    if (!widgetsRef.current || !isWidgetReady || isRequesting) return;
    if (!validateGuest()) return;

    setIsRequesting(true);
    try {
      // TODO: [백엔드 연동] 결제 요청 전에 Server Action `createOrder` 호출하여
      //       서버 orders 레코드(status=pending)를 생성하고, 서버가 반환한 orderId 사용.
      const origin = window.location.origin;

      // 결제 성공 후 Order 레코드 생성을 위해 orderId + 비회원 인증 정보를 저장
      const phoneDigits = guestInfo.phoneNumber.replace(/\D/g, "");
      savePendingOrder({
        contentSlug: content.slug,
        category: content.category,
        summary: pendingInput?.summary ?? [],
        orderId: orderIdRef.current,
        guestPhone: mode === "guest" ? phoneDigits : undefined,
        guestPassword: mode === "guest" ? guestInfo.password : undefined,
      });

      await widgetsRef.current.requestPayment({
        orderId: orderIdRef.current,
        orderName: content.title,
        successUrl: `${origin}/payments/success?content=${content.slug}`,
        failUrl: `${origin}/payments/fail?content=${content.slug}`,
        customerMobilePhone: mode === "guest" ? phoneDigits : undefined,
      });
    } catch (err) {
      // 사용자가 결제창을 닫거나 네트워크 오류 — 버튼 재활성화
      console.error("결제 요청 실패:", err);
      setIsRequesting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-5">
      {/* ── 리포트 요약 + 입력 정보 요약 ── */}
      <OrderSummary content={content} pendingInput={pendingInput} />

      {/* ── 회원 / 비회원 모드 탭 ── */}
      <div
        className="flex gap-2 rounded-2xl p-1.5"
        style={{
          backgroundColor: "rgba(255,255,255,0.7)",
          border: "1.5px solid rgba(74, 59, 92, 0.1)",
          backdropFilter: "blur(8px)",
        }}
        role="tablist"
        aria-label="결제 방식 선택"
      >
        {(["guest", "member"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-all duration-200"
            style={
              mode === m
                ? {
                    backgroundColor: "#F5D7E8",
                    color: "#4A3B5C",
                    boxShadow: "0 2px 10px rgba(245, 215, 232, 0.7)",
                  }
                : { color: "#9B88AC", backgroundColor: "transparent" }
            }
          >
            {m === "guest" ? "비회원 결제" : "회원 결제"}
          </button>
        ))}
      </div>

      {/* ── 비회원 전화번호 + 비밀번호 입력 폼 ── */}
      {mode === "guest" && (
        <GuestInfoForm
          value={guestInfo}
          onChange={(next) => {
            setGuestInfo(next);
            if (guestError) setGuestError(null);
          }}
          error={guestError}
        />
      )}

      {/* ── 회원 결제 안내 ── */}
      {mode === "member" && (
        <div
          className="rounded-2xl p-5 text-sm leading-relaxed text-foreground/70"
          style={{
            backgroundColor: "rgba(232, 212, 240, 0.25)",
            border: "1px solid rgba(74, 59, 92, 0.1)",
          }}
        >
          <p className="mb-1 font-medium text-foreground/80">회원 결제 안내</p>
          <p>
            결제 완료 후 마이페이지에서 언제든 주문 내역과 분석 리포트를 다시 볼
            수 있어요.
          </p>
        </div>
      )}

      {/* ── 토스페이먼츠 위젯 컨테이너 ── */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1.5px solid rgba(74, 59, 92, 0.1)",
          backdropFilter: "blur(8px)",
          // 위젯 로딩 중 빈 카드 높이 확보
          minHeight: isWidgetReady ? undefined : "120px",
        }}
      >
        {/* 로딩 스피너 */}
        {!isWidgetReady && (
          <div
            className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"
            aria-live="polite"
          >
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2"
              style={{
                borderColor: "rgba(74,59,92,0.15)",
                borderTopColor: "#9B88AC",
              }}
              aria-hidden="true"
            />
            결제 위젯을 불러오는 중...
          </div>
        )}
        {/* 토스 SDK 가 이 div 안에 iframe 을 삽입 */}
        <div id="toss-payment-methods" />
        <div id="toss-agreement" />
      </div>

      {/* ── 결제 버튼 ── */}
      <button
        type="button"
        onClick={handleRequestPayment}
        disabled={!isWidgetReady || isRequesting}
        className="w-full rounded-full py-4 text-sm font-semibold transition-all duration-300"
        style={
          isWidgetReady && !isRequesting
            ? {
                backgroundColor: "#4A3B5C",
                color: "#F5F0E8",
                boxShadow: "0 4px 28px rgba(74, 59, 92, 0.35)",
              }
            : {
                backgroundColor: "rgba(74, 59, 92, 0.12)",
                color: "#9B88AC",
                cursor: "not-allowed",
              }
        }
      >
        {isRequesting
          ? "결제창 여는 중..."
          : `${content.price.toLocaleString("ko-KR")}원 결제하기 ✦`}
      </button>

      <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
        결제 시 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
        <br />
        결제는 토스페이먼츠가 제공하는 안전한 시스템으로 처리됩니다.
      </p>
    </div>
  );
};
