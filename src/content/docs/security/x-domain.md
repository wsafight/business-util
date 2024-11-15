---
title: 前端 CORS 工具 XDomain
description: 前端 CORS 工具 XDomain
---

CORS 是一个通用的解决方案，唯一缺点是低版本浏览器（< IE 9）不支持。低版本 IE 支持一个私有的 XDomainRequest 但是没有什么作用，连 cookie 都不可以携带。

[XDomian](https://github.com/jpillora/xdomain) 作者利用 iframe 和 postMessage 技术来实现跨域请求。

## 工作流程

工作流程如下所示：

1. 在您的从域 (http://xyz.example.com) 上，创建一个小proxy.html文件：

```html
<!DOCTYPE HTML>
<script src="//unpkg.com/xdomain@0.8.2/dist/xdomain.min.js" master="http://abc.example.com"></script>
```

2. 然后，在您的主域 (http://abc.example.com) 上，指向您的新proxy.html:

```html
<!DOCTYPE HTML>
<script src="//unpkg.com/xdomain@0.8.2/dist/xdomain.min.js" slave="http://xyz.example.com/proxy.html"></script>
```

3. 在您的主域上，任何 XHR 都 http://xyz.example.com 将自动运行：

```JavaScript
//do some vanilla XHR
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://xyz.example.com/secret/file.txt");
xhr.onreadystatechange = function(e) {
  if (xhr.readyState === 4) console.log("got result: ", xhr.responseText);
};
xhr.send();

//or if we are using jQuery...
$.get("http://xyz.example.com/secret/file.txt").done(function(data) {
  console.log("got result: ", data);
});
```

逻辑流程如下所示

- 在 abc.example.com 建立一个 **iframe**, 指向 xyz.example.com 的 proxy.html 页面
- 当主域 abc.example.com 发起请求时，将请求转给 proxy.html 来真正发起，避免跨域问题。
- 通过 xhook 将返回的 proxy.html 的数据返回到 abc.example.com

## 源码解析

XDomian 自行实现了一套通信协议。

ToDO

## 其他

开发者可以在 IE 9 下做兼容。

```html
<!--[if lte IE 9]>
    <script  src="xdomain.js"></script>
<![endif]-->
```

