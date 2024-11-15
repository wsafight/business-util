---
title: JSON 超级序列化工具
description: JSON 超级序列化工具
---

serialize-javascript 需要使用 eval 来处理，而 eval 有安全性问题，所以可以使用如下工具：

[superjson](https://github.com/flightcontrolhq/superjson) 将 JavaScript 表达式安全地序列化为 JSON 超集，其中包括日期、BigInts 等。