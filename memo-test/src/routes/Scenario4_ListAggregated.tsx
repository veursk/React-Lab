import React, { useMemo } from "react";
import { RunnerFrame } from "./Runner";
import Item from "../components/List_Item";

export default function Scenario4() {
  const data = useMemo(
    () => new Array(2000).fill(0).map(() => Math.random()),
    []
  );
  return (
    <RunnerFrame
      title="🧪 Scenario #4: List aggregated (no per-item memo)"
      durationMs={10000}
    >
      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          background: "#f8fafc",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>🎯 가설:</strong> React.memo 없는 리스트 렌더링 (대조군)
        </p>
        <p>
          <strong>📊 데이터:</strong> {data.length}개 리스트 아이템
          (메모이제이션 없음)
        </p>
      </div>
      <ul style={{ maxHeight: "400px", overflow: "auto" }}>
        {data.map((v, i) => (
          <Item key={i} v={v} />
        ))}
      </ul>
    </RunnerFrame>
  );
}
