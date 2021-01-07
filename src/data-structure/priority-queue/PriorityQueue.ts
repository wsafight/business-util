import ArrayStrategy from './ArrayStrategy'
import { PriorityQueueOptions, Strategy } from "./interface";
import BHeapStrategy from "./BHeapStrategy";

const StrategyMap: Record<Strategy, any> = {
  'array': ArrayStrategy,
  'bHeap': BHeapStrategy
}

class priorityQueue<T> {
  private length: number = 0;
  private readonly instance: any

  constructor(options: PriorityQueueOptions<T>) {
    this.length = options?.initialValue?.length || 0
    this.instance = StrategyMap[options.strategy]
  }

  queue(value: T) {
    this.length++
    this.instance.queue(value)
  }

  dequeue() {
    if (!this.length) {
      throw new Error('Empty queue')
    }
    this.length--
    return this.instance.dequeue()
  }

  peek() {
    if (!this.length) {
      throw new Error('Empty queue')
    }
    return this.instance.peek()
  }

  clear() {
    this.length = 0;
    this.instance.clear()
  }

}