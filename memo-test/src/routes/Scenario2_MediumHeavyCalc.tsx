import React, { useMemo } from "react";
import HeavyCalc_Baseline from "../components/HeavyCalc_Baseline";
import HeavyCalc_MemoStable from "../components/HeavyCalc_MemoStable";
import { useTicker } from "./Runner";
import { OptimizedProfiledRunner } from "../lib/profiler/OptimizedProfiledRunner";

function useData() {
  // 값은 가끔만 바뀜 (updateRate/10)
  const base = new Array(5000)
    .fill(0)
    .map(() => Math.floor(Math.random() * 1000));
  return base;
}

// Baseline 실험용 컴포넌트
function TickerContent_Baseline({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(Math.max(1, Math.floor(updateRateHz / 10)));
  const data = useMemo(() => useData(), [Math.floor(step / 50)]);
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
      <HeavyCalc_Baseline data={data} />
    </div>
  );
}

// useMemo 실험용 컴포넌트
function TickerContent_Memo({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(Math.max(1, Math.floor(updateRateHz / 10)));
  const data = useMemo(() => useData(), [Math.floor(step / 50)]);
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
      <HeavyCalc_MemoStable data={data} />
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
          <strong>예상:</strong> 무거운 계산에서는 useMemo가 확실한 성능 향상을
          보일 것
        </p>
        <p>
          <strong>설정:</strong> {Math.max(1, Math.floor(updateRateHz / 10))}Hz
          데이터 변경, {durationMs / 1000}초 실행
        </p>
        <p>
          <strong>계산:</strong> 5000개 배열 정렬 + 중복제거 + 합산
        </p>
      </div>

      {/* Baseline 실험 */}
      <OptimizedProfiledRunner
        title="🔴 Baseline (직접 계산)"
        profilerId="heavycalc-baseline"
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
          <h3 style={{ marginBottom: "16px" }}>HeavyCalc Baseline</h3>
          <TickerContent_Baseline updateRateHz={updateRateHz} />
        </div>
      </OptimizedProfiledRunner>

      {/* useMemo 실험 */}
      <OptimizedProfiledRunner
        title="🔵 useMemo (메모이제이션)"
        profilerId="heavycalc-memo"
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
          <h3 style={{ marginBottom: "16px" }}>HeavyCalc with useMemo</h3>
          <TickerContent_Memo updateRateHz={updateRateHz} />
        </div>
      </OptimizedProfiledRunner>
    </div>
  );
}
