import React, { useState, useEffect, useRef } from "react";

export function useTicker(hz: number) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000 / hz);

    return () => clearInterval(interval);
  }, [hz]);

  return tick;
}

// 타이머만 담당하는 분리된 컴포넌트
function TimerControls({
  durationMs,
  onStart,
  onStop,
}: {
  durationMs?: number;
  onStart: () => void;
  onStop: () => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTest = () => {
    setIsRunning(true);
    setElapsedTime(0);
    startTimeRef.current = performance.now();
    onStart();

    // 경과 시간 업데이트
    intervalRef.current = setInterval(() => {
      setElapsedTime(performance.now() - startTimeRef.current);
    }, 100);

    // 자동 종료 타이머 설정
    if (durationMs) {
      timeoutRef.current = setTimeout(() => {
        stopTest();
      }, durationMs);
    }
  };

  const stopTest = () => {
    setIsRunning(false);
    onStop();

    // 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setElapsedTime(performance.now() - startTimeRef.current);
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <button
        onClick={isRunning ? stopTest : startTest}
        style={{
          padding: "12px 20px",
          backgroundColor: isRunning ? "#e74c3c" : "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginRight: "12px",
          fontWeight: "600",
        }}
      >
        {isRunning ? "⏹️ Stop" : "▶️ Start"}
      </button>

      <span
        style={{
          marginLeft: "12px",
          fontWeight: "bold",
          color: isRunning ? "#e74c3c" : "#27ae60",
          fontSize: "16px",
        }}
      >
        {isRunning
          ? `🔄 Running... ${(elapsedTime / 1000).toFixed(1)}s`
          : elapsedTime > 0
          ? `✅ Completed (${(elapsedTime / 1000).toFixed(1)}s)`
          : "🏁 Ready to start"}
      </span>
    </div>
  );
}

export function RunnerFrame({
  title,
  children,
  durationMs,
}: {
  title: string;
  children: React.ReactNode;
  durationMs?: number;
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="stage">
      <h2>{title}</h2>

      <TimerControls
        durationMs={durationMs}
        onStart={() => setIsActive(true)}
        onStop={() => setIsActive(false)}
      />

      <div
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "1px solid #cbd5e0",
        }}
      >
        <h4 style={{ marginBottom: "12px", color: "#2d3748" }}>📊 분석 방법</h4>
        <ol style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
          <li>
            <strong>React DevTools → ⚛️ Profiler</strong> 탭 열기
          </li>
          <li>
            React Profiler에서 <strong>🔴 Record</strong> 시작
          </li>
          <li>
            여기서 <strong>▶️ Start</strong> 버튼 클릭하여 실험 시작
          </li>
          <li>
            실험 완료 후 React Profiler에서 <strong>🔴 Stop</strong>
          </li>
          <li>
            <strong>각 commit별로 컴포넌트 렌더링 시간 비교 분석</strong>
          </li>
        </ol>
        <div
          style={{
            marginTop: "12px",
            padding: "8px 12px",
            background: "rgba(102, 126, 234, 0.1)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          💡 <strong>팁:</strong> Timeline에서 각 막대(commit)를 클릭하면
          컴포넌트별 렌더링 시간을 확인할 수 있습니다.
        </div>
      </div>

      {/* 실험이 활성화될 때만 children 렌더링 */}
      {isActive && children}

      {!isActive && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "2px dashed #cbd5e0",
          }}
        >
          <h3>🏁 실험 대기중</h3>
          <p>Start 버튼을 클릭하여 실험을 시작하세요</p>

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#e3f2fd",
              borderRadius: "8px",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            <h4>📋 데이터 수집 방법</h4>
            <ol>
              <li>
                <strong>React Profiler:</strong> Settings → Export data to file
              </li>
              <li>
                <strong>수동 기록:</strong> Timeline에서 각 commit 시간 복사
              </li>
              <li>
                <strong>콘솔 스크립트:</strong> F12 → Console에서 아래 코드 실행
              </li>
            </ol>
            <div
              style={{
                background: "#263238",
                color: "#a7ffeb",
                padding: "8px",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              {`// React DevTools 데이터 추출
$r.$$typeof // 현재 선택된 컴포넌트 정보
performance.getEntriesByType('measure')`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
