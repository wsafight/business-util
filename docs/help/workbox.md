# Service Worker 工具箱 workbox

Web Worker 为 JavaScript 创造多线程环境。目的是减轻 JavaScript 主线程运行所有任务(其他线程可以执行计算密集型或高延迟的任务)的负担，不去阻塞或者拖慢主线程运行，从而提升用户体验。大家可以尝试使用 [comlink](https://github.com/GoogleChromeLabs/comlink) 来进行代码优化。

其中 Service Worker 是一组有特殊意义的 Web Worker。它充当 Web 应用程序、浏览器与网络（可用时）之间的代理服务器。它会拦截网络请求并根据网络是否可用来采取适当的动作、更新来自服务器的的资源。它还提供入口以推送通知和访问后台同步 API。

Service Worker 具备复杂的生命周期和 api 令开发者难以使用，而 [Workbox](https://github.com/GoogleChrome/workbox) 封装了 Service Worker 最佳实践。

