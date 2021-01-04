/** 优先队列策略 */
export type Strategy = ''

export interface PriorityQueueOptions<T> {
  strategy: any;
  comparator: (prev: T, next: T) => number;
  initialValue?: T[]
}

class AbstractPriorityQueue<T>{
  private length: number = 0;
  private readonly priv: any
  constructor(options: PriorityQueueOptions<T>) {
    this.length = options?.initialValue?.length || 0
    this.priv = new options.strategy(options)
  }

  queue(value: T) {
    this.length++
    this.priv.queue(value)
  }

  dequeue() {
    if (!this.length) {
      throw new Error('Empty queue')
    }
    this.length--
    this.priv.dequeue()
  }

  peek() {
    if (!this.length) {
      throw new Error('Empty queue')
    }
    this.priv.peek()
  }

  clear() {
    this.length = 0;
    this.priv.clear()
  }


}