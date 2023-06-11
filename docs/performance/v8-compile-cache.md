# 加快执行速度的编译缓存工具 v8-compile-cache

V8 使用即时编译(JIT) 来执行 JavaScript 代码。这意味着在运行脚本之前，必须对其进行解析和编译——这会导致相当大的开销。

代码缓存从 V8 4.2 版本开始可用，并且不仅仅限于 Chrome。它通过 V8 的 API 公开，因此每个 V8 嵌入器都可以利用它。例如 node 在 5.7.0 后也支持了该功能。

[v8-compile-cache] 就是帮助 node 进行编译持久化的库。我们直接这样使用即可。

```js
require('v8-compile-cache')
```

非常简单就得到了对应的性能提升。

## 功能原理

想要使用中间文件，需要先生成中间文件。v8 提供了以下几个方法：

- v8::ScriptCompiler::kProduceCodeCache 是否生成 code cache
- v8::ScriptCompiler::Source::GetCachedData 获取生成的 code cache
- v8::ScriptCompiler::kConsumeCodeCache 消费生成的 cache


当一个脚本被 V8 编译时，可以通过作为一个选项传递来产生缓存数据来加速后面的编译 v8::ScriptCompiler::kProduceCodeCache 。如果编译成功，缓存数据将附加到源对象并可以通过v8::ScriptCompiler::Source::GetCachedData 。然后可以将其持久化以备后用，例如将其写入磁盘。

在以后的编译过程中，先前生成的缓存数据可以附加到源对象并v8::ScriptCompiler::kConsumeCodeCache 作为选项传递。这一次，代码的生成速度会快得多，因为 V8 绕过编译代码并从提供的缓存数据中反序列化代码。

生成缓存数据需要一定的计算和内存成本。出于这个原因，Chrome 只有在同一脚本在几天内至少出现两次时才会生成缓存数据。通过这种方式，Chrome 能够以平均两倍的速度将脚本文件转换为可执行代码，从而为用户节省每次后续页面加载的宝贵时间。

## 源码解析




