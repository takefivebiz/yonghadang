import Link from "next/link";
import { ContentDetail } from "@/types/content-detail";

const CATEGORY_LABELS: Record<string, string> = {
  mbti: "MBTI",
  saju: "사주",
  tarot: "타로",
  astrology: "점성술",
};

interface ContentDetailPageProps {
  detail: ContentDetail;
}

/**
 * 개별 콘텐츠 상세 페이지 공통 레이아웃 — PRD 6-4
 * 기본 분석(무료 공개) + 추가 분석(블러 + CTA 오버레이) + 하단 Sticky CTA
 */
export const ContentDetailPage = ({ detail }: ContentDetailPageProps) => {
  const startHref = `/start?preselect=${detail.slug}`;

  return (
    // 하단 Sticky CTA 공간 확보
    <div className="pb-28">
      {/* ── 콘텐츠 헤더 ── */}
      <div className="relative overflow-hidden">
        {/* 그래디언트 이미지 영역 */}
        <div
          className="flex flex-col items-center justify-center px-4 py-16 md:py-20"
          style={{
            background: `linear-gradient(135deg, ${detail.gradientFrom}, ${detail.gradientTo})`,
          }}
        >
          <span className="mb-4 text-8xl md:text-9xl" role="img" aria-label={detail.title}>
            {detail.thumbnailEmoji}
          </span>
        </div>

        {/* 콘텐츠 정보 */}
        <div className="mx-auto max-w-2xl px-4 py-8">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "rgba(74, 59, 92, 0.07)",
              color: "#9B88AC",
            }}
          >
            {CATEGORY_LABELS[detail.category]}
          </span>

          <h1 className="font-display mb-3 text-2xl font-bold text-deep-purple md:text-3xl">
            {detail.title}
          </h1>

          <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
            {detail.longDescription}
          </p>

          {/* 분석 항목 */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "rgba(232, 212, 240, 0.2)",
              border: "1px solid rgba(74, 59, 92, 0.08)",
            }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              포함 분석 항목
            </p>
            <ul className="space-y-2">
              {detail.analysisItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground/75">
                  <span style={{ color: "#C4AED8" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 가격 */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">리포트 가격</span>
            <span className="text-xl font-bold text-deep-purple">
              {detail.price.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-2xl px-4"
        style={{ borderTop: "1px solid rgba(74, 59, 92, 0.08)" }}
      >
        {/* ── 기본 분석 섹션 (무료 공개) ── */}
        <section className="py-10">
          <div className="mb-5 flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
            >
              무료
            </span>
            <h2 className="text-base font-bold text-deep-purple">
              {detail.freeSection.title}
            </h2>
          </div>

          <div className="space-y-4">
            {detail.freeSection.paragraphs.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/75">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* ── 추가 분석 섹션 (포함 내용 미리보기 + CTA) ── */}
        <section className="relative mb-10">
          <div className="mb-5 flex items-center gap-2">
            <span className="text-base">🔒</span>
            <h2 className="text-base font-bold text-deep-purple">전체 분석</h2>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
            >
              유료
            </span>
          </div>

          {/* 블러 처리된 섹션들 */}
          <div className="relative">
            <div className="space-y-3">
              {detail.premiumSections.map((section, i) => (
                <div
                  key={i}
                  className="rounded-2xl px-5 py-5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(74, 59, 92, 0.08)",
                  }}
                >
                  <h3 className="mb-3 text-sm font-semibold text-deep-purple">
                    {section.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-foreground/80"
                    style={{ filter: "blur(5px)", userSelect: "none" }}
                    aria-hidden="true"
                  >
                    {section.blurredContent}
                  </p>
                </div>
              ))}
            </div>

            {/* 그라디언트 + CTA 오버레이 */}
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-6"
              style={{
                top: "20%",
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(245,240,232,0.88) 30%, #F5F0E8 55%)",
              }}
            >
              <Link
                href={startHref}
                className="rounded-full px-10 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "#4A3B5C",
                  color: "#F5F0E8",
                  boxShadow: "0 6px 32px rgba(74, 59, 92, 0.4)",
                }}
              >
                전체 분석 시작하기 ✦
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">
                {detail.price.toLocaleString("ko-KR")}원 · 평균 3분 완성
              </p>
            </div>
          </div>
        </section>

        {/* ── 안내 및 주의사항 ── */}
        <section
          className="rounded-2xl p-5 py-10"
          style={{
            borderTop: "1px solid rgba(74, 59, 92, 0.08)",
          }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            안내 및 주의사항
          </p>
          <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li>· 보통 3분 이내에 분석이 완료됩니다.</li>
            <li>· 각 분야의 해석은 AI를 통해 데이터를 기반으로 생성됩니다.</li>
            <li>
              · 이 해석은 자기 이해를 돕기 위한 참고 자료이며, 의학적·심리학적
              진단을 대체하지 않습니다.
            </li>
          </ul>
        </section>
      </div>

      {/* ── 하단 Sticky CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3"
        style={{
          background:
            "linear-gradient(to top, rgba(250,248,252,1) 70%, rgba(250,248,252,0))",
        }}
      >
        <Link
          href={startHref}
          className="block w-full max-w-lg mx-auto rounded-full py-4 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "#4A3B5C",
            color: "#F5F0E8",
            boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
          }}
        >
          시작하기 — {detail.price.toLocaleString("ko-KR")}원
        </Link>
      </div>
    </div>
  );
};
