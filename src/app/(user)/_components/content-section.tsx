'use client';

import { useState } from 'react';
import { ContentCard } from '@/components/common/content-card';
import { DUMMY_CONTENTS } from '@/lib/dummy-contents';
import { CategoryFilter } from '@/types/content';

/** 카테고리 탭 목록 */
const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: 'all',       label: '전체' },
  { value: 'mbti',      label: 'MBTI' },
  { value: 'saju',      label: '사주' },
  { value: 'tarot',     label: '타로' },
  { value: 'astrology', label: '점성술' },
];

export const ContentSection = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  // TODO: [백엔드 연동] 카테고리 필터를 쿼리 파라미터로 /api/contents에 전달
  const filteredContents =
    activeCategory === 'all'
      ? DUMMY_CONTENTS
      : DUMMY_CONTENTS.filter((c) => c.category === activeCategory);

  return (
    <section id="content" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 pt-4">
      {/* 섹션 헤더 */}
      <div className="mb-8 text-center">
        <p className="font-display mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Services
        </p>
        <h2 className="font-display text-3xl font-bold text-deep-purple md:text-4xl">
          지금 바로 시작하세요
        </h2>
      </div>

      {/* 카테고리 탭 필터 */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveCategory(tab.value)}
            className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
            style={
              activeCategory === tab.value
                ? {
                    backgroundColor: '#F5D7E8',
                    color: '#4A3B5C',
                    boxShadow: '0 2px 12px rgba(245, 215, 232, 0.8)',
                    border: '1.5px solid rgba(74, 59, 92, 0.15)',
                  }
                : {
                    backgroundColor: 'transparent',
                    color: '#9B88AC',
                    border: '1.5px solid #DDD3E8',
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

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
