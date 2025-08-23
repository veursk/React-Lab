import React, { useMemo } from "react";
import HeavyCalc_MemoStable from "../components/HeavyCalc_MemoStable";
import { RunnerFrame } from "./Runner";

export default function Scenario5() {
  const stable = useMemo(
    () => new Array(5000).fill(0).map(() => Math.random()),
    []
  );
  const unstable = new Array(5000).fill(0).map(() => Math.random()); // 매 렌더 새 배열

  return (
    <RunnerFrame
      title="🧪 Scenario #5: Stable vs Unstable deps"
      durationMs={10000}
    >
      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          background: "#f8fafc",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>🎯 가설:</strong> 불안정한 의존성 배열이 메모이제이션 효과를
          감소시킬 것
        </p>
      </div>
      <div className="grid">
        <div>
          <h3>🟢 Stable deps (memoized array)</h3>
          <div
            style={{
              padding: "12px",
              background: "#d4edda",
              borderRadius: "8px",
            }}
          >
            <HeavyCalc_MemoStable data={stable} />
          </div>
        </div>
        <div>
          <h3>🔴 Unstable deps (new array every render)</h3>
          <div
            style={{
              padding: "12px",
              background: "#f8d7da",
              borderRadius: "8px",
            }}
          >
            <HeavyCalc_MemoStable data={unstable} />
          </div>
        </div>
      </div>
    </RunnerFrame>
  );
}
