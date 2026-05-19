"use client";

import { useState } from "react";
import Image from "next/image";
import CategorySelectSheet from "./category-select-sheet";

const BADGE_TEXT = "심리탐정 리포트";

const MiniHero = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <section className="relative w-full overflow-hidden">
        <div
          className="relative mx-auto max-w-xl px-7 flex flex-col md:flex-row items-flex-start md:items-center"
          style={{
            paddingTop: "clamp(24px, 4vh, 60px)",
            paddingBottom: "120px",
          }}
        >
          {/* 왼쪽: 텍스트 */}
          <div className="flex flex-col flex-1 min-w-0 relative z-10">
            {/* 배지 */}
            <span
              className="inline-flex w-fit items-center px-3 py-1 rounded-full font-body"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.38)",
                background: "rgba(255,255,255,0.03)",
                fontSize: "13px",
                letterSpacing: "-0.05em",
              }}
            >
              {BADGE_TEXT}
            </span>

            {/* 제목 */}
            <h1
              className="font-hero mt-5 md:mt-7"
              style={{
                fontSize: "clamp(1.75rem, 5.5vw, 2.5rem)",
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                color: "rgba(249, 249, 229, 0.92)",
              }}
            >
              왜 나는 <span style={{ color: "#b48be0" }}>맨날 이러지..</span>
              <br />
              싶었던 적 있어?
            </h1>

            {/* 부제 */}
            <p
              className="font-body mt-4 md:mt-6"
              style={{
                fontSize: "clamp(1rem, 4vw, 1rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: "rgba(249, 249, 229, 0.56)",
              }}
            >
              설명 안 되던 감정,
              <br />
              <span style={{ color: "#d16dac" }}>내가 정확히 말해줄게</span>
            </p>
          </div>

          {/* 오른쪽 하단: 탐정 고양이 (배경처럼 묻혀있음) */}
          <div
            className="absolute bottom-10 right-3 md:relative md:flex-shrink-0 pointer-events-none"
            style={{
              width: "200px",
              height: "200px",
            }}
          >
            <Image
              src="/img/cat_main.png"
              alt="감정 파일을 읽는 탐정"
              fill
              priority
              className="object-contain object-right-bottom"
              style={{
                opacity: 0.7,
              }}
            />
          </div>
        </div>
      </section>

      <CategorySelectSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
};

export default MiniHero;
