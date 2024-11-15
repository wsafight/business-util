---
title: js 手写生成 pdf
description: 手写 pdf 逻辑
---

pdf 无处不在，尤其在电子书领域，相比于 epub，mobi 等格式，pdf 还是主流格式。对于网页打印来说，还有生成 pdf 的选项。

之前我在移动端开发报表功能展示时，便是使用 [puppeteer](https://github.com/puppeteer/puppeteer) 作为服务渲染网页然后生成 pdf 下载。 

而 [jspdf](https://parall.ax/products/jspdf) 无疑解决了 pdf 生成问题，让开发更简单。

大家可以直接到官网查看其功能，只需要几行简单 js 代码就能生成漂亮的 pdf。


注：该库为了安全，也使用了 [DOMPurify](https://github.com/cure53/DOMPurify) ,可以看看 [xss 过滤器 DOMPurify](../security/dom-purify)

