import React from "react";
import SmallCalc_Baseline from "../components/SmallCalc_Baseline";
import SmallCalc_Memo from "../components/SmallCalc_Memo";
import { useTicker, RunnerFrame } from "./Runner";

// 티커를 분리해서 불필요한 리렌더링 방지
function TickerContent({ updateRateHz }: { updateRateHz: number }) {
  const n = useTicker(updateRateHz);
  return (
    <div className="grid">
      <div>
        <h3>🔴 Baseline (직접 계산)</h3>
        <div
          style={{
            padding: "12px",
            background: "#fff",
            borderRadius: "8px",
            border: "2px solid #e74c3c",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <SmallCalc_Baseline n={n % 1000} />
        </div>
      </div>
      <div>
        <h3>🔵 useMemo (메모이제이션)</h3>
        <div
          style={{
            padding: "12px",
            background: "#fff",
            borderRadius: "8px",
            border: "2px solid #3498db",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <SmallCalc_Memo n={n % 1000} />
        </div>
      </div>
    </div>
  );
}

export default function Scenario1({
  durationMs,
  updateRateHz,
}: {
  durationMs: number;
  updateRateHz: number;
}) {
  return (
    <RunnerFrame
      title="🧪 Scenario #1: SmallCalc (Baseline vs useMemo)"
      durationMs={durationMs}
    >
      <div
        style={{
          marginBottom: "20px",
          padding: "16px",
          background: "#f8fafc",
          borderRadius: "8px",
        }}
      >
        <h4>🎯 가설 검증</h4>
        <p>
          <strong>예상:</strong> 계산이 너무 가벼워서 useMemo 오버헤드가 더 클
          것
        </p>
        <p>
          <strong>설정:</strong> {updateRateHz}Hz 업데이트, {durationMs / 1000}
          초 실행
        </p>
      </div>

      <TickerContent updateRateHz={updateRateHz} />
    </RunnerFrame>
  );
}
