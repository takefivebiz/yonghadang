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
            className="group flex w-full max-w-[500px] items-center gap-2 rounded-3xl rounded-bl-none border border-accent/20 bg-black/20 backdrop-blur-sm px-4 py-3 text-left transition-all duration-200 hover:border-accent/35 hover:bg-black/25"
          >
            <span>✨</span>
            <span className="flex-1 text-[13px] font-nomal text-white/80">
              혼자 고민하고 있다면, 편하게 말해볼래?
            </span>
            <svg
              className="h-3.5 w-3.5 shrink-0 text-accent/45 transition-all group-hover:text-accent/60"
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
