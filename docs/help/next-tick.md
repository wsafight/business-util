# 微任务延迟调度

时代变了，考虑使用

https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask

```ts
let promise

module.exports = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(globalThis)
  // reuse resolved promise, and allocate it lazily
  : cb => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch(err => setTimeout(() => { throw err }, 0))
```

<div style="float: right">更新时间: {docsify-updated}</div>
