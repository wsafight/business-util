---
draft: true
title: HTTP 压测工具 oha
description: 使用 oha 对 Web 服务进行压测。
---
oha 是一个小程序，它将一些负载发送到 Web 应用程序并显示受rakyll/hey启发的实时 tui 。

```bash
oha --json -n 10000 http://localhost:3000 |
                jq ".summary.requestsPerSec * 100 | round / 100"
```

todo!