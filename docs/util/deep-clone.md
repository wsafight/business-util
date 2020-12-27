# 专业的深拷贝库

[clone](https://github.com/jsmini/clone) 库实现了多种深拷贝的方式，可以直接借助该库实现自己想要的深拷贝功能。

包括

- 递归深拷贝 (clone)
- JSON 转换深拷贝 (cloneJSON)
- 循环深拷贝 (cloneLoop)
- 循环引用深拷贝 (cloneForce)

大家可以直接参考学习 [深拷贝的终极探索](https://yanhaijing.com/javascript/2018/10/10/clone-deep/)

当然，我们可以借助 js 实现深拷贝，同时也可以利用浏览器 API 实现该功能。

如 [JavaScript 深拷贝性能分析](https://justjavac.com/javascript/2018/02/02/deep-copy.html) 中的结构化克隆算法:

- MessageChannel

```js
function structuralClone(obj) {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

const obj = /* ... */ {};
const clone = await structuralClone(obj);
```

- History
```js
function structuralClone(obj) {
  const oldState = history.state;
  history.replaceState(obj, document.title);
  const copy = history.state;
  history.replaceState(oldState, document.title);
  return copy;
}

const obj = /* ... */ {};
const clone = structuralClone(obj); 
```

- Notification
```js
function structuralClone(obj) {
  return new Notification('', {data: obj, silent: true}).data;
}

const obj = /* ... */ {};
const clone = structuralClone(obj);
```