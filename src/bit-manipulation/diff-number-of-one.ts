/**
 * 比较二进制中1的个数
 */

/**
 * 根据 number-of-one 算出两个数字个数和 0 比较
 */


/**
 * 如果 第一个数字中
 * @param num1
 * @param num2
 */
export function diffNumberOfOne(num1: number, num2: number) {
  let x = num1 & -num2
  let y = num2 & -num1
  while (1) {
    if (x === 0) {
      return y | -y
    }
    if (y === 0) {
      return 1
    }
    x = x & (x - 1)
    y = y & (y - 1)
  }
}
