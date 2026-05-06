import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContentCard from "@/components/home/content-card";
import { DUMMY_CONTENTS } from "@/lib/data/dummy-contents";
import { Category, CATEGORY_LABELS } from "@/lib/types/content";

// ── 카테고리 메타 정보 ────────────────────────────────────────────
const CATEGORY_META: Record<Category, { description: string }> = {
  love: { description: "연애의 감정과 관계 흐름을 해석합니다" },
  relationship: { description: "사람과의 관계에서 생기는 패턴을 봅니다" },
  career: { description: "일과 진로에서 오는 고민을 풀어냅니다" },
  emotion: { description: "내 감정의 실체와 원인을 찾습니다" },
};

const VALID_CATEGORIES: Category[] = [
  "love",
  "relationship",
  "career",
  "emotion",
];

// ── 정적 경로 생성 ────────────────────────────────────────────────
export const generateStaticParams = () =>
  VALID_CATEGORIES.map((category) => ({ category }));

// ── 동적 메타데이터 ───────────────────────────────────────────────
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> => {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) return {};

  const cat = category as Category;
  const label = CATEGORY_LABELS[cat];
  const { description } = CATEGORY_META[cat];

  return {
    title: `${label} — VEIL`,
    description,
    openGraph: {
      title: `${label} — VEIL`,
      description,
      type: "website",
    },
  };
};

// ── 페이지 컴포넌트 ───────────────────────────────────────────────
interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) notFound();

  const cat = category as Category;
  const label = CATEGORY_LABELS[cat];
  const { description } = CATEGORY_META[cat];

  // TODO: [백엔드 연동] 더미데이터를 GET /api/contents?category={cat} 실제 호출로 교체
  const contents = DUMMY_CONTENTS.filter((c) => c.category === cat);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-8">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-xs text-highlight/35 transition-colors hover:text-highlight/65"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        홈
      </Link>

      {/* 헤더 */}
      <header className="mb-12 border-b border-white/5 pb-8">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="h-5 w-1 rounded-full bg-secondary" />
          <h1 className="text-2xl font-bold tracking-wide text-highlight sm:text-3xl">
            {label}
          </h1>
        </div>
        <p className="pl-3.5 text-sm leading-relaxed text-highlight/45">
          {description}
        </p>
        <p className="mt-2 pl-3.5 text-xs text-highlight/25">
          총 {contents.length}개
        </p>
      </header>

      {/* 콘텐츠 그리드 — 모바일 1열 / 데스크톱 2열 */}
      {contents.length > 0 ? (
        <ul className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {contents.map((content, index) => (
            <li key={content.id}>
              <ContentCard
                content={content}
                priority={index < 4}
                variant="list"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-24 text-center text-sm text-highlight/30">
          아직 준비된 콘텐츠가 없습니다.
        </p>
      )}
    </div>
  );
};

export default CategoryPage;
