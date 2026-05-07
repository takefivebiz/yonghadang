"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Content, CATEGORY_LABELS } from "@/lib/types/content";
import { Heart, Lightbulb, Compass, Lock } from "lucide-react";

/** 카테고리별 색상 */
const CATEGORY_CONFIG: Record<
  Content["category"],
  { badge: string; button: string; buttonHover: string; glow: string }
> = {
  love: {
    badge: "bg-accent/8 text-accent/70 border border-accent/15",
    button: "bg-slate-600 text-white",
    buttonHover: "hover:bg-slate-700",
    glow: "from-accent/10",
  },
  relationship: {
    badge: "bg-secondary/8 text-secondary/70 border border-secondary/15",
    button: "bg-slate-600 text-white",
    buttonHover: "hover:bg-slate-700",
    glow: "from-secondary/10",
  },
  career: {
    badge: "bg-highlight/6 text-highlight/60 border border-highlight/10",
    button: "bg-slate-600 text-white",
    buttonHover: "hover:bg-slate-700",
    glow: "from-highlight/8",
  },
  emotion: {
    badge: "bg-purple-400/8 text-purple-300/70 border border-purple-400/15",
    button: "bg-slate-600 text-white",
    buttonHover: "hover:bg-slate-700",
    glow: "from-purple-400/10",
  },
};

/** 인사이트 아이콘 매핑 */
const INSIGHT_ICONS = [
  <Compass key="compass" className="w-5 h-5" />,
  <Heart key="heart" className="w-5 h-5" />,
  <Lightbulb key="lightbulb" className="w-5 h-5" />,
  <Lock key="lock" className="w-5 h-5" />,
];

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
            className="scale-125 object-cover opacity-15 blur-3xl"
            priority
          />
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-b ${config.glow} via-background/80 to-background`}
      />

      <main className="relative z-10 mx-auto max-w-lg px-5 pb-12 pt-8">
        {/* 썸네일 섹션 */}
        <section className="mb-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-white/[0.04] shadow-2xl shadow-black/40">
            {content.thumbnail_url ? (
              <Image
                src={content.thumbnail_url}
                alt={content.title}
                fill
                sizes="(max-width: 640px) calc(100vw - 40px), 600px"
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-surface/50" />
            )}
          </div>
        </section>

        {/* 메인 콘텐츠 섹션 */}
        <section>
          {/* 카테고리 배지 */}
          <div className="mb-6">
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold ${config.badge}`}
            >
              {CATEGORY_LABELS[content.category]}
            </span>
          </div>

          {/* 제목 */}
          <h2 className="mb-3 text-3xl font-bold leading-tight text-white">
            {content.title}
          </h2>

          {/* Intro text (PRD 요구사항) */}
          <p className="mb-8 text-base leading-relaxed text-white/70">
            {content.subtitle || "이 흐름을 통해 알게 되는 진짜 감정"}
          </p>

          {/* 인사이트 카드들 */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <p className="mb-5 pb-4 border-b border-white/10 text-base font-semibold text-white">
              이 흐름 안에서 보이는 것들
            </p>
            <div className="space-y-4">
              {(content.insights ?? []).map((insight, i) => (
                <div key={i} className="flex items-start gap-3 text-white/80">
                  <div className="mt-1 shrink-0 text-accent/80">
                    {INSIGHT_ICONS[i % INSIGHT_ICONS.length]}
                  </div>
                  <span className="text-sm leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA 버튼 */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full rounded-2xl py-4 text-base font-bold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: loading
                ? "rgba(255, 255, 255, 0.03)"
                : "linear-gradient(135deg, rgba(180, 110, 160, 0.75) 0%, rgba(155, 95, 140, 0.75) 100%)",
              border: loading
                ? "1px solid rgba(255, 255, 255, 0.05)"
                : "1px solid rgba(220, 150, 200, 0.35)",
              color: "rgba(255, 255, 255, 0.9)",
              boxShadow: loading
                ? "none"
                : "0 4px 16px rgba(180, 110, 160, 0.15)",
            }}
          >
            {loading ? "준비 중..." : "시작하기 →"}
          </button>

          {/* 하단 설명 텍스트 */}
          <p className="mt-6 text-center text-xs text-white/40">
            이제, 진짜 마음을 들여다볼 차례야.
          </p>
        </section>
      </main>
    </div>
  );
};

export default ContentIntro;
