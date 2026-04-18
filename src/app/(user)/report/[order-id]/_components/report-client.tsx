"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";
import { Content } from "@/types/content";
import { DummyReport } from "@/lib/dummy-reports";
import { hasGuestAccess, isMemberLoggedIn } from "@/lib/report-access";
import { GuestAuthForm } from "./guest-auth-form";
import { ReportView } from "./report-view";
import { ReportStatus } from "./report-status";

interface ReportClientProps {
  order: Order;
  content: Content;
  report: DummyReport;
}

type ViewState = "checking" | "auth" | "status" | "report";

/**
 * PRD 6-6 리포트 페이지 오케스트레이터.
 * - 인증 상태 확인 (회원 세션 / 비회원 주문 인증)
 * - 인증 통과 시 AI 생성 상태 분기 (generating → status UI, done → ReportView)
 *
 * TODO: [백엔드 연동] 인증 체크는 Server Component 에서 세션 + 쿠키 기반으로 처리.
 *       현재 프론트엔드 데모는 클라이언트 storage 로 시뮬레이션.
 */
export const ReportClient = ({
  order,
  content,
  report,
}: ReportClientProps) => {
  const [view, setView] = useState<ViewState>("checking");

  // 최초 렌더 시 인증 체크 (useEffect 로 클라이언트 전용 storage 접근)
  useEffect(() => {
    const authed =
      order.ownerType === "member"
        ? isMemberLoggedIn()
        : hasGuestAccess(order.id);

    if (!authed) {
      setView("auth");
      return;
    }

    if (order.status === "done") {
      setView("report");
    } else {
      setView("status");
    }
  }, [order]);

  // 회원 비로그인 상태 — /auth 안내
  if (view === "auth" && order.ownerType === "member") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #E8D4F0, #F5D7E8)",
          }}
          aria-hidden="true"
        >
          <span className="text-2xl">🔒</span>
        </div>
        <h1 className="font-display mb-3 text-2xl font-bold text-deep-purple">
          로그인이 필요해요
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          이 리포트는 구매하신 회원만 열람할 수 있어요.
          <br />
          로그인 후 다시 시도해주세요.
        </p>
        <a
          href={`/auth?redirect=/report/${order.id}`}
          className="inline-block rounded-full px-10 py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "#4A3B5C",
            color: "#F5F0E8",
            boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
          }}
        >
          로그인하러 가기 ✦
        </a>
      </div>
    );
  }

  // 비회원 인증 폼
  if (view === "auth") {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 60%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: "#E8D4F0", opacity: 0.3 }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 top-80 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: "#F5D7E8", opacity: 0.3 }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 pt-16">
          <GuestAuthForm
            orderId={order.id}
            onSuccess={() =>
              setView(order.status === "done" ? "report" : "status")
            }
          />
        </div>
      </div>
    );
  }

  // AI 생성 중 / 실패 상태
  if (view === "status") {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 px-4">
          <ReportStatus
            orderId={order.id}
            initialStatus={order.status}
            errorMessage={order.errorMessage}
            onDone={() => setView("report")}
          />
        </div>
      </div>
    );
  }

  // 인증 통과 + done → 리포트 표시
  if (view === "report") {
    return (
      <ReportView
        content={content}
        report={report}
        createdAt={order.createdAt}
      />
    );
  }

  // 초기 렌더링 (storage 체크 전) — 페이드 인 대비 블랭크
  return (
    <div className="min-h-screen" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 60%)",
        }}
      />
    </div>
  );
};
