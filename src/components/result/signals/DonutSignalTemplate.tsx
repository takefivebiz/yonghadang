import type { SceneSignal } from "@/lib/types/scene-signal";

type DonutSignalTemplateProps = {
  signals: SceneSignal[];
};

const clampIntensity = (value: number) => Math.min(Math.max(value, 0), 1);

const DonutSignalTemplate = ({ signals }: DonutSignalTemplateProps) => {
  return (
    <div
      className="overflow-hidden rounded-[12px] px-3.5 py-3.5"
      style={{
        background: "rgba(255, 255, 255, 0.012)",
        border: "1px solid rgba(143, 122, 216, 0.065)",
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        {signals.map((signal) => {
          const [dominantState, recessiveState] = signal.states;
          const dominantShare = clampIntensity(dominantState.intensity) * 100;

          return (
            <div
              key={signal.id}
              className="flex min-w-0 flex-col items-center"
            >
              <div
                className="relative h-20 w-20 rounded-full"
                style={{
                  background: `conic-gradient(rgba(143, 122, 216, 0.72) 0deg ${dominantShare * 3.6}deg, rgba(143, 122, 216, 0.16) ${dominantShare * 3.6}deg 360deg)`,
                  boxShadow: "0 0 18px rgba(143, 122, 216, 0.055)",
                }}
              >
                <div
                  className="absolute inset-[10px] rounded-full"
                  style={{ background: "rgba(32, 25, 43, 0.94)" }}
                />
                {signal.summaryLabel && (
                  <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
                    <span
                      className="text-[9px] lg:text-[11px] font-medium leading-[1.15]"
                      style={{ color: "rgba(249, 249, 229, 0.62)" }}
                    >
                      {signal.summaryLabel}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 min-w-0 max-w-full">
                <div className="flex items-center justify-center gap-1">
                  <p
                    className="truncate text-[10px] lg:text-[12px]"
                    style={{ color: "rgba(249, 249, 229, 0.64)" }}
                  >
                    {dominantState.label}
                  </p>
                  <span style={{ color: "rgba(143, 122, 216, 0.34)" }}>
                    ↔
                  </span>
                  <p
                    className="truncate text-[10px] lg:text-[12px]"
                    style={{ color: "rgba(249, 249, 229, 0.34)" }}
                  >
                    {recessiveState.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutSignalTemplate;
