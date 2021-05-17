# 函数拷贝

在开发 [memoizee-proxy](https://github.com/wsafight/memoizee-proxy) 过程中，需要对放入的函数添加属性。但是如果添加属性，我们就会污染函数。

```ts
function cloneFunction<T>(fn: (...args: any[]) => T): (...args: any[]) => T {
  return new Function('return '+ fn.toString())();
}
```

但对于类，则需要 proxy 去完成这代码。

代理的应用场景是不可限量的。开发者使用它可以创建出各种编码模式，比如(但远远不限于)跟 踪属性访问、隐藏属性、阻止修改或删除属性、函数参数验证、构造函数参数验证、数据绑定，以及可观察对象。