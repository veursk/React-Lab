import React, { useMemo } from "react";
import { useTicker } from "./Runner";
import { OptimizedProfiledRunner } from "../lib/profiler/OptimizedProfiledRunner";

// 개별 아이템 컴포넌트 (React.memo 적용)
const ListItem = React.memo(function ListItem({ value }: { value: number }) {
  // 각 아이템마다 중간 정도 계산
  let x = value;
  for (let i = 0; i < 20; i++) x = (x * 31 + 7) % 1000003;
  return (
    <li style={{ padding: "2px 0", borderBottom: "1px solid #eee" }}>
      Item: {x}
    </li>
  );
});

// 🔴 Per-item React.memo with 고정 props
function ListContent_MemoStable({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(updateRateHz);

  // 고정된 props (변경되지 않음)
  const data = useMemo(
    () =>
      new Array(1000)
        .fill(0)
        .map((_, i) => ({ id: i, value: Math.random() * 1000 })),
    []
  );

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#e74c3c",
        minHeight: "300px",
        maxHeight: "400px",
        overflow: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        Step: {step} | Items: {data.length}
      </div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
        🔴 React.memo + 고정 props (memo 효과 최대)
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {data.slice(0, 50).map((item) => (
          <ListItem key={item.id} value={item.value} />
        ))}
      </ul>
    </div>
  );
}

// 🟠 Per-item React.memo with 변경되는 props
function ListContent_MemoChanging({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(updateRateHz);

  // props가 자주 변경됨 (매 렌더링마다 변경)
  const data = useMemo(
    () =>
      new Array(1000)
        .fill(0)
        .map((_, i) => ({ id: i, value: Math.random() * 1000 + step * 0.001 })),
    [step]
  );

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#ff9800",
        minHeight: "300px",
        maxHeight: "400px",
        overflow: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        Step: {step} | Items: {data.length}
      </div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
        🟠 React.memo + 변경되는 props (memo 오버헤드)
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {data.slice(0, 50).map((item) => (
          <ListItem key={item.id} value={item.value} />
        ))}
      </ul>
    </div>
  );
}

// 🔵 No memo with 고정 props
function ListContent_NoMemoStable({ updateRateHz }: { updateRateHz: number }) {
  const step = useTicker(updateRateHz);

  // 고정된 props (변경되지 않음)
  const data = useMemo(
    () =>
      new Array(1000)
        .fill(0)
        .map((_, i) => ({ id: i, value: Math.random() * 1000 })),
    []
  );

  // 일반 컴포넌트 (React.memo 없음)
  const SimpleListItem = ({
    item,
  }: {
    item: { id: number; value: number };
  }) => {
    let x = item.value;
    for (let i = 0; i < 20; i++) x = (x * 31 + 7) % 1000003;
    return (
      <li style={{ padding: "2px 0", borderBottom: "1px solid #eee" }}>
        Item: {x}
      </li>
    );
  };

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#3498db",
        minHeight: "300px",
        maxHeight: "400px",
        overflow: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        Step: {step} | Items: {data.length}
      </div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
        🔵 No memo + 고정 props (매번 리렌더링)
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {data.slice(0, 50).map((item) => (
          <SimpleListItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

// 🟢 No memo with 변경되는 props
function ListContent_NoMemoChanging({
  updateRateHz,
}: {
  updateRateHz: number;
}) {
  const step = useTicker(updateRateHz);

  // props가 자주 변경됨 (매 렌더링마다 변경)
  const data = useMemo(
    () =>
      new Array(1000)
        .fill(0)
        .map((_, i) => ({ id: i, value: Math.random() * 1000 + step * 0.001 })),
    [step]
  );

  // 일반 컴포넌트 (React.memo 없음)
  const SimpleListItem = ({
    item,
  }: {
    item: { id: number; value: number };
  }) => {
    let x = item.value;
    for (let i = 0; i < 20; i++) x = (x * 31 + 7) % 1000003;
    return (
      <li style={{ padding: "2px 0", borderBottom: "1px solid #eee" }}>
        Item: {x}
      </li>
    );
  };

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#4caf50",
        minHeight: "300px",
        maxHeight: "400px",
        overflow: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
        Step: {step} | Items: {data.length}
      </div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
        🟢 No memo + 변경되는 props (순수 렌더링)
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {data.slice(0, 50).map((item) => (
          <SimpleListItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function Scenario3({
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
          <strong>가설:</strong> per-item memo는 상황에 따라 효과가 다르다
        </p>
        <p>
          <strong>예상:</strong> props 변경 빈도에 따라 React.memo의 효과가
          달라질 것
        </p>
        <p>
          <strong>설정:</strong> {updateRateHz}Hz 업데이트, {durationMs / 1000}
          초 실행
        </p>
        <p>
          <strong>테스트:</strong> 고정 props vs 자주 변경되는 props
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* React.memo + 고정 props */}
        <OptimizedProfiledRunner
          title="🔴 React.memo + 고정 props"
          profilerId="memo-stable-props"
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
            <h3 style={{ marginBottom: "16px" }}>React.memo 최적 조건</h3>
            <ListContent_MemoStable updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>

        {/* No memo + 고정 props */}
        <OptimizedProfiledRunner
          title="🔵 No memo + 고정 props"
          profilerId="no-memo-stable-props"
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
            <h3 style={{ marginBottom: "16px" }}>일반 렌더링 (대조군)</h3>
            <ListContent_NoMemoStable updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* React.memo + 변경되는 props */}
        <OptimizedProfiledRunner
          title="🟠 React.memo + 변경되는 props"
          profilerId="memo-changing-props"
          durationMs={durationMs}
        >
          <div
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "12px",
              border: "2px solid #ff9800",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>React.memo 비효율 조건</h3>
            <ListContent_MemoChanging updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>

        {/* No memo + 변경되는 props */}
        <OptimizedProfiledRunner
          title="🟢 No memo + 변경되는 props"
          profilerId="no-memo-changing-props"
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
            <h3 style={{ marginBottom: "16px" }}>일반 렌더링 (기준)</h3>
            <ListContent_NoMemoChanging updateRateHz={updateRateHz} />
          </div>
        </OptimizedProfiledRunner>
      </div>
    </div>
  );
}
