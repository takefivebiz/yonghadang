"use client";

import { useRouter } from "next/navigation";
import { Category, CATEGORY_LABELS } from "@/lib/types/content";

interface CategorySelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CONFIG: Record<
  Category,
  {
    label: string;
    description: string;
    accentColor: string;
    accentBg: string;
  }
> = {
  love: {
    label: "연애·결혼",
    description: "좋아하는 마음이 흔들리고 있다면",
    accentColor: "text-[rgba(209,109,172,0.6)]",
    accentBg: "bg-[rgba(209,109,172,0.08)]",
  },
  relationship: {
    label: "인간관계",
    description: "사람 사이에서 지치고 있다면",
    accentColor: "text-[rgba(105,169,190,0.6)]",
    accentBg: "bg-[rgba(105,169,190,0.08)]",
  },
  career: {
    label: "직업·진로",
    description: "선택 앞에서 계속 망설이고 있다면",
    accentColor: "text-[rgba(190,172,145,0.6)]",
    accentBg: "bg-[rgba(190,172,145,0.08)]",
  },
  emotion: {
    label: "감정",
    description: "설명되지 않는 마음이 남아있다면",
    accentColor: "text-[rgba(160,118,210,0.6)]",
    accentBg: "bg-[rgba(160,118,210,0.08)]",
  },
};

const CATEGORIES: Category[] = ["love", "relationship", "career", "emotion"];

const CategorySelectSheet = ({ isOpen, onClose }: CategorySelectSheetProps) => {
  const router = useRouter();

  const handleCategorySelect = (category: Category) => {
    onClose();
    router.push(`/category/${category}`);
  };

  return (
    <>
      {/* 백드롭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 바텀 시트 */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center max-h-[85vh] transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full max-w-[500px] bg-gradient-to-t from-[rgba(20,20,38,0.95)] to-[rgba(28,28,50,0.90)] rounded-t-3xl">

        {/* 그래브 바 */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="h-1 w-12 rounded-full bg-white/10" />
        </div>

        {/* 콘텐츠 */}
        <div className="overflow-y-auto px-5 pb-10 pt-6">
          {/* 헤드라인 — 버블 메시지 (왼쪽) */}
          <div className="mb-8 flex justify-start">
            <div className="rounded-3xl rounded-bl-none border border-white/5 bg-white/[0.03] px-4 py-3 max-w-[80%]">
              <h2 className="text-base font-nomal text-white/80">
                지금, 어떤 부분이 가장 신경 쓰여?
              </h2>
            </div>
          </div>

          {/* 카테고리 선택지 — 버블 메시지 스타일 */}
          <div className="space-y-2.5">
            {CATEGORIES.map((category) => {
              const config = CATEGORY_CONFIG[category];
              return (
                <div key={category} className="flex justify-end">
                  <button
                    onClick={() => handleCategorySelect(category)}
                    className={`group rounded-3xl rounded-br-none border border-white/5 ${config.accentBg} px-4 py-2.5 text-left transition-all duration-200 hover:border-white/10`}
                  >
                    <div className="flex flex-col gap-1.5">
                      {/* 아이콘 + 카테고리 */}
                      <div className="flex items-center gap-1.5">
                        <div className="shrink-0 flex h-5 w-5 items-center justify-center">
                          {category === "love" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-3 h-3 text-pink-400/60"
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
                              className="w-4 h-4 text-blue-400/60"
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
                              className="w-4 h-4 text-amber-400/60"
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
                              className="w-4 h-4 text-purple-400/60"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="text-sm font-medium text-white">
                          {config.label}
                        </div>
                      </div>

                      {/* 서브텍스트 */}
                      <div className="text-xs leading-relaxed text-highlight/45 pl-0.5">
                        {config.description}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* 패딩 (하단 스페이스) */}
          <div className="h-8" />
        </div>
        </div>
      </div>
    </>
  );
};

export default CategorySelectSheet;
