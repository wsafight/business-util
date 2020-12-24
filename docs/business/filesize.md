# 文件格式化库 filesize

简单的情况可以直接使用 [format-file-size](../business/format-file-size)

直接使用开源库 filesize

```ts
// 默认使用方式,直接放入
filesize(500);                        // "500 B"

// 启用位大小
filesize(500, {bits: true});          // "4 Kb"
filesize(265318, {base: 10});         // "265.32 kB"
filesize(265318);                     // "259.1 KB"
filesize(265318, {round: 0});         // "259 KB"
filesize(265318, {output: "array"});  // [259.1, "KB"]
filesize(265318, {output: "object"}); // {value: 259.1, symbol: "KB", exponent: 1}
filesize(1, {symbols: {B: "Б"}});     // "1 Б"
filesize(1024);                       // "1 KB"
filesize(1024, {exponent: 0});        // "1024 B"
filesize(1024, {output: "exponent"}); // 1
filesize(265318, {standard: "iec"});  // "259.1 KiB"
filesize(265318, {standard: "iec", fullform: true}); // "259.1 kibibytes"
filesize(12, {fullform: true, fullforms: ["байтов"]});  // "12 байтов"
filesize(265318, {separator: ","});   // "259,1 KB"
filesize(265318, {locale: "de"});   // "259,1 KB"
```

因为我们在开发项目的过程中，往往只需要一种配置，这时候，我们可以直接使用函数柯里化直接提供配置。而 fileSize 提供了该功能 partial。

```ts
filesize.partial = opt => arg => filesize(arg, opt);

// 直接通过 partial 方法
const size = filesize.partial({standard: "iec"});

size(265318); // "259.1 KiB"
```

源码解析如下：