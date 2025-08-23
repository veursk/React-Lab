import React, { useMemo } from "react";
import HeavyCalc_Baseline from "../components/HeavyCalc_Baseline";
import HeavyCalc_MemoStable from "../components/HeavyCalc_MemoStable";
import { useTicker, RunnerFrame } from "./Runner";

function useData() {
  // 값은 가끔만 바뀜 (updateRate/10)
  const base = new Array(5000)
    .fill(0)
    .map(() => Math.floor(Math.random() * 1000));
  return base;
}

// 티커를 분리해서 불필요한 리렌더링 방지
function TickerContent({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(Math.max(1, Math.floor(updateRateHz / 10)));
  const data = useMemo(() => useData(), [Math.floor(step / 50)]);
  return (
    <div className="grid">
      <div>
        <h3>Baseline</h3>
        <HeavyCalc_Baseline data={data} />
      </div>
      <div>
        <h3>useMemo (stable deps) </h3>
        <HeavyCalc_MemoStable data={data} />
      </div>
    </div>
  );
}

export default function Scenario2({
  durationMs,
  updateRateHz,
}: {
  durationMs: number;
  updateRateHz: number;
}) {
  return (
    <RunnerFrame
      title="#2 Medium/Heavy (baseline vs memo stable)"
      durationMs={durationMs}
    >
      <TickerContent updateRateHz={updateRateHz} />
    </RunnerFrame>
  );
}
