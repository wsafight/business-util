---
title: 安全三要素
description: 安全三要素
---

> CIA: 机密性(Confidentiality)、完整性(integirty)、可用性(Availability)。

## 机密性

保证数据内容不能泄漏，往往采用各种加密算法。

- HTTPS (可逆加密: 对称加密和非对称加密)
- 用户密码加密 (不可逆加密)


## 完整性

要求保证内容数据是完整的，没有被中间篡改的。常见的技术手段是数字签名。

子资源完整性(SRI) 是允许浏览器检查其获得的资源（例如从 CDN 获得的）是否被篡改的一项安全特性。它通过验证获取文件的哈希值是否和你提供的哈希值一样来判断资源是否被篡改。

```html
<script 
  src="https://example.com/example-framework.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous"></script>
```

integrity 值分成两个部分，第一部分指定哈希值的生成算法（目前支持 sha256、sha384 及 sha512），第二部分是经过 base64 编码的实际哈希值，两者之间通过一个短横（-）分割。


## 可用性

要求保护资源的可用性，而拒绝服务攻击破坏的是安全的可用性。

syn flood 是比较经典的 DDOS 攻击，其实质就是 TCP 三次握手。

- 客户端发送 SYN 包（初始序列号 x）
- 服务器会返回 SYN/ACK(x+1/服务端初始序列号 y)
- 客户端返回(y+1/x+1) 

syn flood 攻击伪造大量的 IP 地址发送请求。由于 IP 地址是伪造的所以在第三步不会应答。但是服务端仍旧会等待(几十秒到几分钟不等)，超时后才会丢弃，攻击者大量发送连接，导致服务器占用资源过多，无法处理正常请求，从而拒绝服务。

该方法是利用 TCP 本身的机制，难以解决，需要服务商提供更高的服务器资源和带宽协助以及各种算法结合进行流量清洗。

当然其实还有应用层 DDOS 攻击，CC 攻击。即 syn flood 被清洗了，攻击者利用应用层不断发起正常的请求，消耗数据库或者流量资源。

如利用 api 请求较大的页数以消耗数据库资源(有没有限制 pageSize 和 pageNum)。

还有滥用资源型的攻击，如利用极低的速度发送 HTTP 请求。以此来占用服务器连接资源。

当然还有正则表达式攻击，可以参看 [防御 ReDoS 攻击](./regexploit) 