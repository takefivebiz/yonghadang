"use client";

import { ResultScene } from "@/lib/types/result";

interface ProgressIndicatorProps {
  scenes: ResultScene[];
  unlockedScenes: number[];
  currentSceneIndex: number;
}

const ProgressIndicator = ({
  scenes,
  unlockedScenes,
  currentSceneIndex,
}: ProgressIndicatorProps) => {
  return (
    <div className="px-2 py-0">
      <div className="flex items-center gap-0 w-fit mx-auto">
        {scenes.map((scene, idx) => {
          const isUnlocked =
            unlockedScenes.includes(scene.scene_index) || scene.is_free;
          const isActive = idx === currentSceneIndex;

          return (
            <div key={scene.id} className="flex items-center gap-0">
              {/* Dot indicator */}
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                  isActive ? "ring-1 ring-offset-1" : ""
                }`}
                style={{
                  backgroundColor: isUnlocked
                    ? "rgba(209, 109, 172, 0.5)"
                    : "rgba(255, 255, 255, 0.08)",
                  boxShadow: isActive
                    ? "0 0 0 2px rgba(0, 0, 0, 0.8), 0 0 0 4px rgba(209, 109, 172, 0.3)"
                    : "none",
                }}
              />

              {/* Connecting line */}
              {idx < scenes.length - 1 && (
                <div
                  className="h-px mx-1 transition-colors duration-300"
                  style={{
                    width: "28px",
                    backgroundColor: isUnlocked
                      ? "rgba(209, 109, 172, 0.2)"
                      : "rgba(255, 255, 255, 0.04)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
