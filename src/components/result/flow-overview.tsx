"use client";

import { ResultScene } from "@/lib/types/result";

interface FlowOverviewProps {
  scenes: ResultScene[];
  unlockedScenes: number[];
  onUnlockAll: () => void;
  onUnlockScene?: (sceneIndex: number) => void;
}

const FlowOverview = ({
  scenes,
  unlockedScenes,
  onUnlockAll,
  onUnlockScene,
}: FlowOverviewProps) => {
  const paidScenes = scenes.filter((s) => !s.is_free);
  const allPaidUnlocked = paidScenes.every((s) =>
    unlockedScenes.includes(s.scene_index),
  );
  const previewScenes = paidScenes.slice(0, 4);

  return (
    <div
      data-testid="flow-overview"
      className="px-6 pb-8 pt-1"
      style={{
        background: "transparent",
      }}
    >
      {/* 헤더 */}
      <div className="mb-4">
        <p
          className="text-[11px] font-medium tracking-[0.12em]"
          style={{ color: "rgba(143, 122, 216, 0.58)" }}
        >
          여기까지의 흐름
        </p>
        <p
          className="mt-1 text-xs leading-relaxed"
          style={{ color: "rgba(249, 249, 229, 0.34)" }}
        >
          이후 기록은 잠겨 있어.
        </p>
      </div>

      {/* Scene 목록 */}
      <div className="mb-5 space-y-1.5">
        {previewScenes.map((scene) => {
          const isUnlocked =
            unlockedScenes.includes(scene.scene_index) || scene.is_free;

          return (
            <div
              key={scene.id}
              data-testid="flow-overview-scene-item"
              data-unlocked={isUnlocked}
              className="flex items-center gap-3 rounded-md px-1 py-1.5 text-sm"
              style={{
                background: "transparent",
                cursor: !isUnlocked && onUnlockScene ? "pointer" : "default",
              }}
              onClick={() => !isUnlocked && onUnlockScene?.(scene.scene_index)}
            >
              {/* Scene info */}
              <span
                className="w-5 flex-shrink-0 text-[11px]"
                style={{ color: "rgba(143, 122, 216, 0.48)" }}
              >
                {String(scene.scene_index).padStart(2, "0")}
              </span>
              <p
                className="min-w-0 flex-1 truncate text-xs"
                style={{
                  color: isUnlocked
                    ? "rgba(249, 249, 229, 0.58)"
                    : "rgba(249, 249, 229, 0.42)",
                }}
              >
                {scene.scene_title}
              </p>
              {!isUnlocked && onUnlockScene && (
                <span
                  className="flex-shrink-0 text-[11px]"
                  style={{ color: "rgba(143, 122, 216, 0.42)" }}
                >
                  열기
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {!allPaidUnlocked && (
        <div>
          {/* Primary CTA with badge */}
          <div className="relative">
            <button
              data-testid="flow-overview-unlock-all-btn"
              onClick={onUnlockAll}
              className="w-full rounded-[14px] py-3 transition-all duration-200 hover:opacity-90 active:opacity-80"
              style={{
                background: "rgba(143, 122, 216, 0.20)",
                border: "1px solid rgba(143, 122, 216, 0.26)",
              }}
            >
              <span
                style={{
                  color: "rgba(249, 249, 229, 0.88)",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                전체 기록 열기
              </span>
            </button>
          </div>
          <p
            className="mt-3 text-center text-[11px]"
            style={{ color: "rgba(249, 249, 229, 0.24)" }}
          >
            또는 필요한 기록만 열람할 수 있어
          </p>
        </div>
      )}

      {allPaidUnlocked && (
        <p
          className="text-center text-xs py-3"
          style={{ color: "rgba(209, 109, 172, 0.5)" }}
        >
          전체 흐름이 열렸어. 계속 읽어봐
        </p>
      )}
    </div>
  );
};

export default FlowOverview;
