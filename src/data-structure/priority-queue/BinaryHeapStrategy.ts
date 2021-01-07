import { Comparator, PriorityQueueOptions } from "./interface";

function defaultComparator (prev: number, next: number) {
  return  prev - next
}

export default class BinaryHeapStrategy<T> {
  private readonly comparator: Comparator<T>;
  private readonly data: T[]
  constructor(options: PriorityQueueOptions<T>) {
    this.comparator = options?.comparator || defaultComparator
    this.data = options.initialValue?.slice(0) || []
    this.heapify()
  }

  private heapify() {
    if (this.data.length > 0) {
      for (let i of this.data) {

      }
    }
  }
}