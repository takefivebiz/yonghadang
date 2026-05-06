"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Content, CATEGORY_LABELS } from "@/lib/types/content";

/** 카테고리별 색상 */
const CATEGORY_CONFIG: Record<
  Content["category"],
  { badge: string; dot: string; button: string; glow: string }
> = {
  love: {
    badge: "bg-accent/15 text-accent border border-accent/30",
    dot: "bg-accent",
    button: "bg-accent text-white hover:brightness-110",
    glow: "from-accent/20",
  },
  relationship: {
    badge: "bg-secondary/15 text-secondary border border-secondary/30",
    dot: "bg-secondary",
    button: "bg-secondary text-white hover:brightness-110",
    glow: "from-secondary/20",
  },
  career: {
    badge: "bg-highlight/10 text-highlight/80 border border-highlight/20",
    dot: "bg-highlight/70",
    button: "bg-highlight/90 text-background hover:bg-highlight",
    glow: "from-highlight/10",
  },
  emotion: {
    badge: "bg-purple-400/15 text-purple-300 border border-purple-400/30",
    dot: "bg-purple-400",
    button: "bg-purple-400 text-white hover:brightness-110",
    glow: "from-purple-400/20",
  },
};

interface ContentIntroProps {
  content: Content;
}

const ContentIntro = ({ content }: ContentIntroProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const config = CATEGORY_CONFIG[content.category];

  const handleStart = async () => {
    setLoading(true);
    const mockSessionId = crypto.randomUUID();
    router.push(`/analyze/${mockSessionId}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* SEO / 접근성용 제목 */}
      <h1 className="sr-only">{content.title}</h1>
      {content.subtitle && <p className="sr-only">{content.subtitle}</p>}

      {/* 전체 블러 배경 */}
      {content.thumbnail_url && (
        <div className="absolute inset-0">
          <Image
            src={content.thumbnail_url}
            alt=""
            fill
            sizes="100vw"
            className="scale-125 object-cover opacity-20 blur-3xl"
            priority
          />
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-b ${config.glow} via-background/75 to-background`}
      />

      <main className="relative z-10 mx-auto max-w-lg px-5 pb-12 pt-4">
        {/* 썸네일 */}
        <section className="relative">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-white/[0.04] shadow-2xl shadow-black/30">
            {content.thumbnail_url ? (
              <Image
                src={content.thumbnail_url}
                alt={content.title}
                fill
                sizes="(max-width: 640px) calc(100vw - 40px), 512px"
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-surface/50" />
            )}
          </div>
        </section>

        {/* 본문 카드 */}
        <section className="mt-5">
          <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-5 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
              >
                {CATEGORY_LABELS[content.category]}
              </span>

              <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-white/45">
                약 {content.estimated_minutes ?? 5}분
              </span>
            </div>

            <p className="text-center text-[15px] leading-relaxed text-white/72">
              몇 가지만 보면
              <br />
              지금 상태가 바로 드러나
            </p>

            <div className="mt-6 space-y-3">
              {(content.insights ?? []).map((insight, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3"
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white bg-white/10`}
                  >
                    {i + 1}
                  </div>

                  <span className="text-sm font-medium leading-snug text-white/80">
                    {insight}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              disabled={loading}
              className={`mt-7 w-full rounded-2xl py-4 text-base font-bold shadow-lg shadow-black/20 transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${config.button}`}
            >
              {loading ? "준비 중..." : "지금 내 상태 확인하기 →"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContentIntro;
