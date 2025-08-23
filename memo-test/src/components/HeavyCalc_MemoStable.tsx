import React, { useMemo } from "react";
import { mediumAgg } from "../lib/workloads";

export default function HeavyCalc_MemoStable({ data }: { data: number[] }) {
  const sum = useMemo(() => mediumAgg(data), [data]);
  return <span>{sum}</span>;
}
