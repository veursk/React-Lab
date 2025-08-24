import React, { useState, useRef, Profiler, useMemo, useCallback } from "react";
import { PerformanceCollector } from "./PerformanceCollector";
import { PerformanceDisplay } from "./PerformanceDisplay";

interface OptimizedProfiledRunnerProps {
  title: string;
  profilerId: string;
  children: React.ReactNode;
  durationMs?: number;
}

// 측정 중에는 UI 업데이트를 최소화하는 최적화된 버전
export function OptimizedProfiledRunner({
  title,
  profilerId,
  children,
  durationMs,
}: OptimizedProfiledRunnerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [finalStats, setFinalStats] = useState(
    new PerformanceCollector().getStats()
  );

  const collectorRef = useRef(new PerformanceCollector());
  const updateStatsInterval = useRef<number | null>(null);

  // 실험 시작
  const startExperiment = useCallback(() => {
    collectorRef.current.reset();
    setFinalStats(collectorRef.current.getStats());

    setIsActive(true);
    setIsCollecting(true);

    // 측정 중에는 UI 업데이트 최소화 (실험 종료 시에만 업데이트)
    // 대신 콘솔에 주기적으로 진행상황 출력
    let logCount = 0;
    updateStatsInterval.current = setInterval(() => {
      const currentStats = collectorRef.current.getStats();
      logCount++;
      if (logCount % 10 === 0) {
        // 5초마다 한 번씩 콘솔 출력
        console.log(
          `📊 [${profilerId}] 진행중... 커밋: ${
            currentStats.totalCommits
          }, 평균: ${currentStats.averageActualDuration.toFixed(2)}ms`
        );
      }
    }, 500);

    // 자동 종료 타이머
    if (durationMs) {
      setTimeout(() => {
        stopExperiment();
      }, durationMs);
    }
  }, [profilerId, durationMs]);

  // 실험 종료
  const stopExperiment = useCallback(() => {
    setIsActive(false);
    setIsCollecting(false);

    // 통계 업데이트 중지
    if (updateStatsInterval.current) {
      clearInterval(updateStatsInterval.current);
      updateStatsInterval.current = null;
    }

    // 최종 통계 업데이트 (한 번만)
    const finalResults = collectorRef.current.getStats();
    setFinalStats(finalResults);

    // 결과를 콘솔에 출력
    console.log(`🏁 [${profilerId}] 실험 완료!`, finalResults);
  }, [profilerId]);

  const resetData = useCallback(() => {
    collectorRef.current.reset();
    setFinalStats(collectorRef.current.getStats());
  }, []);

  const downloadData = useCallback(() => {
    const filename = `${profilerId}-performance-${Date.now()}.json`;
    collectorRef.current.downloadData(filename);
  }, [profilerId]);

  // 컨트롤 UI를 메모이제이션하여 불필요한 리렌더링 방지
  const controlsUI = useMemo(
    () => (
      <div style={{ marginBottom: "20px" }}>
        <h2>{title}</h2>

        {/* 실험 컨트롤 */}
        <div style={{ marginBottom: "16px" }}>
          <button
            onClick={isActive ? stopExperiment : startExperiment}
            style={{
              padding: "12px 20px",
              backgroundColor: isActive ? "#ef4444" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "12px",
              fontWeight: "600",
            }}
          >
            {isActive ? "⏹️ Stop" : "▶️ Start"}
          </button>

          {durationMs && (
            <span style={{ fontSize: "14px", color: "#64748b" }}>
              자동 종료: {durationMs / 1000}초
            </span>
          )}
        </div>

        {/* 실험 상태 표시 */}
        <div
          style={{
            padding: "12px",
            background: isCollecting ? "#dcfce7" : "#f8fafc",
            borderRadius: "8px",
            border: `1px solid ${isCollecting ? "#bbf7d0" : "#e2e8f0"}`,
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isCollecting ? "#10b981" : "#94a3b8",
                animation: isCollecting ? "pulse 1s infinite" : "none",
              }}
            />
            <span style={{ fontWeight: "600" }}>
              {isCollecting ? "🔴 데이터 수집 중..." : "⏸️ 수집 중지"}
            </span>
            {isCollecting && (
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                (콘솔에서 진행상황 확인)
              </span>
            )}
          </div>
        </div>
      </div>
    ),
    [title, isActive, isCollecting, durationMs, startExperiment, stopExperiment]
  );

  return (
    <div style={{ padding: "20px" }}>
      {controlsUI}

      {/* 성능 데이터 표시 (측정 중이 아닐 때만 업데이트) */}
      {!isCollecting && (
        <PerformanceDisplay
          stats={finalStats}
          title={profilerId}
          onDownload={downloadData}
          onReset={resetData}
        />
      )}

      {/* 측정 중일 때 간단한 상태 표시 */}
      {isCollecting && (
        <div
          style={{
            padding: "20px",
            background: "#f0f9ff",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #0ea5e9",
          }}
        >
          <h3>📊 측정 진행 중...</h3>
          <p>정확한 측정을 위해 UI 업데이트를 최소화하고 있습니다.</p>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            진행상황은 브라우저 콘솔(F12)에서 확인하세요.
          </p>
        </div>
      )}

      {/* 실험 컨텐츠 - Profiler로 래핑 */}
      {isActive && (
        <div style={{ marginTop: "20px" }}>
          <Profiler id={profilerId} onRender={collectorRef.current.onRender}>
            {children}
          </Profiler>
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}
