import type { SceneSignal } from "@/lib/types/scene-signal";
import DonutSignalTemplate from "./DonutSignalTemplate";

type SignalVisualizationProps = {
  title: string;
  signals: SceneSignal[];
};

const SignalVisualization = ({ title, signals }: SignalVisualizationProps) => {
  const donutSignals = signals.filter((signal) => signal.template === "donut");

  if (donutSignals.length === 0) return null;

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

      <DonutSignalTemplate signals={donutSignals} />
    </div>
  );
};

export default SignalVisualization;
