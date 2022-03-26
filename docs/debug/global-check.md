# 查找调试 JS 全局变量

## 找出全局范围内的 JavaScript 变量

```JS
window.__runtimeGlobalsChecker__ = (function createGlobalsChecker() {
  // 浏览器本身的全局变量
  let browserGlobals = [];

  // 忽略的全局变量，默认为 __runtimeGlobalsChecker__
  const ignoredGlobals = ["__runtimeGlobalsChecker__"];

  // 收集浏览器本省的全局变量，先创建一个干净的 iframe 
  function collectBrowserGlobals() {
    const iframe = window.document.createElement("iframe");
    iframe.src = "about:blank";
    window.document.body.appendChild(iframe);
    browserGlobals = Object.keys(iframe.contentWindow);
    window.document.body.removeChild(iframe);
    return browserGlobals;
  }

  
  function getRuntimeGlobals() {
    if (browserGlobals.length === 0) {
      collectBrowserGlobals();
    }

    const runtimeGlobals = Object.keys(window).filter((key) => {
      const isFromBrowser = browserGlobals.includes(key);
      const isIgnored = ignoredGlobals.includes(key);
      // 不是来自于浏览器以及忽略的全局就展示出来 
      return !isFromBrowser && !isIgnored;
    });
    return runtimeGlobals;
  }

  return {
    getRuntimeGlobals,
  };
})();
```

## 调试全局范围内的 JavaScript 变量

```JS
window.__globalsDebugger__ = (function createGlobalsDebugger() {
  // 要检查的变量的名称。
  const globalsToInspect = [];

  // 已经被检查过一次的全局变量
  const inspectedGlobals = [];

  function addGlobalToInspect(globalName) {
    if (!globalsToInspect.includes(globalName)) {
      globalsToInspect.push(globalName);
    }

    // 无法使用 Proxy 代理 window, 所以还是需要使用 defineProperty
    Object.defineProperty(window, globalName, {
      get: function () {
        return window[`__globals-debugger-proxy-for-${globalName}__`];
      },
      set: function (value) {
        // 仅在第一次的时候放入设置中
        if (!inspectedGlobals.includes(globalName)) {
          inspectedGlobals.push(globalName);
          console.trace()
          debugger;
        }
        window[`__globals-debugger-proxy-for-${globalName}__`] = value;
      },
      configurable: true,
    });
  }

  // 解析网址中的 ?globalsToInspect=xxx,bbb 然后添加调试变量
  const parsedUrl = new URL(window.location.href);
  (parsedUrl.searchParams.get("globalsToInspect") || "")
    .split(",")
    .filter(Boolean)
    .forEach((globalToInspect) => addGlobalToInspect(globalToInspect));

  return {
    addGlobalToInspect,
  };
})();
```