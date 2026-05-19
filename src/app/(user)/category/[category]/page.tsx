import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentCard from "@/components/home/content-card";
import { fetchContents } from "@/lib/data/fetch-contents";
import { Category, CATEGORY_LABELS, PublicContent } from "@/lib/types/content";

// ── 카테고리 메타 정보 ────────────────────────────────────────────
const CATEGORY_META: Record<Category, { description: string }> = {
  love: { description: "마음이 흔들리는 순간이 찾아 온다면" },
  relationship: { description: "사람 사이의 거리와 감정이 고민이라면" },
  career: { description: "선택 앞에서 망설여진다면" },
  emotion: { description: "설명되지 않는 감정을 느낀다면" },
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
    // template "%s | VEIL"이 자동 적용되어 "연애·결혼 | VEIL" 형식으로 렌더링됨
    title: label,
    description,
    openGraph: {
      title: `${label} | VEIL`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} | VEIL`,
      description,
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

  const allContents: PublicContent[] = await fetchContents();
  const contents = allContents.filter((c) => c.category === cat);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-8">
      {/* 헤더 — 중앙 정렬, 세로 배치 */}
      <header className="mb-12 text-center flex flex-col items-center">
        <div className="w-5 h-5 mb-2">
          {cat === "love" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-pink-400/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
          {cat === "relationship" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-blue-400/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          )}
          {cat === "career" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-amber-400/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          )}
          {cat === "emotion" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-purple-400/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          )}
        </div>
        <h1 className="text-2xl font-nomal tracking-wide text-highlight sm:text-3xl">
          {label}
        </h1>
        <p className="mt-1.5 text-sm text-highlight/40">
          {CATEGORY_META[cat].description}
        </p>
        <p className="mt-4 text-xs text-highlight/20">총 {contents.length}개</p>
      </header>

      {/* 콘텐츠 목록 — 1열 (breathing space 우선) */}
      {contents.length > 0 ? (
        <ul
          className="mx-auto max-w-2xl space-y-6 lg:space-y-8"
          data-testid="category-grid"
        >
          {contents.map((content, index) => (
            <li key={content.id}>
              <ContentCard
                content={content}
                priority={index < 4}
                variant="list"
                showBadge={false}
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
