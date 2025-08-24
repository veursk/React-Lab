import { ProfilerOnRenderCallback } from "react";

export interface PerformanceData {
  id: string;
  phase: "mount" | "update";
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  timestamp: number;
}

export interface PerformanceStats {
  totalCommits: number;
  mountCommits: number;
  updateCommits: number;
  totalActualDuration: number;
  averageActualDuration: number;
  maxActualDuration: number;
  minActualDuration: number;
  p50ActualDuration: number;
  p95ActualDuration: number;
  longTasks: number; // > 16.67ms (60fps threshold)
  data: PerformanceData[];
}

export class PerformanceCollector {
  private data: PerformanceData[] = [];
  private startTime: number = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.data = [];
    this.startTime = performance.now();
  }

  // React Profiler onRender 콜백
  onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    this.data.push({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      timestamp: performance.now() - this.startTime,
    });
  };

  getStats(): PerformanceStats {
    if (this.data.length === 0) {
      return {
        totalCommits: 0,
        mountCommits: 0,
        updateCommits: 0,
        totalActualDuration: 0,
        averageActualDuration: 0,
        maxActualDuration: 0,
        minActualDuration: 0,
        p50ActualDuration: 0,
        p95ActualDuration: 0,
        longTasks: 0,
        data: [],
      };
    }

    const actualDurations = this.data
      .map((d) => d.actualDuration)
      .sort((a, b) => a - b);
    const mountCommits = this.data.filter((d) => d.phase === "mount").length;
    const updateCommits = this.data.filter((d) => d.phase === "update").length;
    const longTasks = this.data.filter((d) => d.actualDuration > 16.67).length;

    const totalActualDuration = actualDurations.reduce((sum, d) => sum + d, 0);
    const averageActualDuration = totalActualDuration / actualDurations.length;

    // 백분위수 계산
    const p50Index = Math.floor(actualDurations.length * 0.5);
    const p95Index = Math.floor(actualDurations.length * 0.95);

    return {
      totalCommits: this.data.length,
      mountCommits,
      updateCommits,
      totalActualDuration,
      averageActualDuration,
      maxActualDuration: Math.max(...actualDurations),
      minActualDuration: Math.min(...actualDurations),
      p50ActualDuration: actualDurations[p50Index] || 0,
      p95ActualDuration: actualDurations[p95Index] || 0,
      longTasks,
      data: [...this.data],
    };
  }

  exportData(): string {
    return JSON.stringify(
      {
        collectedAt: new Date().toISOString(),
        stats: this.getStats(),
      },
      null,
      2
    );
  }

  downloadData(filename?: string) {
    const data = this.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `performance-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
