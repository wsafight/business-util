# csp 内容安全策略

浏览器自带的 CSP 是一个简单而强大的解决方案。主要解决跨站脚本攻击(xss) 和数据包嗅探攻击

内容安全策略 (CSP)  是一个附加的安全层，用于帮助检测和缓解某些类型的攻击，包括跨站脚本 (XSS) 和数据注入等攻击。 这些攻击可用于实现从数据窃取到网站破坏或作为恶意软件分发版本等用途。

CSP被设计成向后兼容；不支持的浏览器依然可以运行使用了它的服务器页面，反之亦然。不支持CSP的浏览器会忽略它，像平常一样运行，默认对网页内容使用标准的同源策略。如果网站不提供CSP头部，浏览器同样会使用标准的同源策略。

## 使用

为使CSP可用, 你需要配置你的网络服务器返回  Content-Security-Policy  HTTP 头部。

此外,HTML 中的 <meta> 元素也可以被用来配置该策略, 例如

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
```

## 描述策略

在 http 头部，我们以 policy 指定自己的策略

> Content-Security-Policy: policy

而在 HTML 中，我们可以直接在 content 描述 policy。

- policy = default-src 'self'   

  所有内容(图片,脚本,音频,视频等内容)均来自站点的同一个源 (不包括其子域名)

- policy = default-src 'self' *.xxx.com

  允许内容来自信任的域名及其子域名
  
- policy = default-src 'self'; img-src *;  
  
  允许图片来自任何地方

- policy = default-src 'self'; media-src media1.com media2.com; script-src userscripts.xxx.com  
  
  音频视频文件仅允许从 media1.com 和 media2.com 加载, 脚本仅允许来自于userscripts.example.com

- policy = default-src https://xxx.xxx.com
  
  只允许通过 HTTPS 方式并仅从 xxx.xxx.com 域名来访问文档


## 发送违规报告(还未测试)

为启用发送违规报告，你需要指定 report-uri 策略指令，并提供至少一个URI地址去递交报告

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; report-uri http://reportcollector.example.com/collector.cgi;">
```
你需要设置你的服务器能够接收报告，使其能够以你认为恰当的方式存储并处理这些报告。

作为报告的JSON对象报告包含了:

- document-uri   
  发生违规的文档的URI。
  
- referrer   
  违规发生处的文档引用（地址）。

- blocked-uri   
  被CSP阻止的资源URI。如果被阻止的URI来自不同的源而非文档URI，那么被阻止的资源URI会被删减，仅保留协议，主机和端口号。

- violated-directive   
  违反的策略名称。
  
- original-policy   
  在 Content-Security-Policy HTTP 头部中指明的原始策略。

<div style="float: right">更新时间: {docsify-updated}</div>
