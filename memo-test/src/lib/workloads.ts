export function smallCalc(x: number) {
  // 아주 가벼운 계산을 조금 더 무겁게
  let result = x;
  for (let i = 0; i < 10; i++) {
    result = (result * 31 + 7) % 97;
  }
  return result;
}

export function tinyCalc(x: number) {
  // 극도로 가벼운 계산 (오버헤드 테스트용)
  return x * 2 + 1;
}

export function heavyCalc(x: number) {
  // 확실히 무거운 계산
  let result = x;
  for (let i = 0; i < 1000; i++) {
    result = Math.sin(result) * 1000 + Math.cos(result) * 1000;
  }
  return Math.floor(result);
}

export function mediumAgg(arr: number[]) {
  // 중간 규모 집계: 정렬 + 중복제거 + 합산
  const a = [...arr].sort((a, b) => a - b);
  let sum = 0,
    last = NaN;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== last) sum += a[i];
    last = a[i];
  }
  return sum;
}

export function heavyParse(objCount: number) {
  // 큰 객체 대량 생성 (alloc-heavy)
  const out: any[] = [];
  for (let i = 0; i < objCount; i++)
    out.push({ i, v: Math.random(), t: Date.now() });
  // 일부를 반환해 GC 유지효과
  return out.slice(0, Math.floor(objCount / 10));
}
