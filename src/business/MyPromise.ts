import validate = WebAssembly.validate;

type PromiseState = 'pending' | 'fulfilled' | 'rejected'

/**
 * 微任务
 *
 * 更新一下，现在 Vue 的 nextTick 实现移除了 MutationObserver 的方式（兼容性原因），取而代之的是使用 MessageChannel。
 */

//  termine (macro) task defer implementation.
// // Technically setImmediate should be the ideal choice, but it's only available
// // in IE. The only polyfill that consistently queues the callback after all DOM
// // events triggered in the same loop is by using MessageChannel.
// /* istanbul ignore if */
// // 如果浏览器不支持Promise，使用宏任务来执行nextTick回调函数队列
// // 能力检测，测试浏览器是否支持原生的setImmediate（setImmediate只在IE中有效）
// if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
//   // 如果支持，宏任务（ macro task）使用setImmediate
//   macroTimerFunc = () => {
//     setImmediate(flushCallbacks)
//   }
//   // 同上
// } else if (typeof MessageChannel !== 'undefined' && (
//   isNative(MessageChannel) ||
//   // PhantomJS
//   MessageChannel.toString() === '[object MessageChannelConstructor]'
// )) {
//   const channel = new MessageChannel()
//   const port = channel.port2
//   channel.port1.onmessage = flushCallbacks
//   macroTimerFunc = () => {
//     port.postMessage(1)
//   }
// } else {
//   /* istanbul ignore next */
//   // 都不支持的情况下，使用setTimeout
//   macroTimerFunc = () => {
//     setTimeout(flushCallbacks, 0)
//   }
// }


export const nextTick = (function () {
  let callbacks: any[] = []
  let pending = false
  let timerFunc: any

  function nextTickHandler() {
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
    var textNode = document.createTextNode('' + counter)
    observer.observe(textNode, { // 监听 textNode 这个文本节点
      characterData: true // 一旦文本改变则触发回调函数 nextTickHandler
    })
    timerFunc = function () {
      counter = (counter + 1) % 2 // 每次执行 timeFunc 都会让文本在 1 和 0 间切换
      textNode.data = '' + counter
    }
  } else {
    timerFunc = setTimeout // 如果不支持 MutationObserver, 退选 setTimeout
  }
  return function (cb: any, ctx: any) {
    var func = ctx
      ? function () {
        cb.call(ctx)
      }
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
  private onFulfilledArray: any[] = [];
  private onRejectedArray: any[] = [];


  constructor(executor: any) {
    const resolve = (value: any) => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      nextTick(() => {
        if (this.state === 'pending') {
          this.value = value
          this.state = 'fulfilled'
          this.onFulfilledArray.forEach(func => {
            func(value)
          })
        }
      }, this)
    }
    const reject = (reason: any) => {
      nextTick(() => {
        if (this.state === 'pending') {
          this.reason = reason
          this.state = 'rejected'
          this.onRejectedArray.forEach(func => {
            func(reason)
          })
        }
      }, this)
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }


  }

  static resolve(value: any) {
    return new MyPromise((resolve: any) => resolve(value))
  }

  static reject(value: any) {
    return new MyPromise((resolve: any, reject: any) => reject(value))
  }

  static all(promises: MyPromise[]) {
    return new MyPromise((resolve: any, reject: any) => {
      try {
        const length = promises.length
        const resultArray = new Array(length)
        let count = 0
        for (let i = 0; i < length; i++) {
          promises[i].then((data: any) => {
            count++
            resultArray[i] = data
            if (count === length) {
              resolve(resultArray)
            }

          }, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  static race(promises: MyPromise[]) {
    return new MyPromise((resolve: any, reject: any) => {
      try {
        const length = promises.length
        for (let i = 0; i < length; i++) {
          promises[i].then(resolve, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }


  then(onFulfilled: any, onRejected: any) {
    const resolvePromise = (promise2: any, result: any, resolve: any, reject: any) => {
      if (promise2 === result) {
        reject(new TypeError('error due to circular reference'))
      }

      let consumed: boolean = false
      let thenable

      if (result instanceof MyPromise) {
        if (result.state === 'pending') {
          result.then(function (data: any) {
            resolvePromise(promise2, data, resolve, reject)
          }, reject)
        } else {
          result.then(resolve, reject)
        }
        return
      }

      let isComplexResult = (target: any) => (typeof target === 'function' || typeof target === 'object') && target !== null

      if (isComplexResult(result)) {
        try {
          thenable = result.then
          if (typeof thenable === 'function') {
            thenable.call(result, function (data: any) {
              if (consumed) {
                return
              }
              consumed = true

              return resolvePromise(promise2, data, resolve, reject)
            }, function (error: any) {
              if (consumed) {
                return
              }
              consumed = true
              return reject(error)
            })
          } else {
            resolve(result)
          }
        } catch (e) {
          if (consumed) {
            return;
          }
          consumed = true
          return reject(e)
        }
      } else {
        resolve(result)
      }
    }


    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (data: any) => data
    onRejected = typeof onRejected === 'function' ? onRejected : (error: any) => {
      throw error
    }
    let promise2: MyPromise
    if (this.state === 'fulfilled') {
      return promise2 = new MyPromise((resolve: any, reject: any) => {
        nextTick(() => {
          try {
            const result = onFulfilled(this.value)
            resolvePromise(promise2, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, this)
      })
    }
    if (this.state === 'rejected') {
      return promise2 = new MyPromise((resolve: any, reject: any) => {
        nextTick(() => {
          try {
            const result = onRejected(this.value)
            resolvePromise(promise2, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, this)
      })
    }

    if (this.state === 'pending') {
      return promise2 = new MyPromise((resolve: any, reject: any) => {
        this.onFulfilledArray.push(() => {
          try {
            const result = onFulfilled(this.value)
            resolvePromise(promise2, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })

        this.onRejectedArray.push(() => {
          try {
            const result = onRejected(this.value)
            resolvePromise(promise2, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, this)
      })
    }

  }

  catch(catchFunc: any) {
    return this.then(null, catchFunc)
  }


}