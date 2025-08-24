# 🧪 React 메모이제이션 성능 실험실

> \*_"useMemo를 정확히 언제 써야할까?"_

## React 메모이제이션 고민사항

React 개발하다 보면 맨날 고민되는 것들:

- 🤔 "이 계산에도 useMemo 써야 하나?"
- 🤔 "React.memo 남발하면 오히려 느려질까?"
- 🤔 "의존성 자주 바뀌면 의미없나?"

**이 모든 궁금증을 실제 데이터로 해결해보자!**

## 🔬 5가지 실험

### 1️⃣ 가벼운 계산 vs useMemo

**가설**: "10번 루프 같은 가벼운 계산은 useMemo가 오히려 독"

```javascript
// 🔴 Baseline: 그냥 계산
const result = smallCalc(n);

// 🔵 useMemo: 메모이제이션
const result = useMemo(() => smallCalc(n), [n]);
```

---

### 2️⃣ 무거운 계산 vs useMemo

**가설**: "진짜 무거운 계산은 useMemo가 이득이다"

```javascript
// 5000개 배열 정렬 + 중복제거 + 합산
const result = useMemo(() => mediumAgg(data), [data]);
```

---

### 3️⃣ 리스트 (per-item) 메모는 손해다

**가설**: "per-item 메모는 메모리 증가로 손해다"

4가지 조건으로 테스트:

- 🔴 React.memo + 고정 props
- 🔵 No memo + 고정 props
- 🟠 React.memo + 변경 props
- 🟢 No memo + 변경 props

---

### 4️⃣ 의존성 배열의 중요성

**가설**: "불안정한 의존성이 useMemo를 무력화시킴"

```javascript
// 🟢 안정적: []
const data = useMemo(() => heavyCalc(), []);

// 🔴 불안정: 매번 변함
const data = heavyCalc(); // useMemo 없음
```

---

### 5️⃣ 큰 객체 메모이제이션의 함정

**가설**: "큰 객체 메모하면 메모리 터짐"

→ 성능 vs 메모리 딜레마!

## 🎮 실행해보기

```bash
cd memo-test
npm install
npm run dev
```

각 시나리오에서 **Start** 버튼 누르고 결과 확인!

## 📊 결과 보는 법

### 성능 지표

- **평균**: 전체적 성능
- **P50/P95**: 중간값/95% 성능
- **최소/최대**: 극단값

### Chrome DevTools

- **F12 → Performance → Memory 체크**
- JS Heap 패턴으로 메모리 사용량 확인

## 🎯 결론 & 실무 가이드

### ✅ useMemo 써야 할 때

```javascript
// 1. 무거운 계산 (1ms 이상)
const result = useMemo(() => heavyCalc(data), [data]);

// 2. 안정적인 의존성
const result = useMemo(() => calc(stable), [stable]);
```

### ❌ useMemo 쓰지 말아야 할 때

```javascript
// 1. 가벼운 계산
const result = x * 2 + 1; // 그냥 이게 나음

// 2. 큰 객체 + 자주 변하는 의존성
// → 메모리 누수 위험!
```

### 🎯 React.memo 가이드

- 거의 항상 도움됨 (성능 향상)
- 단, 메모리 사용량 증가
- 큰 리스트에서 특히 효과적

## 📚 프로젝트 구조 & 핵심 코드

### 🔬 성능 측정 시스템

#### `PerformanceCollector.ts` - 데이터 수집 엔진

React Profiler의 콜백을 받아서 성능 데이터를 모으고 분석:

```javascript
export class PerformanceCollector {
  private data = [];

  // React Profiler 콜백 - 모든 렌더링마다 호출됨
  onRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    this.data.push({
      id,                    // 컴포넌트 ID
      phase,                 // "mount" 또는 "update"
      actualDuration,        // 실제 렌더링 시간 (ms)
      baseDuration,          // 메모 없이 예상 시간
      startTime,             // 렌더링 시작 시점
      commitTime,            // DOM 커밋 시점
      timestamp: performance.now()
    });
  };

  // 통계 계산
  getStats() {
    const durations = this.data.map(d => d.actualDuration).sort();
    return {
      totalCommits: this.data.length,
      averageDuration: durations.reduce((a, b) => a + b) / durations.length,
      p50Duration: durations[Math.floor(durations.length * 0.5)],
      p95Duration: durations[Math.floor(durations.length * 0.95)],
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
      longTasks: durations.filter(d => d > 16.67).length // 60fps 기준
    };
  }
}
```

#### `OptimizedProfiledRunner.tsx` - 측정 프레임워크

측정 도구 자체가 성능에 영향을 주지 않도록 최적화:

