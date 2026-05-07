"use client";

import { ResultScene, SceneMessage } from "@/lib/types/result";

interface SceneContentProps {
  scene: ResultScene;
  isUnlocked: boolean;
  onUnlockScene: () => void;
  isFirst?: boolean;
}

// AI 메시지 블록
const AiBlock = ({ text, index = 0 }: { text: string; index?: number }) => {
  // 텍스트 길이와 메시지 순서에 따라 리듬 조정
  const textLength = text.length;
  const rhythm = index % 3;

  let maxWidth = "max-w-[85%]";
  let marginBottom = "mb-3";

  if (textLength < 25) {
    maxWidth = "max-w-[65%]";
  } else if (textLength < 55) {
    maxWidth = rhythm === 0 ? "max-w-[75%]" : "max-w-[78%]";
  } else if (textLength < 90) {
    maxWidth = "max-w-[85%]";
  } else {
    maxWidth = "max-w-[92%]";
  }

  // 메시지 간 간격 변화
  if (rhythm === 1) marginBottom = "mb-2.5";
  else if (rhythm === 2) marginBottom = "mb-3.5";

  return (
    <div className={`${marginBottom} flex justify-start`}>
      <div
        className={maxWidth}
        style={{
          /* 배경과 자연스럽게 blend되는 bubble */
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: "3px 14px 14px 14px",
          padding: "10px 15px",
          /* 아주 약한 border로 정의감 최소화 */
          border: "1px solid rgba(255, 255, 255, 0.015)",
        }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "rgba(249, 249, 229, 0.80)",
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
  const verticalMargin = index % 2 === 0 ? "my-11" : "my-12";

  return (
    <div className={`${verticalMargin} px-4 text-center`}>
      <p
        style={{
          /* 충분한 가독성과 배경과의 조화 */
          color: "rgba(209, 109, 172, 0.58)",
          fontSize: "14px",
          lineHeight: "1.75",
          fontWeight: "400",
          letterSpacing: "0",
        }}
      >
        {text}
      </p>
    </div>
  );
};

// 메모 쪽지
const MemoBlock = ({ text, index = 0 }: { text: string; index?: number }) => {
  const verticalMargin = index % 2 === 0 ? "my-5" : "my-6";
  const rotation = index % 2 === 0 ? "-1.2deg" : "-1.4deg";

  return (
    <div
      className={`${verticalMargin} mx-2`}
      style={{
        background: "rgba(245, 239, 220, 0.88)",
        color: "#3A2A18",
        padding: "12px 16px",
        borderRadius: "4px",
        transform: `rotate(${rotation})`,
        fontSize: "13px",
        lineHeight: "1.95",
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};

const getSceneIntroText = (sceneIndex: number): string => {
  const introTexts: Record<number, string> = {
    1: "마음은 이미 작은 반응에도 흔들리고 있었어.",
    2: "안심보다 확인이 먼저 필요해진 상태였어.",
    3: "반복은 여기서부터 더 선명해져.",
    4: "이제 돌이킬 수 없는 지점이 가까워지고 있었어.",
    5: "마지막 순간의 선택이 남겨진 거야.",
    6: "모든 흐름의 끝에 보이는 것들이 있어.",
  };
  return introTexts[sceneIndex] || "";
};

const renderMessage = (msg: SceneMessage, idx: number) => {
  switch (msg.type) {
    case "ai":
      return <AiBlock key={idx} text={msg.text} index={idx} />;
    case "punch":
      return <PunchBlock key={idx} text={msg.text} index={idx} />;
    case "memo":
      return <MemoBlock key={idx} text={msg.text} index={idx} />;
  }
};

const SceneContent = ({
  scene,
  isUnlocked,
  onUnlockScene,
  isFirst,
}: SceneContentProps) => {
  const isLocked = !scene.is_free && !isUnlocked;

  return (
    <div
      className="px-6 py-8"
      style={{
        borderTop: isFirst ? "none" : "1px solid rgba(255, 255, 255, 0.03)",
      }}
    >
      {/* Subtle scene marker */}
      {!isFirst && (
        <p
          className="text-[10px] font-light tracking-widest mb-2.5"
          style={{
            color: "rgba(209, 109, 172, 0.392)",
            letterSpacing: "0.08em",
          }}
        >
          {String(scene.scene_index).padStart(2, "0")}
        </p>
      )}

      {/* Scene 제목 및 상태 */}
      <div className="mb-4 flex gap-3">
        {/* Subtle vertical marker */}
        <div
          className="w-px flex-shrink-0 self-start"
          style={{
            background: "rgba(209, 109, 172, 0.392)",
            minHeight: "55px",
          }}
        />

        {/* Scene header content */}
        <div className="flex-1">
          {scene.is_free && scene.scene_index !== 2 && (
            <div
              className="inline-block px-2 py-0.5 rounded-md text-[9px] font-medium mb-2 tracking-wide uppercase"
              style={{
                background: "rgba(209, 109, 172, 0.08)",
                color: "rgba(209, 109, 172, 0.5)",
              }}
            >
              무료
            </div>
          )}

          <h2
            className="text-xl font-normal leading-relaxed"
            style={{
              color: "rgba(249, 249, 229, 0.80)",
              letterSpacing: "-0.01em",
            }}
          >
            {scene.scene_title}
          </h2>

          {getSceneIntroText(scene.scene_index) && (
            <p
              className="leading-relaxed mt-1.5 mb-4"
              style={{
                color: "rgba(249, 249, 229, 0.28)",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              {getSceneIntroText(scene.scene_index)}
            </p>
          )}
        </div>
      </div>

      {/* Scene 콘텐츠 */}
      {!isLocked ? (
        // 무료 또는 unlocked scene: 전체 메시지 노출
        <div className="space-y-1 mt-6">
          {(scene.messages ?? []).map((msg, idx) => (
            <div
              key={idx}
              style={{
                // 첫 message를 살짝 강조 (opener 역할)
                opacity: idx === 0 ? 1 : 1,
              }}
            >
              {renderMessage(msg, idx)}
            </div>
          ))}
        </div>
      ) : (
        // Locked scene: preview 메시지가 자연스럽게 희미해지면서 잠기는 방식
        <div>
          {/* Preview messages with gradual fade — lock CTA가 중간에 끼어 있음 */}
          <div className="relative mt-6 space-y-1 pb-16">
            {(scene.preview_messages ?? []).map((msg, idx) => {
              // 모든 preview message에 동일한 opacity와 blur 적용
              const opacity = 0.5;
              const filter = "blur(2.8px)";
              return (
                <div
                  key={idx}
                  style={{
                    opacity,
                    filter,
                  }}
                >
                  {renderMessage(msg, idx)}
                </div>
              );
            })}

            {/* Message Bubble Style Lock CTA — preview 흐름 위에 overlay */}
            <button
              onClick={onUnlockScene}
              className="absolute  left-1/2 w-[78%] max-w-[420px] -translate-x-1/2 transition-all duration-200 hover:opacity-85 active:opacity-70"
              style={{
                bottom: "120px",
                background:
                  "linear-gradient(180deg, rgba(140, 80, 130, 0.65) 0%, rgba(110, 60, 105, 0.58) 100%)",
                border: "1.5px solid rgba(200, 120, 180, 0.5)",
                borderRadius: "3px 14px 14px 14px",
                padding: "20px 20px",
                boxShadow:
                  "0 0 10px rgba(180, 120, 200, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                pointerEvents: "auto",
              }}
            >
              {/* Lock icon - layout에서 제외 */}
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  background: "rgba(180, 110, 160, 0.35)",
                  boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.12)",
                }}
              >
                <svg
                  className="h-5 w-5"
                  style={{ color: "rgba(230, 170, 210, 0.8)" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                </svg>
              </div>
              {/* Text는 CTA 전체 기준 중앙 */}
              <div className="flex w-full flex-col items-center justify-center text-center">
                <p
                  style={{
                    color: "rgba(245, 180, 220, 0.92)",
                    fontSize: "16px",
                    letterSpacing: "-0.01em",
                    fontWeight: "600",
                  }}
                >
                  이 부분만 보기
                </p>
                <p
                  style={{
                    color: "rgba(255, 200, 230, 0.85)",
                    fontSize: "12px",
                    letterSpacing: "-0.01em",
                    fontWeight: "400",
                  }}
                >
                  900원
                </p>
              </div>
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
