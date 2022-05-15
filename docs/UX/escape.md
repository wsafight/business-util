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

转换多行代码逻辑代码如下所示

```ts
import escape from 'lodash/escape';

export const formatMultilineText = (text: string, fontSize: number = 0.5) => {
    if (!text || typeof text !== "string") {
        return '';
    }
    return text.split(/\r?\n/).map(line => {
        // 去除每一行最后的空白并进行转义
        return escape(line.replace(/\s+$/g, ''))
            // 转换制表符为多个空格
            .replace(/\t/g, '        ')
            // 转换多个空格为 span 避免长度折叠
            .replace(/\s{2,}/g, (replacement: string) => {
                return `<span style='display:inline-block;width:${replacement.length * fontSize}em'></span>`
            })
        }
    ).join('<br/>')
}
```

注意: 随着 lodash 的更新， escape 转义变得更加严格，涉及到

|  转义前  | 转义后  |
|  :----:  | :----:  |
| \t   | %09 |
| 空格  | %20 |
| %  | %25 |

鉴于 % 也会转义 为 %25，所以这里并不需要担心原有文字中会存在 %09 %20 被转义的情况，重新处理为：

```ts
import escape from 'lodash/escape';

export const formatMultilineText = (text: string, fontSize: number = 0.5) => {
    if (!text || typeof text !== "string") {
        return '';
    }
    return text.split(/\r?\n/).map(line => {
        // 去除每一行最后的空白并进行转义
        return escape(line.replace(/\s+$/g, ''))
            // 转换制表符为多个空格
            .replace(/%20/g, ' ')
            .replace(/%09/g, '        ')
            // 转换多个空格为 span 避免空白折叠
            .replace(/\s{2,}/g, (replacement: string) => {
                return `<span style='display:inline-block;width:${replacement.length * fontSize}em'></span>`
            })
        }
    ).join('<br/>')
}
```



