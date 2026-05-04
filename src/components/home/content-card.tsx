import Link from "next/link"
import Image from "next/image"
import { Content, Category } from "@/lib/types/content"

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; badge: string; accent: string; ring: string }
> = {
  love: {
    label: "연애",
    badge: "bg-accent/30 text-accent",
    accent: "bg-accent",
    ring: "border-accent/30",
  },
  relationship: {
    label: "인간관계",
    badge: "bg-secondary/50 text-white",
    accent: "bg-secondary",
    ring: "border-secondary/30",
  },
  career: {
    label: "직업·진로",
    badge: "bg-white/15 text-white/80",
    accent: "bg-highlight/60",
    ring: "border-highlight/20",
  },
  emotion: {
    label: "감정",
    badge: "bg-purple-400/30 text-purple-300",
    accent: "bg-purple-400",
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
      {/* 3:4 세로형 카드 */}
      <article className="relative aspect-[3/4] overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]">

        {/* 배경 이미지 or 플레이스홀더 */}
        {content.thumbnail_url ? (
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-surface/60">
            {/* 우측 상단 동심원 패턴 */}
            <div className={`absolute -right-6 -top-6 h-36 w-36 rounded-full border-2 ${config.ring}`} />
            <div className={`absolute -right-2 -top-2 h-24 w-24 rounded-full border ${config.ring} opacity-50`} />
            <div className={`absolute right-8 top-8 h-10 w-10 rounded-full border ${config.ring} opacity-30`} />
          </div>
        )}

        {/* 하단 텍스트 가독성 오버레이 — 카드 하단 45% 영역 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

        {/* 카테고리 배지 — 좌상단 */}
        {showBadge && (
          <div className="absolute left-3 top-3">
            <span className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${config.badge}`}>
              {config.label}
            </span>
          </div>
        )}

        {/* 텍스트 블록 — 좌하단 고정 */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="line-clamp-2 text-lg font-bold leading-tight text-white sm:text-xl">
            {content.title}
          </p>
          {/* 카테고리 액센트 라인 */}
          <div className={`mt-2.5 h-[2px] w-7 rounded-full ${config.accent}`} />
          {content.subtitle && (
            <p className="mt-2 line-clamp-2 text-xs leading-snug text-white/65">
              {content.subtitle}
            </p>
          )}
        </div>

      </article>
    </Link>
  )
}

export default ContentCard
