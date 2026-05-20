"use client";

import Image from "next/image";
import { ResultScene, SceneMessage } from "@/lib/types/result";
import { useEffect, useRef, useState } from "react";
import type { SceneSignal } from "@/lib/types/scene-signal";
import SignalVisualization from "@/components/result/signals/SignalVisualization";

interface SceneContentProps {
  scene: ResultScene;
  sceneTitle?: string;
  sceneSubtitle?: string;
  isUnlocked: boolean;
  onUnlockScene: () => void;
  isFirst?: boolean;
  isCurrent?: boolean;
  variant?: "default" | "receipt";
}

// AI 메시지 블록
const AiBlock = ({ text, index = 0 }: { text: string; index?: number }) => {
  const label =
    index === 0 ? "관찰 기록" : index === 1 ? "감정 메모" : "분석 조각";

  return (
    <div className="mb-4">
      <div
        className="w-full font-body"
        style={{
          background: "rgba(255, 255, 255, 0.018)",
          borderRadius: "12px",
          padding: "13px 15px",
          border: "1px solid rgba(143, 122, 216, 0.035)",
        }}
      >
        <p
          className="mb-2 text-[9px] font-medium tracking-[0.14em]"
          style={{ color: "rgba(143, 122, 216, 0.34)" }}
        >
          {label}
        </p>
        <p
          className="text-sm leading-[1.75] whitespace-pre-line"
          style={{
            color: "rgba(249, 249, 229, 0.82)",
            fontSize: "14px",
            letterSpacing: "-0.01em",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

// 펀치라인 (강조 문장)
const PunchBlock = ({ text, index = 0 }: { text: string; index?: number }) => {
  // index=0: title 바로 아래 subtitle 위치. 상단 margin 없애고 하단만 유지.
  // index>0: 본문 중간 감정 강조 (기존 스타일 유지)
  const verticalMargin =
    index === 0 ? "mt-0 mb-7" : index % 2 === 0 ? "my-11" : "my-12";

  return (
    <div className={`${verticalMargin} px-4 text-left`}>
      <p
        className="font-punch"
        style={{
          /* 충분한 가독성과 배경과의 조화 */
          color: "rgba(143, 122, 216, 0.76)",
          fontSize: "15px",
          lineHeight: "1.6",
          fontWeight: "500",
          letterSpacing: "0",
          fontStyle: "italic",
        }}
      >
        “{text}”
      </p>
    </div>
  );
};

const renderMessage = (msg: SceneMessage, idx: number) => {
  switch (msg.type) {
    case "ai":
      return <AiBlock key={idx} text={msg.text} index={idx} />;
    case "punch":
      return <PunchBlock key={idx} text={msg.text} index={idx} />;
  }
};

const scene01Signals: SceneSignal[] = [
  {
    id: "scene01-anxiety",
    sceneIndex: 1,
    title: "강하게 관찰된 감정 신호",
    template: "donut",
    archetype: "anxiety_vs_stability",
    states: [
      { label: "불안 반응", intensity: 0.82 },
      { label: "안정감 기대", intensity: 0.18 },
    ],
    summaryLabel: "불안 우세",
  },
  {
    id: "scene01-expression",
    sceneIndex: 1,
    title: "강하게 관찰된 감정 신호",
    template: "donut",
    archetype: "urge_vs_suppression",
    states: [
      { label: "질문 충동", intensity: 0.88 },
      { label: "실제 표현", intensity: 0.12 },
    ],
    summaryLabel: "표현 억제",
  },
];

const EmotionEvidenceBlock = () => {
  return (
    <SignalVisualization
      title="강하게 관찰된 감정 신호"
      signals={scene01Signals}
    />
  );
};

const ReceiptReport = ({
  openingMessages,
  bodyMessages,
}: {
  openingMessages: SceneMessage[];
  bodyMessages: SceneMessage[];
}) => {
  const punch = openingMessages.find((msg) => msg.type === "punch");
  const reportMessages = [
    ...openingMessages.filter((msg) => msg.type === "ai"),
    ...bodyMessages.filter((msg) => msg.type === "ai"),
  ];

  return (
    <div data-testid="scene-receipt-report" className="px-0 py-0">
      {punch && (
        <div className="mb-7">
          <p
            className="mb-2 inline-flex rounded-full px-2 py-0.5 text-[9px] lg:text-[12px] font-medium tracking-[0.12em]"
            style={{
              background: "rgba(143, 122, 216, 0.08)",
              color: "rgba(143, 122, 216, 0.62)",
            }}
          >
            핵심 징후
          </p>
          <div
            className="overflow-hidden rounded-[12px] px-3.5 py-3.5"
            style={{
              background: "rgba(255, 255, 255, 0.012)",
              border: "1px solid rgba(143, 122, 216, 0.065)",
            }}
          >
            <p
              className="mx-auto max-w-[90%] text-center font-punch text-[16px] lg:text-[19px] leading-[1.3]"
              style={{
                color: "rgba(143, 122, 216, 0.88)",
                letterSpacing: "0",
                fontWeight: 500,
              }}
            >
              “{punch.text}”
            </p>
            <div className="mt-3 flex items-center justify-end gap-1.5">
              <span
                className="text-[9px] lg:text-[12px] tracking-[0.08em]"
                style={{ color: "rgba(249, 249, 229, 0.34)" }}
              >
                - 심리탐정 베일
              </span>
              <div
                className="relative h-6 w-6 overflow-hidden rounded-full"
                style={{
                  background: "rgba(143, 122, 216, 0.08)",
                  border: "1px solid rgba(143, 122, 216, 0.10)",
                }}
              >
                <Image
                  src="/img/cat_face.png"
                  alt=""
                  fill
                  sizes="24px"
                  className="object-cover object-center opacity-75"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <EmotionEvidenceBlock />

          {reportMessages.length > 0 && (
        <div className="space-y-2.5">
          {reportMessages.map((msg, index) => {
            const isLongRecord =
              msg.text.length > 42 || msg.text.includes("\n");

            return (
              <div key={index} className="flex gap-2">
                <span
                  className="mt-[0.62em] h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: "rgba(143, 122, 216, 0.52)" }}
                />
                <p
                  className={`whitespace-pre-line text-[13px] lg:text-[16px] ${
                    isLongRecord ? "leading-[1.68]" : "leading-[1.92]"
                  }`}
                  style={{
                    color: "rgba(249, 249, 229, 0.76)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {msg.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SceneContent = ({
  scene,
  sceneTitle,
  sceneSubtitle,
  isUnlocked,
  onUnlockScene,
  isFirst,
  isCurrent = false,
  variant = "default",
}: SceneContentProps) => {
  const isLocked = !scene.is_free && !isUnlocked;

  // MVP: body section visibility (한 번만 reveal)
  const [isBodyVisible, setIsBodyVisible] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // Body section fade-in: 한 번 reveal되면 유지
  // TODO: [UX 실험] 나중에 opening_messages/body_messages를 서버에서 명시적으로 내려주는 구조로 변경
  useEffect(() => {
    if (isLocked || !bodyRef.current || isBodyVisible) return;

    const element = bodyRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsBodyVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isLocked, isBodyVisible]);

  // MVP 임시 규칙: Opening = 첫 1개 message
  // 향후: opening_messages / body_messages를 서버에서 분리 제공
  const messages = scene.messages ?? [];
  const openingMessages = messages.slice(0, 1);
  const bodyMessages = messages.slice(1);
  // punch가 첫 메시지(subtitle 위치)면 title과의 간격을 좁힘
  const hasLeadingPunch = openingMessages[0]?.type === "punch";
  const isReceiptVariant = variant === "receipt" && scene.scene_index === 1;

  return (
    <div
      className={`${isReceiptVariant ? "px-2.5 py-3" : "px-6 py-8"} transition-opacity duration-500`}
      style={{
        borderTop: isFirst ? "none" : "1px solid rgba(255, 255, 255, 0.03)",
        opacity: isCurrent ? 1 : 0.5, // Scene dim 처리
        transitionTimingFunction: "ease-out",
      }}
    >
      {/* Scene 제목 및 상태 */}
      <div className={`${isReceiptVariant ? "mb-5" : "mb-8"} flex gap-3`}>
        {/* Subtle vertical marker */}
        {!isReceiptVariant && (
          <div
            className="w-px flex-shrink-0 self-start"
            style={{
              background: "rgba(143, 122, 216, 0.34)",
              minHeight: "80px",
            }}
          />
        )}

        {/* Scene header content */}
        <div className={isReceiptVariant ? "flex-1 text-center" : "flex-1"}>
          {/* Scene marker + 무료 배지 (같은 라인) */}
          <div
            className={
              isReceiptVariant
                ? "mb-2 flex items-center justify-center gap-2"
                : "flex items-center gap-2 mb-2"
            }
          >
            {(!isFirst || scene.is_free) &&
              (isReceiptVariant ? (
                <div>
                  <p
                    className="mt-1 text-[11px] font-medium tracking-[0.12em]"
                    style={{ color: "rgba(143, 122, 216, 0.62)" }}
                  >
                    FILE {String(scene.scene_index).padStart(2, "0")} •{" "}
                    {sceneTitle ?? scene.scene_title}
                  </p>
                </div>
                ) : (
                <p
                  className="text-[10px] lg:text-[12px] font-light tracking-widest"
                  style={{
                    color: "rgba(143, 122, 216, 0.52)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {String(scene.scene_index).padStart(2, "0")}
                  {sceneSubtitle && ` ${sceneTitle ?? scene.scene_title}`}
                </p>
              ))}

            {scene.is_free && scene.scene_index !== 2 && (
              <div
                className={
                  isReceiptVariant
                    ? "rounded-full px-1.5 py-0.5 text-[9px] lg:text-[11px] font-medium tracking-wide"
                    : "px-2 py-0.5 rounded-md text-[9px] font-medium tracking-wide uppercase"
                }
                style={{
                  background: "rgba(143, 122, 216, 0.08)",
                  color: "rgba(143, 122, 216, 0.55)",
                }}
              >
                무료
              </div>
            )}
          </div>

          <h2
            className={
              isReceiptVariant
                ? "break-keep text-[14px] lg:text-[16px] font-normal leading-[1.28] whitespace-normal"
                : sceneSubtitle
                  ? "text-xl font-normal leading-relaxed whitespace-pre-line"
                  : "text-lg font-normal leading-relaxed whitespace-pre-line"
            }
            style={{
              color: isReceiptVariant
                ? "rgba(249, 249, 229, 0.58)"
                : sceneSubtitle
                  ? "rgba(249, 249, 229, 0.84)"
                  : "rgba(249, 249, 229, 0.80)",
              letterSpacing: "-0.01em",
            }}
          >
            {sceneSubtitle ?? sceneTitle ?? scene.scene_title}
          </h2>
        </div>
      </div>

      {/* Scene 콘텐츠 */}
      {!isLocked ? (
        // 무료 또는 unlocked scene
        <div
          data-testid="scene-messages"
          className={
            isReceiptVariant
              ? "space-y-1"
              : `space-y-1 ${hasLeadingPunch ? "mt-3" : "mt-6"}`
          }
        >
          {isReceiptVariant ? (
            <ReceiptReport
              openingMessages={openingMessages}
              bodyMessages={bodyMessages}
            />
          ) : (
            <>
              {/* Opening: 항상 visible */}
              {openingMessages.map((msg, idx) => renderMessage(msg, idx))}

              {/* Body sections: scroll-driven fade-in (MVP 실험) */}
              {bodyMessages.length > 0 && (
                <div
                  ref={bodyRef}
                  data-body-section="true"
                  data-visible={isBodyVisible ? "true" : "false"}
                  className="transition-opacity duration-[600ms]"
                  style={{
                    opacity: isBodyVisible ? 1 : 0,
                  }}
                >
                  {bodyMessages.map((msg, idx) =>
                    renderMessage(msg, idx + openingMessages.length),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div data-testid="scene-preview-messages">
          <div
            className="mt-6 rounded-2xl px-5 py-8 text-center"
            style={{
              background: "rgba(255, 255, 255, 0.020)",
              border: "1px solid rgba(143, 122, 216, 0.10)",
            }}
          >
            <div
              className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(143, 122, 216, 0.12)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "rgba(143, 122, 216, 0.78)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                viewBox="0 0 24 24"
              >
                <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                <rect x="5" y="10" width="14" height="10" rx="2" />
              </svg>
            </div>
            <p
              className="text-xs lg:text-[15px] font-medium tracking-wide"
              style={{ color: "rgba(143, 122, 216, 0.72)" }}
            >
              잠긴 기록
            </p>
            <p
              className="mx-auto mt-3 max-w-[260px] text-sm lg:text-[16px] leading-relaxed"
              style={{ color: "rgba(249, 249, 229, 0.58)" }}
            >
              이 기록은 아직 잠겨 있어.
              <br />더 깊은 분석을 확인하려면 기록을 열어줘
            </p>
            <button
              data-testid="scene-unlock-btn"
              onClick={onUnlockScene}
              className="mt-7 w-full max-w-[260px] transition-all duration-200 hover:opacity-85 active:opacity-70"
              style={{
                background: "rgba(143, 122, 216, 0.24)",
                border: "1px solid rgba(143, 122, 216, 0.34)",
                borderRadius: "14px",
                padding: "15px 18px",
                boxShadow:
                  "0 8px 24px rgba(20, 16, 32, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              }}
            >
              <p
                style={{
                  color: "rgba(249, 249, 229, 0.92)",
                  fontSize: "14px",
                  lineHeight: "1.3",
                  letterSpacing: "-0.01em",
                  fontWeight: "600",
                }}
                className="lg:text-[17px]"
              >
                잠긴 기록 열기
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Unlocked badge */}
      {!scene.is_free && isUnlocked && (
        <p
          className="mt-8 text-right text-[10px] tracking-widest uppercase"
          style={{ color: "rgba(255, 255, 255, 0.08)" }}
        >
          unlocked
        </p>
      )}
    </div>
  );
};

export default SceneContent;
