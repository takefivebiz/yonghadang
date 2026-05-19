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
        {/* 배경: 탐정 고양이 (절대 배치) */}
        <div
          className="absolute bottom-42 md:bottom-31 right-3 md:right-60 pointer-events-none"
          style={{
            width: "clamp(180px, 45vw, 260px)",
            height: "clamp(180px, 45vw, 260px)",
          }}
        >
          {/* 고양이 뒤 원형 글로우 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 55% 55%, rgba(186, 112, 208, 0.191) 10%, rgba(209, 155, 224, 0.077) 35%, transparent 75%)",
            }}
          />
          <Image
            src="/img/cat_main.png"
            alt="감정 파일을 읽는 탐정"
            fill
            priority
            className="object-contain object-right-bottom"
            style={{ opacity: 0.9 }}
          />
        </div>

        {/* 콘텐츠: 텍스트와 CTA */}
        <div
          className="relative mx-auto max-w-xl px-7"
          style={{
            paddingTop: "clamp(24px, 4vh, 60px)",
            paddingBottom: "60px",
          }}
        >
          {/* 텍스트 영역 */}
          <div className="flex flex-col flex-1 min-w-0">
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
                fontSize: "clamp(1.8rem, 5.5vw, 2.5rem)",
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                color: "rgba(249, 249, 229, 0.92)",
              }}
            >
              무슨 일인지,
              <br />
              <span style={{ color: "#9b88df" }}>나한테 다 말해봐</span>
            </h1>

            {/* 부제 */}
            <p
              className="font-body mt-4 md:mt-6"
              style={{
                fontSize: "clamp(0.95rem, 3.5vw, 1.2rem)",
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                color: "rgba(249, 249, 229, 0.808)",
              }}
            >
              설명되지 않던 감정,
              <br />
              내가{" "}
              <span
                style={{
                  color: "rgba(155, 136, 223, 0.88)",
                }}
              >
                정확하게{" "}
              </span>
              읽어줄게
              <br />
            </p>

            {/* CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 md:mt-10 w-full">
              <button
                onClick={() => setIsSheetOpen(true)}
                className="flex-1 px-6 py-2 rounded-lg font-body text-center transition-all duration-200 hover:opacity-90"
                aria-label="감정 의뢰하기"
                style={{
                  background: "#7562b0",
                  color: "rgba(249, 249, 229, 0.95)",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                의뢰하기
              </button>
              <button
                onClick={() => (window.location.href = "/auth")}
                className="flex-1 px-6 py-2 rounded-lg font-body text-center transition-all duration-200 hover:border-opacity-100"
                aria-label="파일 열람하기"
                style={{
                  border: "1px solid rgba(143, 122, 216, 0.42)",
                  background: "rgba(38, 32, 58, 0.72)",
                  color: "rgba(249, 249, 229, 0.85)",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                파일 열람
              </button>
            </div>
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
