---
title: 基于字符串生成 DFA 正则表达式
description: 基于字符串生成 DFA 正则表达式
---

regexgen 是一款可以生成 DFA 正则的库。我们可以基于它来构建正则

```ts
const regexgen = require('regexgen');

regexgen(['foobar', 'foobaz', 'foozap', 'fooza']); // => /foo(?:zap?|ba[rz])/
```

