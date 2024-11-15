---
title: xss 过滤器 DOMPurify
description: xss 过滤器 DOMPurify
---

允许开发人员获取不受信任的 HTML 输入并对其进行清理，以便安全地插入到文档的 DOM 节点中，这时候就可能需要清洁 DOM 以避免攻击。

[DOMPurify](https://github.com/cure53/DOMPurify) 用于清理 HTML (防止 XSS 攻击) 。您可以向 DOMPurify 提供充满任意 HTML 的字符串，它将返回一个干净 HTML 的字符串(除非另有配置)。DOMPurify 将去除包含危险的 HTML 内容，从而防止 XSS 攻击和其他污点。该库可以用于 HTML、 MathML 和 SVG。

## 使用方式

在前端使用方式为
```ts
import DOMPurify from 'dompurify';

var clean = DOMPurify.sanitize(dirty);

// 如果你仅需要 HTML，可以这样配置
DOMPurify.sanitize( dirty , {USE_PROFILES: {html: true}} );
```

实际业务中，应该向 DOM 中插入 HTML 时使用 DOMPurify。
```tsx
import purify from "dompurify";

<div 
  dangerouslySetInnerHTML={{__html:purify.sanitize(data)}} 
/>
```

注：该库也可以在 node 环境下使用，但是在前端渲染时候使用会更加安全有效。

编译结果如下所示：

修改前
```html
<script>
  alert('ccc')
</script>

<span data-a=1>
 1111
</span>
<img src='aa' onerror="">
<p>33333<div>3333

<!-- 测试 mXSS -->
<svg></p><style><a id="</style><img src=1 onerror=alert(1)>">
```

修改后:
```html
<span data-a="1">
 1111
</span>
<img src="aa">
<p>33333</p><div>3333</div>

<!-- mXSS 被编译出来 -->
<svg></svg><p></p><img src="1">"&gt;</div>
```


可以看到，当前 DOMPurify 不但可以去除 xss 攻击，还可以补全修复 DOM 结构。

## mXSS

关于突变 XSS 的定义，可以追溯于 Mario Heiderich 等人于 2013 年发表的一篇论文 “ mXSS Attacks: Attacking well-secured Web-Applications by using innerHTML Mutations.”
该 bug 是使用浏览器自动补全 DOM 结构来攻击的一种方案。

如: innerHTML api
```ts
let element = document.createElement('div')

element.innerHTML = '<u>Some <i>HTML'
// <u>Some <i>HTML"

element.innerHTML = element.innerHTML
// <u>Some <i>HTML</i></u>
```

```html
<svg></p><style><a id="</style><img src=1 onerror=alert(1)>">

<svg></svg><p></p><style><a id="</style><img src(unknow) onerror="alert(1)">">
```

不过该 bug 早在 DOMPurify 2.0.1 被修复。

如果是 input textarea 这样的的文本输入。使用 lodash.escape 即可。参考 [使用 escape 解决 HTML 空白折叠](../../ux/escape)
