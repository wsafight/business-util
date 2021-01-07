
export type Strategy = 'array' | 'bHeap'

export type Comparator<T> = (prev: T, next: T) => number

export interface PriorityQueueOptions<T> {
  strategy: Strategy;
  comparator: (prev: T, next: T) => number;
  pageSize?: number;
  initialValue?: T[]
}