---
title: 强大的异步库 async
description: 强大的异步库 async
---

开发过程中常常觉得当前异步不够用。rxjs 虽然很强大，但是代码侵入度太高，代码复杂度太高。

所以在这里推荐 [async](https://github.com/caolan/async) 库 ，async 为 Node.js 以及浏览器提供支持。

[async](https://github.com/caolan/async) 库提供大约 70 个函数，以及为异步控制流一些常见的模式（parallel，series，waterfall...）。所有这些函数都假定您遵循 Node.js 约定，即提供单个回调作为异步函数的最后一个参数（一个将 Error 作为其第一个参数的回调），并调用一次该回调。