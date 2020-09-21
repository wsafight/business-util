/**
 * 数字范围增减,适用于数字溢出后返回最小值
 * 时间复杂度 O(1)
 */

export function roundIndex(count: number, initialVal: number = 0) {
  // 初始化数据
  let index =  initialVal
  return function (step: number) {
    const currentIndex = index + (step % count)
    index = currentIndex < 0 ? currentIndex + count : currentIndex % count
    return index
  }
}