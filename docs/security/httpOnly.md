# 使用 HttpOnly 解决 XSS Cookie 劫持

HTTP Cookie（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

HttpOnly 由微软提出并在 IE6 实现。已经成为了一种标准。当用户已经被 XSS 攻破，使用 HttpOnly 避免 cookie 泄漏。

如

```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; HttpOnly
```

无法从 document.cookie 获取 id 属性，也无法操作该属性。即使使用 js 添加 id 也只是新增一个属性而并非覆盖。