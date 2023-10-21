# 使用代理查看对象调用

在排查 API 调用的场景下，开发者通过查看分析代码往往会很慢，我们需要一个更快捷的分析路径。这时候我们可以用 Proxy。

如：

```ts
const nowStr = () => {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const format = (n) => `${n < 10 ? '0' : ''}${n}`;
  return [hour, minute, second].map(format).join(":");
};

const handler = {
  get(target, prop, receiver) {
    // 此时可以查看调用时间和属性
    console.log(`${nowStr()} ${prop}`);
    // 也可以查看调用栈
    console.trace();
    return target[prop];
  },
};

const setProxy = (proxyKey) => {
  window[proxyKey] = new Proxy(window[proxyKey], handler);
};
```

```ts
setProxy('Math')
```

此时我们就可以快速查看对应属性是否使用了。

但是 Proxy 无法代理 window, 要使用 defineProperty 才行，这里可以查看下一篇 [查找调试 JS 全局变量](./global-check) 。
