"use client";

import { useState } from "react";
import CategorySelectSheet from "./category-select-sheet";

const CTASticky = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="mx-auto max-w-screen-lg px-4 py-4 flex justify-center">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="group flex w-full max-w-[500px] items-center gap-3 rounded-3xl rounded-bl-none border border-white/10 bg-black/30 backdrop-blur-sm px-5 py-3 text-left transition-all duration-200 hover:border-accent/30 hover:bg-black/30"
          >
            <span className="text-lg shrink-0">✨</span>
            <span className="flex-1 text-sm font-nomal text-white/90">
              진짜 나를 이해하는 3분, 지금 시작하기
            </span>
            <svg
              className="h-4 w-4 shrink-0 text-white/40 transition-all group-hover:text-white/60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 카테고리 선택 바텀 시트 */}
      <CategorySelectSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
};

export default CTASticky;
