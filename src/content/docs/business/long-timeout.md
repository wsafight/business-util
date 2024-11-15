---
title: 超长定时器 long-timeout
description: 超长定时器 long-timeout
---

最近在开发一些定时任务。因为 setTimeout 或者 setInterval 仅支持 24.8（2^31-1 ms） 天。如果使用上述 API 进行开发定时任务就会出现问题。

2147483648 / 1000 / 60 / 60 / 24 = 24.855134814814818

```js
setTimeout(() => {
  console.log("hello-world");
}, 2147483648);
```

在控制台执行上述 js 代码就会立即输出 hello-word 字符串。而不是在 24 天以后输出。

[long-timeout](https://github.com/tellnes/long-timeout) 支持更长时间维度的定时器。

```JavaScript
var lt = require('long-timeout')

var timeout = lt.setTimeout(function() {
  console.log('in 30 days')
}, 1000 * 60 * 60 * 24 * 30)

var interval = lt.setInterval(function() {
  console.log('every 30 days')
}, 1000 * 60 * 60 * 24 * 30)

// Clear them
lt.clearTimeout(timeout)
lt.clearInterval(interval)
```

该库底层依然使用 setTimeout 实现。

```JavaScript
var TIMEOUT_MAX = 2147483647;

// 如果当前时间小于 2147483647 ms，直接执行回调函数
if (this.after <= TIMEOUT_MAX) {
    this.timeout = setTimeout(this.listener, this.after)
} else {
  var self = this
  // 否则继续执行该函数
  this.timeout = setTimeout(function() {
    // 不断减少 2147483647 ms。直到时间小于 2147483647 ms
    self.after -= TIMEOUT_MAX
    self.start()
  }, TIMEOUT_MAX)
}
```
