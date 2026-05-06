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
          background: "rgba(255, 255, 255, 0.055)",
          borderRadius: "3px 14px 14px 14px",
          padding: "10px 15px",
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
          color: "rgba(209, 109, 172, 0.55)",
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
            color: "rgba(255, 255, 255, 0.318)",
            letterSpacing: "0.08em",
          }}
        >
          {String(scene.scene_index).padStart(2, "0")}
        </p>
      )}

      {/* Scene 제목 및 상태 */}
      <div className="mb-4">
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
        // Locked scene: preview + fade + lock message
        <div>
          {/* Preview messages with fade */}
          <div className="relative">
            <div className="space-y-1 pb-12 mt-6">
              {(scene.preview_messages ?? []).map(renderMessage)}
            </div>

            {/* Fade-out overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(12, 10, 22, 0.60) 40%, rgba(12, 10, 22, 0.95) 100%)",
              }}
            />
          </div>

          {/* Lock message */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: "rgba(255, 255, 255, 0.25)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1C6.477 1 2 5.477 2 11v8c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2v-8c0-5.523-4.477-10-10-10zm0 2c4.418 0 8 3.582 8 8v8H4v-8c0-4.418 3.582-8 8-8zm1 7h-2v4h2v-4z" />
              </svg>
            </div>
            <p
              className="text-xs text-center leading-relaxed"
              style={{ color: "rgba(249, 249, 229, 0.35)" }}
            >
              여기서부터는
              <br />
              잠겨 있어
            </p>
          </div>

          {/* Unlock CTA */}
          <button
            onClick={onUnlockScene}
            className="w-full mt-8 rounded-2xl py-3.5 font-medium transition-all duration-200 hover:opacity-85 active:opacity-70"
            style={{
              background: "rgba(209, 109, 172, 0.15)",
              border: "1px solid rgba(209, 109, 172, 0.3)",
              color: "rgba(209, 109, 172, 0.85)",
              fontSize: "13px",
            }}
          >
            이 흐름만 이어보기 · 900원
          </button>
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
