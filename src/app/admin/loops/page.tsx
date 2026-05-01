import { type Metadata } from "next";
import { TrendingUp, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "탐색 루프 분석 | 코어로그 관리자",
  robots: { index: false, follow: false },
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

/**
 * 탐색 루프 분석 페이지 (8-9).
 * 평균 루프 깊이, 단계별 전환율, 이탈 지점 등을 표시.
 *
 * TODO: [백엔드 연동] /api/admin/analytics/loops 실제 호출로 교체
 */
const LoopAnalyticsPage = () => {
  // TODO: [백엔드 연동] 실제 데이터는 /api/admin/analytics/loops에서 조회
  const analytics = {
    avgLoopDepth: 0,
    depth1Users: 0,
    depth2Users: 0,
    depth3Users: 0,
    depth1To2ConversionRate: 0,
    depth2To3ConversionRate: 0,
    dropoffPoint: 'depth1' as const,
    avgQuestionsPerUser: 0,
  };
  const totalUsers =
    analytics.depth1Users +
    analytics.depth2Users +
    analytics.depth3Users;

  const depth1Percent = ((analytics.depth1Users / totalUsers) * 100).toFixed(1);
  const depth2Percent = ((analytics.depth2Users / totalUsers) * 100).toFixed(1);
  const depth3Percent = ((analytics.depth3Users / totalUsers) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F0E6FA" }}>
          탐색 루프 분석
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#B8A8D8" }}>
          유저 탐색 깊이와 단계별 전환율을 확인합니다.
        </p>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 평균 루프 깊이 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
            평균 탐색 깊이
          </h3>
          <p className="mt-3 text-3xl font-bold" style={{ color: "#F0E6FA" }}>
            {analytics.avgLoopDepth.toFixed(2)}
          </p>
          <p className="mt-1 text-xs" style={{ color: "#B8A8D8" }}>
            (1~3 단계)
          </p>
        </div>

        {/* 1단계 → 2단계 전환율 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
            1단계 → 2단계 전환율
          </h3>
          <p className="mt-3 text-3xl font-bold" style={{ color: "#6495ED" }}>
            {formatPercent(analytics.depth1To2ConversionRate)}
          </p>
          <p className="mt-1 text-xs" style={{ color: "#B8A8D8" }}>
            <TrendingUp size={12} className="inline mr-1" />
            {analytics.depth2Users.toLocaleString()} / {analytics.depth1Users.toLocaleString()}
          </p>
        </div>

        {/* 2단계 → 3단계 전환율 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
            2단계 → 3단계 전환율
          </h3>
          <p className="mt-3 text-3xl font-bold" style={{ color: "#A366FF" }}>
            {formatPercent(analytics.depth2To3ConversionRate)}
          </p>
          <p className="mt-1 text-xs" style={{ color: "#B8A8D8" }}>
            <TrendingUp size={12} className="inline mr-1" />
            {analytics.depth3Users.toLocaleString()} / {analytics.depth2Users.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 루프 깊이 분포 */}
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
          border: "1px solid rgba(230, 230, 250, 0.15)",
        }}
      >
        <h2 className="mb-6 text-base font-semibold" style={{ color: "#F0E6FA" }}>
          루프 깊이별 사용자 분포
        </h2>

        <div className="flex items-end gap-8">
          {/* 1단계 */}
          <div className="flex flex-1 flex-col items-center gap-3">
            <div
              className="w-full rounded-t-lg transition-opacity hover:opacity-80"
              style={{
                height: `${(analytics.depth1Users / totalUsers) * 200}px`,
                background: "linear-gradient(180deg, #6495ED 0%, #4169E1 100%)",
                minHeight: "4px",
              }}
            />
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#F0E6FA" }}>
                {depth1Percent}%
              </p>
              <p className="text-xs" style={{ color: "#B8A8D8" }}>
                1단계
              </p>
              <p className="text-xs mt-1" style={{ color: "#B8A8D8" }}>
                {analytics.depth1Users.toLocaleString()}명
              </p>
            </div>
          </div>

          {/* 2단계 */}
          <div className="flex flex-1 flex-col items-center gap-3">
            <div
              className="w-full rounded-t-lg transition-opacity hover:opacity-80"
              style={{
                height: `${(analytics.depth2Users / totalUsers) * 200}px`,
                background: "linear-gradient(180deg, #A366FF 0%, #8A2BE2 100%)",
                minHeight: "4px",
              }}
            />
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#F0E6FA" }}>
                {depth2Percent}%
              </p>
              <p className="text-xs" style={{ color: "#B8A8D8" }}>
                2단계
              </p>
              <p className="text-xs mt-1" style={{ color: "#B8A8D8" }}>
                {analytics.depth2Users.toLocaleString()}명
              </p>
            </div>
          </div>

          {/* 3단계 */}
          <div className="flex flex-1 flex-col items-center gap-3">
            <div
              className="w-full rounded-t-lg transition-opacity hover:opacity-80"
              style={{
                height: `${(analytics.depth3Users / totalUsers) * 200}px`,
                background: "linear-gradient(180deg, #DA70D6 0%, #BA55D3 100%)",
                minHeight: "4px",
              }}
            />
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#F0E6FA" }}>
                {depth3Percent}%
              </p>
              <p className="text-xs" style={{ color: "#B8A8D8" }}>
                3단계
              </p>
              <p className="text-xs mt-1" style={{ color: "#B8A8D8" }}>
                {analytics.depth3Users.toLocaleString()}명
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4" style={{ borderColor: "rgba(230, 230, 250, 0.1)" }}>
          <p className="text-sm" style={{ color: "#B8A8D8" }}>
            총 {totalUsers.toLocaleString()}명 | 평균 구매 질문 수:{" "}
            <span style={{ color: "#F0E6FA" }}>
              {analytics.avgQuestionsPerUser.toFixed(1)}개
            </span>
          </p>
        </div>
      </div>

      {/* 이탈 지점 경고 */}
      <div
        className="rounded-2xl p-6 shadow-sm border-l-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 71, 87, 0.08))",
          border: "1px solid rgba(255, 107, 107, 0.2)",
          borderLeft: "4px solid rgba(255, 107, 107, 0.6)",
        }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            size={20}
            style={{ color: "#FF6B6B", flexShrink: 0, marginTop: "2px" }}
          />
          <div>
            <h3 className="font-semibold" style={{ color: "#FF6B6B" }}>
              주의: 주요 이탈 지점
            </h3>
            <p className="mt-1 text-sm" style={{ color: "#D8C9E8" }}>
              {analytics.dropoffPoint === "depth1"
                ? "1단계에서 대부분 이탈합니다. 무료 리포트의 설득력을 강화하세요."
                : analytics.dropoffPoint === "depth2"
                ? "2단계에서 많은 유저가 이탈합니다. 1~2단계 간 결제 전환 문구를 개선하세요."
                : "3단계 도달 이후 구독 모델 등 후행 상품이 필요합니다."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopAnalyticsPage;
