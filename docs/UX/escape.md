# 使用 escape 解决 HTML 空白折叠

对于富文本编辑器产生的内容，我们可以利用 xss 过滤器 DOMPurify 等工具来解决 xss 攻击。

由于 HTML 解析会存在空白折叠的问题，对于展示 textarea 的多行文本我们需要转换成 html 才能够实现换行功能。

由于转换过程可能涉及到 xss 攻击，所以我们需要做一些基础的转换。如此就不会产生此类问题。

此时我们使用 lodash.escape， 该函数可以转义 string 中的 "&", "<", ">", '"', "'", 和 "`" 字符为 HTML 实体字符。

即:
```ts
escape('fred, barney, & pebbles<bbb></bbb>');
// => 
"fred%2C%20barney%2C%20%26%20pebbles%3Cbbb%3E%3C/bbb%3E"
```

转换多行代码如下所示

```ts
import escape from 'lodash/escape';

export const formatMultilineText = (text: string) => {
  if (!text || typeof text !== "string" ) {
    return '';
  }
  return text.split(/\r?\n/).map(line => escape(line)
    // 其他处理
    .replace()
  ).join('<br/>');
}
```




