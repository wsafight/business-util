---
title: 微任务延迟调度
description: 微任务延迟调度
---

针对不同的浏览器而言，我们想要尽快执行异步代码时往往会添加 nextTick 函数。而 nextTick 会直接使用 setTimeout (这样做法并不严谨，因为 setTimeout 属于宏任务，而并非微任务)。

在此之前，我们都会用 MutationObserver 模拟微任务执行。

但现在时代变了，浏览器直接提供了  queueMicrotask API，可以让我们直接在 js 引擎层面加入微任务。

queueMicrotask 没有任何参数也不具备任何返回值。

```ts
log("Before enqueueing the microtask");
queueMicrotask(() => {
  log("The microtask has run.")
});
log("After enqueueing the microtask");
```
