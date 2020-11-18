type PromiseState = 'pending' | 'fulfilled' | 'rejected'

/**
 * 微任务
 */
export const nextTick = (function () {
  const callbacks = []
  let pending = false
  let timerFunc
  function nextTickHandler () {
    pending = false
    var copies = callbacks.slice(0)
    callbacks = []
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') { // 首选 MutationObserver
    var counter = 1
    var observer = new MutationObserver(nextTickHandler) // 声明 MO 和回调函数
    var textNode = document.createTextNode(counter)
    observer.observe(textNode, { // 监听 textNode 这个文本节点
      characterData: true // 一旦文本改变则触发回调函数 nextTickHandler
    })
    timerFunc = function () {
      counter = (counter + 1) % 2 // 每次执行 timeFunc 都会让文本在 1 和 0 间切换
      textNode.data = counter
    }
  } else {
    timerFunc = setTimeout // 如果不支持 MutationObserver, 退选 setTimeout
  }
  return function (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx) }
      : cb
    callbacks.push(func)
    if (pending) return
    pending = true
    timerFunc(nextTickHandler, 0)
  }
})()

class MyPromise {
  private state: PromiseState = 'pending'
  private value: any = null;
  private reason: any = null;
  private onFulfilledFunc = Function.prototype;
  private onRejectedFunc = Function.prototype;


  constructor(executor: any) {
    const resolve = (value: any) => {
      if (this.state === 'pending') {
        this.value = value
        this.state = 'fulfilled'
        this.onFulfilledFunc(this.value)
      }
    }
    const reject = (reason: any) => {
      if (this.state === 'pending') {
        this.reason = reason
        this.state = 'rejected'
        this.onRejectedFunc(this.reason)
      }
    }
    executor(resolve, reject)
  }



  then(onFulfilled: any, onRejected: any) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (data: any) => data
    onRejected = typeof onRejected === 'function' ? onRejected : (error: any) => {
      throw error
    }
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.state === 'rejected') {
      onRejected(this.reason)
    }

    if (this.state === 'pending') {
      this.onFulfilledFunc = onFulfilled
      this.onRejectedFunc = onRejected
    }

  }
}