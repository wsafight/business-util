---
title: 通过扁平字符串提升输出性能
description: 通过扁平字符串提升输出性能
---

如果您要进行大量字符串连接，然后在某处进行写入，[flatstr](https://github.com/davidmarkclements/flatstr) 极大地提高了性能。

在 v8 C++ 层中，JavaScript 字符串可以用两种方式表示。

- 作为一个数组(SeqString)
- 作为一棵树(ConsString)

当拼接 JavaScript 字符串时（即： 'abc' + 'efg'）时候，使用树结构操作比重新分配更大的数组耗时要少。但是，对树结构执行其他操作耗时要多。

V8 有一个方法调用 String::Flatten ，该方法会把树结构转换为数组结构。此方法并不会提供给业务开发者使用。但是我们如果进行字符串操作时，会隐式转换字符串为数组结构，如：

- 转换为数值（Number / parseInt / ~ ）
- 读取字符（s[0] / charCodeAt ）
- 正则表达式操作（ test / exec ）

这些操作中，Number 的性能是最高的。所以一般会使用该方式进行转化。大部分情况下，我们都不需要进行处理。一个明显需要提升的例子是： WriteStream。如果底层表示是一棵树，这会耗费更长的时间(node 默认使用字符集为 UTF-8,而 UTF-8 字符所占用的空间不能直接通过字符数计算，需要遍历每个字符才能知道。如果是树结构，需要多次调用计算与写入，而数组则只需要一次)。

- defaultEncoding <string> 当没有将编码指定为 stream.write() 的参数时使用的默认编码。 默认值: 'utf8'。
- encoding <string> 字符串块的编码。 必须是有效的 Buffer 编码，例如 'utf8' 或 'ascii'。

当前如果是 ascii 则影响不大。

flatstr 全部代码如下所示：

```js
function flatstr (s) {
  s | 0
  return s
}
```