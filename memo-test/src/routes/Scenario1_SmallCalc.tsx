import React, { Profiler } from "react";
import SmallCalc_Baseline from "../components/SmallCalc_Baseline";
import SmallCalc_Memo from "../components/SmallCalc_Memo";
import { useTicker } from "./Runner";
import { OptimizedProfiledRunner } from "../lib/profiler/OptimizedProfiledRunner";

// Baseline 실험용 컴포넌트
function TickerContent_Baseline({ updateRateHz }: { updateRateHz: number }) {
  const n = useTicker(updateRateHz);
  return (
    <div
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#e74c3c",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SmallCalc_Baseline n={n % 1000} />
    </div>
  );
}

// useMemo 실험용 컴포넌트
function TickerContent_Memo({ updateRateHz }: { updateRateHz: number }) {
  const n = useTicker(updateRateHz);
  return (
    <div
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#3498db",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SmallCalc_Memo n={n % 1000} />
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
    <div>
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

      {/* Baseline 실험 */}
      <OptimizedProfiledRunner
        title="🔴 Baseline (직접 계산)"
        profilerId="smallcalc-baseline"
        durationMs={durationMs}
      >
        <div
          style={{
            padding: "20px",
            background: "#fff",
            borderRadius: "12px",
            border: "2px solid #e74c3c",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>SmallCalc Baseline</h3>
          <TickerContent_Baseline updateRateHz={updateRateHz} />
        </div>
      </OptimizedProfiledRunner>

      {/* useMemo 실험 */}
      <OptimizedProfiledRunner
        title="🔵 useMemo (메모이제이션)"
        profilerId="smallcalc-memo"
        durationMs={durationMs}
      >
        <div
          style={{
            padding: "20px",
            background: "#fff",
            borderRadius: "12px",
            border: "2px solid #3498db",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>SmallCalc with useMemo</h3>
          <TickerContent_Memo updateRateHz={updateRateHz} />
        </div>
      </OptimizedProfiledRunner>
    </div>
  );
}
