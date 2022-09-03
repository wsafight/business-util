# 文件名替换非法字符串

当前函数把文件名中的非法字符替换为下划线让用户正常使用。

在 Windows 系统中, \ / | : * ? " < > 这样几个字符是不能存在于文件夹名或文件名中的，将其转换为下划线 _。

```js
export const normalizeFileName = (fileName: string): string => {
  if (!fileName || typeof fileName !== 'string') {
    throw new Error('fileName must be a String')
  }
  fileName = fileName.replace(/[\\/|:*?"><]/g, '_')
  return fileName
}
```