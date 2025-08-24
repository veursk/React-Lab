import React from "react";
import { PerformanceStats } from "./PerformanceCollector";

interface PerformanceDisplayProps {
  stats: PerformanceStats;
  title: string;
  onDownload?: () => void;
  onReset?: () => void;
}

export function PerformanceDisplay({
  stats,
  title,
  onDownload,
  onReset,
}: PerformanceDisplayProps) {
  if (stats.totalCommits === 0) {
    return (
      <div
        style={{
          padding: "16px",
          background: "#f8fafc",
          borderRadius: "8px",
          border: "2px dashed #cbd5e0",
          textAlign: "center",
        }}
      >
        <p>📊 성능 데이터 수집 대기중...</p>
        <p style={{ fontSize: "14px", color: "#64748b" }}>
          실험을 시작하면 실시간으로 성능 데이터가 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        borderRadius: "12px",
        border: "1px solid #0ea5e9",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ color: "#0c4a6e", margin: 0 }}>📊 {title} 성능 분석</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          {onReset && (
            <button
              onClick={onReset}
              style={{
                padding: "6px 12px",
                background: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🔄 Reset
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              style={{
                padding: "6px 12px",
                background: "#0ea5e9",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              💾 Download
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {/* 커밋 통계 */}
        <div
          style={{
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "14px" }}
          >
            🔄 Commit 통계
          </h4>
          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
            <div>
              <strong>총 커밋:</strong> {stats.totalCommits}
            </div>
            <div>
              <strong>Mount:</strong> {stats.mountCommits}
            </div>
            <div>
              <strong>Update:</strong> {stats.updateCommits}
            </div>
          </div>
        </div>

        {/* 렌더링 시간 */}
        <div
          style={{
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "14px" }}
          >
            ⏱️ 렌더링 시간 (ms)
          </h4>
          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
            <div>
              <strong>평균:</strong> {stats.averageActualDuration.toFixed(2)}
            </div>
            <div>
              <strong>최대:</strong> {stats.maxActualDuration.toFixed(2)}
            </div>
            <div>
              <strong>최소:</strong> {stats.minActualDuration.toFixed(2)}
            </div>
          </div>
        </div>

        {/* 백분위수 */}
        <div
          style={{
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "14px" }}
          >
            📈 백분위수 (ms)
          </h4>
          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
            <div>
              <strong>P50:</strong> {stats.p50ActualDuration.toFixed(2)}
            </div>
            <div>
              <strong>P95:</strong> {stats.p95ActualDuration.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Long Tasks */}
        <div
          style={{
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "14px" }}
          >
            🐌 Long Tasks
          </h4>
          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
            <div>
              <strong>16.67ms 초과:</strong> {stats.longTasks}
            </div>
            <div>
              <strong>비율:</strong>{" "}
              {((stats.longTasks / stats.totalCommits) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 성능 평가 */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          background:
            stats.p95ActualDuration > 16.67
              ? "#fef2f2"
              : stats.p95ActualDuration > 8
              ? "#fffbeb"
              : "#f0fdf4",
          borderRadius: "8px",
          border: `1px solid ${
            stats.p95ActualDuration > 16.67
              ? "#fecaca"
              : stats.p95ActualDuration > 8
              ? "#fed7aa"
              : "#bbf7d0"
          }`,
        }}
      >
        <div style={{ fontSize: "14px" }}>
          <strong>
            {stats.p95ActualDuration > 16.67
              ? "🔴 성능 개선 필요"
              : stats.p95ActualDuration > 8
              ? "🟡 보통 성능"
              : "🟢 우수한 성능"}
          </strong>
        </div>
        <div style={{ fontSize: "12px", marginTop: "4px", color: "#64748b" }}>
          P95 {stats.p95ActualDuration.toFixed(2)}ms
          {stats.p95ActualDuration > 16.67 && " (60fps 기준 초과)"}
        </div>
      </div>

      {/* 최근 데이터 차트 (간단한 막대 그래프) */}
      {stats.data.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <h4
            style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "14px" }}
          >
            📊 최근 렌더링 시간 추이
          </h4>
          <div
            style={{
              display: "flex",
              height: "60px",
              background: "white",
              borderRadius: "6px",
              padding: "8px",
              alignItems: "end",
              gap: "1px",
              overflow: "hidden",
            }}
          >
            {stats.data.slice(-50).map((data, index) => {
              const height = Math.max(
                2,
                (data.actualDuration / stats.maxActualDuration) * 44
              );
              const color =
                data.actualDuration > 16.67
                  ? "#ef4444"
                  : data.actualDuration > 8
                  ? "#f59e0b"
                  : "#10b981";
              return (
                <div
                  key={index}
                  style={{
                    width: "3px",
                    height: `${height}px`,
                    background: color,
                    borderRadius: "1px",
                  }}
                  title={`${data.actualDuration.toFixed(2)}ms (${data.phase})`}
                />
              );
            })}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
            최근 {Math.min(50, stats.data.length)}개 커밋 (🟢 좋음 🟡 보통 🔴
            느림)
          </div>
        </div>
      )}
    </div>
  );
}
