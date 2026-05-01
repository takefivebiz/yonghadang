import { type Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { QuestionAnalytic } from "@/types/admin";

export const metadata: Metadata = {
  title: "질문 분석 | 코어로그 관리자",
  robots: { index: false, follow: false },
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

/**
 * 질문 분석 페이지 (8-7).
 * 가장 많이 선택된 질문 TOP 20, 클릭률, 전환율 등을 표시.
 *
 * TODO: [백엔드 연동] /api/admin/analytics/questions 실제 호출로 교체
 */
const QuestionAnalyticsPage = () => {
  const analytics: QuestionAnalytic[] = []; // TODO: [백엔드 연동] /api/admin/analytics/questions

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#F0E6FA' }}>
          질문 분석
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#B8A8D8' }}>
          가장 많이 선택된 질문과 전환율을 확인합니다.
        </p>
      </div>

      {/* 인사이트 영역 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 최고 전환율 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
            전환율 1위
          </h3>
          <p className="mt-2 text-base" style={{ color: "#F0E6FA" }}>
            {analytics[0]?.title}
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color: "#6495ED" }}>
            {formatPercent(analytics[0]?.conversionRate || 0)}
          </p>
        </div>

        {/* 최고 클릭 수 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
            클릭 수 1위
          </h3>
          <p className="mt-2 text-base" style={{ color: "#F0E6FA" }}>
            {analytics[0]?.title}
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color: "#A366FF" }}>
            {analytics[0]?.clickCount.toLocaleString()}회
          </p>
        </div>

        {/* 평균 구매 개수 */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "#B8A8D8" }}>
            평균 구매 개수 (TOP 1위)
          </h3>
          <p className="mt-2 text-base" style={{ color: "#F0E6FA" }}>
            {analytics[0]?.title}
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color: "#00D084" }}>
            {analytics[0]?.avgPurchaseCount.toFixed(1)}개
          </p>
        </div>
      </div>

      {/* TOP 20 질문 테이블 */}
      <div
        className="rounded-2xl p-6 shadow-sm overflow-x-auto"
        style={{
          background:
            "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))",
          border: "1px solid rgba(230, 230, 250, 0.15)",
        }}
      >
        <h2 className="mb-4 text-base font-semibold" style={{ color: "#F0E6FA" }}>
          가장 많이 선택된 질문 TOP 20
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(230, 230, 250, 0.2)" }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: "#B8A8D8" }}>
                순위
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: "#B8A8D8" }}>
                질문
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: "#B8A8D8" }}>
                클릭 수
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: "#B8A8D8" }}>
                클릭률
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: "#B8A8D8" }}>
                전환율
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: "#B8A8D8" }}>
                평균 구매 개수
              </th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((item, index) => (
              <tr
                key={item.questionId}
                className="border-b hover:bg-opacity-50 transition-colors"
                style={{ borderColor: "rgba(230, 230, 250, 0.1)" }}
              >
                <td className="px-4 py-3" style={{ color: "#F0E6FA" }}>
                  <span className="font-semibold">{index + 1}</span>
                </td>
                <td className="px-4 py-3 max-w-xs" style={{ color: "#D8C9E8" }}>
                  <span className="line-clamp-2">{item.title}</span>
                </td>
                <td className="px-4 py-3 text-right" style={{ color: "#F0E6FA" }}>
                  {item.clickCount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right" style={{ color: "#F0E6FA" }}>
                  {formatPercent(item.clickRate)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span style={{ color: "#F0E6FA" }}>
                      {formatPercent(item.conversionRate)}
                    </span>
                    <TrendingUp size={14} style={{ color: "#6495ED" }} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right" style={{ color: "#F0E6FA" }}>
                  {item.avgPurchaseCount.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionAnalyticsPage;
