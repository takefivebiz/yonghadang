"use client";

import { useEffect, useRef, useState } from "react";
import CategoryTabs from "./category-tabs";

const CategoryTabsSticky = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const marker = markerRef.current;
      if (!marker) return;

      const rect = marker.getBoundingClientRect();
      setIsScrolled(rect.top <= 60); // top 값이 fixed 위치에 닿기 전 바로 전환
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div ref={markerRef} className="h-px" aria-hidden="true" />

      <div className="relative mb-8">
        <div
          className={[
            "mx-auto max-w-screen-lg px-4 py-3",

            isScrolled ? "invisible" : "visible",
          ].join(" ")}
        >
          <div className="flex justify-center">
            <CategoryTabs />
          </div>
        </div>
      </div>

      {/* fixed 탭: 스크롤 후만 보임 */}

      <div
        data-testid="category-tabs-sticky"
        className={[
          "fixed left-0 right-0 top-[52px] z-30",

          isScrolled ? "block" : "hidden",
        ].join(" ")}
        style={{ backgroundColor: "#232035" }}
      >
        <div className="mx-auto max-w-screen-lg px-4 py-3">
          <div className="flex justify-center">
            <CategoryTabs />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryTabsSticky;
