import { Comparator, PriorityQueueOptions } from "./interface";

function binarySearchForIndexReversed<T>(
  array: T[],
  value: T,
  comparator: Comparator<T>
) {
  let low: number = 0;
  let high = array.length;
  while (low < high) {
    const mid = (low + high) >>> 1
    if (comparator(array[mid], value) >= 0) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low
}


export default class ArrayStrategy<T> {
  private readonly comparator: Comparator<T>;
  private readonly data: T[]

  constructor(options: PriorityQueueOptions<T>) {
    this.comparator = options.comparator
    this.data = options.initialValue?.slice(0) || []
    this.data.sort(this.comparator).reverse()
  }

  queue (value: T) {
    const pos = binarySearchForIndexReversed(this.data, value, this.comparator)
    this.data.splice(pos, 0, value)
  }

  dequeue (): T | undefined {
    return this.data.pop()
  }

  peek (): T {
    return  this.data[this.data.length - 1]
  }

  clear() {
    this.data.length = 0
  }

}