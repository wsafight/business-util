---
title: web 多线程开发工具 comlink
description: web 多线程开发工具 comlink
---

Web Worker 为 JavaScript 创造多线程环境。目的是减轻 JavaScript 主线程运行所有任务(其他线程可以执行计算密集型或高延迟的任务)的负担，不去阻塞或者拖慢主线程运行，从而提升用户体验。

其原理为：在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。


## Web Worker 限制

当然了,能力越大，责任越大。Web Worker 也有许多限制，其中大多数都是为了安全性考虑。

- Worker 线程运行的脚本文件，必须与主线程的脚本文件同源
- Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用document、window、parent这些对象。但是，Worker 线程可以读取 navigator 对象和 location 对象（安全性，同时避免多线程访问 dom 导致问题）
- Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成(必要限制)
- Worker 线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求
- Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络

我们可以将复杂计算以及数据传输都放在 web Worker 中去。

浏览器还提供了两个比较特殊的 Web Worker, Shared Worker 和 Service Worker。Service Worker 过于特殊，此处暂时不提。顾名思义 Shared Worker 是分享的 Worker。 它可以从几个浏览上下文中访问，例如几个窗口、iframe 或其他 worker。它们实现一个不同于普通 worker 的接口，具有不同的全局作用域,

也就是说，使用 Shared Worker 可以在所有主线程共享相同的数据，提供跨窗口状态管理。甚至通过数据传递可以跨窗口拖放组件以及CSS 更新。

## Web Worker 代码

主线程代码流程如下所示(发送和接收消息)：

```js
// 调用 Worker() 构造函数，加载网络文件，新建一个 Worker 线程。
var worker = new Worker('work.js');

// 接受子线程 Worker 的发回来的消息
worker.onmessage = (e) => {
    switch (e) {
    }
}

// Worker 执行发生错误时回调用该方法
worker.onerror = () => {

}

// 向 Worker 发送消息
worker.postMessage();

// 关闭 Worker 线程
worker.terminate();
```

worker 线程代码流程如下所示(发送和接收消息)：

```js
// 接收主线程消息
self.addEventListener('message', (e) => {
    // 返回主线程消息
    self.postMessage('Unknown command');
}, false);
```

当然，如果一个线程只完成一件事情，可能还可以接受，如果一个线程需要完成一类事，可能这就较为繁琐了。需要在接受消息时候用判断来决定运行逻辑。

这里更好的方法是使用 RPC 调用，RPC：Remote Procedure Call，远程过程调用，指调用不同于当前上下文环境的方法，通常可以是不同的线程、域、网络主机，通过提供的接口进行调用。

总结一下，RPC要解决的两个问题：

- 解决分布式系统中，服务之间的调用问题
- 远程调用时，要能够像本地调用一样方便，让调用者感知不到远程调用的逻辑（重点）

## 辅助工具 comlink

这时候可以使用 [comlink](https://github.com/GoogleChromeLabs/comlink)，一个只有 2.5 KB 的微型库。

先看一个简单的例子,新建 worker.js 文件

```js
// worker 通过 importScripts 加载外部 js
importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

// 定义一个对象，包含数据和方法
const obj = {
  counter: 0,
  inc() {
    this.counter++;
  },
};

// 向外暴露该对象
Comlink.expose(obj);
```

主线程代码


```js
import * as comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

async function init() {
  const worker = new Worker("worker.js");
  // 包裹 worker.js
  const obj = Comlink.wrap(worker);
  // 获取 counter 数据
  alert(`Counter: ${await obj.counter}`);
  // 调用 inc 方法
  await obj.inc();
  // 获取 counter 数据
  alert(`Counter: ${await obj.counter}`);
}
init();
```


当前代码中没有任何关于类似 onmessage 和 postMessage 的代码，主线程就像调用其他模块定义的函数一般使用，以及 obj.counter 会获取一个 Promise 对象，这时候我们无疑就想到了元编程以及 Proxy。我之前也写过基于 Proxy 的缓存 [memoizee-proxy](https://github.com/wsafight/memoizee-proxy),感兴趣的也可以看看，这里就不做太多叙述了。

事实上 Comlink 的确使用了 Proxy。后续我们可以解析一下具体代码。官方也提供了 comlink 的一系列 [example](https://github.com/GoogleChromeLabs/comlink/tree/main/docs/examples) ，也包括 node、Shared Worker、Service Worker 以及 EventListener 等复杂处理。


