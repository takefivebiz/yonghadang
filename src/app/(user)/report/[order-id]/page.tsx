import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDummyReport } from "@/lib/dummy-reports";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";
import { ShareButton } from "./_components/share-button";

interface Props {
  params: Promise<{ "order-id": string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { "order-id": orderId } = await params;
  const report = getDummyReport(orderId);
  if (!report) return { title: "분석 결과" };
  return {
    title: `분석 결과 | 용하당`,
    description: report.headline,
  };
};

const ReportPage = async ({ params }: Props) => {
  const { "order-id": orderId } = await params;

  // TODO: [백엔드 연동] 실제 주문 ID로 /api/orders/{orderId}/report 호출로 교체
  const report = getDummyReport(orderId);
  if (!report) notFound();

  const slug = orderId.startsWith("demo-")
    ? orderId.replace("demo-", "")
    : null;
  const content = slug ? DUMMY_CONTENTS.find((c) => c.slug === slug) : null;

  const categoryLabel: Record<string, string> = {
    mbti: "MBTI",
    saju: "사주",
    tarot: "타로",
    astrology: "점성술",
  };

  // 무료 공개: headline + sections[0]
  // 유료 잠금: sections[1..]
  const freeSection = report.sections[0];
  const lockedSections = report.sections.slice(1);

  // TODO: [백엔드 연동] /payments?orderId={orderId} 실제 결제 페이지로 교체
  const paymentsHref = `/payments?slug=${slug ?? ""}`;

  return (
    <div className="min-h-screen bg-[#FAF8FC] pb-28">
      {/* ── 상단 헤더 ── */}
      <div
        className="w-full pb-10 pt-16 text-center"
        style={{
          background: content
            ? `linear-gradient(135deg, ${content.gradientFrom}22, ${content.gradientTo}44)`
            : "linear-gradient(135deg, #4A3B5C22, #F5D7E844)",
        }}
      >
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-4 text-7xl">{content?.thumbnailEmoji ?? "✨"}</div>
          {content && (
            <span className="mb-3 inline-block rounded-full bg-[#4A3B5C]/10 px-3 py-1 text-xs font-medium text-[#4A3B5C]">
              {categoryLabel[content.category] ?? content.category}
            </span>
          )}
          <h1 className="mb-2 text-2xl font-bold text-[#4A3B5C]">
            {content?.title ?? "분석 결과"}
          </h1>
          <p className="text-sm text-[#4A3B5C]/50">AI 분석이 완료되었습니다</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-8">
        {/* ── 무료 구간 ── */}

        {/* 핵심 한 줄 강조 */}
        <div className="mb-6 rounded-2xl border border-[#E8D4F0] bg-white px-6 py-6 shadow-sm">
          <p className="text-center text-base font-semibold leading-relaxed text-[#4A3B5C] sm:text-lg">
            &ldquo;{report.headline}&rdquo;
          </p>
        </div>

        {/* 첫 번째 섹션 — 완전 무료 공개 */}
        <div className="mb-2 flex items-center gap-2 px-1">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}
          >
            무료
          </span>
          <span className="text-xs text-[#4A3B5C]/50">기본 분석 결과</span>
        </div>
        <div className="rounded-2xl border border-[#E8D4F0]/60 bg-white px-6 py-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-[#4A3B5C]">
            {freeSection.title}
          </h2>
          <div className="space-y-3">
            {freeSection.paragraphs.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-[#4A3B5C]/80">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* 공유 버튼 */}
        <div className="mt-5 flex justify-center">
          <ShareButton />
        </div>

        {/* ── 유료 구간 구분선 ── */}
        <div className="relative my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E8D4F0]" />
          <span className="rounded-full border border-[#E8D4F0] bg-white px-3 py-1 text-xs font-medium text-[#9B88AC]">
            🔒 이하 내용은 유료입니다
          </span>
          <div className="h-px flex-1 bg-[#E8D4F0]" />
        </div>

        {/* ── 유료 구간: 블러 처리된 섹션들 + CTA 오버레이 ── */}
        {lockedSections.length > 0 && (
          <div className="relative">
            {/* 블러 처리된 섹션들 — 텍스트만 blur, 제목은 보임 */}
            <div className="space-y-4">
              {lockedSections.map((section, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E8D4F0]/40 bg-white px-6 py-6"
                >
                  <h2 className="mb-4 text-base font-bold text-[#4A3B5C]/60">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm leading-relaxed text-[#4A3B5C]/80"
                        style={{ filter: "blur(6px)", userSelect: "none" }}
                        aria-hidden="true"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 그라디언트 + CTA 오버레이 */}
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-4"
              style={{
                top: "58%",
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(250,248,252,0.85) 25%, #FAF8FC 50%)",
              }}
            >
              {/* CTA 카드 */}
              <div
                className="w-[70%] rounded-2xl px-6 py-7 text-center"
                style={{
                  background: "linear-gradient(170deg, #4a3b5ca0, #805077d4)",
                  boxShadow: "0 8px 40px rgba(74, 59, 92, 0.3)",
                }}
              >
                <p className="mb-1 text-lg font-bold text-white">
                  전체 분석 보기
                </p>
                <p className="mb-5 text-sm text-white/70">
                  {lockedSections.length}개의 심층 분석이 잠겨 있습니다
                </p>
                <ul className="mb-6 space-y-2 text-left">
                  {lockedSections.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-white/100"
                    >
                      <span className="text-[#ffffff]">✦</span>
                      {s.title}
                    </li>
                  ))}
                </ul>
                {/* TODO: [백엔드 연동] /payments 실제 결제 페이지로 교체 */}
                <Link
                  href={paymentsHref}
                  className="block w-full rounded-full py-4 text-sm font-bold transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#F5D7E8",
                    color: "#4A3B5C",
                    boxShadow: "0 4px 20px rgba(245, 215, 232, 0.4)",
                  }}
                >
                  결과 전체 보기 —{" "}
                  {content?.price.toLocaleString("ko-KR") ?? ""}원
                </Link>
                <p className="mt-3 text-xs text-white/80">
                  결제 후 즉시 전체 결과 열람 가능
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 홈으로 */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-[#4A3B5C]/40 underline underline-offset-2 hover:text-[#4A3B5C]"
          >
            홈으로 돌아가기
          </Link>
        </div>
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
          href={paymentsHref}
          className="mx-auto block w-full max-w-lg rounded-full py-4 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: "#4A3B5C",
            color: "#F5F0E8",
            boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
          }}
        >
          전체 결과 보기 — {content?.price.toLocaleString("ko-KR") ?? ""}원
        </Link>
      </div>
    </div>
  );
};

export default ReportPage;
