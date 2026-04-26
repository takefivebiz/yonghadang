'use client';

import { useRouter } from 'next/navigation';

const CATEGORIES = ['연애', '감정', '인간관계', '직업/진로'] as const;
type Category = typeof CATEGORIES[number];

/** PRD 6-1: 카테고리 선택 섹션 */
export const CategorySection = () => {
  const router = useRouter();

  const handleCategorySelect = (category: Category) => {
    // TODO: [백엔드 연동] /analyze?category= 로 이동하며 분석 플로우 시작
    router.push(`/analyze?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-md">
        <h2
          className="mb-6 text-2xl font-bold md:text-3xl"
          style={{ color: '#2D3250' }}
        >
          어떤 부분이 고민이야?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="flex min-h-[56px] items-center justify-center rounded-xl border-2 border-[#C4B5D4] bg-white px-4 py-3 text-sm font-semibold transition-all hover:border-[#7B6A9B] hover:bg-[#F5F1FA] hover:shadow-md active:scale-[0.98]"
              style={{ color: '#2D3250' }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
