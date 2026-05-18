"use client";

import { useEffect, useState, useRef } from "react";
import {
  loadPaymentWidget,
  ANONYMOUS,
  type PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LoopType } from "@/lib/types/quiz";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: "single" | "all" | "loop" | "loop_all";
  sceneIndex?: number;
  cardTitle?: string;
  /** loop 결제 시 필수. successUrl에 _loop_type으로 포함된다. */
  loopType?: LoopType;
}

const PaymentModal = ({
  isOpen,
  onClose,
  paymentType,
  sceneIndex,
  cardTitle,
  loopType,
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<PaymentWidgetInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSingle = paymentType === "single";
  const isLoop = paymentType === "loop";
  const isLoopAll = paymentType === "loop_all";

  const amount = isLoopAll ? 2200 : isLoop ? 900 : isSingle ? 1500 : 4900;
  const title = isLoopAll
    ? "전체 질문 깊게 읽기"
    : isLoop
      ? `${cardTitle} 읽기`
      : isSingle
        ? `[${cardTitle}] 열기`
        : "전체 흐름 열기";
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

  // 로그인 상태 감지: true = 회원, false = 비회원, null = 확인 중
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // single/all이고 비회원이면: purchase_method → guest_info → payment
  // single/all이고 회원이면: payment (바로)
  // loop/loop_all: payment (바로)
  const [step, setStep] = useState<"purchase_method" | "guest_info" | "payment">("payment");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestPin, setGuestPin] = useState("");
  const [guestInfoError, setGuestInfoError] = useState<string | null>(null);

  // 모달 오픈 시 로그인 상태 확인 → step 초기화
  useEffect(() => {
    if (!isOpen) return;

    const checkSession = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        const loggedIn = !!session?.user;
        setIsLoggedIn(loggedIn);

        const isSingleOrAll = paymentType === "single" || paymentType === "all";
        // 비회원 + single/all: 구매 방식 선택 step부터 시작
        setStep(isSingleOrAll && !loggedIn ? "purchase_method" : "payment");
      } catch {
        // 확인 실패 시 안전하게 비회원 경로로 fallback
        setIsLoggedIn(false);
        if (paymentType === "single" || paymentType === "all") {
          setStep("purchase_method");
        }
      }
    };

    void checkSession();
  }, [isOpen, paymentType]);

  const formatPhone = (value: string): string => {
    const d = value.replace(/\D/g, "");
    if (d.length === 0) return "";
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
  };

  const handleGuestInfoNext = () => {
    const digits = guestPhone.replace(/\D/g, "");
    if (!/^\d{10,11}$/.test(digits)) {
      setGuestInfoError("전화번호를 올바르게 입력해줘");
      return;
    }
    if (!/^\d{4}$/.test(guestPin)) {
      setGuestInfoError("4자리 숫자 비밀번호를 입력해줘");
      return;
    }
    // Toss redirect 후 confirm API 호출 시 사용. 성공 시에만 삭제.
    sessionStorage.setItem("veil_pending_phone", digits);
    sessionStorage.setItem("veil_pending_pin", guestPin);
    setGuestInfoError(null);
    setStep("payment");
  };

  // 위젯 초기화: payment 단계에서만 실행
  // step이 "guest_info"일 때는 #payment-methods DOM이 없으므로 초기화 skip
  // isLoggedIn === null: 세션 확인 중 → 초기화 skip (step이 아직 확정되지 않은 상태)
  useEffect(() => {
    if (!isOpen || step !== "payment" || isLoggedIn === null || !containerRef.current) return;

    // cancelled: 모달 닫힘/deps 변경 시 진행 중인 async 콜백을 무시하기 위한 플래그
    let cancelled = false;

    const initWidget = async () => {
      try {
        if (!clientKey) {
          setError("결제 설정이 올바르지 않아요");
          return;
        }

        console.log("[Toss] loadPaymentWidget 시작 →", {
          paymentType,
          amount,
          loopType: loopType ?? null,
        });
        const widget = await loadPaymentWidget(clientKey, ANONYMOUS);
        console.log("[Toss] loadPaymentWidget 완료");

        if (cancelled) return;

        widgetRef.current = widget;

        console.log("[Toss] renderPaymentMethods 시작 →", { amount });
        await widget.renderPaymentMethods(
          "#payment-methods",
          { value: amount },
          { variantKey: "DEFAULT" },
        );
        console.log("[Toss] renderPaymentMethods 완료");

        if (!cancelled) setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error(
            "[Toss] 위젯 초기화 실패:",
            JSON.stringify(err, Object.getOwnPropertyNames(err as object)),
          );
          console.error("[Toss] 위젯 초기화 실패 raw:", err);
          setError("결제 위젯 로드에 실패했어요");
        }
      }
    };

    initWidget();

    return () => {
      cancelled = true;
      widgetRef.current = null;
      // step="guest_info"일 때는 DOM에 없으므로 null 체크 필요
      const methodsEl = document.getElementById("payment-methods");
      if (methodsEl) methodsEl.innerHTML = "";
    };
  }, [isOpen, step, clientKey, amount, isLoggedIn]);

  const handlePayment = async () => {
    if (!widgetRef.current) {
      setError("결제 위젯이 준비되지 않았어요");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const orderName = isLoopAll
        ? "전체 질문 깊게 읽기"
        : isLoop
          ? (cardTitle ?? "")
          : isSingle
            ? `${cardTitle} 열기`
            : "전체 흐름 열기";

      const baseUrl =
        typeof window !== "undefined" ? window.location.href.split("?")[0] : "";

      const successUrl = isLoopAll
        ? `${baseUrl}?_payment_type=loop_all&_unlock=true`
        : isLoop
          ? `${baseUrl}?_payment_type=loop&_loop_type=${loopType || ""}&_unlock=true`
          : `${baseUrl}?_payment_type=${paymentType}&_scene_index=${sceneIndex || 0}&_unlock=true`;
      const failUrl = `${baseUrl}?_payment_failed=true`;

      console.log("[Toss] requestPayment 직전:", {
        paymentType,
        amount,
        orderName,
        orderId,
        successUrl,
        failUrl,
      });

      await widgetRef.current.requestPayment({
        orderId,
        orderName,
        customerEmail: "guest@veil.app",
        customerName: "게스트",
        successUrl,
        failUrl,
      });

      // successUrl로 리다이렉트되므로 이 코드는 실행되지 않음
    } catch (err) {
      const error = err as { code?: string; message?: string } | Error | null;
      console.error("[Toss] requestPayment 실패 raw:", err);
      console.error(
        "[Toss] requestPayment 실패 JSON:",
        JSON.stringify(err, Object.getOwnPropertyNames(err as object)),
      );
      if (error && "code" in error && error.code === "USER_CANCEL") {
        setError("결제가 취소되었어요");
      } else if (error && "code" in error && error.code) {
        const message = "message" in error ? error.message : "알 수 없는 오류";
        setError(`결제 오류: ${message}`);
      } else {
        setError("결제 처리 중 오류가 발생했어요");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  // 세션 확인 중: 빈 모달 껍데기만 렌더 (step이 확정되기 전에 위젯이 마운트되지 않도록)
  if (isLoggedIn === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-background border border-white/10 flex items-center justify-center p-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
        </div>
      </div>
    );
  }

  const isGuestInfoValid =
    /^\d{10,11}$/.test(guestPhone.replace(/\D/g, "")) &&
    /^\d{4}$/.test(guestPin);

  return (
    <div
      data-testid="payment-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
    >
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-2xl bg-background border border-white/10 flex flex-col max-h-[90vh]"
      >
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <button
            onClick={onClose}
            disabled={isProcessing}
            data-testid="payment-modal-close-btn"
            className="mb-6 text-highlight/40 transition-colors hover:text-highlight/70 disabled:opacity-50"
          >
            ✕
          </button>

          {/* ── Step 0: 구매 방식 선택 (single/all 전용) ───────────────── */}
          {step === "purchase_method" && (
            <div>
              <h2
                data-testid="payment-modal-title"
                className="mb-1 text-xl font-bold text-highlight sm:text-2xl"
              >
                {title}
              </h2>
              <p className="mb-6 text-sm text-highlight/40">
                어떻게 구매할지 선택해줘
              </p>

              {/* 로그인하고 구매하기 (추천) */}
              <button
                data-testid="payment-modal-login-btn"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem(
                      "redirect_to",
                      window.location.pathname + window.location.search,
                    );
                    window.location.href = "/auth";
                  }
                }}
                className="group w-full text-left rounded-xl px-5 py-4 mb-2.5 transition-all duration-200 hover:scale-[1.015] active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(94,153,171,0.18) 0%, rgba(94,153,171,0.08) 100%)",
                  border: "1px solid rgba(94,153,171,0.45)",
                  boxShadow: "0 0 0 0 rgba(94,153,171,0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 18px rgba(94,153,171,0.22)";
                  e.currentTarget.style.borderColor = "rgba(94,153,171,0.65)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 0 0 rgba(94,153,171,0)";
                  e.currentTarget.style.borderColor = "rgba(94,153,171,0.45)";
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-highlight">
                    로그인하고 계속 보기
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(94,153,171,0.2)",
                      color: "rgba(94,153,171,0.9)",
                      border: "1px solid rgba(94,153,171,0.3)",
                    }}
                  >
                    추천
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(249,249,229,0.45)" }}>
                  결과와 구매 내역이 계정에 저장돼.
                </p>
              </button>

              {/* 비회원으로 구매하기 */}
              <button
                data-testid="payment-modal-guest-btn"
                onClick={() => setStep("guest_info")}
                className="w-full text-left rounded-xl px-5 py-4 mb-5 transition-all duration-200 hover:bg-white/[0.06] active:scale-[0.99]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-sm font-medium mb-1" style={{ color: "rgba(249,249,229,0.65)" }}>
                  비회원으로 계속하기
                </p>
                <p className="text-xs" style={{ color: "rgba(249,249,229,0.3)" }}>
                  전화번호와 비밀번호로 나중에 다시 조회할 수 있어.
                </p>
              </button>

              <button
                data-testid="payment-modal-cancel-btn"
                onClick={onClose}
                className="w-full text-sm rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-highlight/70 transition-all hover:bg-white/10"
              >
                취소
              </button>
            </div>
          )}

          {/* ── Step 1: 비회원 정보 입력 (single/all 전용) ──────────────── */}
          {step === "guest_info" && (
            <div>
              <h2
                data-testid="payment-modal-title"
                className="mb-2 text-xl font-bold text-highlight sm:text-2xl"
              >
                비회원으로 계속하기
              </h2>
              <p className="mb-8 text-sm text-highlight/50">
                나중에 결과를 다시 볼 때 필요해
              </p>

              <div className="space-y-4 mb-8">
                <div className="space-y-1.5">
                  <label className="block text-xs text-highlight/60">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => {
                      setGuestPhone(formatPhone(e.target.value));
                      setGuestInfoError(null);
                    }}
                    placeholder="010-0000-0000"
                    className="w-full rounded px-4 py-3 text-sm transition-colors focus:outline-none"
                    style={{
                      backgroundColor: "rgba(209, 109, 172, 0.08)",
                      border: "1px solid rgba(209, 109, 172, 0.285)",
                      color: "rgba(249, 249, 229, 0.85)",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs text-highlight/60">
                    비밀번호 (4자리)
                  </label>
                  <input
                    type="password"
                    value={guestPin}
                    onChange={(e) => {
                      setGuestPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                      setGuestInfoError(null);
                    }}
                    placeholder="••••"
                    inputMode="numeric"
                    maxLength={4}
                    className="w-full rounded px-4 py-3 text-sm transition-colors focus:outline-none"
                    style={{
                      backgroundColor: "rgba(209, 109, 172, 0.08)",
                      border: "1px solid rgba(209, 109, 172, 0.285)",
                      color: "rgba(249, 249, 229, 0.85)",
                    }}
                  />
                </div>
              </div>

              {guestInfoError && (
                <p
                  data-testid="payment-modal-guest-info-error"
                  className="mb-4 text-xs text-red-400"
                >
                  {guestInfoError}
                </p>
              )}

              <button
                data-testid="payment-modal-guest-next-btn"
                onClick={handleGuestInfoNext}
                disabled={!isGuestInfoValid}
                className="w-full text-sm rounded-lg bg-secondary px-4 py-3 font-medium text-white transition-all hover:bg-secondary/90 disabled:opacity-40"
              >
                다음
              </button>
              <button
                data-testid="payment-modal-cancel-btn"
                onClick={onClose}
                className="mt-3 w-full text-sm rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-highlight/70 transition-all hover:bg-white/10"
              >
                취소
              </button>
            </div>
          )}

          {/* ── Step 1: Toss 결제 위젯 ─────────────────────────────────── */}
          {step === "payment" &&
            (!error ? (
              <div>
                <h2
                  data-testid="payment-modal-title"
                  className="mb-2 text-xl font-bold text-highlight sm:text-2xl"
                >
                  {title}
                </h2>
                <p className="mb-8 text-sm text-highlight/50">
                  {isLoopAll
                    ? "3개 질문을 한번에 깊게 읽을 수 있어"
                    : isLoop
                      ? "결과를 더 깊이 읽을 수 있어"
                      : isSingle
                        ? "이어서 읽을 수 있어"
                        : "잠겨있는 모든 흐름을 열 수 있어"}
                </p>

                <div className="mb-8 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
                  <p className="mb-2 text-xs font-semibold text-highlight/60">
                    결제 금액
                  </p>
                  <p
                    data-testid="payment-modal-price"
                    className="text-sm font-bold text-secondary"
                  >
                    {amount.toLocaleString()}
                    <span className="text-sm text-highlight/60">원</span>
                  </p>
                </div>

                {/* 결제 수단 선택 UI (Toss 위젯이 렌더링됨) */}
                <div id="payment-methods" className="mb-6" />

                <button
                  data-testid="payment-modal-pay-btn"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full text-sm rounded-lg bg-secondary px-4 py-3 font-medium text-white transition-all hover:bg-secondary/90 disabled:opacity-50"
                >
                  {amount.toLocaleString()}원 결제하기
                </button>

                <button
                  data-testid="payment-modal-cancel-btn"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="mt-3 w-full text-sm rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-highlight/70 transition-all hover:bg-white/10 disabled:opacity-50"
                >
                  취소
                </button>

                {isProcessing && (
                  <div
                    data-testid="payment-modal-spinner"
                    className="mt-4 flex justify-center"
                  >
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p
                  data-testid="payment-modal-error-msg"
                  className="mb-6 text-sm text-red-400"
                >
                  {error}
                </p>
                <button
                  data-testid="payment-modal-error-close-btn"
                  onClick={onClose}
                  className="w-full rounded-lg bg-secondary px-4 py-3 font-semibold text-white transition-all hover:bg-secondary/90"
                >
                  닫기
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
