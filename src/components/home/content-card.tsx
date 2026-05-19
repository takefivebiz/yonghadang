import Link from "next/link";
import Image from "next/image";
import { PublicContent, Category } from "@/lib/types/content";

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
  content: PublicContent;
  priority?: boolean;
  /**
   * carousel: 홈 가로 스크롤 (기존 디자인 유지)
   * list: 텍스트 중심 1열 가로 카드
   * trending: 이미지 중심 2열 카드
   */
  variant?: "carousel" | "list" | "trending";
  /** list variant 전용 — featured는 인트로 페이지용으로 더 큼 */
  size?: "default" | "featured";
  /** list variant 전용 — 화살표 표시 여부 */
  showArrow?: boolean;
  /** 카테고리 배지 표시 여부 */
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
      href={`/content/${content.slug ?? content.id}`}
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

// ── list variant (가로형 카드 — 질문 읽기 중심, 정보 hierarchy 강화) ────────
const ListCard = ({
  content,
  priority,
  showArrow = true,
  showBadge = false,
}: Omit<ContentCardProps, "variant">) => {
  const config = CATEGORY_CONFIG[content.category];

  return (
    <Link
      href={`/content/${content.slug ?? content.id}`}
      className="group block w-full"
    >
      <article className="flex w-full min-h-[120px] lg:min-h-[160px] overflow-hidden rounded-[12px] border border-white/[0.05] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]">
        {/* 썸네일 — 왼쪽 패널 (카드 높이를 꽉 채움) */}
        <div className={`relative w-28 lg:w-32 shrink-0 self-stretch`}>
          {content.thumbnail_url ? (
            <Image
              src={content.thumbnail_url}
              alt={content.title}
              fill
              sizes="(max-width: 640px) 112px, 128px"
              priority={priority}
              className="object-cover object-center transition-opacity duration-300 group-hover:opacity-70"
            />
          ) : (
            <div className="absolute inset-0 bg-surface/30">
              <div
                className={`absolute -right-4 -top-4 h-16 w-16 rounded-full border-2 ${config.ring} opacity-40`}
              />
              <div
                className={`absolute -right-1 -top-1 h-10 w-10 rounded-full border ${config.ring} opacity-20`}
              />
            </div>
          )}
        </div>

        {/* 텍스트 패널 — 질문 덩어리 (수직 중앙 정렬) */}
        <div className="relative flex flex-1 flex-col justify-center px-5 py-4 lg:px-6 lg:py-5">
          {/* 카테고리 — 조용하게 (showBadge={true}일 때만) */}
          {showBadge && (
            <span
              className={`inline-block mb-4 rounded-[3px] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-widest ${config.categoryColor} opacity-50 w-fit`}
            >
              {config.label}
            </span>
          )}

          {/* 제목 — 정보 hierarchy 최강 */}
          <h2 className="line-clamp-3 whitespace-pre-line font-nomal leading-[1.4] text-[15px] lg:text-[18px] text-white/85 mb-2">
            {content.title}
          </h2>

          {/* 부제 — subtle hook */}
          {content.subtitle && (
            <p className="line-clamp-2 whitespace-pre-line leading-[1.6] text-[12px] lg:text-[13px] text-highlight/35">
              {content.subtitle}
            </p>
          )}

          {/* 화살표 — 거의 보이지 않게 */}
          {showArrow && (
            <div className="absolute right-4 bottom-5 lg:right-5 lg:bottom-6 flex h-4 w-4 items-center justify-center transition-opacity duration-300 group-hover:opacity-40">
              <svg
                className="h-3 w-3 text-white/30"
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

// ── trending variant (이미지 중심 2열 카드) ────────────────────────────
const TrendingCard = ({
  content,
  priority,
  showBadge = true,
}: Omit<ContentCardProps, "variant" | "size" | "showArrow">) => {
  const config = CATEGORY_CONFIG[content.category];

  return (
    <Link
      href={`/content/${content.slug ?? content.id}`}
      className="group block w-full"
    >
      <article className="flex flex-col h-[260px] lg:h-[290px] overflow-hidden rounded-[12px] border border-white/[0.05] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.04]">
        {/* 이미지 — 상단 (고정 높이) */}
        <div className="relative h-[150px] lg:h-[180px] shrink-0 overflow-hidden">
          {content.thumbnail_url ? (
            <Image
              src={content.thumbnail_url}
              alt={content.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="object-cover object-center transition-opacity duration-300 group-hover:opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-surface/40">
              <div
                className={`absolute -right-6 -top-6 h-32 w-32 rounded-full border-2 ${config.ring} opacity-40`}
              />
              <div
                className={`absolute -right-2 -top-2 h-20 w-20 rounded-full border ${config.ring} opacity-20`}
              />
            </div>
          )}

          {/* 카테고리 배지 — 이미지 왼쪽 상단 */}
          {showBadge && (
            <span
              className={`absolute top-2 left-2.5 inline-block rounded-[10px] border px-1.5 py-0.5 text-[8px] font-semibold ${config.categoryColor} ${config.categoryBorder} ${config.categoryBg} backdrop-blur-sm`}
            >
              {config.label}
            </span>
          )}
        </div>

        {/* 텍스트 영역 — 하단 */}
        <div className="flex-1 px-4 py-3.5 lg:px-5 lg:py-4 flex flex-col">
          {/* 제목 */}
          <h2 className="line-clamp-2 whitespace-pre-line font-nomal leading-[1.45] text-[14px] lg:text-[16px] text-white/85 mb-1.5">
            {content.title}
          </h2>

          {/* 부제 */}
          {content.subtitle && (
            <p className="whitespace-pre-line leading-[1.5] text-[11px] lg:text-[12px] text-highlight/35">
              {content.subtitle}
            </p>
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
        showBadge={showBadge}
      />
    );
  }
  if (variant === "trending") {
    return (
      <TrendingCard
        content={content}
        priority={priority}
        showBadge={showBadge}
      />
    );
  }
  return (
    <CarouselCard content={content} priority={priority} showBadge={showBadge} />
  );
};

export default ContentCard;
