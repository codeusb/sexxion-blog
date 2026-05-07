---
title: "React 源码执行流程"
date: "2026-04-18"
tags: "react, source-code"
---

## 执行流程

示例代码

```tsx
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("render", count);
  }, [count]);

  return <div onClick={() => setCount(count + 1)}>{count}</div>;
}
```

React 从调度到提交的核心执行链路。
::iframe[React 源码执行流程](react_execution_flow_v3.html){height=1020}
