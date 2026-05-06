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
  priority?: boolean;
  /**
   * carousel: 홈 가로 스크롤 (기존 디자인 유지)
   * list: 카테고리 세로 리스트 (브런치형 텍스트 중심)
   */
  variant?: "carousel" | "list";
  /** carousel variant 전용 — 카테고리 배지 표시 여부 */
  showBadge?: boolean;
}

// ── carousel variant (홈 가로 스크롤) ──────────────────────────────
const CarouselCard = ({
  content,
  priority,
  showBadge = true,
}: Omit<ContentCardProps, "variant">) => {
  const config = CATEGORY_CONFIG[content.category];

  return (
    <Link
      href={`/content/${content.id}`}
      className="group block w-[88%] shrink-0 sm:w-[420px]"
    >
      <article className="relative aspect-[3/2] overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]">
        {content.thumbnail_url ? (
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            fill
            sizes="(max-width: 640px) 88vw, 420px"
            priority={priority}
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-surface/60">
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

        {/* 카테고리 배지 */}
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

// ── list variant (카테고리 세로 스택 카드) ────────────────────
const ListCard = ({ content, priority }: Omit<ContentCardProps, "variant">) => {
  const config = CATEGORY_CONFIG[content.category];

  return (
    <Link href={`/content/${content.id}`} className="group block">
      <article className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-surface/20 transition-all duration-300 hover:border-white/15 hover:shadow-md hover:-translate-y-1">
        {/* 썸네일 — 가로형 이미지 자연스럽게 표시 */}
        <div className="relative aspect-video w-full overflow-hidden">
          {content.thumbnail_url ? (
            <Image
              src={content.thumbnail_url}
              alt={content.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface/60 to-surface/40">
              <div
                className={`absolute -right-6 -top-6 h-32 w-32 rounded-full border-2 ${config.ring}`}
              />
              <div
                className={`absolute -right-2 -top-2 h-20 w-20 rounded-full border ${config.ring} opacity-50`}
              />
            </div>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col gap-2.5 px-4 py-4 sm:gap-3 sm:px-5 sm:py-5">
          {/* 제목 */}
          <h2 className="text-base font-bold leading-snug tracking-tight text-highlight transition-colors group-hover:text-white sm:text-lg">
            {content.title}
          </h2>

          {/* 설명 */}
          {content.subtitle && (
            <p className="line-clamp-2 text-sm leading-relaxed text-highlight/50 sm:text-base">
              {content.subtitle}
            </p>
          )}

          {/* 메타 정보 — 카테고리 · 소요시간 */}
          <div className="flex items-center gap-2.5 pt-1">
            <span
              className={`rounded-md px-2.5 py-1 text-[10px] font-semibold leading-none sm:text-[11px] ${config.badge}`}
            >
              {config.label}
            </span>
            {content.estimated_minutes && (
              <>
                <span className="text-highlight/15">·</span>
                <span className="text-xs text-highlight/40">
                  {content.estimated_minutes}분
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

// ── 공통 export ────────────────────────────────────────────────────
const ContentCard = ({
  content,
  priority = false,
  variant = "carousel",
  showBadge = true,
}: ContentCardProps) => {
  if (variant === "list") {
    return <ListCard content={content} priority={priority} />;
  }
  return (
    <CarouselCard content={content} priority={priority} showBadge={showBadge} />
  );
};

export default ContentCard;
