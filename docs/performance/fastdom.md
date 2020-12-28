# 通过批处理避免布局抖动 fastDom

每个度量值/修改作业都被添加到相应的度量值/修改队列中。使用 window.requestAnimationFrame 在下一帧的转折处清空队列(读取，然后写入)。

FastDom 的目标是在你的应用程序的所有模块中表现得像一个单例模式。当任何模块需要“ FastDom”时，它们将返回相同的实例，这意味着 FastDom 可以在整个应用程序范围内协调 DOM 访问。

FastDom 作为应用程序/库和 DOM 之间的一个管理层。通过批处理 DOM 访问，我们避免了不必要的文档回流，并显著提高了布局性能。

<div style="float: right">更新时间: {docsify-updated}</div>
