import Link from 'next/link';
import { Content } from '@/types/content';

const CATEGORY_LABELS: Record<string, string> = {
  mbti: 'MBTI',
  saju: '사주',
  tarot: '타로',
  astrology: '점성술',
};

/** 배지 스타일 설정 */
const BADGE_CONFIG = {
  popular: {
    label: '인기',
    style: {
      backgroundColor: 'rgba(74, 59, 92, 0.08)',
      color: '#4A3B5C',
      border: '1px solid rgba(74, 59, 92, 0.18)',
    },
  },
  new: {
    label: 'NEW',
    style: {
      backgroundColor: 'rgba(245, 215, 232, 0.7)',
      color: '#9B68B8',
      border: '1px solid rgba(212, 165, 165, 0.4)',
    },
  },
} as const;

interface ContentCardProps {
  content: Content;
}

export const ContentCard = ({ content }: ContentCardProps) => {
  const badge = content.badge ? BADGE_CONFIG[content.badge] : null;

  return (
    <Link href={content.slug} className="group block">
      <article
        className="overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1"
        style={{
          borderColor: 'rgba(74, 59, 92, 0.12)',
          // 호버 시 그림자 효과는 CSS에서 처리 어려워 Tailwind arbitrary로 처리
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 8px 28px rgba(74, 59, 92, 0.12)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* 썸네일 영역 */}
        <div
          className="relative flex h-40 items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${content.gradientFrom}, ${content.gradientTo})`,
          }}
        >
          <span
            className="text-5xl transition-transform duration-300 group-hover:scale-110"
            role="img"
            aria-label={content.title}
          >
            {content.thumbnailEmoji}
          </span>

          {/* 인기/신규 배지 */}
          {badge && (
            <span
              className="absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={badge.style}
            >
              {badge.label}
            </span>
          )}
        </div>

        {/* 콘텐츠 정보 */}
        <div className="p-4">
          {/* 카테고리 태그 */}
          <span
            className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs"
            style={{
              backgroundColor: 'rgba(74, 59, 92, 0.06)',
              color: '#9B88AC',
            }}
          >
            {CATEGORY_LABELS[content.category]}
          </span>

          {/* 제목 */}
          <h3 className="mb-1.5 text-base font-semibold leading-snug text-deep-purple">
            {content.title}
          </h3>

          {/* 한 줄 설명 */}
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {content.description}
          </p>

          {/* 가격 */}
          <p className="text-sm font-bold text-deep-purple">
            {content.price.toLocaleString('ko-KR')}원
          </p>
        </div>
      </article>
    </Link>
  );
};
