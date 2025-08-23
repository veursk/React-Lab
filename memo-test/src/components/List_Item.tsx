import React from "react";
export default function List_Item({ v }: { v: number }) {
  let x = v;
  for (let i = 0; i < 50; i++) x = (x * 31 + 7) % 1000003;
  return <li>{x}</li>;
}
