import { Content, Category, CATEGORY_LABELS } from "@/lib/types/content"
import ContentCard from "@/components/home/content-card"

interface ContentSectionProps {
  category: Category
  contents: Content[]
}

const ContentSection = ({ category, contents }: ContentSectionProps) => {
  return (
    /* scroll-mt: 고정 Navbar(56px) + 고정 CategoryTabs(~48px) 높이 합산 */
    <section id={category} className="mb-12 scroll-mt-28 px-4">
      {/* 섹션 헤더 */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-secondary" />
          <h2 className="text-base font-bold tracking-wider text-highlight">
            {CATEGORY_LABELS[category]}
          </h2>
        </div>
        {/* TODO: [백엔드 연동] 전체보기 링크에 카테고리 필터 페이지 연결 */}
        <a
          href="#"
          className="text-xs text-highlight/30 transition-colors hover:text-highlight/60"
        >
          전체보기 →
        </a>
      </div>

      {/* 가로 스크롤 카드 목록 */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} showBadge={false} />
        ))}
      </div>
    </section>
  )
}

export default ContentSection
