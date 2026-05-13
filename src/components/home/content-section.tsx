import { Content, Category, CATEGORY_LABELS } from "@/lib/types/content";
import ContentCard from "@/components/home/content-card";

interface ContentSectionProps {
  category: Category;
  contents: Content[];
}

const ContentSection = ({ category, contents }: ContentSectionProps) => {
  return (
    /* scroll-mt: 고정 Navbar(56px) + 고정 CategoryTabs(~48px) 높이 합산 */
    <section
      id={category}
      className="mb-12 scroll-mt-28"
      data-testid="content-section"
    >
      <div className="mx-auto max-w-3xl px-4">
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

        {/* 그리드 카드 목록 — 모바일 2열 / 태블릿 2열 / 데스크톱 3열 */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10 lg:max-w-[960px] lg:mx-auto">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} variant="list" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
