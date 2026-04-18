"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MemberProfile } from "@/types/member";
import { Order } from "@/types/order";
import {
  getMemberProfile,
  loginAsMember,
} from "@/lib/report-access";
import { DUMMY_MEMBER } from "@/lib/dummy-member";
import { listAllOrders } from "@/lib/dummy-orders";
import { ProfileCard } from "./profile-card";
import { OrderHistoryList } from "./order-history-list";

type LoadState =
  | { phase: "loading" }
  | { phase: "unauthorized" }
  | { phase: "ready"; profile: MemberProfile; orders: Order[] };

/**
 * PRD 6-7 마이페이지 클라이언트 오케스트레이터.
 * - 비로그인 시 데모용 자동 로그인(`DUMMY_MEMBER`) 수행 후 화면 진입.
 *   (프론트엔드 개발 단계에서 체험 우선; 실제 배포 시엔 /auth 리다이렉트)
 *
 * TODO: [백엔드 연동]
 *   1) Server Component 로 전환하여 세션 검증 후 `getMyOrders` 서버 액션 호출.
 *   2) 비로그인 시 `redirect("/auth")`.
 *   3) 자동 로그인 제거.
 */
export const MyPageClient = () => {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ phase: "loading" });

  useEffect(() => {
    let profile = getMemberProfile();

    // 데모 편의: 세션이 없으면 더미 회원으로 자동 로그인.
    // TODO: [백엔드 연동] 이 블록 제거 후 /auth 리다이렉트로 대체
    if (!profile) {
      loginAsMember(DUMMY_MEMBER);
      profile = DUMMY_MEMBER;
    }

    const myOrders = listAllOrders()
      .filter(
        (o) => o.ownerType === "member" && o.memberId === profile!.memberId,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    setState({ phase: "ready", profile, orders: myOrders });
  }, [router]);

  const backgroundStyle = useMemo<React.CSSProperties>(
    () => ({
      background:
        "radial-gradient(ellipse 90% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 55%, #F5F0E8 100%)",
    }),
    [],
  );

  if (state.phase === "loading") {
    return (
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0"
          style={backgroundStyle}
          aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span
              className="inline-block h-6 w-6 animate-spin rounded-full border-2"
              style={{
                borderColor: "rgba(74,59,92,0.15)",
                borderTopColor: "#9B88AC",
              }}
              aria-hidden="true"
            />
            <p className="text-sm text-[#4A3B5C]/70">
              프로필을 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state.phase === "unauthorized") {
    // 현재는 도달 불가 (자동 로그인 때문). 백엔드 연동 이후 사용.
    return null;
  }

  const { profile, orders } = state;

  const handleProfileChange = (next: MemberProfile) => {
    setState((prev) =>
      prev.phase === "ready" ? { ...prev, profile: next } : prev,
    );
  };

  return (
    <div className="relative min-h-screen pb-20">
      <div
        className="absolute inset-0"
        style={backgroundStyle}
        aria-hidden="true"
      />

      {/* 신비로운 장식 — 별/달 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[40vh] overflow-hidden"
      >
        <span className="absolute left-[8%] top-[18%] text-2xl opacity-20">
          ✦
        </span>
        <span className="absolute right-[12%] top-[30%] text-3xl opacity-20">
          🌙
        </span>
        <span className="absolute left-[78%] top-[8%] text-lg opacity-20">
          ✦
        </span>
        <span className="absolute left-[25%] top-[52%] text-xl opacity-15">
          ✦
        </span>
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-10 sm:pt-14"
        style={{
          animation: "myPageFadeIn 0.6s ease-out",
        }}
      >
        {/* 헤더 */}
        <header className="mb-6 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#9B88AC]">
            My Page
          </p>
          <h1 className="font-display text-2xl font-bold text-[#4A3B5C] sm:text-3xl">
            나의 우주
          </h1>
        </header>

        {/* 프로필 카드 */}
        <div className="mb-8">
          <ProfileCard
            profile={profile}
            onProfileChange={handleProfileChange}
          />
        </div>

        {/* 구매 내역 */}
        <section>
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="font-display text-lg font-bold text-[#4A3B5C]">
              구매한 분석
            </h2>
            <span className="text-xs text-[#4A3B5C]/60">
              총 {orders.length}건
            </span>
          </div>
          <OrderHistoryList orders={orders} />
        </section>
      </div>

      {/* 페이드인 애니메이션 keyframes */}
      <style jsx>{`
        @keyframes myPageFadeIn {
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
