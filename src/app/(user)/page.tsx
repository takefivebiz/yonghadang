import type { Metadata } from "next";
import MiniHero from "@/components/home/mini-hero";
import TrendingSection from "@/components/home/trending-section";
import CategoryTabsSticky from "@/components/home/category-tabs-sticky";
import ContentSection from "@/components/home/content-section";
import CTASticky from "@/components/home/cta-sticky";
import { fetchContents } from "@/lib/data/fetch-contents";
import { Category, Content } from "@/lib/types/content";

export const metadata: Metadata = {
  title: "VEIL — 베일에 가려진 진짜 나",
  description:
    "콘텐츠와 간단한 입력을 통해 나의 현재 상황, 감정, 관계를 해석하는 자기 해석 서비스",
  openGraph: {
    title: "VEIL — 베일에 가려진 진짜 나",
    description: "사주·MBTI처럼 끼워넣은 나말고, 진짜 나를 찾다",
    type: "website",
  },
};

const CATEGORY_ORDER: Category[] = [
  "love",
  "relationship",
  "career",
  "emotion",
];

// 카테고리별 대표 콘텐츠 slug (트렌딩 고정 목록)
const TRENDING_SLUGS = ["love-1", "rel-1", "career-2", "emotion-3"];

const HomePage = async () => {
  const allContents: Content[] = await fetchContents();

  const contentsByCategory = CATEGORY_ORDER.reduce<Record<Category, Content[]>>(
    (acc, category) => {
      acc[category] = allContents.filter((c) => c.category === category);
      return acc;
    },
    {} as Record<Category, Content[]>,
  );

  // API slug 기준으로 트렌딩 필터링 (slug가 없는 경우 id로 fallback)
  const trendingContents = allContents.filter((c) =>
    TRENDING_SLUGS.includes(c.slug ?? c.id),
  );

  return (
    <>
      <div className="w-full max-w-full overflow-x-hidden mx-auto max-w-screen-lg pb-28">
        {/* 미니히어로 */}
        <MiniHero />

        {/* 트렌딩 섹션 */}
        <TrendingSection contents={trendingContents} />

        {/* 카테고리 탭 — Navbar 바로 아래 고정 (스크롤 감지로 배경 동적 변경) */}
        <CategoryTabsSticky />

        {/* 카테고리별 콘텐츠 섹션 */}
        {CATEGORY_ORDER.map((category) => (
          <ContentSection
            key={category}
            category={category}
            contents={contentsByCategory[category]}
          />
        ))}
      </div>

      {/* CTA 스티키 — 하단 고정 */}
      <CTASticky />
    </>
  );
};

export default HomePage;
