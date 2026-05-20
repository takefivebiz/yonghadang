import type { SceneSignal } from "@/lib/types/scene-signal";
import {
  Activity,
  BatteryLow,
  Bookmark,
  Infinity,
  MessageCircleOff,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type EditorialInfographicSignalTemplateProps = {
  signals: SceneSignal[];
};

const getSignalTone = (index: number) =>
  index === 0
    ? {
        background:
          "linear-gradient(145deg, rgba(88, 103, 170, 0.24), rgba(48, 38, 72, 0.34))",
        border: "1px solid rgba(142, 164, 235, 0.16)",
        accent: "rgba(207, 217, 82, 0.78)",
        text: "rgba(249, 249, 229, 0.76)",
      }
    : {
        background:
          "linear-gradient(145deg, rgba(224, 230, 238, 0.085), rgba(52, 40, 68, 0.30))",
        border: "1px solid rgba(224, 230, 238, 0.10)",
        accent: "rgba(255, 125, 91, 0.78)",
        text: "rgba(249, 249, 229, 0.72)",
      };

const SignalIcon = ({
  color,
  icon: Icon,
}: {
  color: string;
  icon: LucideIcon;
}) => {
  return (
    <div className="flex justify-end opacity-80" aria-hidden="true">
      <Icon size={38} strokeWidth={1.28} color={color} />
    </div>
  );
};

const getSignalIcon = (signalId: string): LucideIcon => {
  if (signalId.includes("interpretive-loop")) return Infinity;
  if (signalId.includes("clarity-hunger")) return Search;
  if (signalId.includes("action-imminence")) return MessageCircleOff;
  if (signalId.includes("expectation-fold")) return Bookmark;
  if (signalId.includes("emotional-fatigue")) return BatteryLow;
  if (signalId.includes("shake-intensity")) return Activity;

  return Infinity;
};

const getSignalLines = (signal: SceneSignal): string[] =>
  signal.states[0].label
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const EditorialInfographicSignalTemplate = ({
  signals,
}: EditorialInfographicSignalTemplateProps) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:gap-3">
      {signals.slice(0, 2).map((signal, index) => {
        const tone = getSignalTone(index);
        const lines = getSignalLines(signal);
        const Icon = getSignalIcon(signal.id);

        return (
          <div
            key={signal.id}
            className="flex min-h-[86px] flex-col justify-between overflow-hidden rounded-[15px] px-3 py-2.5 lg:min-h-[104px] lg:px-4 lg:py-3"
            style={{
              background: tone.background,
              border: tone.border,
            }}
          >
            <SignalIcon color={tone.accent} icon={Icon} />

            <div>
              {lines.map((line, lineIndex) => (
                <p
                  key={line}
                  className={`${lineIndex === 0 ? "" : "mt-1"} font-punch text-[20px] leading-[1.02] tracking-[-0.055em] lg:text-[27px]`}
                  style={{ color: tone.text }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EditorialInfographicSignalTemplate;
