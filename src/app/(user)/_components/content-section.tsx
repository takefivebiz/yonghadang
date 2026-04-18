"use client";

import { useState } from "react";
import { ContentCard } from "@/components/common/content-card";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";
import { CategoryFilter } from "@/types/content";

/** PRD 6-1.1: 카테고리 탭 목록 — 탭 선택 시 설명 fade-in 노출 */
const CATEGORY_TABS: { value: CategoryFilter; label: string; description: string }[] = [
  { value: "all", label: "전체", description: "당신에게 맞는 분석 방법을 찾아보세요" },
  { value: "mbti", label: "MBTI", description: "내 성격의 뿌리, 관계 패턴, 직업 적합성까지" },
  { value: "saju", label: "사주", description: "태어난 순간이 담고 있는 나만의 운명 코드" },
  { value: "tarot", label: "타로", description: "지금 이 순간, 가장 필요한 메시지를 카드가 전합니다" },
  { value: "astrology", label: "점성술", description: "별의 위치가 말해주는 당신의 본질과 가능성" },
];

export const ContentSection = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  // TODO: [백엔드 연동] 카테고리 필터를 쿼리 파라미터로 /api/contents에 전달
  const filteredContents =
    activeCategory === "all"
      ? DUMMY_CONTENTS
      : DUMMY_CONTENTS.filter((c) => c.category === activeCategory);

  const activeCategoryDescription = CATEGORY_TABS.find(
    (tab) => tab.value === activeCategory
  )?.description ?? "";

  return (
    <section
      id="content"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 pt-10"
    >
      {/* 섹션 헤더 — PRD 6-1.1: "시작하세요"(지시)에서 "필요한 건?"(유저 중심 질문)으로 전환 */}
      <div className="mb-8 text-center">
        <h2 className="font-display mb-3 text-3xl font-bold text-deep-purple md:text-4xl">
          지금 당신에게 필요한 건 무엇인가요?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          4가지 방법으로, 당신만의 이야기를 꺼내드립니다
        </p>
      </div>

      {/* 카테고리 탭 필터 */}
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveCategory(tab.value)}
            className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
            style={
              activeCategory === tab.value
                ? {
                    backgroundColor: "#F5D7E8",
                    color: "#4A3B5C",
                    boxShadow: "0 2px 12px rgba(245, 215, 232, 0.8)",
                    border: "1.5px solid rgba(74, 59, 92, 0.15)",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "#9B88AC",
                    border: "1.5px solid #DDD3E8",
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRD 6-1.1: 카테고리 설명 — 탭 선택 시 fade-in으로 노출 */}
      <p
        key={activeCategory}
        className="mb-8 animate-fade-in text-center text-xs text-muted-foreground"
      >
        {activeCategoryDescription}
      </p>

      {/* 콘텐츠 카드 그리드 */}
      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredContents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          <p className="mb-2 text-4xl">🌙</p>
          <p>준비 중인 콘텐츠입니다.</p>
        </div>
      )}
    </section>
  );
};
