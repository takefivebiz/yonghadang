import { type Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { AdminOrderSummary, AdminUser } from "@/types/admin";
import { OrderStatus } from "@/types/order";

interface PageProps {
  params: Promise<{ "user-id": string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { "user-id": userId } = await params;
  return {
    title: `유저 상세 ${userId} | 코어로그 관리자`,
    robots: { index: false, follow: false },
  };
};

/** 주문 상태 배지 */
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const MAP: Record<OrderStatus, { label: string; className: string }> = {
    done:       { label: "완료",    className: "bg-emerald-100 text-emerald-700" },
    generating: { label: "생성중",  className: "bg-amber-100 text-amber-700" },
    pending:    { label: "대기중",  className: "bg-gray-100 text-gray-600" },
    error:      { label: "오류",    className: "bg-red-100 text-red-600" },
  };
  const { label, className } = MAP[status];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

/** 정보 행 */
const InfoRow = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="w-28 flex-shrink-0 text-sm font-medium" style={{ color: '#B8A8D8' }}>{label}</span>
      <span className="text-sm" style={{ color: '#F0E6FA' }}>{value}</span>
    </div>
  ) : null;

/** ISO 날짜 → 한국어 형식 */
const formatDateKo = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

/** ISO 날짜 → "YYYY.MM.DD HH:MM" */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").slice(0, -1);
  const time = d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date} ${time}`;
};

/** 주문 내역 행 */
const OrderRow = ({ order }: { order: AdminOrderSummary }) => (
  <Link
    href={`/admin/order-list/${order!.id}`}
    className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b px-5 py-4 text-sm transition-colors last:border-b-0 hover:bg-blue-500/10"
    style={{ borderColor: 'rgba(230, 230, 250, 0.1)' }}
  >
    <div className="min-w-0">
      <p className="font-medium" style={{ color: '#F0E6FA' }}>{order!.category} 분석</p>
      <p className="truncate text-xs" style={{ color: '#B8A8D8' }}>{order!.id}</p>
    </div>
    <span className="hidden text-xs sm:block" style={{ color: '#B8A8D8' }}>{formatDate(order.createdAt)}</span>
    <span className="font-semibold" style={{ color: '#F0E6FA' }}>{order!.amount.toLocaleString()}원</span>
    <div className="flex items-center gap-1">
      <StatusBadge status={order!.status} />
      <ChevronRight size={14} style={{ color: 'rgba(255, 255, 255, 0.2)' }} />
    </div>
  </Link>
);

/**
 * PRD 7-6 유저 상세 (/admin/user-list/[user-id]).
 * - 유저 기본 정보 카드
 * - 해당 유저의 전체 주문 내역 리스트 → 주문 상세(7-4)로 이동
 *
 * TODO: [백엔드 연동] /api/admin/users/[id] 실제 호출로 교체
 */
const AdminUserDetailPage = async ({ params }: PageProps) => {
  await params;

  // TODO: [백엔드 연동] /api/admin/users/{userId}에서 실제 데이터 조회
  const result = null;

  if (!result) {
    return <div style={{ color: "#D4C5E2" }}>사용자 정보를 불러올 수 없습니다. 백엔드 구현이 필요합니다.</div>;
  }
  const { user, orders } = result;

  const PROVIDER_LABEL: Record<string, string> = {
    google: "Google 소셜 로그인",
    kakao: "Kakao 소셜 로그인",
    guest: "비회원 (전화번호)",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 뒤로가기 */}
      <Link
        href="/admin/user-list"
        className="flex items-center gap-1.5 text-sm transition-colors hover:text-purple-200"
        style={{ color: '#B8A8D8' }}
      >
        <ArrowLeft size={16} />
        유저 관리
      </Link>

      {/* 유저 헤더 */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold" style={{ background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)', color: '#FFFFFF' }}>
          {(user as AdminUser).nickname.slice(0, 1)}
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0E6FA' }}>{(user as AdminUser).nickname}</h1>
          <span className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${(user as AdminUser).userType === "member" ? "bg-purple-500/20 text-purple-300" : "bg-orange-500/20 text-orange-300"}`}>
            {(user as AdminUser).userType === "member" ? "회원" : "비회원"}
          </span>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="flex flex-col gap-4 rounded-2xl p-6 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
        <h2 className="text-base font-semibold" style={{ color: '#F0E6FA' }}>기본 정보</h2>
        <div className="flex flex-col gap-3">
          <InfoRow label="이메일" value={(user as AdminUser).email} />
          <InfoRow label="연락처" value={(user as AdminUser).phone} />
          <InfoRow label="가입 경로" value={PROVIDER_LABEL[(user as AdminUser).provider ?? "guest"]} />
          <InfoRow label="가입 일시" value={formatDateKo((user as AdminUser).joinedAt)} />
          <InfoRow label="누적 주문" value={`${(user as AdminUser).totalOrders}건`} />
          <InfoRow label="결제 여부" value={(user as AdminUser).hasPurchased ? "결제 완료" : "미결제"} />
        </div>
      </div>

      {/* 주문 내역 */}
      <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
        <div className="border-b px-5 py-4" style={{ borderColor: 'rgba(230, 230, 250, 0.15)' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F0E6FA' }}>
            전체 주문 내역
            <span className="ml-2 text-sm font-normal" style={{ color: '#B8A8D8' }}>{(orders as AdminOrderSummary[]).length}건</span>
          </h2>
        </div>

        {(orders as AdminOrderSummary[]).length === 0 ? (
          <p className="py-12 text-center text-sm" style={{ color: '#B8A8D8' }}>주문 내역이 없습니다.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ borderColor: 'rgba(230, 230, 250, 0.15)', color: '#B8A8D8', background: 'rgba(100, 149, 237, 0.08)' }}>
              <span>콘텐츠</span>
              <span className="hidden sm:block">주문 일시</span>
              <span>금액</span>
              <span>상태</span>
            </div>
            {(orders as AdminOrderSummary[]).map((order) => (
              <OrderRow key={order!.id} order={order} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