```javascript
export function OptimizedProfiledRunner({
  title,
  profilerId,
  children,
  durationMs,
}) {
  const [isActive, setIsActive] = useState(false);
  const collectorRef = useRef(new PerformanceCollector());

  const startExperiment = useCallback(() => {
    setIsActive(true);
    collectorRef.current.reset();

    // 측정 중에는 UI 업데이트 최소화 (콘솔로만 진행상황 출력)
    console.log(`🔬 ${profilerId} 실험 시작!`);

    // 자동 종료
    setTimeout(() => stopExperiment(), durationMs);
  }, [profilerId, durationMs]);

  return (
    <div>
      <button onClick={startExperiment}>▶️ 실험 시작</button>

      {/* 측정 중에만 Profiler 활성화 */}
      {isActive && (
        <Profiler id={profilerId} onRender={collectorRef.current.onRender}>
          {children}
        </Profiler>
      )}

      {/* 실시간 결과 표시 */}
      <PerformanceDisplay stats={stats} />
    </div>
  );
}
```

### 🏋️ 계산 부하 함수들 (`workloads.ts`)

실험에 사용되는 다양한 무게의 계산들:

```javascript
// 🐭 가벼운 계산 (약 0.01ms) - Scenario 1용
export function smallCalc(x) {
  let result = x;
  for (let i = 0; i < 10; i++) {
    result = (result * 31 + 7) % 97; // 해시 함수 시뮬레이션
  }
  return result;
}

// 🐘 중간 무게 계산 (약 1-5ms) - Scenario 2용
export function mediumAgg(arr) {
  const sorted = [...arr].sort((a, b) => a - b); // O(n log n)
  const unique = [...new Set(sorted)]; // O(n)
  return unique.reduce((sum, val) => sum + val, 0); // O(n)
}

// 🔥 매우 무거운 계산 (약 10-50ms)
export function heavyCalc(x) {
  let result = x;
  for (let i = 0; i < 1000; i++) {
    result = Math.sin(result) * 1000 + Math.cos(result) * 1000;
  }
  return Math.floor(result);
}

// 💾 메모리 집약적 계산 - Scenario 5용
export function heavyParse(objCount) {
  return Array.from({ length: objCount }, (_, i) => ({
    id: i,
    data: new Array(1000).fill(Math.random()), // ~8KB per object
    timestamp: Date.now(),
  })).slice(0, Math.floor(objCount / 10)); // 일부만 반환
}
```

### 🧩 실험 대상 컴포넌트들

#### Baseline vs Memo 컴포넌트 쌍

```javascript
// 🔴 Baseline: 메모이제이션 없음
export default function SmallCalc_Baseline({ n }) {
  const result = smallCalc(n); // 매번 직접 계산
  return <span>{result}</span>;
}

// 🔵 Memo: useMemo 적용
export default function SmallCalc_Memo({ n }) {
  const result = useMemo(() => smallCalc(n), [n]); // 메모이제이션
  return <span>{result}</span>;
}
```

#### React.memo 비교

```javascript
// 🔴 일반 리스트 아이템
export default function List_Item({ v }) {
  let x = v;
  for (let i = 0; i < 50; i++) x = (x * 31 + 7) % 1000003;
  return <li>{x}</li>;
}

// 🔵 React.memo 적용
export default React.memo(function List_ItemMemo({ v }) {
  let x = v;
  for (let i = 0; i < 50; i++) x = (x * 31 + 7) % 1000003;
  return <li>{x}</li>;
});
```

### 🎛️ 실험 인프라

#### `useTicker(hz)` - 주기적 상태 변경

```javascript
export function useTicker(hz) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000 / hz); // hz 주파수로 틱 생성

    return () => clearInterval(interval);
  }, [hz]);

  return tick; // 0, 1, 2, 3... 계속 증가
}
```

**사용법**: 20Hz로 설정하면 초당 20번 컴포넌트가 리렌더링됩니다.

#### 시나리오 구조 예시

```javascript
export default function Scenario1({ durationMs, updateRateHz }) {
  return (
    <div>
      {/* Baseline 실험 */}
      <OptimizedProfiledRunner
        title="🔴 Baseline (직접 계산)"
        profilerId="smallcalc-baseline"
        durationMs={durationMs}
      >
        <TickerContent_Baseline updateRateHz={updateRateHz} />
      </OptimizedProfiledRunner>

      {/* useMemo 실험 */}
      <OptimizedProfiledRunner
        title="🔵 useMemo (메모이제이션)"
        profilerId="smallcalc-memo"
        durationMs={durationMs}
      >
        <TickerContent_Memo updateRateHz={updateRateHz} />
      </OptimizedProfiledRunner>
    </div>
  );
}
```

## 🔧 기술 스택

- **React 18** - 최신 Profiler API
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 서버
- **Custom Profiler** - 정밀한 성능 측정

## 💡 핵심 교훈

1. **가벼운 계산**: useMemo 굳이 안 써도 됨
2. **무거운 계산**: useMemo 필수 (3-7배 향상)
3. **React.memo**: 거의 항상 도움됨
4. **의존성**: 안정적일 때만 의미 있음 (11배 차이!)
5. **큰 객체**: 메모리 주의 (성능 vs 메모리)

**결론**: useMemo는 만능이 아니다! 상황에 맞게 써야 함 🎯

---

_"측정할 수 없으면 개선할 수 없다"_ 🚀
