"use client";

import { useState } from "react";
import Link from "next/link";
import { AnalysisSession } from "@/lib/types/session";
import { getContentTitle, getContentCategory } from "@/lib/data/dummy-sessions";

interface SessionListProps {
  sessions: AnalysisSession[];
}

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    love: "연애",
    relationship: "인간관계",
    career: "직업·진로",
    emotion: "감정",
  };
  return labels[category] || category;
};

const getCategoryColor = (category: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    love: { bg: "bg-accent/6", text: "text-accent/60" },
    relationship: { bg: "bg-secondary/6", text: "text-secondary/60" },
    career: { bg: "bg-highlight/4", text: "text-highlight/50" },
    emotion: { bg: "bg-purple-400/6", text: "text-purple-300/60" },
  };
  return colors[category] || { bg: "bg-surface/30", text: "text-highlight/50" };
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // 밀리초 -> 일 단위
  const daysAgo = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) {
    const hoursAgo = Math.floor(diff / (1000 * 60 * 60));
    if (hoursAgo === 0) {
      const minutesAgo = Math.floor(diff / (1000 * 60));
      return `${minutesAgo}분 전`;
    }
    return `${hoursAgo}시간 전`;
  }
  if (daysAgo === 1) return "어제";
  if (daysAgo < 7) return `${daysAgo}일 전`;

  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
};

const SessionList = ({ sessions }: SessionListProps) => {
  const [displayCount, setDisplayCount] = useState(5);

  if (sessions.length === 0) {
    return (
      <section className="mb-12">
        <p className="text-xs text-highlight/50">아직 생성된 결과가 없어요</p>
      </section>
    );
  }

  const displayedSessions = sessions.slice(0, displayCount);
  const hasMore = displayCount < sessions.length;

  return (
    <section className="mb-12">
      <div className="mb-3 pt-5 pb-3 border-t border-surface/20">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-highlight/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-base font-semibold text-highlight">지난 기록</p>
        </div>
      </div>
      <div className="space-y-1">
        {displayedSessions.map((session) => {
          const contentTitle = getContentTitle(session.content_id);
          const category = getContentCategory(session.content_id);
          const categoryLabel = getCategoryLabel(category);
          const categoryColor = getCategoryColor(category);
          const formattedDate = formatDate(session.created_at);

          return (
            <Link
              key={session.id}
              href={`/result/${session.id}`}
              className="block rounded-lg border border-surface/20 bg-surface/15 p-3 transition-all hover:border-accent/30 hover:bg-surface/25"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* 카테고리 아이콘 */}
                  <div
                    className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-md ${categoryColor.bg}`}
                  >
                    {category === "love" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-pink-400/60"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    )}
                    {category === "relationship" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-400/60"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                    )}
                    {category === "career" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-amber-400/60"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                    )}
                    {category === "emotion" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-purple-400/60"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* 컨텐츠 정보 */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-highlight">
                      {contentTitle}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-highlight/50">
                        {categoryLabel}
                      </p>
                      <span className="text-xs text-highlight/30">/</span>
                      <span className="text-xs text-highlight/50">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 우측 정보 */}
                <div className="shrink-0 flex items-center">
                  <svg
                    className="w-4 h-4 text-highlight/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-surface/20">
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => setDisplayCount(displayCount + 5)}
              className="text-sm text-highlight/60 transition-colors hover:text-highlight"
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SessionList;
