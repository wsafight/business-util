简单的将文件大小转换为人类可读的字符串,有 1024 和 1000

```ts
interface FormatFileSizeOptions {
  /** 转换基数， 1024 与 1000 */
  base: 1024 | 1000;
  /** 舍入的小数据 */
  round: number;
}

/**
 * 默认配置
 */
const DEFAULT_OPTIONS: FormatFileSizeOptions = {
  base: 1024,
  round: 2
}

/**
 * 存储单位
 */
const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB']


/**
 *
 * @param fileSize 文件数据
 * @param options
 */
function formatFileSize(fileSize: number, options?: FormatFileSizeOptions) {
  options = Object.assign({}, DEFAULT_OPTIONS, options)

  const transferBase = options.base

  if (fileSize < transferBase) {
    return fileSize + ' B'
  }

  let unitIndex = Math.floor(Math.log(fileSize) / Math.log(transferBase))

  if (unitIndex >= units.length) {
    unitIndex = units.length - 1
  }

  fileSize = fileSize / (transferBase ** unitIndex)

  return fileSize.toFixed(options.round) + ' ' + units[unitIndex]
}
```

github代码在 [格式化文件大小](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/formatFileSize.ts) 中

更加复杂的功能可以使用 [filesize](https://github.com/avoidwork/filesize.js) 
 