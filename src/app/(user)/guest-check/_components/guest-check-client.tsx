"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getGuestPhoneNumber, logoutGuest } from "@/lib/report-access";
import { listAllOrders, getOrder } from "@/lib/dummy-orders";
import { Order } from "@/types/order";

/**
 * PRD 6-10. 비회원 주문 조회 페이지 (/guest-check)
 * - 게스트 로그인된 사용자만 진입 가능
 * - 전화번호로 필터링된 주문 목록 표시
 * - 각 항목 클릭 시 보고서 확인 페이지로 이동
 */
export const GuestCheckClient = () => {
  const router = useRouter();
  const [guestOrders, setGuestOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const phone = getGuestPhoneNumber();
    if (!phone) {
      // 게스트 로그인이 없으면 로그인 페이지로 리다이렉트
      router.replace("/guest-login");
      return;
    }

    setPhoneNumber(phone);

    // 비회원 주문 목록 필터링
    const allOrders = listAllOrders();
    const normalize = (v: string): string => v.replace(/\D/g, "");
    const filtered = allOrders.filter((order) => {
      if (order.ownerType !== "guest") return false;
      return normalize(order.phoneNumber ?? "") === normalize(phone);
    });

    setGuestOrders(filtered);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 55%, #F5F0E8 100%)",
          }}
        />
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8D4F0]/30 animate-pulse">
              <span className="text-xl">✦</span>
            </div>
            <p className="text-sm text-[#4A3B5C]/70">주문 내역을 로드 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  const getOrderStatusBadge = (order: Order) => {
    switch (order.status) {
      case "done":
        return { label: "완료", color: "#10B981" };
      case "generating":
        return { label: "생성 중", color: "#F59E0B" };
      case "error":
        return { label: "오류", color: "#EF4444" };
      default:
        return { label: "진행 중", color: "#8B5CF6" };
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      mbti: "MBTI",
      saju: "사주",
      tarot: "타로",
      astrology: "점성술",
    };
    return labels[category] || category;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
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

      <div
        className="relative z-10 mx-auto w-full max-w-2xl px-4 py-12"
        style={{ animation: "authFadeIn 0.6s ease-out" }}
      >
        {/* 헤더 */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#4A3B5C] sm:text-3xl">
              주문 내역
            </h1>
            <p className="mt-2 text-sm text-[#4A3B5C]/70">
              {phoneNumber && `${phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-****-$3")}` }로 조회된 주문 내역입니다.
            </p>
          </div>
          <button
            onClick={() => {
              logoutGuest();
              router.replace("/guest-login");
            }}
            className="text-xs font-medium text-[#4A3B5C]/60 hover:text-[#4A3B5C] transition-colors"
          >
            로그아웃
          </button>
        </header>

        {/* 주문 목록 */}
        {guestOrders.length === 0 ? (
          <section
            className="rounded-3xl border border-[#E8D4F0] bg-white px-6 py-12 text-center sm:px-8"
            style={{
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 55%, #F9F2FB 100%)",
            }}
          >
            <div className="mb-4 flex justify-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, #E8D4F0, #F5D7E8)",
                }}
                aria-hidden="true"
              >
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <h2 className="font-display mb-2 text-lg font-semibold text-[#4A3B5C]">
              주문 내역이 없어요
            </h2>
            <p className="mb-6 text-sm text-[#4A3B5C]/70">
              현재 조회된 주문 내역이 없습니다.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: "#4A3B5C",
                color: "#F5F0E8",
                boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
              }}
            >
              홈으로 돌아가기
            </Link>
          </section>
        ) : (
          <section className="space-y-3">
            {guestOrders.map((order) => {
              const badge = getOrderStatusBadge(order);
              const orderDetail = getOrder(order.id);

              return (
                <Link
                  key={order.id}
                  href={`/report/${order.id}`}
                  className="block rounded-2xl border border-[#E8D4F0] bg-white p-4 transition-all duration-300 hover:shadow-md hover:border-[#D4A5A5] sm:p-5"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,242,251,0.6) 100%)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${badge.color}20`,
                            color: badge.color,
                          }}
                        >
                          {badge.label}
                        </span>
                        <span
                          className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(232, 212, 240, 0.5)",
                            color: "#4A3B5C",
                          }}
                        >
                          {getCategoryLabel(order.category)}
                        </span>
                      </div>
                      <h3 className="font-medium text-[#4A3B5C] mb-1 truncate">
                        {orderDetail?.contentSlug || order.id}
                      </h3>
                      <p className="text-xs text-[#4A3B5C]/60">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-[#4A3B5C]">
                        {formatPrice(order.amount)}
                      </p>
                      <span className="text-xs text-[#4A3B5C]/60">
                        주문 ID: {order.id.slice(-8)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        {/* 안내 메시지 */}
        {guestOrders.length > 0 && (
          <div
            className="mt-8 rounded-2xl px-5 py-4 text-sm"
            style={{
              backgroundColor: "rgba(232, 212, 240, 0.25)",
              border: "1px solid rgba(74, 59, 92, 0.1)",
            }}
          >
            <p className="text-[#4A3B5C]/80 leading-relaxed">
              💡 <strong>회원가입하면</strong> 구매 내역을 더 쉽게 관리할 수 있어요.
            </p>
          </div>
        )}
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
