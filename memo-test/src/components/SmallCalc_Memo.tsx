import React, { useMemo } from "react";
import { smallCalc } from "../lib/workloads";

export default function SmallCalc_Memo({ n }: { n: number }) {
  const out = useMemo(() => smallCalc(n), [n]);
  return <span>{out}</span>;
}
