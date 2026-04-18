import { Content } from "@/types/content";
import { PendingOrderInput } from "@/types/payment";

const CATEGORY_LABELS: Record<string, string> = {
  mbti: "MBTI",
  saju: "사주",
  tarot: "타로",
  astrology: "점성술",
};

interface OrderSummaryProps {
  content: Content;
  /** /start 에서 sessionStorage 로 전달된 입력 정보 — 없으면 안내 문구 표시 */
  pendingInput: PendingOrderInput | null;
}

/**
 * PRD 6-5: "선택한 리포트 요약 (제목, 가격)" + "입력 정보 요약"
 * 두 섹션을 하나의 카드로 묶어 결제 페이지 상단에 표시.
 */
export const OrderSummary = ({ content, pendingInput }: OrderSummaryProps) => {
  return (
    <div
      className="overflow-hidden rounded-3xl"
      style={{ border: "1.5px solid rgba(74, 59, 92, 0.1)" }}
    >
      {/* ── 리포트 헤더 (썸네일 + 제목 + 가격) ── */}
      <div
        className="flex items-center gap-4 px-5 py-5"
        style={{
          background: `linear-gradient(135deg, ${content.gradientFrom}, ${content.gradientTo})`,
        }}
      >
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-3xl backdrop-blur-sm"
          role="img"
          aria-label={content.title}
        >
          {content.thumbnailEmoji}
        </span>
        <div className="min-w-0 flex-1">
          <span className="mb-1 inline-block rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium text-deep-purple backdrop-blur-sm">
            {CATEGORY_LABELS[content.category]}
          </span>
          <h2 className="truncate text-base font-bold text-deep-purple">
            {content.title}
          </h2>
        </div>
      </div>

      {/* ── 본문 — 가격 + 입력 정보 요약 ── */}
      <div
        className="space-y-4 px-5 py-5"
        style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
      >
        {/* 입력 정보 요약 */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            입력 정보 요약
          </p>

          {pendingInput && pendingInput.summary.length > 0 ? (
            <ul className="space-y-1.5">
              {pendingInput.summary.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="shrink-0 text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="min-w-0 text-right font-medium text-foreground/85">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              이전 단계에서 입력한 정보는 결제 완료 후 AI 분석에 사용됩니다.
            </p>
          )}
        </div>

        {/* 구분선 */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: "rgba(74, 59, 92, 0.1)" }}
        />

        {/* 가격 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">최종 결제 금액</span>
          <span className="font-display text-2xl font-bold text-deep-purple">
            {content.price.toLocaleString("ko-KR")}
            <span className="ml-0.5 text-sm font-medium">원</span>
          </span>
        </div>
      </div>
    </div>
  );
};
