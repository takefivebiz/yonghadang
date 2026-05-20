import type { SceneSignal } from "@/lib/types/scene-signal";
import DonutSignalTemplate from "./DonutSignalTemplate";
import EditorialInfographicSignalTemplate from "./EditorialInfographicSignalTemplate";
import PulseTimelineSignalTemplate from "./PulseTimelineSignalTemplate";

type SignalVisualizationProps = {
  title: string;
  signals: SceneSignal[];
};

const SignalVisualization = ({ title, signals }: SignalVisualizationProps) => {
  const donutSignals = signals.filter((signal) => signal.template === "donut");
  const pulseTimelineSignals = signals.filter(
    (signal) => signal.template === "pulse_timeline",
  );
  const editorialInfographicSignals = signals.filter(
    (signal) => signal.template === "editorial_infographic",
  );

  if (
    donutSignals.length === 0 &&
    pulseTimelineSignals.length === 0 &&
    editorialInfographicSignals.length === 0
  ) {
    return null;
  }

  return (
    <div className="mb-7">
      <p
        className="mb-2 inline-flex rounded-full px-2 py-0.5 text-[9px] lg:text-[11px] font-medium tracking-[0.12em]"
        style={{
          background: "rgba(143, 122, 216, 0.08)",
          color: "rgba(143, 122, 216, 0.62)",
        }}
      >
        {title}
      </p>

      <div className="space-y-3">
        {donutSignals.length > 0 && (
          <DonutSignalTemplate signals={donutSignals} />
        )}
        {pulseTimelineSignals.length > 0 && (
          <PulseTimelineSignalTemplate signals={pulseTimelineSignals} />
        )}
        {editorialInfographicSignals.length > 0 && (
          <EditorialInfographicSignalTemplate
            signals={editorialInfographicSignals}
          />
        )}
      </div>
    </div>
  );
};

export default SignalVisualization;
