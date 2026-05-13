import Link from "next/link";
import Image from "next/image";
import { Content, Category } from "@/lib/types/content";

const CATEGORY_CONFIG: Record<
  Category,
  {
    label: string;
    badge: string;
    accent: string;
    ring: string;
    categoryColor: string;
    categoryBg: string;
    categoryBorder: string;
    arrowColor: string;
  }
> = {
  love: {
    label: "연애",
    badge: "bg-accent/15 text-accent/70",
    accent: "bg-accent",
    ring: "border-accent/15",
    categoryColor: "text-[rgba(209,109,172,0.88)]",
    categoryBg: "bg-[rgba(209,109,172,0.18)]",
    categoryBorder: "border-[rgba(209,109,172,0.18)]",
    arrowColor: "border-[rgba(209,109,172,0.72)] text-[rgba(209,109,172,0.72)]",
  },
  relationship: {
    label: "인간관계",
    badge: "bg-secondary/25 text-white/70",
    accent: "bg-secondary",
    ring: "border-secondary/15",
    categoryColor: "text-[rgba(105,169,190,0.88)]",
    categoryBg: "bg-[rgba(105,169,190,0.18)]",
    categoryBorder: "border-[rgba(105,169,190,0.18)]",
    arrowColor: "border-[rgba(105,169,190,0.72)] text-[rgba(105,169,190,0.72)]",
  },
  career: {
    label: "직업·진로",
    badge: "bg-white/8 text-white/60",
    accent: "bg-highlight/60",
    ring: "border-highlight/10",
    categoryColor: "text-[rgba(190,172,145,0.88)]",
    categoryBg: "bg-[rgba(190,172,145,0.18)]",
    categoryBorder: "border-[rgba(190,172,145,0.18)]",
    arrowColor: "border-[rgba(190,172,145,0.72)] text-[rgba(190,172,145,0.72)]",
  },
  emotion: {
    label: "감정",
    badge: "bg-purple-400/15 text-purple-300/70",
    accent: "bg-purple-400",
    ring: "border-purple-400/15",
    categoryColor: "text-[rgba(160,118,210,0.88)]",
    categoryBg: "bg-[rgba(160,118,210,0.18)]",
    categoryBorder: "border-[rgba(160,118,210,0.18)]",
    arrowColor: "border-[rgba(160,118,210,0.72)] text-[rgba(160,118,210,0.72)]",
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
  /** list variant 전용 — featured는 인트로 페이지용으로 더 큼 */
  size?: "default" | "featured";
  /** list variant 전용 — 화살표 표시 여부 */
  showArrow?: boolean;
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

// ── list variant (세로형 그리드 카드 — 정방형 이미지) ─────────────
const ListCard = ({
  content,
  priority,
  size = "default",
  showArrow = true,
}: Omit<ContentCardProps, "variant">) => {
  const config = CATEGORY_CONFIG[content.category];

  const cardWidth = size === "featured" ? "lg:w-[260px]" : "lg:w-[230px]";
  const cardMaxWidth =
    size === "featured" ? "lg:max-w-[260px]" : "lg:max-w-[230px]";
  const mobileMaxWidth =
    size === "featured" ? "max-w-[240px]" : "max-w-[280px]";

  const titleSize =
    size === "featured" && !showArrow
      ? "text-[15px] lg:text-[18px]"
      : size === "featured"
        ? "text-[18px] lg:text-[24px]"
        : "text-[15px] lg:text-[19px]";
  const subtitleSize =
    size === "featured" && !showArrow
      ? "text-[11px] lg:text-[12px]"
      : size === "featured"
        ? "text-[12px] lg:text-[14px]"
        : "text-[11px] lg:text-[13px]";
  const minHeight =
    size === "featured" && !showArrow
      ? "min-h-[100px] lg:min-h-[110px]"
      : "min-h-[150px] lg:min-h-[160px]";

  return (
    <Link
      href={`/content/${content.id}`}
      className={`group block w-full ${cardWidth}`}
    >
      <article
        className={`group flex w-full ${mobileMaxWidth} ${cardMaxWidth} flex-col overflow-hidden rounded-[10px] border border-[rgba(209,109,172,0.18)] bg-[rgba(20,20,38,0.72)]`}
      >
        {/* 정방형 썸네일 — 감정 오브젝트 */}
        <div className="relative aspect-square shrink-0 overflow-hidden">
          {content.thumbnail_url ? (
            <Image
              src={content.thumbnail_url}
              alt={content.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="object-cover object-center transition-opacity duration-300 group-hover:opacity-85"
            />
          ) : (
            <div className="absolute inset-0 bg-surface/40">
              <div
                className={`absolute -right-6 -top-6 h-32 w-32 rounded-full border-2 ${config.ring}`}
              />
              <div
                className={`absolute -right-2 -top-2 h-20 w-20 rounded-full border ${config.ring} opacity-50`}
              />
            </div>
          )}

          {/* 카테고리 라벨 — 이미지 위 overlay */}
          <span
            className={`absolute top-2 left-2 rounded-[20px] px-2 py-1 text-[10px] font-medium ${config.categoryColor} ${config.categoryBg}`}
          >
            {config.label}
          </span>
        </div>

        {/* 텍스트 패널 — divider + 화살표 포함 */}
        <div
          className={`relative flex ${minHeight} flex-1 flex-col border-t border-white/[0.06] px-4 pt-5 pb-5 lg:px-5 lg:py-5 lg:pt-5 lg:pb-5`}
        >
          {/* 제목 */}
          <h2
            className={`min-h-[40px] line-clamp-2 whitespace-pre-line font-medium leading-[1.45] ${titleSize}`}
          >
            {content.title}
          </h2>

          {/* 부제 */}
          {content.subtitle && (
            <p
              className={`mt-2 line-clamp-2 whitespace-pre-line pr-9 leading-[1.55] text-highlight/45 ${subtitleSize}`}
            >
              {content.subtitle}
            </p>
          )}

          {/* 화살표 — 카드 오른쪽 아래 고정 */}
          {showArrow && (
            <div className="absolute bottom-4 right-1.5 flex h-6 w-6 items-center justify-center transition-opacity duration-300 group-hover:opacity-50 lg:h-8 lg:w-8">
              <svg
                className="h-3 w-3 text-white/18 lg:h-3.5 lg:w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
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
  size = "default",
  showArrow = true,
  showBadge = true,
}: ContentCardProps) => {
  if (variant === "list") {
    return (
      <ListCard
        content={content}
        priority={priority}
        size={size}
        showArrow={showArrow}
      />
    );
  }
  return (
    <CarouselCard content={content} priority={priority} showBadge={showBadge} />
  );
};

export default ContentCard;
