import Link from "next/link";
import { Content } from "@/types/content";
import { DummyReport } from "@/lib/dummy-reports";
import { ReportShare } from "./report-share";

interface ReportViewProps {
  content: Content;
  report: DummyReport;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  mbti: "MBTI",
  saju: "사주",
  tarot: "타로",
  astrology: "점성술",
};

/**
 * PRD 6-6. 보고서 확인 페이지 — 전체 공개 뷰.
 * 기본 풀이(첫 섹션)와 심화 풀이(나머지 섹션) 모두 블러 없이 공개.
 */
export const ReportView = ({ content, report, createdAt }: ReportViewProps) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* ── 배경 — 파스텔 그라디언트 + 신비로운 블러 원 ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 55%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.35 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 top-96 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.3 }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* ── 상단 헤더 ── */}
        <div
          className="w-full pb-12 pt-16 text-center"
          style={{
            background: `linear-gradient(135deg, ${content.gradientFrom}22, ${content.gradientTo}44)`,
          }}
        >
          <div className="mx-auto max-w-2xl px-4">
            {/* 신비로운 상단 심볼 */}
            <div className="mb-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9B88AC]">
              <span aria-hidden="true">✦</span>
              <span>AI Report</span>
              <span aria-hidden="true">✦</span>
            </div>

            <div className="mb-5 text-7xl" role="img" aria-label={content.title}>
              {content.thumbnailEmoji}
            </div>

            <span
              className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: "rgba(74, 59, 92, 0.08)",
                color: "#4A3B5C",
              }}
            >
              {CATEGORY_LABELS[content.category] ?? content.category}
            </span>

            <h1 className="font-display mb-2 text-2xl font-bold text-deep-purple md:text-3xl">
              {content.title}
            </h1>
            <p className="text-xs text-muted-foreground">{formattedDate} 생성</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 pt-8">
          {/* ── 결과 첫 문장 강조 (PRD 6-6) ── */}
          <div
            className="relative mb-10 overflow-hidden rounded-3xl px-6 py-10 text-center"
            style={{
              background: "linear-gradient(170deg, #4a3b5cdd, #805077e6)",
              boxShadow: "0 16px 60px rgba(74, 59, 92, 0.3)",
            }}
          >
            {/* 상단 별 장식 */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24"
              style={{
                background:
                  "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(245,215,232,0.25) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">
              Headline
            </p>
            <p className="font-display text-lg font-semibold leading-relaxed text-white md:text-xl">
              &ldquo;{report.headline}&rdquo;
            </p>
          </div>

          {/* ── 섹션 리스트 (기본 + 심화 전체 공개) ── */}
          <div className="space-y-5">
            {report.sections.map((section, idx) => (
              <article
                key={idx}
                className="rounded-2xl bg-white/85 px-6 py-6 shadow-sm backdrop-blur"
                style={{
                  border: "1.5px solid rgba(74, 59, 92, 0.08)",
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, #E8D4F0, #F5D7E8)",
                      color: "#4A3B5C",
                    }}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <h2 className="text-base font-bold text-deep-purple md:text-lg">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {section.paragraphs.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm leading-relaxed text-[#4A3B5C]/85 md:text-[15px]"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* ── 마무리 안내 ── */}
          <div
            className="mt-10 rounded-2xl px-5 py-5 text-center"
            style={{
              backgroundColor: "rgba(232, 212, 240, 0.25)",
              border: "1px solid rgba(74, 59, 92, 0.08)",
            }}
          >
            <p className="text-xs leading-relaxed text-muted-foreground">
              이 해석은 AI가 데이터를 기반으로 생성한 참고 자료이며,
              <br />
              의학적·심리학적 진단을 대체하지 않습니다.
            </p>
          </div>

          {/* ── 공유 영역 ── */}
          <div className="mt-10 flex flex-col items-center">
            <ReportShare headline={report.headline} title={content.title} />
          </div>

          {/* ── 홈으로 ── */}
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[#4A3B5C]/50 underline-offset-2 hover:text-[#4A3B5C] hover:underline"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
