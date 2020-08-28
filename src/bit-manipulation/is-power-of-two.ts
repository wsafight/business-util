/**
 * n & (n - 1) => 1000_1000 & 1000_0111 =>  1000_0000
 * 把最后一个 1 置 0
 * 2 的幂必然只有一个 1
 * @param n
 */
function isPowerOfTwo(n: number): boolean {
  if (n <= 0) return false
  return (n & (n - 1)) === 0
}

/**
 * 利用其他函数解决此问题
 * @param n
 */
function isPowerOfTwo2(n: number): boolean {
  return Number.isInteger(Math.log2(n))
}
