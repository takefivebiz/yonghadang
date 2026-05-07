"use client";

import { ResultScene } from "@/lib/types/result";

interface FlowOverviewProps {
  scenes: ResultScene[];
  unlockedScenes: number[];
  onUnlockAll: () => void;
}

const FlowOverview = ({
  scenes,
  unlockedScenes,
  onUnlockAll,
}: FlowOverviewProps) => {
  const paidScenes = scenes.filter((s) => !s.is_free);
  const allPaidUnlocked = paidScenes.every((s) =>
    unlockedScenes.includes(s.scene_index),
  );

  return (
    <div
      className="px-6 py-16 border-t border-b border-white/10"
      style={{
        background: "rgba(209, 109, 172, 0.04)",
      }}
    >
      {/* 헤더 */}
      <div className="mb-10 text-center">
        <p
          className="text-xs tracking-wider"
          style={{ color: "rgba(209, 109, 172, 0.5)" }}
        >
          <span style={{ fontSize: "14px" }}>···</span> 여기까지의 흐름{" "}
          <span style={{ fontSize: "14px" }}>···</span>
        </p>
      </div>

      {/* Scene 목록 */}
      <div className="space-y-2 mb-12 max-w-sm mx-auto">
        {scenes.map((scene) => {
          const isUnlocked =
            unlockedScenes.includes(scene.scene_index) || scene.is_free;

          return (
            <div
              key={scene.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm"
              style={{
                background: isUnlocked
                  ? "rgba(209, 109, 172, 0.1)"
                  : "rgba(255, 255, 255, 0.02)",
              }}
            >
              {/* Status icon */}
              <div className="flex-shrink-0">
                {isUnlocked ? (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(209, 109, 172, 0.4)" }}
                  >
                    <svg
                      className="w-2.5 h-2.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: "rgba(209, 109, 172, 0.9)" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255, 255, 255, 0.08)" }}
                  >
                    <svg
                      className="w-2.5 h-2.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: "rgba(255, 255, 255, 0.25)" }}
                    >
                      <path d="M5 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Scene info */}
              <p
                style={{
                  color: isUnlocked
                    ? "rgba(249, 249, 229, 0.75)"
                    : "rgba(249, 249, 229, 0.4)",
                }}
              >
                {scene.scene_title}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {!allPaidUnlocked && (
        <div className="max-w-sm mx-auto">
          {/* Primary CTA with badge */}
          <div className="relative mb-4">
            <button
              onClick={onUnlockAll}
              className="w-full rounded-2xl py-3.5 font-medium transition-all duration-200 hover:opacity-85 active:opacity-70"
              style={{
                background: "rgba(170, 100, 150, 0.35)",
                border: "1px solid rgba(170, 100, 150, 0.45)",
                color: "rgba(240, 150, 200, 0.95)",
                fontSize: "13px",
              }}
            >
              전체 이어보기 · 2,900원
            </button>
            {/* 추천 뱃지 */}
            <div
              className="absolute -top-2 right-6 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
              style={{
                background: "rgba(180, 120, 220, 0.95)",
                color: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(180, 120, 220, 0.8)",
                boxShadow: "0 4px 12px rgba(180, 120, 220, 0.35)",
              }}
            >
              ✨ 추천
            </div>
          </div>

          <p
            className="text-center text-xs leading-relaxed"
            style={{ color: "rgba(249, 249, 229, 0.25)" }}
          >
            여기서부터는 더 깊어져
          </p>
        </div>
      )}

      {allPaidUnlocked && (
        <p
          className="text-center text-xs py-3"
          style={{ color: "rgba(209, 109, 172, 0.5)" }}
        >
          전체 흐름이 열렸어. 계속 읽어봐 →
        </p>
      )}
    </div>
  );
};

export default FlowOverview;
