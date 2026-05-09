"use client";

import { useEffect, useRef, useState } from "react";
import CategoryTabs from "./category-tabs";

const CategoryTabsSticky = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={markerRef} className="h-px" aria-hidden="true" />

      <div className="sticky top-12 z-30 mb-8" data-testid="category-tabs-sticky">
        {/* 전체 화면 배경 */}
        <div
          className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 pointer-events-none"
          style={{ backgroundColor: isScrolled ? "#232035" : "transparent" }}
          aria-hidden="true"
        />

        {/* 실제 탭 영역 */}
        <div className="relative mx-auto max-w-screen-lg px-4 py-3">
          <div className="flex justify-center">
            <CategoryTabs />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryTabsSticky;
