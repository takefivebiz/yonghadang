"use client";

import { useEffect, useRef, useState } from "react";
import CategoryTabs from "./category-tabs";

const CategoryTabsSticky = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    // Intersection Observer로 마커 요소 감지
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 마커가 화면 상단을 벗어나면 배경 표시
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 스크롤 감지용 마커 */}
      <div ref={markerRef} className="h-px" aria-hidden="true" />

      <div
        className={`sticky top-14 z-30 mb-8 transition-all duration-200 ${
          isScrolled
            ? "bg-background/55 backdrop-blur-md"
            : "bg-transparent backdrop-blur-none"
        }`}
      >
        <div className="px-4 py-3">
          <CategoryTabs />
        </div>
      </div>
    </>
  );
};

export default CategoryTabsSticky;
