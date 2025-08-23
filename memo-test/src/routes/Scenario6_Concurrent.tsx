import React, { startTransition, useMemo, useState } from "react";
import HeavyCalc_MemoStable from "../components/HeavyCalc_MemoStable";
import { RunnerFrame } from "./Runner";

export default function Scenario6() {
  const [q, setQ] = useState("");
  const data = useMemo(
    () => new Array(8000).fill(0).map(() => Math.floor(Math.random() * 1000)),
    []
  );
  const filtered = useMemo(
    () => data.filter((v) => v.toString().includes(q)),
    [data, q]
  );

  return (
    <RunnerFrame
      title="🧪 Scenario #6: Concurrent (transition)"
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
          <strong>🎯 가설:</strong> Concurrent 기능과 메모이제이션의 상호작용
          확인
        </p>
        <p>
          <strong>📊 데이터:</strong> {data.length}개 → {filtered.length}개
          (필터링됨)
        </p>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="숫자 검색 (예: 123)..."
          style={{
            padding: "12px",
            fontSize: "16px",
            width: "100%",
            maxWidth: "300px",
            borderRadius: "8px",
            border: "2px solid #e2e8f0",
          }}
          onChange={(e) => {
            const v = e.target.value;
            startTransition(() => setQ(v));
          }}
        />
      </div>

      <div
        style={{
          padding: "16px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <HeavyCalc_MemoStable data={filtered} />
      </div>
    </RunnerFrame>
  );
}
