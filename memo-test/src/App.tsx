import React, { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Scenario1 from "./routes/Scenario1_SmallCalc";
import Scenario2 from "./routes/Scenario2_MediumHeavyCalc";
import Scenario3 from "./routes/Scenario3_ListPerItem";
import Scenario4 from "./routes/Scenario4_ListAggregated";
import Scenario5 from "./routes/Scenario5_UnstableDeps";
import Scenario6 from "./routes/Scenario6_Concurrent";
import Scenario7 from "./routes/Scenario7_BigClosure";

export default function App() {
  const [durationMs, setDurationMs] = useState(10000);
  const [updateRateHz, setUpdateRateHz] = useState(20);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="container">
      <header>
        <h1>useMemo Hypotheses Lab</h1>
        <nav>
          <Link to="/" className={isActive("/") ? "active" : ""}>
            Home
          </Link>
          <Link to="/s1" className={isActive("/s1") ? "active" : ""}>
            #1 SmallCalc
          </Link>
          <Link to="/s2" className={isActive("/s2") ? "active" : ""}>
            #2 Medium/Heavy
          </Link>
          <Link to="/s3" className={isActive("/s3") ? "active" : ""}>
            #3 List per-item
          </Link>
          <Link to="/s4" className={isActive("/s4") ? "active" : ""}>
            #4 List aggregated
          </Link>
          <Link to="/s5" className={isActive("/s5") ? "active" : ""}>
            #5 Unstable deps
          </Link>
          <Link to="/s6" className={isActive("/s6") ? "active" : ""}>
            #6 Concurrent
          </Link>
          <Link to="/s7" className={isActive("/s7") ? "active" : ""}>
            #7 Big closure
          </Link>
        </nav>
      </header>

      <section className="panel">
        <label>
          Duration (ms):
          <input
            type="number"
            value={durationMs}
            onChange={(e) => setDurationMs(+e.target.value)}
          />
        </label>
        <label>
          Update rate (Hz):
          <input
            type="number"
            value={updateRateHz}
            onChange={(e) => setUpdateRateHz(+e.target.value)}
          />
        </label>
        <p className="hint">
          실험 페이지에서 Start를 누르면 설정이 적용됩니다.
        </p>
      </section>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/s1"
          element={
            <Scenario1 durationMs={durationMs} updateRateHz={updateRateHz} />
          }
        />
        <Route
          path="/s2"
          element={
            <Scenario2 durationMs={durationMs} updateRateHz={updateRateHz} />
          }
        />
        <Route path="/s3" element={<Scenario3 durationMs={durationMs} />} />
        <Route path="/s4" element={<Scenario4 />} />
        <Route path="/s5" element={<Scenario5 />} />
        <Route path="/s6" element={<Scenario6 />} />
        <Route path="/s7" element={<Scenario7 />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div className="stage">
      <h2>🧪 useMemo 가설 검증 실험실</h2>
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #cbd5e0",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
          📋 실험 진행 방법
        </h3>
        <div style={{ display: "grid", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <span
              style={{
                background: "#667eea",
                color: "white",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              1
            </span>
            <span>상단 네비게이션에서 테스트할 시나리오를 선택하세요</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <span
              style={{
                background: "#48bb78",
                color: "white",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              2
            </span>
            <span>
              Duration과 Update rate를 조정한 후 <strong>Start</strong> 버튼을
              클릭하세요
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <span
              style={{
                background: "#4299e1",
                color: "white",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              3
            </span>
            <span>
              Chrome DevTools의 Performance & React Profiler로 동시에 관찰하세요
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <span
              style={{
                background: "#f56565",
                color: "white",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              4
            </span>
            <span>결과는 화면에 표시되며, JSON으로 다운로드 가능합니다</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>🎯 검증할 7가지 가설</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>#1-2:</strong> 소규모 컴포넌트에서 메모이제이션 오버헤드
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>#3:</strong> 복잡한 계산에서 메모이제이션 효과
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>#4:</strong> 리스트 렌더링에서 React.memo 효과
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>#5:</strong> 불안정한 의존성 배열의 영향
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>#6:</strong> Concurrent 기능과의 상호작용
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "12px",
              borderRadius: "8px",
            }}
          >
            <strong>#7:</strong> 큰 클로저의 메모리 영향
          </div>
        </div>
      </div>
    </div>
  );
}
