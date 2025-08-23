# 🧪 React Memoization Performance Lab

> **"얼마나 많은 컴포넌트를 useMemo / React.memo 하면 이득인가?"**를 실측으로 밝혀내는 실험실

React의 메모이제이션 최적화 기법인 `useMemo`와 `React.memo`의 실제 성능 영향을 측정하여, 어느 정도 규모의 컴포넌트에서 메모이제이션이 유의미한 성능 향상을 가져오는지 확인합니다.

## 📋 목차

- [🎯 실험 목표](#-실험-목표)
- [📊 측정 지표](#-측정-지표)
- [🔬 7가지 실험 시나리오](#-7가지-실험-시나리오)
- [🏗️ 프로젝트 구조](#️-프로젝트-구조)
- [🧩 컴포넌트 아키텍처](#-컴포넌트-아키텍처)
- [📚 라이브러리 유틸리티](#-라이브러리-유틸리티)
- [🚀 시작하기](#-시작하기)
- [📈 실험 진행 방법](#-실험-진행-방법)
- [🔧 기술 스택](#-기술-스택)

## 🎯 실험 목표

### 검증할 가설들

1. **소규모 컴포넌트에서 메모이제이션 오버헤드**: 계산이 가벼울 때는 메모이제이션 비용이 더 클 것
2. **임계점 존재**: 특정 복잡도를 넘으면 메모이제이션의 이득이 명확해질 것
3. **깊은 트리에서의 효과**: 컴포넌트 트리가 깊을수록 React.memo 효과가 클 것
4. **복잡한 계산에서의 useMemo**: 무거운 계산일수록 useMemo 효과가 클 것
5. **리스트 렌더링에서의 React.memo**: 대량 리스트에서 개별 아이템 메모이제이션 효과
6. **불안정한 의존성의 영향**: 자주 변경되는 의존성 배열이 메모이제이션 효과를 감소시킬 것
7. **메모리 사용량 증가**: 메모이제이션이 메모리 사용량을 증가시킬 것

## 📊 측정 지표

- **p50/p95 응답시간**: 렌더링 성능의 중앙값과 95퍼센타일
- **Long Task**: 50ms 이상의 긴 작업 발생 빈도
- **Commit 횟수**: React의 렌더 사이클 커밋 횟수
- **메모리 사용량**: 큰 클로저 캡처 시 메모리 증가량

## 🔬 7가지 실험 시나리오

### Scenario 1: SmallCalc (소규모 계산)

- **목적**: 가벼운 계산에서 `useMemo` 오버헤드 측정
- **비교**: Baseline vs useMemo
- **계산**: 10회 반복하는 간단한 수학 연산
- **가설**: useMemo 오버헤드가 계산 비용보다 클 것

### Scenario 2: Medium/Heavy Calc (중간/무거운 계산)

- **목적**: 복잡한 계산에서 `useMemo` 효과 측정
- **비교**: Baseline vs useMemo (stable deps)
- **계산**: 5000개 배열의 정렬, 중복제거, 합산
- **가설**: 복잡한 계산일수록 useMemo 효과가 클 것

### Scenario 3: List per-item (개별 아이템 메모이제이션)

- **목적**: `React.memo`를 사용한 리스트 아이템 최적화 효과 측정
- **데이터**: 2000개 리스트 아이템
- **컴포넌트**: `List_ItemMemo` (React.memo 적용)
- **가설**: 개별 아이템 메모이제이션이 리렌더링을 방지할 것

### Scenario 4: List aggregated (집합적 리스트)

- **목적**: 메모이제이션 없는 리스트 렌더링 (대조군)
- **데이터**: 2000개 리스트 아이템
- **컴포넌트**: `List_Item` (메모이제이션 없음)
- **가설**: Scenario 3과 비교하여 성능 차이 확인

### Scenario 5: Unstable deps (불안정한 의존성)

- **목적**: 의존성 배열 안정성이 메모이제이션에 미치는 영향
- **비교**: Stable deps vs Unstable deps
- **구현**:
  - Stable: `useMemo`로 생성한 고정 배열
  - Unstable: 매 렌더마다 새로 생성되는 배열
- **가설**: 불안정한 의존성이 메모이제이션 효과를 무효화할 것

### Scenario 6: Concurrent (동시성 기능)

- **목적**: React 18의 Concurrent 기능과 메모이제이션의 상호작용
- **기능**: `startTransition`을 사용한 검색 필터링
- **데이터**: 8000개 숫자 배열에서 실시간 검색
- **가설**: Concurrent 기능이 메모이제이션과 잘 동작할 것

### Scenario 7: Big Closure (큰 클로저)

- **목적**: 메모이제이션이 메모리 사용량에 미치는 영향
- **구현**: 20000개 객체를 생성하여 일부만 반환
- **측정**: 메모리 사용량 및 GC 압박
- **가설**: 큰 클로저 메모이제이션이 메모리 누수를 유발할 것

## 🏗️ 프로젝트 구조

```
memo-test/
├── src/
│   ├── components/           # 비교 실험용 컴포넌트들
│   │   ├── HeavyCalc_Baseline.tsx      # 메모이제이션 없는 무거운 계산
│   │   ├── HeavyCalc_MemoStable.tsx    # useMemo 적용된 무거운 계산
│   │   ├── SmallCalc_Baseline.tsx      # 메모이제이션 없는 가벼운 계산
│   │   ├── SmallCalc_Memo.tsx          # useMemo 적용된 가벼운 계산
│   │   ├── List_Item.tsx               # 일반 리스트 아이템
│   │   └── List_ItemMemo.tsx           # React.memo 적용된 리스트 아이템
│   ├── routes/               # 7가지 실험 시나리오
│   │   ├── Runner.tsx                  # 공통 실험 프레임워크
│   │   ├── Scenario1_SmallCalc.tsx     # 시나리오 1: 소규모 계산
│   │   ├── Scenario2_MediumHeavyCalc.tsx # 시나리오 2: 중간/무거운 계산
│   │   ├── Scenario3_ListPerItem.tsx   # 시나리오 3: 개별 아이템 메모
│   │   ├── Scenario4_ListAggregated.tsx # 시나리오 4: 집합적 리스트
│   │   ├── Scenario5_UnstableDeps.tsx  # 시나리오 5: 불안정한 의존성
│   │   ├── Scenario6_Concurrent.tsx    # 시나리오 6: 동시성 기능
│   │   └── Scenario7_BigClosure.tsx    # 시나리오 7: 큰 클로저
│   ├── lib/                  # 유틸리티 라이브러리
│   │   ├── workloads.ts      # 다양한 계산 부하 함수들
│   │   ├── stability.ts      # 안정성 관련 훅들
│   │   └── profiler/         # 성능 측정 도구 (예약됨)
│   ├── App.tsx              # 메인 애플리케이션
│   └── main.tsx             # 앱 진입점
├── package.json
└── README.md
```

## 🧩 컴포넌트 아키텍처

### 비교 실험 패턴

각 실험은 **Baseline vs Optimized** 패턴을 따릅니다:

#### 계산 컴포넌트

- **Baseline**: 메모이제이션 없이 매번 직접 계산
- **Memo**: `useMemo`로 의존성이 변경될 때만 재계산

#### 리스트 컴포넌트

- **Item**: 일반 함수형 컴포넌트
- **ItemMemo**: `React.memo`로 래핑된 컴포넌트

### Runner 프레임워크

`RunnerFrame` 컴포넌트는 모든 실험에 공통으로 사용되는 기능을 제공합니다:

- ⏱️ 타이머 제어 (시작/정지)
- 📊 실험 진행 상태 표시
- 🎯 분석 방법 가이드
- 📈 React DevTools Profiler 연동 안내

## 📚 라이브러리 유틸리티

### `workloads.ts` - 계산 부하 함수들

#### `smallCalc(x: number)`

- 가벼운 계산 (10회 반복)
- 시나리오 1에서 사용
- useMemo 오버헤드 측정용

#### `tinyCalc(x: number)`

- 극도로 가벼운 계산 (x \* 2 + 1)
- 오버헤드 테스트용

#### `heavyCalc(x: number)`

- 무거운 계산 (1000회 삼각함수 연산)
- CPU 집약적 작업 시뮬레이션

#### `mediumAgg(arr: number[])`

- 중간 규모 집계 함수
- 정렬 → 중복제거 → 합산
- 시나리오 2에서 사용

#### `heavyParse(objCount: number)`

- 대량 객체 생성 (메모리 집약적)
- 시나리오 7에서 메모리 압박 테스트용

### `stability.ts` - 안정성 관련 훅

#### `useStableArray<T>(arr: T[])`

- 배열 참조 안정화
- 내용이 같으면 동일한 참조 반환
- 불필요한 리렌더링 방지

#### `useStableObject<T>(obj: T)`

- 객체 참조 안정화
- 값이 변경되지 않으면 같은 참조 재사용
- `useMemo` 기반 구현

### `Runner.tsx` - 실험 프레임워크

#### `useTicker(hz: number)`

- 지정된 주파수로 틱 생성
- 실험 중 지속적인 상태 변경 시뮬레이션

#### `RunnerFrame`

- 모든 실험의 공통 UI 프레임워크
- 타이머 제어, 상태 표시, 분석 가이드 제공

## 🚀 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint
```

### 브라우저에서 확인

1. `http://localhost:5173` 접속
2. 상단 네비게이션에서 실험 시나리오 선택
3. Duration과 Update rate 설정
4. Start 버튼으로 실험 시작

## 📈 실험 진행 방법

### 1. 사전 준비

1. **Chrome DevTools 열기** (F12)
2. **⚛️ React DevTools** 설치 및 활성화
3. **Performance** 탭과 **React Profiler** 탭 준비

### 2. 데이터 수집

1. **React Profiler**에서 🔴 **Record** 시작
2. 실험 페이지에서 **▶️ Start** 클릭
3. 실험 완료 후 React Profiler에서 **🔴 Stop**
4. Timeline에서 각 commit별 렌더링 시간 분석

### 3. 분석 포인트

- **Commit 수**: 총 렌더 사이클 횟수
- **렌더링 시간**: 각 컴포넌트별 소요 시간
- **Flame Graph**: 컴포넌트 트리별 성능 분포
- **Ranked Chart**: 가장 느린 컴포넌트 순위

### 4. 데이터 내보내기

- React Profiler → Settings → **Export data to file**
- JSON 형태로 상세 성능 데이터 저장 가능

### 5. 비교 분석

각 시나리오에서 Baseline과 Optimized 버전을 비교:

- 평균 렌더링 시간 차이
- Long Task 발생 빈도
- 메모리 사용량 (Scenario 7)

## 🔧 기술 스택

- **React 19**: 최신 React 기능 활용
- **Vite**: 빠른 개발 환경
- **TypeScript**: 타입 안전성
- **React Router DOM**: SPA 라우팅
- **Performance API**: 성능 측정
- **React DevTools Profiler**: 상세 성능 분석

## 📊 예상 결과

### 가설별 예상 결과

1. **Scenario 1**: useMemo 오버헤드 > 계산 비용 (메모이제이션 비추천)
2. **Scenario 2**: useMemo 효과 > 오버헤드 (메모이제이션 권장)
3. **Scenario 3 vs 4**: React.memo가 불필요한 리렌더링 방지
4. **Scenario 5**: 불안정한 deps가 메모이제이션 무효화
5. **Scenario 6**: Concurrent 기능과 메모이제이션 호환성 확인
6. **Scenario 7**: 메모리 사용량 증가 및 GC 압박 확인

### 실용적 가이드라인 도출

실험 결과를 바탕으로 다음과 같은 가이드라인을 수립할 수 있습니다:

- 어느 정도 복잡도에서 메모이제이션을 도입할지
- React.memo vs useMemo 선택 기준
- 의존성 배열 안정화 중요성
- 메모리 vs 성능 트레이드오프

---

**🔬 Happy Experimenting!**

실험 결과를 통해 React 메모이제이션의 실제 효과를 데이터로 확인하고, 프로덕션 환경에서의 최적화 전략을 수립해보세요.
