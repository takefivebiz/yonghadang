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

  /**
   * 시작 버튼 핸들러
   * TODO: [백엔드 연동] mock session을 POST /api/sessions 실제 호출로 교체
   * 현재는 crypto.randomUUID()로 mock session_id를 생성 후 /analyze로 이동
   */
  const handleStart = async () => {
    setLoading(true);
    const mockSessionId = crypto.randomUUID();
    router.push(`/analyze/${mockSessionId}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      {/* 전체 페이지 블러 배경 */}
      {content.thumbnail_url && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={content.thumbnail_url}
            alt=""
            fill
            className="scale-110 object-cover opacity-15 blur-3xl"
            priority
          />
        </div>
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${config.glow} via-background/50 to-background`}
      />

      {/* ── 썸네일 이미지 섹션 ── */}
      {/*
       * 이미지(overflow-hidden)와 그라디언트·텍스트를 분리
       * 그라디언트를 overflow-hidden 바깥 형제로 두어 이미지 경계에서 잘리지 않도록 함
       */}
      <div className="relative z-10 mx-auto max-w-lg">
        {/* 이미지 — overflow-hidden으로 클립 */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {content.thumbnail_url ? (
            <Image
              src={content.thumbnail_url}
              alt={content.title}
              fill
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-surface/50">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-2 border-white/10" />
              <div className="absolute -right-3 -top-3 h-28 w-28 rounded-full border border-white/8" />
            </div>
          )}
          {/* 카테고리 배지 */}
          <div className="absolute left-4 top-4">
            <span
              className={`rounded-lg px-3 py-1 text-xs font-semibold backdrop-blur-sm ${config.badge}`}
            >
              {CATEGORY_LABELS[content.category]}
            </span>
          </div>
        </div>

        {/*
         * 그라디언트 — overflow-hidden 바깥에 위치
         * inset-x-0 bottom-0 h-[55%] → 이미지 하단 55% 구간을 덮으며 자연스럽게 페이드
         * overflow-hidden에 클립되지 않으므로 경계선 없이 매끄럽게 사라짐
         */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-background via-background/75 to-transparent" />

        {/* 제목 + 서브텍스트 — 그라디언트 위, 역시 overflow-hidden 바깥 */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
          <h1 className="whitespace-pre-line text-[1.875rem] font-bold leading-tight text-white drop-shadow-lg sm:text-4xl">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-white/60 drop-shadow">
              {content.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── 정보 섹션 — 박스 없이 텍스트로만 흐름 유지 ── */}
      <div className="relative z-10 mx-auto max-w-lg px-6 pb-14 pt-6">
        {/* 이걸 보면 알게 되는 것 */}
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
          이걸 보면 알게 되는 것
        </p>
        <ul className="space-y-3">
          {(content.insights ?? []).map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`}
              />
              <span className="text-sm leading-snug text-white/70">
                {insight}
              </span>
            </li>
          ))}
        </ul>

        {/* 소요 시간 */}
        <div className="mt-5 flex items-center gap-1.5 text-xs text-white/35">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          약 {content.estimated_minutes ?? 5}분 소요
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          disabled={loading}
          className={`mt-8 w-full rounded-2xl py-4 text-base font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${config.button}`}
        >
          {loading ? "세션 생성 중..." : "시작하기 →"}
        </button>
      </div>
    </div>
  );
};

export default ContentIntro;
