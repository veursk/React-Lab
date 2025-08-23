import React, { useMemo } from "react";
import { RunnerFrame } from "./Runner";
import Item from "../components/List_ItemMemo";

export default function Scenario3({ durationMs }: { durationMs: number }) {
  const data = useMemo(
    () => new Array(2000).fill(0).map(() => Math.random()),
    []
  );
  return (
    <RunnerFrame
      title="🧪 Scenario #3: List per-item React.memo"
      durationMs={durationMs}
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
          <strong>🎯 가설:</strong> React.memo로 개별 아이템 메모이제이션 효과
          확인
        </p>
        <p>
          <strong>📊 데이터:</strong> {data.length}개 리스트 아이템
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
