import Link from "next/link";
import { Content } from "@/types/content";

const CATEGORY_LABELS: Record<string, string> = {
  mbti: "MBTI",
  saju: "사주",
  tarot: "타로",
  astrology: "점성술",
};

const BADGE_CONFIG = {
  popular: {
    label: "인기",
    style: {
      backgroundColor: "rgb(255, 77, 116)",
      color: "#ffffff",
      border: "1px solid rgba(255, 150, 185, 0.435)",
    },
  },
  new: {
    label: "NEW",
    style: {
      backgroundColor: "rgba(166, 51, 243, 0.842)",
      color: "#ffffff",
      border: "1px solid rgba(250, 192, 237, 0.4)",
    },
  },
} as const;

interface ContentCardProps {
  content: Content;
}

export const ContentCard = ({ content }: ContentCardProps) => {
  const badge = content.badge ? BADGE_CONFIG[content.badge] : null;

  // PRD 6-1.2: 카드 클릭 시 /start 이동 + 해당 콘텐츠 preselect
  const href = `/start?preselect=${content.slug}`;

  return (
    <Link href={href} className="group block">
      <article
        className="overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(74,59,92,0.12)]"
        style={{ borderColor: "rgba(74, 59, 92, 0.12)" }}
      >
        {/* 썸네일 */}
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
          <span
            className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs"
            style={{ backgroundColor: "rgba(74, 59, 92, 0.06)", color: "#9B88AC" }}
          >
            {CATEGORY_LABELS[content.category]}
          </span>

          <h3 className="mb-1.5 text-base font-semibold leading-snug text-deep-purple">
            {content.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {content.description}
          </p>

          <p className="text-sm font-bold text-deep-purple">
            {content.price.toLocaleString("ko-KR")}원
          </p>
        </div>
      </article>
    </Link>
  );
};
