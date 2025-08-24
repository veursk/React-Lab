import React, { useMemo } from "react";
import { useTicker } from "./Runner";
import { OptimizedProfiledRunner } from "../lib/profiler/OptimizedProfiledRunner";
import { heavyParse } from "../lib/workloads";

// 🔴 Big closure with memo (메모리 누적)
function BigClosureWithMemo({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(updateRateHz);

  // 큰 객체를 메모이제이션 (의존성이 자주 변경됨)
  const bigData = useMemo(() => {
    const result = heavyParse(10000); // 큰 객체 생성
    return {
      data: result,
      timestamp: Date.now(),
      step: step,
    };
  }, [Math.floor(step / 5)]); // 매 5 step마다 변경

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
        🔴 큰 객체 메모이제이션 (메모리 누적 위험)
      </div>
      <div
        style={{
          padding: "12px",
          background: "#ffeaea",
          borderRadius: "6px",
          textAlign: "center",
        }}
      >
        <p>
          <strong>캐시된 객체:</strong> {bigData.data.length}개
        </p>
        <p>
          <strong>메모리 사용:</strong> ~
          {((bigData.data.length * 100) / 1024).toFixed(1)}KB
        </p>
        <p>
          <strong>생성 시간:</strong>{" "}
          {new Date(bigData.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

// 🔵 No memo (메모리 효율적)
function BigClosureNoMemo({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(updateRateHz);

  // 진짜 메모이제이션 없음 - 매번 직접 계산
  const result = heavyParse(10000);
  const bigData = {
    data: result,
    timestamp: Date.now(),
    step: step,
  };

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#3498db",
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
        🔵 매번 새 생성 (GC 친화적)
      </div>
      <div
        style={{
          padding: "12px",
          background: "#e3f2fd",
          borderRadius: "6px",
          textAlign: "center",
        }}
      >
        <p>
          <strong>현재 객체:</strong> {bigData.data.length}개
        </p>
        <p>
          <strong>메모리 사용:</strong> ~
          {((bigData.data.length * 100) / 1024).toFixed(1)}KB
        </p>
        <p>
          <strong>생성 시간:</strong>{" "}
          {new Date(bigData.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default function Scenario5({
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
          <strong>가설:</strong> 큰 객체를 메모이제이션하면 메모리 누적으로
          오히려 성능이 나빠질 것
        </p>
        <p>
          <strong>예상:</strong> 메모이제이션이 메모리 사용량을 증가시키고 GC
          부담을 늘릴 것
        </p>
        <p>
          <strong>설정:</strong> {updateRateHz}Hz 업데이트, {durationMs / 1000}
          초 실행
        </p>
        <p>
          <strong>⚠️ 주의:</strong> 이 실험은 메모리 누수 가능성을 테스트합니다
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Big closure with memo 실험 */}
        <OptimizedProfiledRunner
          title="🔴 Big closure + memo (위험)"
          profilerId="big-closure-memo"
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
            <h3 style={{ marginBottom: "16px" }}>큰 객체 메모이제이션</h3>
            <BigClosureWithMemo updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>

        {/* No memo 실험 */}
        <OptimizedProfiledRunner
          title="🔵 매번 새 생성 (안전)"
          profilerId="big-closure-no-memo"
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
            <h3 style={{ marginBottom: "16px" }}>매번 새 객체 생성</h3>
            <BigClosureNoMemo updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>
      </div>
    </div>
  );
}
