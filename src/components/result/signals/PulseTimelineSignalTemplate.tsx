import type { SceneSignal } from "@/lib/types/scene-signal";

type PulseTimelineSignalTemplateProps = {
  signals: SceneSignal[];
};

const clampIntensity = (value: number) => Math.min(Math.max(value, 0), 1);

const replayEvents = [
  {
    time: "23:14",
    label: "답장 다시 확인",
    signalId: "meaning-loop",
  },
  {
    time: "00:08",
    label: "말투 의미 재해석",
    signalId: "meaning-loop",
  },
  {
    time: "00:51",
    label: "거리감 추론",
    signalId: "reaction-spike",
  },
  {
    time: "01:27",
    label: "대화 다시 읽음",
    signalId: "meaning-loop",
  },
];

const PulseTimelineSignalTemplate = ({
  signals,
}: PulseTimelineSignalTemplateProps) => {
  const getSignalForEvent = (signalId: string) =>
    signals.find((signal) => signal.id.includes(signalId)) ?? signals[0];

  return (
    <div
      className="overflow-hidden rounded-[12px] px-3.5 py-4"
      style={{
        background: "rgba(255, 255, 255, 0.012)",
        border: "1px solid rgba(143, 122, 216, 0.065)",
      }}
    >
      <div className="relative">
        <div
          className="absolute bottom-2 left-[43px] top-2 w-px"
          style={{
            background:
              "linear-gradient(180deg, rgba(143, 122, 216, 0.04), rgba(143, 122, 216, 0.24), rgba(143, 122, 216, 0.05))",
          }}
        />

        <div className="space-y-3.5">
          {replayEvents.map((event) => {
            const signal = getSignalForEvent(event.signalId);
            const primaryIntensity = clampIntensity(
              signal?.states[0]?.intensity ?? 0.68,
            );
            const pulseSize = 7 + Math.round(primaryIntensity * 7);
            const pulseOpacity = 0.28 + primaryIntensity * 0.42;
            const isSpike = event.signalId === "reaction-spike";

            return (
              <div
                key={`${event.time}-${event.label}`}
                className="relative flex items-center gap-3"
              >
                <p
                  className="w-[31px] shrink-0 text-right text-[9px] lg:text-[11px] tabular-nums"
                  style={{ color: "rgba(249, 249, 229, 0.34)" }}
                >
                  {event.time}
                </p>

                <div
                  className="relative flex h-6 w-5 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    className="absolute rounded-full"
                    style={{
                      width: `${pulseSize + 10}px`,
                      height: `${pulseSize + 10}px`,
                      background: isSpike
                        ? "rgba(143, 122, 216, 0.10)"
                        : "rgba(143, 122, 216, 0.07)",
                      opacity: pulseOpacity,
                    }}
                  />
                  <span
                    className="relative rounded-full"
                    style={{
                      width: `${pulseSize}px`,
                      height: `${pulseSize}px`,
                      background: isSpike
                        ? "rgba(143, 122, 216, 0.82)"
                        : "rgba(143, 122, 216, 0.58)",
                      boxShadow: isSpike
                        ? "0 0 18px rgba(143, 122, 216, 0.25)"
                        : "0 0 10px rgba(143, 122, 216, 0.16)",
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className="truncate text-[12px] lg:text-[14px]"
                      style={{ color: "rgba(249, 249, 229, 0.76)" }}
                    >
                      {event.label}
                    </p>
                    {signal?.summaryLabel && (
                      <p
                        className="shrink-0 text-[9px] lg:text-[11px] tracking-[0.08em]"
                        style={{ color: "rgba(143, 122, 216, 0.52)" }}
                      >
                        {signal.summaryLabel}
                      </p>
                    )}
                  </div>

                  <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-transparent">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(primaryIntensity * 100, 48)}%`,
                        background:
                          "linear-gradient(90deg, rgba(143, 122, 216, 0.10), rgba(143, 122, 216, 0.46))",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 flex items-center justify-between gap-3 border-t pt-3"
          style={{ borderColor: "rgba(143, 122, 216, 0.06)" }}
        >
          {signals.slice(0, 2).map((signal) => {
            const [primaryState, secondaryState] = signal.states;

            return (
              <div key={signal.id} className="min-w-0">
                <p
                  className="truncate text-[9px] lg:text-[11px]"
                  style={{ color: "rgba(249, 249, 229, 0.34)" }}
                >
                  {secondaryState.label}
                </p>
                <p
                  className="mt-0.5 truncate text-[10px] lg:text-[12px]"
                  style={{
                    color: "rgba(143, 122, 216, 0.62)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {primaryState.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PulseTimelineSignalTemplate;
