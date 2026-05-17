import type { Metadata } from "next";
import MiniHero from "@/components/home/mini-hero";
import TrendingSection from "@/components/home/trending-section";
import CategoryTabsSticky from "@/components/home/category-tabs-sticky";
import ContentSection from "@/components/home/content-section";
import CTASticky from "@/components/home/cta-sticky";
import { CONTENTS, TRENDING_CONTENTS } from "@/lib/data/contents";
import { Category } from "@/lib/types/content";

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

const HomePage = () => {
  // TODO: [백엔드 연동] CONTENTS를 /api/contents 실제 호출로 교체
  const contentsByCategory = CATEGORY_ORDER.reduce<
    Record<Category, typeof CONTENTS>
  >(
    (acc, category) => {
      acc[category] = CONTENTS.filter((c) => c.category === category);
      return acc;
    },
    {} as Record<Category, typeof CONTENTS>,
  );

  return (
    <>
      <div className="w-full max-w-full overflow-x-hidden mx-auto max-w-screen-lg pb-28">
        {/* 미니히어로 */}
        <MiniHero />

        {/* 트렌딩 섹션 */}
        <TrendingSection contents={TRENDING_CONTENTS} />

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
