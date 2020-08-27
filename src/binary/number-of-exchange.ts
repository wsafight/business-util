/**
 * 借助中间变量来解决交换问题
 * @param numbers
 */
export function numberOfExchange(numbers: number[]) {
  let temp = numbers[0]
  numbers[0] = numbers[1]
  numbers[1] = temp
  return [numbers[0], numbers[1]]
}

/**
 * 二进制数字交换
 * @param numbers
 * 任何数字进行 ^ 操作都是 0 ： a ^ a === 0
 * 任何数字与 0 进行 ^ 操作都是当前数字： a ^ 0 === a
 */
export function numberOfExchange2(numbers: number[]) {
  let a = numbers[0]
  let b = numbers[1];
  a = a ^ b;
  // 结合上面的 a => b = a ^ b ^ b => a ^ 0 => a
  b = a ^ b; //
  // 同理得到  a = a ^ b ^a => b
  a = a ^ b; //
  return [a, b]
}

export function numberOfExchange3(numbers: number[]) {
  [numbers[0], numbers[1]] = [numbers[1], numbers[0]]
  return numbers
}


numberOfExchange([1, 2])
numberOfExchange2([1, 2])
