---
title: 浏览器原生 xss 过滤器
description: 浏览器原生 xss 过滤器
---

```ts
// XSS 🧨
$div.innerHTML = `<em>hello world</em><img src="" onerror=alert(0)>`
// Sanitized ⛑
$div.innerHTML = `<em>hello world</em><img src="">`
```

具体提案在: [Sanitizer API](https://wicg.github.io/sanitizer-api/)