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
          <div className="relative space-y-1 pb-32 mt-6">
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
              className="absolute left-4 right-4 flex items-center gap-3 transition-all duration-200 hover:opacity-85 active:opacity-70"
              style={{
                bottom: "140px",
                background: "rgba(170, 100, 150, 0.35)",
                border: "1px solid rgba(170, 100, 150, 0.45)",
                borderRadius: "3px 14px 14px 14px",
                padding: "20px 16px",
                pointerEvents: "auto",
              }}
            >
              {/* Lock icon */}
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                style={{ background: "rgba(180, 120, 220, 0.3)" }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: "rgba(180, 120, 220, 0.95)" }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1C6.477 1 2 5.477 2 11v8c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2v-8c0-5.523-4.477-10-10-10zm0 2c4.418 0 8 3.582 8 8v8H4v-8c0-4.418 3.582-8 8-8zm1 7h-2v4h2v-4z" />
                </svg>
              </div>

              {/* CTA text */}
              <div className="flex flex-col items-center justify-center gap-0">
                <p
                  className="font-normal text-center"
                  style={{
                    color: "rgba(240, 150, 200, 0.95)",
                    letterSpacing: "-0.01em",
                    fontSize: "14px",
                  }}
                >
                  계속 읽기
                </p>
                <p
                  className="font-normal text-[11px] text-center"
                  style={{
                    color: "rgba(240, 150, 200, 0.95)",
                    letterSpacing: "-0.01em",
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
