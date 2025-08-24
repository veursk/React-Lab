import React, { useState, useRef, Profiler } from "react";
import { PerformanceCollector } from "./PerformanceCollector";
import { PerformanceDisplay } from "./PerformanceDisplay";

interface ProfiledRunnerProps {
  title: string;
  profilerId: string;
  children: React.ReactNode;
  durationMs?: number;
}

export function ProfiledRunner({
  title,
  profilerId,
  children,
  durationMs,
}: ProfiledRunnerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const collectorRef = useRef(new PerformanceCollector());
  const [stats, setStats] = useState(collectorRef.current.getStats());

  // 통계 업데이트를 위한 인터벌
  const updateStatsInterval = useRef<number | null>(null);

  const startExperiment = () => {
    // 데이터 리셋
    collectorRef.current.reset();
    setStats(collectorRef.current.getStats());

    setIsActive(true);
    setIsCollecting(true);

    // 실시간 통계 업데이트 시작 (더 긴 간격으로 변경하여 측정 영향 최소화)
    updateStatsInterval.current = setInterval(() => {
      setStats(collectorRef.current.getStats());
    }, 500); // 100ms → 500ms로 변경하여 오버헤드 줄임

    // 자동 종료 타이머
    if (durationMs) {
      setTimeout(() => {
        stopExperiment();
      }, durationMs);
    }
  };

  const stopExperiment = () => {
    setIsActive(false);
    setIsCollecting(false);

    // 통계 업데이트 중지
    if (updateStatsInterval.current) {
      clearInterval(updateStatsInterval.current);
      updateStatsInterval.current = null;
    }

    // 최종 통계 업데이트
    setStats(collectorRef.current.getStats());
  };

  const resetData = () => {
    collectorRef.current.reset();
    setStats(collectorRef.current.getStats());
  };

  const downloadData = () => {
    const filename = `${profilerId}-performance-${Date.now()}.json`;
    collectorRef.current.downloadData(filename);
  };

  return (
    <div style={{ padding: "20px" }}>
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
                (실시간 업데이트)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 성능 데이터 표시 */}
      <PerformanceDisplay
        stats={stats}
        title={profilerId}
        onDownload={downloadData}
        onReset={resetData}
      />

      {/* 실험 컨텐츠 */}
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
