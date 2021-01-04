# 微任务延迟调度

针对不同的浏览器而言，我们想要尽快执行异步代码时往往会添加 nextTick 函数。而 nextTick 会直接使用 setTimeout (这样做法并不严谨，因为 setTimeout 属于宏任务，而并非微任务)

```ts
const nextTick =
  typeof Promise !== 'undefined'
    ? Promise.resolve().then.bind(Promise.resolve())
    : function (a) {
        window.setTimeout(a, 0);
      };
```


为了尽快执行代码，很多 Promise 的实现库用了 MutationObserver 来模仿 nextTick。但不利于



```ts
import { ITask, ITaskCallback } from './type'

const macroTask: ITask[] = []
let deadline: number = 0
const threshold: number = 1000 / 60
const callbacks = []

export const schedule = (cb) => callbacks.push(cb) === 1 && postMessage()

export const scheduleWork = (callback: ITaskCallback): void => {
  const currentTime = getTime()
  const newTask = {
    callback,
    time: currentTime + 3000,
  }
  macroTask.push(newTask)
  schedule(flushWork)
}

const postMessage = (() => {
  const cb = () => callbacks.splice(0, callbacks.length).forEach((c) => c())
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  }
  return () => setTimeout(cb)
})()

const flush = (initTime: number): boolean => {
  let currentTime = initTime
  let currentTask = peek(macroTask)

  while (currentTask) {
    const timeout = currentTask.time <= currentTime
    if (!timeout && shouldYield()) break

    const callback = currentTask.callback
    currentTask.callback = null

    const next = callback(timeout)
    next ? (currentTask.callback = next as any) : macroTask.shift()

    currentTask = peek(macroTask)
    currentTime = getTime()
  }
  return !!currentTask
}

const peek = (queue: ITask[]) => {
  queue.sort((a, b) => a.time - b.time)
  return queue[0]
}

const flushWork = (): void => {
  const currentTime = getTime()
  deadline = currentTime + threshold
  flush(currentTime) && schedule(flushWork)
}

export const shouldYield = (): boolean => {
  return getTime() >= deadline
}

const getTime = () => performance.now()

```

<div style="float: right">更新时间: {docsify-updated}</div>