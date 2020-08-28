/**
 * 转化为 0
 * 给你一个非负整数 num ，请你返回将它变成 0 所需要的步数。 如果当前数字是偶数，你需要把它除以 2 ；否则，减去 1 。
 */

export function reduceNumberToZero(num: number) {
  let count = 0
  while (num) {
    num = num % 2 === 0 ? num >> 1 : num - 1;
    count++;
  }
  return count
}


