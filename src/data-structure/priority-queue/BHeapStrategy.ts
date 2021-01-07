import { Comparator, PriorityQueueOptions } from "./interface";

function defaultComparator (prev: number, next: number) {
  return  prev - next
}

export default class BHeapStrategy<T> {
  private readonly comparator: Comparator<T>;
  private readonly pageSize: number

  constructor(options: PriorityQueueOptions<T>) {
    this.comparator = options?.comparator || defaultComparator
    this.pageSize = options?.pageSize || 512
  }
}