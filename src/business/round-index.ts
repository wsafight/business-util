/**
 *
 */

export function roundIndex(count: number, initialVal: number = 0) {
  let index =  initialVal
  return function (step: number) {
    const currentIndex = index + step
    index = currentIndex < 0 ? currentIndex + count : currentIndex % count
    return index
  }
}