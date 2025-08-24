import React, { useMemo } from "react";
import HeavyCalc_MemoStable from "../components/HeavyCalc_MemoStable";
import { useTicker } from "./Runner";
import { OptimizedProfiledRunner } from "../lib/profiler/OptimizedProfiledRunner";

// 🟢 Stable deps (안정적 의존성)
function StableDepsContent({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(updateRateHz);

  // 안정적인 의존성 (변경되지 않음)
  const stableData = useMemo(
    () => new Array(5000).fill(0).map(() => Math.random()),
    [] // 빈 의존성 배열 = 한 번만 생성
  );

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#4caf50",
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <div style={{ marginBottom: "12px", fontWeight: "bold" }}>
        Step: {step}
      </div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
        🟢 안정적 의존성 ([] - 변경 없음)
      </div>
      <div
        style={{ padding: "12px", background: "#e8f5e8", borderRadius: "6px" }}
      >
        <HeavyCalc_MemoStable data={stableData} />
      </div>
    </div>
  );
}

// 🔴 Unstable deps (불안정한 의존성)
function UnstableDepsContent({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(updateRateHz);

  // 불안정한 의존성 (매 렌더링마다 새 배열)
  const unstableData = new Array(5000).fill(0).map(() => Math.random());

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#e74c3c",
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <div style={{ marginBottom: "12px", fontWeight: "bold" }}>
        Step: {step}
      </div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
        🔴 불안정한 의존성 (매번 새 배열 생성)
      </div>
      <div
        style={{ padding: "12px", background: "#ffeaea", borderRadius: "6px" }}
      >
        <HeavyCalc_MemoStable data={unstableData} />
      </div>
    </div>
  );
}

export default function Scenario4({
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
          <strong>가설:</strong> 불안정한 의존성이 useMemo 효과를 완전히
          무력화시킬 것
        </p>
        <p>
          <strong>예상:</strong> 안정적 의존성은 빠르고, 불안정한 의존성은 매우
          느릴 것
        </p>
        <p>
          <strong>설정:</strong> {updateRateHz}Hz 업데이트, {durationMs / 1000}
          초 실행
        </p>
        <p>
          <strong>계산:</strong> 5000개 배열 집계 (정렬 + 중복제거 + 합산)
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Stable deps 실험 */}
        <OptimizedProfiledRunner
          title="🟢 Stable deps (효율적)"
          profilerId="stable-deps"
          durationMs={durationMs}
        >
          <div
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "12px",
              border: "2px solid #4caf50",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>안정적 의존성</h3>
            <StableDepsContent updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>

        {/* Unstable deps 실험 */}
        <OptimizedProfiledRunner
          title="🔴 Unstable deps (비효율적)"
          profilerId="unstable-deps"
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
            <h3 style={{ marginBottom: "16px" }}>불안정한 의존성</h3>
            <UnstableDepsContent updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>
      </div>
    </div>
  );
}
