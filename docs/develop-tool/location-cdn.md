# LocalCDN 插件提升网站加载速度

一个有追求的开发人员对性能总是不满足的。

对于加载资源，我们可以借助 cdn 提升。但是如果有开发者还不满意呢？

[LocalCDN](https://www.localcdn.org/) 是浏览器扩展，主要为 Mozilla 的 Firefox 浏览器开发。尽管插件也可用于基于 Chromium 的浏览器，但是有一些基于Chromium的浏览器不支持的功能。

没错，如果我们把很多 cdn 资源放在本地，那么网站的速度将会再次提升(不针对我开发网站，而是我浏览的所有网站)。

LocalCDN 插件通过劫持注入 cdn 资源以便提升速度。

技术实现：

拿到插件后，发现有些网站无法使用？

在大多数情况下，LocalCDN 可以很容易地取代嵌入式框架并提高隐私性。在某些情况下，网站可能会试图通过在 HTML 源代码中设置某些选项来防止这种情况。LocalCDN 先读取 HTML 源代码，然后在浏览器显示时删除这些配置项目。
删除 crossorigin 和 integrity 属性

crossorigin 强制浏览器忽略其他源。

integrity 提供 hash 数值。

如果您在控制台（Ctrl + Shift + K）中找到这样的错误消息，则看起来像是CSP / SOP问题。该网站确定可以从哪些资源加载资源。在这种情况下，无法从附加存储中加载资源。SOP（相同来源策略）是一项安全功能。可以检测到此错误的错误报告已经存在，但是具有最低的优先级（Bugzilla＃1419459）。唯一的解决方案：禁用此网站的LocalCDN

[html 过滤器]
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData


玩的开心， ⚠️ 注意安全！

<div style="float: right">更新时间: {docsify-updated}</div>
