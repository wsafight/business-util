---
title: 图片压缩服务 tiny-png
description: 图片压缩服务 tiny-png
---

当我们在讨论新格式 WEBP,AVIF 时候，我们依然无法忽略老版的浏览器所带来的影响。所以简单的方案仍旧有不可忽略的价值。

对于中小型公司的官网和图片使用而言，[tiny-png](https://tinypng.com/) 是不折不扣的好东西。使用智能有损压缩技术来减小 PNG/JPG 文件的文件大小。通过有选择地减少图像中的颜色数量，需要较少的字节来存储数据。效果几乎是看不见的，但文件大小却有很大差异！

对比下面两张图片来说，第一张，第二张经过 tiny-png 压缩后，肉眼不可见，但是大小却相差近三倍。

![原始图片](tiny-png-src.png) ![目标图片](tiny-png-dist.png)

本人多次使用下，发现 PNG/JPG 类型图片能够压缩到原始图片大小的 1/2 左右，简单而强大的网站，非常棒。

如果您需要更加强大的服务，可以尝试使用 cdn 服务 —— Tinify CDN。

Tinify CDN 支持即时更改图像。特别是，可以调整图像大小以创建较小的版本，例如缩略图。

当前图片 URL 可以通过不同的请求参数来调整大小以及显示方式。

如：把图像缩小到100像素宽，并相应地调整高度

```
https://xxxxxxxx.tinifycdn.com/panda.png？resize.width = 100
```

可以组合多个查询字符串参数：

```
https://xxxxxxxx.tinifycdn.com/panda.png？resize.width = 100＆resize.height = 50＆resize.method = fit
```

你可以自行参考 [Tinify CDN 文档](https://tinify.com/cdn/documentation) 修改参数。