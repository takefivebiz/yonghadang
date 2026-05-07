import { Category, CATEGORY_LABELS } from "@/lib/types/content"

const CATEGORIES: Category[] = ["love", "relationship", "career", "emotion"]

/** 카테고리별 탭 색상 */
const CATEGORY_TAB_STYLE: Record<Category, string> = {
  love: "border-accent/15 bg-accent/6 text-accent/65 hover:bg-accent/10",
  relationship: "border-secondary/15 bg-secondary/6 text-secondary/65 hover:bg-secondary/10",
  career: "border-highlight/10 bg-highlight/4 text-highlight/55 hover:bg-highlight/8",
  emotion: "border-purple-400/15 bg-purple-400/6 text-purple-300/65 hover:bg-purple-400/10",
}

/**
 * 카테고리 탭: 클릭 시 해당 ContentSection으로 스크롤 이동 (앵커 링크)
 * 스크롤 오프셋은 각 섹션의 scroll-mt-* 클래스로 제어
 */
const CategoryTabs = () => {
  return (
    <div className="flex justify-center gap-2.5 overflow-x-auto pb-1">
      {CATEGORIES.map((category) => (
        <a
          key={category}
          href={`#${category}`}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium tracking-wide transition-all duration-150 sm:px-5 sm:py-2 sm:text-base ${CATEGORY_TAB_STYLE[category]}`}
        >
          {CATEGORY_LABELS[category]}
        </a>
      ))}
    </div>
  )
}

export default CategoryTabs
