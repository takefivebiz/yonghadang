"use client";

import { useState } from "react";
import { Content, Category, CATEGORY_LABELS } from "@/lib/types/content";
import ContentCard from "@/components/home/content-card";

interface ContentSectionProps {
  category: Category;
  contents: Content[];
}

const ContentSection = ({ category, contents }: ContentSectionProps) => {
  const [displayCount, setDisplayCount] = useState(5);

  const displayedContents = contents.slice(0, displayCount);
  const hasMore = contents.length > displayCount;

  return (
    /* scroll-mt: 고정 Navbar(56px) + 고정 CategoryTabs(~48px) 높이 합산 */
    <section
      id={category}
      className="mb-12 scroll-mt-28"
      data-testid="content-section"
    >
      <div className="mx-auto max-w-xl px-4">
        {/* 섹션 헤더 */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-secondary" />
            <h2 className="text-base font-nomal tracking-wider text-highlight">
              {CATEGORY_LABELS[category]}
            </h2>
          </div>
          <a
            href={`/category/${category}`}
            className="text-xs text-highlight/30 transition-colors hover:text-highlight/60"
          >
            전체보기 →
          </a>
        </div>

        {/* 카드 목록 — 1열 (breathing space 우선) */}
        <div className="mx-auto max-w-2xl space-y-6 lg:space-y-8">
          {displayedContents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              variant="list"
              showBadge={false}
            />
          ))}
        </div>

        {/* 더보기 버튼 */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 5)}
              className="text-xs text-highlight/30 transition-colors hover:text-highlight/60"
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentSection;
