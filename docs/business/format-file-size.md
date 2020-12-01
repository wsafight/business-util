# 文件大小格式化

简单的将文件大小转换为人类可读的字符串,有 1024 和 1000 字节配置。



```ts
interface FormatFileSizeOptions {
  /** 转换基数， 1024 与 1000 字节可以传入 */
  base: 1024 | 1000;
  /** 舍入的小数位数,通常两位正好 */
  round: number;
}

/**
 * 默认配置 项目
 */
const DEFAULT_OPTIONS: FormatFileSizeOptions = {
  base: 1024,
  round: 2
}

/**
 * 存储单位, GB 已经足够大
 */
const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB']


/**
 *
 * @param fileSize 文件数据
 * @param options
 */
function formatFileSize(fileSize: number, options?: FormatFileSizeOptions) {
  options = {...DEFAULT_OPTIONS, ...options} 

  const transferBase = options.base
  
  // 如果文件大小比当前单位小,直接返回 B 
  if (fileSize < transferBase) {
    return `${fileSize} B`
  }

  let unitIndex = Math.floor(Math.log(fileSize) / Math.log(transferBase))

  // 如果当前计算出的单位位数非常大，直接取当前设置的最大单位
  if (unitIndex >= units.length) {
    unitIndex = units.length - 1
  }

  fileSize = fileSize / (transferBase ** unitIndex)

  return fileSize.toFixed(options.round) + ' ' + units[unitIndex]
}
```

github代码在 [格式化文件大小](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/formatFileSize.ts) 中

更加复杂的功能可以使用 [filesize](https://github.com/avoidwork/filesize.js) 

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

```ts
// 添加配置
const size = filesize.partial({standard: "iec"});

// 通过函数柯里化设置通用配置，往往在一个系统中，配置都是一样的
filesize.partial = opt => arg => filesize(arg, opt);
``` 