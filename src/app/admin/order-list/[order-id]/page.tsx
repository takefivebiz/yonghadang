import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OrderActions } from './_components/order-actions';
import { getAdminOrderDetail } from '@/lib/dummy-admin';
import { OrderStatus } from '@/types/order';

interface PageProps {
  params: Promise<{ 'order-id': string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { 'order-id': orderId } = await params;
  return {
    title: `주문 상세 ${orderId} | Corelog 관리자`,
    robots: { index: false, follow: false },
  };
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const MAP: Record<OrderStatus, { label: string; className: string }> = {
    done:       { label: '완료',   className: 'bg-emerald-100 text-emerald-700' },
    generating: { label: '생성중', className: 'bg-amber-100 text-amber-700' },
    pending:    { label: '대기중', className: 'bg-gray-100 text-gray-600' },
    error:      { label: '오류',   className: 'bg-red-100 text-red-600' },
  };
  const { label, className } = MAP[status];
  return <span className={`rounded-full px-3 py-1 text-sm font-medium ${className}`}>{label}</span>;
};

const InfoRow = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <span className="w-32 shrink-0 text-sm font-medium" style={{ color: '#B8A8D8' }}>{label}</span>
      <span className="text-sm" style={{ color: '#F0E6FA' }}>{value}</span>
    </div>
  ) : null;

const formatDateKo = (iso?: string) => {
  if (!iso) return undefined;
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

/**
 * 관리자 주문 상세 페이지.
 * TODO: [백엔드 연동] /api/admin/orders/[id] 실제 호출로 교체
 */
const AdminOrderDetailPage = async ({ params }: PageProps) => {
  const { 'order-id': orderId } = await params;
  const order = getAdminOrderDetail(orderId);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/order-list"
          className="flex items-center gap-1.5 text-sm transition-colors hover:text-purple-200"
          style={{ color: '#B8A8D8' }}
        >
          <ArrowLeft size={16} />
          주문 내역
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#F0E6FA' }}>{order.category} 분석</h1>
          <p className="mt-1 text-sm" style={{ color: '#B8A8D8' }}>{order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 구매자 정보 */}
        <div className="flex flex-col gap-4 rounded-2xl p-6 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F0E6FA' }}>구매자 정보</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="구분" value={order.ownerType === 'member' ? '회원' : '비회원'} />
            <InfoRow label="닉네임" value={order.nickname} />
            <InfoRow label="이메일" value={order.email} />
            <InfoRow label="연락처" value={order.phone} />
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="flex flex-col gap-4 rounded-2xl p-6 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F0E6FA' }}>결제 정보</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="카테고리" value={order.category} />
            <InfoRow label="결제 금액" value={`${order.amount.toLocaleString()}원`} />
            <InfoRow label="주문 일시" value={formatDateKo(order.createdAt)} />
            <InfoRow label="승인 일시" value={formatDateKo(order.approvedAt)} />
          </div>
        </div>

        {/* 유저 응답 데이터 */}
        <div className="flex flex-col gap-4 rounded-2xl p-6 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F0E6FA' }}>응답 데이터</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(order.answerData).map(([key, value]) => (
              <InfoRow key={key} label={key} value={Array.isArray(value) ? value.join(', ') : String(value)} />
            ))}
          </div>
        </div>

        {/* AI 리포트 */}
        <div className="flex flex-col gap-4 rounded-2xl p-6 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.08))', border: '1px solid rgba(230, 230, 250, 0.15)' }}>
          <h2 className="text-base font-semibold" style={{ color: '#F0E6FA' }}>무료 리포트 요약</h2>
          {order.freeReportText ? (
            <p className="text-sm leading-relaxed" style={{ color: '#D4C5E2' }}>{order.freeReportText}</p>
          ) : (
            <p className="text-sm" style={{ color: '#B8A8D8' }}>
              {order.status === 'generating'
                ? 'AI가 분석 중입니다.'
                : order.status === 'error'
                ? '분석 생성 중 오류가 발생했습니다.'
                : '리포트 내용이 없습니다.'}
            </p>
          )}
        </div>
      </div>

      <OrderActions />
    </div>
  );
};

export default AdminOrderDetailPage;
