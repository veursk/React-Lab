import React from "react";
import { mediumAgg } from "../lib/workloads";

export default function HeavyCalc_Baseline({ data }: { data: number[] }) {
  const sum = mediumAgg(data);
  return <span>{sum}</span>;
}
