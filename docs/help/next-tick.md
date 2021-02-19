# 微任务延迟调度

针对不同的浏览器而言，我们想要尽快执行异步代码时往往会添加 nextTick 函数。而 nextTick 会直接使用 setTimeout (这样做法并不严谨，因为 setTimeout 属于宏任务，而并非微任务)。

在此之前，我们都会用 MutationObserver 模拟微任务执行。

但现在时代变了，浏览器直接提供了  queueMicrotask API，可以让我们直接在 js 引擎层面加入微任务。

在没有支持 queueMicrotask 的浏览器中，我们可以在浏览器直接这样修改:

```ts
if (typeof window.queueMicrotask !== "function") {
  window.queueMicrotask = function (callback) {
    Promise.resolve()
      .then(callback)
      .catch(e => setTimeout(() => { throw e; }));
  };
}
```

当然，如果我们在项目中使用，我们也可以直接绑定。


```ts
let promise: Promise<void>

const microtask = typeof queueMicrotask === 'function'
  ? queueMicrotask.bind(globalThis)
  // reuse resolved promise, and allocate it lazily
  : (cb: () => void) => (promise || (promise = Promise.resolve()))
    .then(cb)
    .catch((err: Error) => setTimeout(() => { throw err }, 0))

export default microtask
```

我们也可以这样使用：

```ts
self.queueMicrotask(() => {
  // function contents here
})
```

或者这样使用:

```ts
const MyElement = Object.create(null)

MyElement.prototype.loadData = function (url: string) {
  if (this._cache[url]) {
    queueMicrotask(() => {
      this._setData(this._cache[url]);
      this.dispatchEvent(new Event("load"));
    });
  } else {
    fetch(url).then(res => res.arrayBuffer()).then(data => {
      this._cache[url] = data;
      this._setData(data);
      this.dispatchEvent(new Event("load"));
    });
  }
};
```

<div style="float: right">更新时间: {docsify-updated}</div>
