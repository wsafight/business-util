---
title: 修改 window 上的变量
description: 修改 window 上的变量
---

在某种情况下，我们是需要改变 window 下的变量数据，但是直接修改是做不到的。例如

在系统中我们需要把 userAgent 改成 mac 以便进行调试，我们在代码中是这样判断 mac 的.

```js
const isMac = () => /macintosh|mac os x/i.test(navigator.userAgent)
```

如果我们直接修改 userAgent 会发现

```js
navigator.userAgent = 'macintosh';
```

重新获取发现 navigator.userAgent 并没有发生改变。而使用 defineProperty 则会发生改变：

```js
Object.defineProperty(navigator, 'userAgent',{
  get: function () {
    return 'macintosh';
  },
  configurable: true,
});
```