import type { Metadata } from "next";
import MiniHero from "@/components/home/mini-hero";
import TrendingSection from "@/components/home/trending-section";
import CategoryTabsSticky from "@/components/home/category-tabs-sticky";
import ContentSection from "@/components/home/content-section";
import CTASticky from "@/components/home/cta-sticky";
import { fetchContents } from "@/lib/data/fetch-contents";
import { Category, PublicContent } from "@/lib/types/content";

export const metadata: Metadata = {
  // absolute: layout template("%s | VEIL")이 중복 적용되지 않도록 완전한 타이틀을 직접 지정
  title: { absolute: "VEIL | 지금 너에게 가장 필요한 말" },
  description:
    "연애, 결혼, 인간관계, 직업, 진로, 감정까지. VEIL은 다양한 고민을 듣고 정확하게 해석해주는 맞춤 해석 서비스입니다.",
  openGraph: {
    title: "VEIL | 지금 너에게 가장 필요한 말",
    description:
      "연애, 결혼, 인간관계, 직업, 진로, 감정까지. VEIL은 다양한 고민을 듣고 정확하게 해석해주는 맞춤 해석 서비스입니다.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEIL | 지금 너에게 가장 필요한 말",
    description:
      "연애, 결혼, 인간관계, 직업, 진로, 감정까지. VEIL은 다양한 고민을 듣고 정확하게 해석해주는 맞춤 해석 서비스입니다.",
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
  const allContents: PublicContent[] = await fetchContents();

  const contentsByCategory = CATEGORY_ORDER.reduce<Record<Category, PublicContent[]>>(
    (acc, category) => {
      acc[category] = allContents.filter((c) => c.category === category);
      return acc;
    },
    {} as Record<Category, PublicContent[]>,
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
