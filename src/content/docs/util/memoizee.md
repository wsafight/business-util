---
title: 强大的业务缓存库 memoizee
description: 强大的业务缓存库 memoizee
---

在开发 web 应用程序时，性能都是必不可少的话题。

事实上，缓存一定是提升 web 应用程序有效方法之一，尤其是用户受限于网速的情况下。提升系统的响应能力，降低网络的消耗。当然，内容越接近于用户，则缓存的速度就会越快，缓存的有效性则会越高。
当然，缓存一定建立在对数据的时效性要求低的情况下，往往在 ToB 场景下更加有效 (系统数据，个人信息和通用数据与配置)。

两年前，我写过一篇关于缓存的文章[前端 api 请求缓存方案](https://github.com/wsafight/personBlog/issues/2) 中详细介绍了如何使用 promise 进行缓存，参数化存储以及缓存超时的一些机制。


不过，相对于完整的 [memoizee](https://github.com/medikoo/memoizee) 缓存库我的代码就显得捉襟见肘了，因为 memoizee 无侵入性。

下面我们来学习一下该库:

普通的使用方式:

```ts
import memoizee from  'memoizee'

var fn = function(one, two, three) {
	/* ... */
};

memoized = memoize(fn);

memoized("foo", 3, "bar");
memoized("foo", 3, "bar"); // 缓存命中
```

适合 Promise, 与普通的方式不同，针对于 Promise 发送异常，则会把结果从缓存中删除。 
```ts
var afn = function(a, b) {
	return new Promise(function(res) {
		res(a + b);
	});
};
memoized = memoize(afn, { promise: true });

memoized(3, 7);
memoized(3, 7); // 缓存命中
```

类似于之前的代码:

```ts

let promise = promiseCache.get(key);
// 当前promise缓存中没有 该promise
if (!promise) {
  promise = request.get('/xxx').then(res => {
    // 对res 进行操作
    //...
  }).catch(error => {
    // 在请求回来后，如果出现问题，把promise从cache中删除 以避免第二次请求继续出错S
    promiseCache.delete(key)
    return Promise.reject(error)
  })
}
// 返回promise
return promise
```

也包括我之前写的基于时间缓存（拉模型，在每次取数据的时候检测当前时间和存储时间）:

```js
// 1s 后数据将会过期
memoized = memoize(fn, { maxAge: 1000 }); 

memoized("foo", 3);
memoized("foo", 3); // 缓存命中
setTimeout(function() {
	memoized("foo", 3); // 缓存已经过期，需要再次计算
	memoized("foo", 3); // 缓存命中
}, 2000);

```

当然，配置如下所示:

