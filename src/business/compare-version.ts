export function compareVersion(v1: string, v2: string) {
  const v1Arr: string[] = v1.split('.')
  const v2Arr: string[] = v2.split('.')
  const len = Math.max(v1Arr.length, v2Arr.length)
  while (v1Arr.length < len) {
    v1Arr.push('0')
  }
  while (v2.length < len) {
    v2Arr.push('0')
  }
  // eslint-disable-next-line no-plusplus
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
