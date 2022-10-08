# 项目版本比对

对比多个版本时候，可以得出哪个版本较高，以便与进行相应的业务处理

```ts
const compareVersion = (
  v1: string = '', 
  v2: string = '', 
  separation: string = '.'
): number => {
  if (!v1 || typeof v1 !== 'string') {
    return -1;
  }
  if (!v2 || typeof v2 !== 'string') {
    return 1;
  }
  const v1Arr: string[] = v1.split(separation)
  const v2Arr: string[] = v2.split(separation)
  const len = Math.max(v1Arr.length, v2Arr.length)
  while (v1Arr.length < len) {
    v1Arr.push('0')
  }
  while (v2.length < len) {
    v2Arr.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1Arr[i], 10)
    const num2 = parseInt(v2Arr[i], 10)
    if (num1 > num2) {
      return 1
    }
    if (num1 < num2) {
      return -1
    }
  }
  return 0
}
```

<div style="float: right">更新时间: {docsify-updated}</div>




