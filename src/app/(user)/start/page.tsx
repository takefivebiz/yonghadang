import { type Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";
import { StartForm } from "./_components/start-form";

export const metadata: Metadata = {
  title: "시작하기",
  description: "AI 분석을 시작합니다. 정보를 입력해주세요.",
};

interface StartPageProps {
  searchParams: Promise<{ preselect?: string }>;
}

const StartPage = async ({ searchParams }: StartPageProps) => {
  const { preselect } = await searchParams;

  // preselect 없이 직접 접근한 경우 홈으로 리다이렉트
  if (!preselect) redirect("/");

  // TODO: [백엔드 연동] /api/contents/[slug] 실제 호출로 교체
  const content = DUMMY_CONTENTS.find((c) => c.slug === preselect) ?? null;

  // 유효하지 않은 slug인 경우 홈으로 리다이렉트
  if (!content) redirect("/");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.35 }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 pb-20 pt-10">
        {/* 뒤로 가기 */}
        <div className="mx-auto mb-8 max-w-lg">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              width="16"
              height="16"
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
            홈으로
          </Link>
        </div>

        {/* 헤더 */}
        <div className="mx-auto mb-8 max-w-lg text-center">
          <p className="font-display mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Step 1
          </p>
          <h1 className="font-display text-2xl font-bold text-deep-purple md:text-3xl">
            정보를 입력해주세요
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            보통 3분 이내에 분석이 완료됩니다
          </p>
        </div>

        {/* 폼 */}
        <StartForm content={content} />
      </div>
    </div>
  );
};

export default StartPage;
