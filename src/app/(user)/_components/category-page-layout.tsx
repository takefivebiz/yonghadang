import Link from "next/link";
import { ContentCard } from "@/components/common/content-card";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";
import { ContentCategory } from "@/types/content";

interface CategoryPageLayoutProps {
  category: ContentCategory;
  emoji: string;
  title: string;
  description: string;
}

/**
 * 카테고리 페이지 공통 레이아웃 — PRD 6-3
 * 카테고리 소개 + 해당 카테고리 콘텐츠 카드 목록
 */
export const CategoryPageLayout = ({
  category,
  emoji,
  title,
  description,
}: CategoryPageLayoutProps) => {
  // TODO: [백엔드 연동] /api/contents?category={category} 실제 호출로 교체
  const contents = DUMMY_CONTENTS.filter((c) => c.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* 뒤로 가기 */}
      <Link
        href="/#content"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        전체 보기
      </Link>

      {/* 카테고리 헤더 */}
      <div className="mb-12 text-center">
        <div
          className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
          style={{
            background: "linear-gradient(135deg, #EDE0F8 0%, #F5D7E8 100%)",
            border: "1.5px solid rgba(74, 59, 92, 0.1)",
          }}
          aria-hidden="true"
        >
          {emoji}
        </div>
        <h1 className="font-display mb-3 text-3xl font-bold text-deep-purple md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      {/* 콘텐츠 카드 목록 */}
      {contents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          <p className="mb-2 text-4xl">🌙</p>
          <p className="text-sm">준비 중인 콘텐츠입니다.</p>
        </div>
      )}
    </div>
  );
};
