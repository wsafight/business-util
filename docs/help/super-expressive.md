# 用编程的方式清晰的构建正则表达式

正则表达式是一个非常强大的工具，但其简洁而神秘的词汇可能使与他人进行构建和交流成为一个挑战。即使是对它们很了解的开发人员，也可能在几个月后难以阅读自己书写的代码！此外，它们无法以编程方式轻松创建和操作-关闭了动态文本处理的整个途径。

但是 [super-expressive](https://github.com/francisrstokes/super-expressive) 解决了这一切。它提供了程序化和人类可读的方式来创建正则表达式。它的API使用流畅的构建器模式，并且是完全不变的。它被构建为可发现和可预测的：

我们可以查看代码 demo:

```ts
import SuperExpressive from 'super-expressive';

SuperExpressive()
  .allowMultipleMatches
  .lineByLine
  .startOfInput
  .optional.string('0x')
  .capture
    .exactly(4).anyOf
      .range('A', 'F')
      .range('a', 'f')
      .range('0', '9')
    .end()
  .end()
  .endOfInput
  .toRegex();

// ->
// /^(?:0x)?([A-Fa-f0-9]{4})$/gm
```

<div style="float: right">更新时间: {docsify-updated}</div>
 
 
