import React from "react";
export default React.memo(function List_ItemMemo({ v }: { v: number }) {
  let x = v;
  for (let i = 0; i < 50; i++) x = (x * 31 + 7) % 1000003;
  return <li>{x}</li>;
});
