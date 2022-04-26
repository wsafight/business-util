# 扁平字符串

如果您要进行大量字符串连接，然后在某处写入该字符串，[flatstr](https://github.com/davidmarkclements/flatstr) 极大地提高了性能。

在 v8 C++ 层中，JavaScript 字符串可以用两种方式表示。

- 作为一个数组
- 作为一棵树

当连接 JavaScript 字符串时，使用树结构来表示它们。对于 concat 操作，这比重新分配更大的数组便宜。但是，对树结构执行其他操作可能会变得昂贵（特别是在发生大量连接的情况下）。

V8 有一个方法调用String::Flatten，它将树转换为 C 数组。此方法通常在遍历字符串字节的操作之前调用（例如，在针对正则表达式进行测试时）。如果一个字符串被多次访问，它也可以被调用，作为对字符串的优化。但是，字符串并不总是变平的。一个例子是当我们将一个字符串传递给 a 时WriteStream，在某些时候该字符串将被转换为一个缓冲区，如果底层表示是一棵树，这可能会很昂贵。

String::Flatten不作为 JavaScript 函数公开，但可以作为副作用触发。

```js
function flatstr (s) {
  s | 0
  return s
}
```

使用 flatstr 的最佳位置是在将其传递给最终运行非 v8 代码的 API 之前（例如fs.WriteStream，或者xhr浏览器中的 DOM api）。