---
title: 流量复制工具 GoReplay
description: 流量复制工具 GoReplay
---

GoReplay 是用 Golang 写的一个 HTTP 流量复制工具,可以将实时 HTTP 流量捕获并重放到测试环境。

GoReplay 支持流量的放大、缩小，频率限制，还支持把请求记录到文件，方便回放和分析，也支持和 ElasticSearch 集成，将流量存入 ES 进行实时分析。

GoReplay 不需要更改生产基础架构，它通过监听网络接口上的流量进行复制。
