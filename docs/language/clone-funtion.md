# 函数拷贝

在开发 [memoizee-proxy](https://github.com/wsafight/memoizee-proxy) 过程中，需要对放入的函数添加属性。但是如果添加属性，我们就会污染函数。

```ts
function cloneFunction<T>(fn: (...args: any[]) => T): (...args: any[]) => T {
  return new Function('return '+ fn.toString())();
}
```

但对于类，我考虑需要其他的机制来完成函数拷贝这一件事。