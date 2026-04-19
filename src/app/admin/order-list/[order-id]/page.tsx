import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderActions } from "./_components/order-actions";
import { getAdminOrderDetail } from "@/lib/dummy-admin";
import { OrderStatus } from "@/types/order";

interface PageProps {
  params: Promise<{ "order-id": string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { "order-id": orderId } = await params;
  return {
    title: `주문 상세 ${orderId} | 용하당 관리자`,
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
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${className}`}>
      {label}
    </span>
  );
};

/** 정보 행 */
const InfoRow = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="w-32 flex-shrink-0 text-sm font-medium text-foreground/50">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  ) : null;

/** ISO 날짜 → 한국어 형식 */
const formatDateKo = (iso?: string) => {
  if (!iso) return undefined;
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

/**
 * PRD 7-4 상세 주문 내역 (/admin/order-list/[order-id]).
 * - 구매자 정보, 결제 정보, 입력 데이터, AI 생성 텍스트 표시
 * - LLM 재생성 버튼, 환불 처리 버튼 (더미)
 *
 * TODO: [백엔드 연동] /api/admin/orders/[id] 실제 호출로 교체
 */
const AdminOrderDetailPage = async ({ params }: PageProps) => {
  const { "order-id": orderId } = await params;

  // TODO: [백엔드 연동] 더미데이터를 /api/admin/orders/[id] 실제 호출로 교체
  const order = getAdminOrderDetail(orderId);
  if (!order) notFound();

  const CATEGORY_LABEL: Record<string, string> = {
    mbti: "MBTI", saju: "사주", tarot: "타로", astrology: "점성술",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/order-list"
          className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground"
        >
          <ArrowLeft size={16} />
          주문 내역
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{order.contentTitle}</h1>
          <p className="mt-1 text-sm text-foreground/50">{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 구매자 정보 */}
        <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">구매자 정보</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="구분" value={order.ownerType === "member" ? "회원" : "비회원"} />
            <InfoRow label="닉네임" value={order.nickname} />
            <InfoRow label="이메일" value={order.email} />
            <InfoRow label="연락처" value={order.phone} />
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">결제 정보</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="콘텐츠 종류" value={CATEGORY_LABEL[order.category]} />
            <InfoRow label="결제 금액" value={`${order.amount.toLocaleString()}원`} />
            <InfoRow label="주문 일시" value={formatDateKo(order.createdAt)} />
            <InfoRow label="승인 일시" value={formatDateKo(order.approvedAt)} />
          </div>
        </div>

        {/* 유저 입력 데이터 */}
        <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">입력 정보</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(order.inputData).map(([key, value]) => (
              <InfoRow key={key} label={key} value={value} />
            ))}
          </div>
        </div>

        {/* AI 리포트 */}
        <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">AI 해석 결과</h2>
          {order.reportText ? (
            <p className="text-sm leading-relaxed text-foreground/80">{order.reportText}</p>
          ) : (
            <p className="text-sm text-foreground/40">
              {order.status === "generating"
                ? "현재 AI가 해석을 생성 중입니다."
                : order.status === "error"
                ? "AI 해석 생성 중 오류가 발생했습니다."
                : "해석 내용이 없습니다."}
            </p>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <OrderActions />
    </div>
  );
};

export default AdminOrderDetailPage;
