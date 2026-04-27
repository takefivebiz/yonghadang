import { type Metadata } from "next";
import { BarChart3, TrendingUp } from "lucide-react";
import { DUMMY_REPORT_ANALYTICS } from "@/lib/dummy-admin";

export const metadata: Metadata = {
  title: "리포트 분석 | 코어로그 관리자",
  robots: { index: false, follow: false },
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

/**
 * 리포트 분석 페이지 (8-8).
 * 무료 vs 유료 리포트 비율, 성공/실패율, 평균 길이 등을 표시.
 *
 * TODO: [백엔드 연동] /api/admin/analytics/reports 실제 호출로 교체
 */
const ReportAnalyticsPage = () => {
  const analytics = DUMMY_REPORT_ANALYTICS;
  const totalReports = analytics.freeReportCount + analytics.paidReportCount;
  const freePercent =
    ((analytics.freeReportCount / totalReports) * 100).toFixed(1);
  const paidPercent =
    ((analytics.paidReportCount / totalReports) * 100).toFixed(1);

  // 원형 차트용 비율 (CSS) 계산
  const freePercentNum = parseFloat(freePercent);

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F0E6FA" }}>
          리포트 분석
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#B8A8D8" }}>
          무료/유료 리포트 비율과 생성 성공률을 확인합니다.
        </p>
      </div>

      {/* 주요 지표 그리드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 무료 vs 유료 리포트 비율 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h2 className="mb-6 text-base font-semibold" style={{ color: "#F0E6FA" }}>
            무료 vs 유료 리포트 비율
          </h2>

          <div className="flex items-center gap-8">
            {/* 원형 차트 (CSS) */}
            <div className="relative h-40 w-40 flex-shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                style={{ transform: "rotate(-90deg)" }}
              >
                {/* 무료 리포트 세그먼트 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(100, 149, 237, 0.3)"
                  strokeWidth="12"
                  strokeDasharray={`${(freePercentNum / 100) * 251.2} 251.2`}
                />
                {/* 유료 리포트 세그먼트 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(163, 102, 255, 0.5)"
                  strokeWidth="12"
                  strokeDasharray={`${((100 - freePercentNum) / 100) * 251.2} 251.2`}
                  style={{
                    strokeDashoffset: `${
                      -((freePercentNum / 100) * 251.2)
                    }px`,
                  }}
                />
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center flex-col"
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: "#F0E6FA" }}
                >
                  {freePercent}%
                </span>
                <span className="text-xs" style={{ color: "#B8A8D8" }}>
                  무료
                </span>
              </div>
            </div>

            {/* 범례 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: "rgba(100, 149, 237, 0.6)" }}
                />
                <span style={{ color: "#D8C9E8" }}>
                  무료: {analytics.freeReportCount.toLocaleString()}건
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: "rgba(163, 102, 255, 0.8)" }}
                />
                <span style={{ color: "#D8C9E8" }}>
                  유료: {analytics.paidReportCount.toLocaleString()}건
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: "rgba(100, 149, 237, 0.3)" }}
                />
                <span style={{ color: "#B8A8D8" }}>
                  총 {totalReports.toLocaleString()}건
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 생성 성공/실패율 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h2 className="mb-6 text-base font-semibold" style={{ color: "#F0E6FA" }}>
            생성 성공/실패율
          </h2>

          <div className="flex items-end gap-4">
            {/* 성공 바 */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg transition-opacity hover:opacity-80"
                style={{
                  height: `${analytics.successRate * 2}px`,
                  background: "linear-gradient(180deg, #00D084 0%, #00A863 100%)",
                  minHeight: "4px",
                }}
              />
              <div className="text-center">
                <p
                  className="text-lg font-bold"
                  style={{ color: "#F0E6FA" }}
                >
                  {formatPercent(analytics.successRate)}
                </p>
                <p className="text-xs" style={{ color: "#B8A8D8" }}>
                  성공
                </p>
              </div>
            </div>

            {/* 실패 바 */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg transition-opacity hover:opacity-80"
                style={{
                  height: `${analytics.failureRate * 2}px`,
                  background: "linear-gradient(180deg, #FF6B6B 0%, #FF4757 100%)",
                  minHeight: "4px",
                }}
              />
              <div className="text-center">
                <p
                  className="text-lg font-bold"
                  style={{ color: "#F0E6FA" }}
                >
                  {formatPercent(analytics.failureRate)}
                </p>
                <p className="text-xs" style={{ color: "#B8A8D8" }}>
                  실패
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 지표 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 평균 길이 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
              평균 리포트 길이
            </h3>
            <BarChart3 size={18} style={{ color: "#6495ED" }} />
          </div>
          <p className="mt-3 text-3xl font-bold" style={{ color: "#F0E6FA" }}>
            {analytics.avgLength.toLocaleString()}
          </p>
          <p className="mt-1 text-xs" style={{ color: "#B8A8D8" }}>
            글자
          </p>
        </div>

        {/* 평균 체류 시간 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
              평균 체류 시간
            </h3>
            <TrendingUp size={18} style={{ color: "#6495ED" }} />
          </div>
          <p className="mt-3 text-3xl font-bold" style={{ color: "#F0E6FA" }}>
            {Math.floor(analytics.avgRetentionTime / 60)}분
          </p>
          <p className="mt-1 text-xs" style={{ color: "#B8A8D8" }}>
            {analytics.avgRetentionTime}초
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalyticsPage;
