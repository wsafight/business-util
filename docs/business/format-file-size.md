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

更加复杂的功能可以使用 [filesize](https://github.com/avoidwork/filesize.js) 开源库，同时该库的解析在 [复杂的文件格式化库 filesize](https://wsafight.github.io/Daily-Algorithm/#/util/filesize) 中。
