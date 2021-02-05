export interface IAdapter<T> {
  add(t: T): void

  remove(): T | undefined

  clear(): void

  length: number
  isEmpty: boolean
}

