# 跳转页面时可靠的发送埋点信息

往往企业会通过分析用户行为而进行用户决策，所以都会使用埋点来进行行为分析。但是当用户需要离开当前页面，往往很难收集可靠信息，原因在：浏览器不保证保留打开的 HTTP 请求。

XHR 请求（通过fetch或XMLHttpRequest）是异步且非阻塞的。一旦请求被排队，请求的实际工作就会被移交给幕后的浏览器。但是当页面进入“终止”状态时，它们有被遗弃的风险，无法保证任何幕后工作都能完成。

简而言之，浏览器的设计假设当一个页面被关闭时，没有必要继续处理它排队的任何后台进程。

有几种种方法可以选择：

## 延迟用户操作

```JS
document.getElementById('link').addEventListener('click', async (e) => {
  e.preventDefault();

  await fetch("/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({
      some: 'data'
    }),
  });

  window.location = e.target.href;
});
```

但是其缺点也很明显，一方面有损用户体验，另一方面用户关闭选项卡时就无法收集信息。

## 使用 Fetch keepalive

```HTML
<a href="/some-other-page" id="link">Go to Page</a>

<script>
  document.getElementById('link').addEventListener('click', (e) => {
    fetch("/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        some: "data"
      }), 
      keepalive: true,
    });
  });
</script>
```

## 使用 Navigator.sendBeacon


它主要用于将统计数据发送到 Web 服务器，同时避免了用传统技术（如：XMLHttpRequest）发送分析数据的一些问题。

语法为:
```JS
navigator.sendBeacon(url);
// data 参数是将要发送的 ArrayBuffer、ArrayBufferView、Blob、DOMString、FormData 或 URLSearchParams 类型的数据。
navigator.sendBeacon(url, data);
```

```HTML
<a href="/some-other-page" id="link">Go to Page</a>

<script>
  document.getElementById('link').addEventListener('click', (e) => {
    const blob = new Blob([JSON.stringify({ some: "data" })], { type: 'application/json; charset=UTF-8' });
    navigator.sendBeacon('/log', blob));
  });
</script>
```

使用 sendBeacon 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能，这意味着：

- 数据发送是可靠的。
- 数据异步传输。
- 不影响下一导航的载入。
- 数据是通过 HTTP POST 请求发送的。

## href 链接 ping 属性

```HTML
<a href="http://localhost:3000/other" ping="http://localhost:3000/log">
  Go to Other Page
</a>
```

发送数据为:

```
headers: {
  'ping-from': 'http://localhost:3000/',
  'ping-to': 'http://localhost:3000/other'
  'content-type': 'text/ping'
  // ...other headers
},
```

它技术上于 sendBeacon 类似，但是有一些限制。

- 它严格限制在链接上的使用，如果您需要跟踪与其他交互相关的数据，例如按钮点击或表单提交，这将使其无法启动。
- 主流 Firefox 特别没有默认启用它。
- 无法发送任何自定义数据。您将获得的最多的是几个 ping-* 标题。



