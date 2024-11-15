---
title: 使用 Bun 提升代码运行效率
description: 使用 Bun 提升代码运行效率
---

目前 JavaScript 的新运行时 [Bun](https://bun.sh/) 已经到了 1.0.1 版本了，但是目前暂不支持 Nest 框架，同时该库的 issue 中还有不少的 bug。所以生产环境暂时不考虑使用。

同时由于工作需要，平时个人会写一些小脚本来处理和分析数据。于是个人就直接尝试使用 Bun 执行之前所写的 mjs 代码。当前脚本使用了 axios 获取数据，同时利用了 node:fs/promises 来处理文件。在没有任何改动的情况下，Bun 可以直接运行对应的脚本。

```js
node xx.mjs
bun xx.mjs
```

由于当前需要获取的数据有上万条数据，需要的时间很长，为了快速处理直接改为了获取 100 条数据。同时利用 console.time 来获取对应代码的执行时间。

对比结果如下所示：

- Node.js  18.179 s
- Bun      14.06  s

目前看来两个运行时 console.time 的小数点位数是不相同的。

简单起见，当前的脚本的数据请求是一个完成后才会执行下一个，目的是当前可以随时中断。

对比 100 条数据请求两者居然会有 4s 的差距！同时按照目前的对比信息来说，如果是 1 万条数据就会有近 400 s 的时间差距，提升的非常非常大。

上述是 IO 密集型功能，那 CPU 密集型功能呢？这里拿出斐波那契数列的递归算法。

```mjs
console.time('fibonacci');

function fibonacci(n) {
  if (n < 0) throw new Error("需大于0");
  if (n == 1 || n == 2) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));

console.timeEnd('fibonacci');
```

对比如下所示：

- n 为 45
    - Node.js  7.906  s
    - Bun      3.22   s

- n 为 46
    - Node.js  12.764s
    - Bun      5.21   s

- n 为 47
    - Node.js  20.641  s
    - Bun      8.43s   s

Bun 表现也非常好，在结果一致的情况下，Bun 运行时间比 Node.js 少了一半还多。

期待 Bun 早日支持 Nest。 