"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MemberProfile } from "@/types/member";
import { FullReport } from "@/types/report";
import { getMemberProfile } from "@/lib/report-access";
import { listAllOrders } from "@/lib/dummy-orders";
import { DUMMY_REPORTS } from "@/lib/dummy-reports";
import { ProfileCard } from "./profile-card";

type DashboardState =
  | { phase: "loading" }
  | { phase: "ready"; profile: MemberProfile; recentReports: FullReport[] };

export const MyPageDashboardClient = () => {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({ phase: "loading" });

  useEffect(() => {
    const profile = getMemberProfile();

    // layout 가드에서 처리하므로 null이면 리다이렉트 중 — 로딩 유지
    if (!profile) return;

    // 회원의 리포트 필터
    const myOrders = listAllOrders()
      .filter(
        (o) => o.ownerType === "member" && o.memberId === profile!.memberId,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    const recentReports = myOrders
      .slice(0, 3)
      .map((order) => DUMMY_REPORTS[order.id])
      .filter(Boolean);

    setState({ phase: "ready", profile, recentReports });
  }, [router]);

  if (state.phase === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2"
            style={{
              borderColor: "rgba(230, 230, 250, 0.2)",
              borderTopColor: "#BEAEDB",
            }}
            aria-hidden="true"
          />
          <p className="text-sm" style={{ color: "#D4C5E2" }}>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { profile, recentReports } = state;

  const handleProfileChange = (next: MemberProfile) => {
    setState((prev) =>
      prev.phase === "ready" ? { ...prev, profile: next } : prev,
    );
  };

  return (
    <div>
      {/* 프로필 헤더 */}
      <div className="mb-8">
        <ProfileCard
          profile={profile}
          onProfileChange={handleProfileChange}
        />
      </div>

      {/* 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
            borderColor: "rgba(230, 230, 250, 0.15)",
          }}
        >
          <p className="mb-2 text-sm" style={{ color: "#B8A8D8" }}>총 리포트</p>
          <p className="text-3xl font-bold" style={{ color: "#F0E6FA" }}>
            {recentReports.length}
          </p>
        </div>
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
            borderColor: "rgba(230, 230, 250, 0.15)",
          }}
        >
          <p className="mb-2 text-sm" style={{ color: "#B8A8D8" }}>구매한 분석</p>
          <p className="text-3xl font-bold" style={{ color: "#F0E6FA" }}>
            {recentReports.reduce((sum, report) => {
              if (!report.paidQuestions) return sum;
              return sum + report.paidQuestions.filter((q) => q.isPurchased).length;
            }, 0)}
          </p>
        </div>
      </div>

      {/* 최근 리포트 */}
      {recentReports.length > 0 && (
        <section className="mt-10">
          <h2
            className="mb-4 text-lg font-semibold md:text-xl"
            style={{ color: "#F0E6FA" }}
          >
            최근 리포트
          </h2>
          <div className="grid gap-4 md:gap-6">
            {recentReports.map((report) => (
              <Link
                key={report.sessionId}
                href={`/report/${report.sessionId}`}
                className="rounded-2xl border p-5 md:p-6 transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
                  borderColor: "rgba(230, 230, 250, 0.15)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium" style={{ color: "#B8A8D8" }}>
                      {report.category}
                    </p>
                    <p className="mb-2 font-semibold" style={{ color: "#F0E6FA" }}>
                      {report.freeReport?.headline || "분석 리포트"}
                    </p>
                    <p className="text-xs" style={{ color: "#B8A8D8" }}>
                      {new Date(report.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(100, 149, 237, 0.2)",
                        color: "#BEAEDB",
                      }}
                    >
                      보기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 빈 상태 */}
      {recentReports.length === 0 && (
        <section className="mt-10 text-center">
          <p className="mb-4" style={{ color: "#D4C5E2" }}>아직 분석 리포트가 없어요.</p>
          <Link
            href="/analyze"
            className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
            }}
          >
            지금 시작하기 →
          </Link>
        </section>
      )}
    </div>
  );
};
