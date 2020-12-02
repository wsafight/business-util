# New Function 创建异步函数

某些情况下，我们可以利用 new Function 创建函数，但是浏览器没有提供可以直接创建异步函数的构造器。这时候，我们需要取得异步函数构造器来构造异步函数。

```ts
AsyncFunction = (async x => x).constructor

foo = new AsyncFunction('x, y, p', 'return x + y + await p')

foo(1,2, Promise.resolve(3)).then(console.log) // 6
```