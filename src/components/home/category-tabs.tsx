import { Category, CATEGORY_LABELS } from "@/lib/types/content"

const CATEGORIES: Category[] = ["love", "relationship", "career", "emotion"]

/** 카테고리별 탭 색상 */
const CATEGORY_TAB_STYLE: Record<Category, string> = {
  love: "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20",
  relationship: "border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20",
  career: "border-highlight/30 bg-highlight/8 text-highlight/70 hover:bg-highlight/15",
  emotion: "border-purple-400/40 bg-purple-400/10 text-purple-300 hover:bg-purple-400/20",
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
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 sm:px-5 sm:py-2 sm:text-sm ${CATEGORY_TAB_STYLE[category]}`}
        >
          {CATEGORY_LABELS[category]}
        </a>
      ))}
    </div>
  )
}

export default CategoryTabs
