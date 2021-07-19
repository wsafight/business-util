# 取消已经发送的请求 AbortController

大约在 2019 年时候，朋友遇到过一个问题，就是后请求的 api 先返回。

问题如下：

在不断输入字符串的过程中，前端根据当前字符串不同会进行请求。当前已经使用了 0.5s 防抖函数。但很可惜，服务器或者网络有问题。很大情况返回之前的错误数据，渲染不正确的过时数据。

当时，fetch 函数未提供解决方案。我们使用了 axios 框架的 cancelToken 控制内部 Promise reject 之前的请求（服务端仍旧会处理，只不过前端抛弃了此次请求）。

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
    cancelToken: source.token
}).catch(function (thrown) {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else {
        // handle error
    }
});

axios.post('/user/12345', {
    name: 'new name'
}, {
    cancelToken: source.token
})

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

但现在，浏览器提供了可以直接使用 AbortController。

```js
const abortController = new AbortController();
const signal = abortController.signal;
fetch(url, { signal });

// 然后可随时取消
abortController.abort();
```

我们可以直接使用 [redaxios](https://github.com/developit/redaxios) 框架。它基本上保持了与 axios 相同的 api，但仅仅只是用了浏览器原生的 fetch 函数。

redaxios 也提供了 AbortController。

```js
/**
	 * @public
	 * @type {AbortController}
	 */
	redaxios.CancelToken = /** @type {any} */ (typeof AbortController == 'function' ? AbortController : Object);
```
