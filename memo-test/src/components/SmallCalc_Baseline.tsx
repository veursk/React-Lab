import React from "react";
import { smallCalc } from "../lib/workloads";

export default function SmallCalc_Baseline({ n }: { n: number }) {
  const out = smallCalc(n);
  return <span>{out}</span>;
}
