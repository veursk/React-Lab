import { useMemo, useRef } from "react";

export function useStableArray<T>(arr: T[]) {
  const ref = useRef<T[]>(arr);
  const same =
    ref.current.length === arr.length &&
    ref.current.every((v, i) => v === arr[i]);
  if (!same) ref.current = arr;
  return ref.current;
}

export function useStableObject<T extends object>(obj: T) {
  const keys = Object.keys(obj) as (keyof T)[];
  const dep = keys.map((k) => obj[k]);
  // 값이 바뀌지 않으면 같은 참조를 재사용
  return useMemo(() => obj, dep);
}
