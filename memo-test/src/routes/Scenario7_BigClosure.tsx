import React, { useMemo } from "react";
import { RunnerFrame } from "./Runner";
import { heavyParse } from "../lib/workloads";

function BigCapture({ n }: { n: number }) {
  const big = useMemo(() => heavyParse(20000), [n]); // 큰 배열 캡처
  return (
    <div
      style={{
        padding: "16px",
        background: "#fff3cd",
        borderRadius: "8px",
        border: "1px solid #ffeaa7",
      }}
    >
      <p>
        <strong>Kept objects:</strong> {big.length}
      </p>
      <p>
        <strong>Memory footprint:</strong> ~
        {((big.length * 100) / 1024).toFixed(1)}KB
      </p>
    </div>
  );
}

export default function Scenario7() {
  const step = Math.floor(performance.now() / 1000);

  return (
    <RunnerFrame title="🧪 Scenario #7: Big closure capture" durationMs={10000}>
      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          background: "#f8fafc",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>🎯 가설:</strong> 큰 클로저를 메모이제이션하면 메모리 사용량이
          증가할 것
        </p>
        <p>
          <strong>⚠️ 주의:</strong> 이 시나리오는 메모리 누수 가능성을
          테스트합니다
        </p>
      </div>

      <BigCapture n={step} />
    </RunnerFrame>
  );
}
