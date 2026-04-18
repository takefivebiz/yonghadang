import Link from "next/link";
import { Order, OrderStatus } from "@/types/order";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";

interface OrderHistoryListProps {
  orders: Order[];
}

const CATEGORY_LABELS: Record<string, string> = {
  mbti: "MBTI",
  saju: "사주",
  tarot: "타로",
  astrology: "점성술",
};

const STATUS_META: Record<
  OrderStatus,
  { label: string; bg: string; fg: string }
> = {
  pending: { label: "결제 대기", bg: "#FFF3E0", fg: "#B26A00" },
  generating: { label: "분석 중", bg: "#EDE0F8", fg: "#6B4B8A" },
  done: { label: "완료", bg: "#E8F5E9", fg: "#2E7D32" },
  error: { label: "오류", bg: "#FDECEA", fg: "#C62828" },
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${dd}`;
};

/**
 * 마이페이지 구매 내역 리스트.
 * - 최신순(createdAt 내림차순)으로 정렬된 주문 전달 가정.
 * - 각 카드 → /report/[order-id] 로 이동.
 * - 빈 상태: 안내 문구 + 탐색 CTA.
 */
export const OrderHistoryList = ({ orders }: OrderHistoryListProps) => {
  if (orders.length === 0) {
    return (
      <div
        className="rounded-3xl border border-dashed border-[#E8D4F0] bg-white/70 px-6 py-12 text-center"
      >
        <div className="mx-auto mb-4 text-4xl opacity-60" aria-hidden="true">
          🌙
        </div>
        <p className="mb-1 text-base font-semibold text-[#4A3B5C]">
          아직 구매한 분석이 없어요
        </p>
        <p className="mb-6 text-sm text-[#4A3B5C]/60">
          지금 나를 위한 첫 번째 이야기를 시작해보세요
        </p>
        <Link
          href="/start"
          className="inline-block rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
          style={{
            backgroundColor: "#4A3B5C",
            color: "#F5F0E8",
            boxShadow: "0 4px 20px rgba(74, 59, 92, 0.25)",
          }}
        >
          분석 시작하기
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => {
        const content = DUMMY_CONTENTS.find((c) => c.slug === order.contentSlug);
        const meta = STATUS_META[order.status];
        const categoryLabel =
          CATEGORY_LABELS[order.category] ?? order.category;

        return (
          <li key={order.id}>
            <Link
              href={`/report/${order.id}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#E8D4F0]/70 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4A3B5C]/40 hover:shadow-md sm:px-5"
            >
              {/* 썸네일 */}
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl sm:h-16 sm:w-16"
                style={{
                  background: content
                    ? `linear-gradient(135deg, ${content.gradientFrom}33, ${content.gradientTo}55)`
                    : "linear-gradient(135deg, #E8D4F0, #F5D7E8)",
                }}
                aria-hidden="true"
              >
                {content?.thumbnailEmoji ?? "✨"}
              </div>

              {/* 본문 */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#4A3B5C]/10 px-2 py-0.5 text-[11px] font-medium text-[#4A3B5C]">
                    {categoryLabel}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: meta.bg, color: meta.fg }}
                  >
                    {meta.label}
                  </span>
                </div>
                <h3 className="truncate text-sm font-bold text-[#4A3B5C] sm:text-base">
                  {content?.title ?? order.contentSlug}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-[#4A3B5C]/60">
                  <span>{formatDate(order.createdAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{order.amount.toLocaleString("ko-KR")}원</span>
                </div>
              </div>

              {/* 화살표 */}
              <span
                aria-hidden="true"
                className="text-xl text-[#9B88AC] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#4A3B5C]"
              >
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
