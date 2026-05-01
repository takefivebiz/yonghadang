import { type Metadata } from "next";
import { TrendingUp, TrendingDown, ShoppingCart, Users, FileText, DollarSign } from "lucide-react";
import { SalesSummary, MonthlySales } from "@/types/admin";

export const metadata: Metadata = {
  title: "매출 조회 | 코어로그 관리자",
  robots: { index: false, follow: false },
};

/** 숫자를 원화 형식으로 포맷 */
const formatKRW = (amount: number) =>
  amount.toLocaleString("ko-KR") + "원";

/** 월 레이블을 짧게 변환 (예: "2026-04" → "4월") */
const formatMonth = (month: string) => {
  const [, m] = month.split("-");
  return `${parseInt(m, 10)}월`;
};

/** 핵심 지표 카드 컴포넌트 */
const StatCard = ({
  label,
  value,
  changeRate,
  icon: Icon,
}: {
  label: string;
  value: string;
  changeRate: number;
  icon: React.ElementType;
}) => {
  const isPositive = changeRate >= 0;
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-5 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: '#B8A8D8' }}>{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(100, 149, 237, 0.2)' }}>
          <Icon size={18} style={{ color: '#6495ED' }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: '#F0E6FA' }}>{value}</p>
      <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>전월 대비 {isPositive ? "+" : ""}{changeRate.toFixed(1)}%</span>
      </div>
    </div>
  );
};

/**
 * CSS-only 바 차트 — recharts 미설치 환경에서 월별 매출 시각화.
 */
const SalesBarChart = ({ data }: { data: MonthlySales[] }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="flex h-48 items-end gap-3">
      {data.map(({ month, revenue }) => {
        const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
        return (
          <div
            key={month}
            className="group relative flex flex-1 flex-col items-center gap-2"
          >
            {/* 툴팁 */}
            <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded-md px-2 py-1 text-xs group-hover:block" style={{ background: 'rgba(100, 149, 237, 0.9)', color: '#FFFFFF' }}>
              {formatKRW(revenue)}
            </div>
            {/* 바 */}
            <div
              className="w-full rounded-t-md transition-opacity hover:opacity-80"
              style={{
                height: `${heightPercent}%`,
                minHeight: "4px",
                background: 'linear-gradient(180deg, #6495ED 0%, #A366FF 100%)',
              }}
            />
            {/* 월 레이블 */}
            <span className="text-xs" style={{ color: '#B8A8D8' }}>{formatMonth(month)}</span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * PRD 7-2 관리자 메인 / 매출 조회 (/admin).
 * - 핵심 지표 요약 카드 (총 매출, 주문 수, 신규 유저, AI 해석 건수)
 * - 최근 8개월 월별 매출 바 차트
 *
 * TODO: [백엔드 연동] /api/admin/sales 실제 호출로 교체
 */
const AdminDashboardPage = () => {
  // TODO: [백엔드 연동] 더미데이터를 /api/admin/sales 실제 호출로 교체
  const summary: SalesSummary = {
    totalRevenue: 0,
    totalOrders: 0,
    newUsers: 0,
    totalReports: 0,
    revenueChangeRate: 0,
    ordersChangeRate: 0,
    usersChangeRate: 0,
    reportsChangeRate: 0,
    monthlySales: [],
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#F0E6FA' }}>매출 조회</h1>
        <p className="mt-1 text-sm" style={{ color: '#B8A8D8' }}>서비스 핵심 지표와 매출 현황을 확인합니다.</p>
      </div>

      {/* 핵심 지표 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="총 매출액"
          value={formatKRW(summary.totalRevenue)}
          changeRate={summary.revenueChangeRate}
          icon={DollarSign}
        />
        <StatCard
          label="총 주문 수"
          value={`${summary.totalOrders.toLocaleString()}건`}
          changeRate={summary.ordersChangeRate}
          icon={ShoppingCart}
        />
        <StatCard
          label="신규 유저 수"
          value={`${summary.newUsers.toLocaleString()}명`}
          changeRate={summary.usersChangeRate}
          icon={Users}
        />
        <StatCard
          label="누적 AI 해석"
          value={`${summary.totalReports.toLocaleString()}건`}
          changeRate={summary.reportsChangeRate}
          icon={FileText}
        />
      </div>

      {/* 월별 매출 차트 */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
        <h2 className="mb-6 text-base font-semibold" style={{ color: '#F0E6FA' }}>
          월별 매출 추이 (최근 8개월)
        </h2>
        <SalesBarChart data={summary.monthlySales} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
