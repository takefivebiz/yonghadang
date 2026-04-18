"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/types/order";
import { Content } from "@/types/content";
import { DummyReport, DUMMY_REPORTS } from "@/lib/dummy-reports";
import { getOrder } from "@/lib/dummy-orders";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";
import { ReportClient } from "./report-client";

interface ReportLoaderProps {
  orderId: string;
}

type LoadState =
  | { phase: "loading" }
  | { phase: "not-found" }
  | {
      phase: "ready";
      order: Order;
      content: Content;
      report: DummyReport;
    };

/**
 * 주문 데이터를 클라이언트 사이드에서 조회.
 * - DUMMY_ORDERS (상수) + localStorage (결제 성공 후 저장된 신규 주문) 모두 검색.
 * - 프론트엔드 데모 전용 패턴.
 *
 * TODO: [백엔드 연동] Server Component 에서 fetch("/api/orders/[id]") 로 교체 후 이 컴포넌트 제거.
 */
export const ReportLoader = ({ orderId }: ReportLoaderProps) => {
  const [state, setState] = useState<LoadState>({ phase: "loading" });

  useEffect(() => {
    const order = getOrder(orderId);
    if (!order) {
      setState({ phase: "not-found" });
      return;
    }

    const content = DUMMY_CONTENTS.find((c) => c.slug === order.contentSlug);
    const report = DUMMY_REPORTS[order.contentSlug];

    if (!content || !report) {
      setState({ phase: "not-found" });
      return;
    }

    setState({ phase: "ready", order, content, report });
  }, [orderId]);

  if (state.phase === "loading") {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2"
            style={{
              borderColor: "rgba(74,59,92,0.15)",
              borderTopColor: "#9B88AC",
            }}
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">주문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (state.phase === "not-found") {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-md text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #E8D4F0, #F5D7E8)",
            }}
            aria-hidden="true"
          >
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="font-display mb-2 text-2xl font-bold text-deep-purple">
            주문을 찾을 수 없어요
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            유효하지 않은 주문번호이거나 만료된 링크입니다.
            <br />
            마이페이지 또는 비회원 주문 조회에서 확인해주세요.
          </p>
          <div className="space-y-3">
            <Link
              href="/guest-login"
              className="block w-full rounded-full py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: "#4A3B5C",
                color: "#F5F0E8",
                boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
              }}
            >
              비회원 주문 조회
            </Link>
            <Link
              href="/"
              className="block w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ReportClient
      order={state.order}
      content={state.content}
      report={state.report}
    />
  );
};
