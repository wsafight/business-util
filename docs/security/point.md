# 安全三要素

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
