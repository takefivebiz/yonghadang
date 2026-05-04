import Link from "next/link";
import Image from "next/image";
import { Content, Category } from "@/lib/types/content";

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
};

interface ContentCardProps {
  content: Content;
  showBadge?: boolean;
  priority?: boolean;
}

const ContentCard = ({
  content,
  showBadge = true,
  priority = false,
}: ContentCardProps) => {
  const config = CATEGORY_CONFIG[content.category];

  return (
    <Link
      href={`/content/${content.id}`}
      className="group block w-full shrink-0 sm:w-[520px]"
    >
      <article className="relative aspect-[16/9] overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]">
        {/* 배경 이미지 or 플레이스홀더 */}
        {content.thumbnail_url ? (
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-surface/60">
            {/* 우측 상단 동심원 패턴 */}
            <div
              className={`absolute -right-6 -top-6 h-36 w-36 rounded-full border-2 ${config.ring}`}
            />
            <div
              className={`absolute -right-2 -top-2 h-24 w-24 rounded-full border ${config.ring} opacity-50`}
            />
            <div
              className={`absolute right-8 top-8 h-10 w-10 rounded-full border ${config.ring} opacity-30`}
            />
          </div>
        )}

        {/* 카테고리 배지 — 좌상단 */}
        {showBadge && (
          <div className="absolute left-3 top-3">
            <span
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm ${config.badge}`}
            >
              {config.label}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition group-hover:bg-black/60">
            <svg
              className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ContentCard;
