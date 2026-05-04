import Link from "next/link"
import Image from "next/image"
import { Content, Category } from "@/lib/types/content"

/** 카테고리별 배지 + 플레이스홀더 링 색상 */
const CATEGORY_CONFIG: Record<
  Category,
  { label: string; badge: string; ring: string }
> = {
  love: {
    label: "연애",
    badge: "bg-accent/20 text-accent",
    ring: "border-accent/30",
  },
  relationship: {
    label: "인간관계",
    badge: "bg-secondary/20 text-secondary",
    ring: "border-secondary/30",
  },
  career: {
    label: "직업·진로",
    badge: "bg-highlight/15 text-highlight/70",
    ring: "border-highlight/20",
  },
  emotion: {
    label: "감정",
    badge: "bg-purple-400/20 text-purple-300",
    ring: "border-purple-400/30",
  },
}

interface ContentCardProps {
  content: Content
  showBadge?: boolean
}

const ContentCard = ({ content, showBadge = true }: ContentCardProps) => {
  const config = CATEGORY_CONFIG[content.category]

  return (
    <Link href={`/content/${content.id}`} className="group block w-56 shrink-0 sm:w-64">
      {/* 정사각형 카드: 이미지 위에 텍스트 오버레이 */}
      <article className="relative aspect-square overflow-hidden rounded-xl border border-surface/60">
        {/* 배경 이미지 or 플레이스홀더 */}
        {content.thumbnail_url ? (
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-surface/40">
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full border-2 ${config.ring}`} />
            <div className={`absolute -bottom-3 -left-3 h-16 w-16 rounded-full border ${config.ring} opacity-60`} />
            <div className={`absolute bottom-10 right-6 h-8 w-8 rounded-full border ${config.ring} opacity-40`} />
          </div>
        )}

        {/* 하단 텍스트 가독성을 위한 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />

        {/* 텍스트 오버레이 */}
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          {/* 카테고리 라벨 — 상단 (트렌딩 섹션에서만 노출) */}
          {showBadge ? (
            <span className={`self-start rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${config.badge}`}>
              {config.label}
            </span>
          ) : (
            <span />
          )}

          {/* 제목 + 서브텍스트 — 하단 */}
          <div className="space-y-0.5">
            <p className="line-clamp-2 text-[12px] font-medium leading-snug text-highlight/95">
              {content.title}
            </p>
            {content.subtitle && (
              <p className="line-clamp-1 text-[10px] leading-relaxed text-highlight/50">
                {content.subtitle}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default ContentCard
