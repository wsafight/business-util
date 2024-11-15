---
title: 单例 Promise 缓存
description: 单例 Promise 缓存
---

之前写过一篇 [前端 api 请求缓存方案](https://segmentfault.com/a/1190000018940422) 介绍了如何使用 Promise 对象进行数据加载优化。当然了，对于某些需求来说我们可能只需要一个非常简单的单例 Promise 对象缓存。过期时间也只在几百毫秒（用于列表内大量数据请求优化）。

```ts
/** 当前缓存的 Promise 函数 */
type CachePromiseFun<T> = (...args: any[]) => Promise<T>

/** 配置项目 **/
interface PromiseCacheSingletonOptions {
  /** 存活时间 */
  expries?: number
  /** 跳过参数比对 */
  skipArgsDiff?: boolean
}

export const promiseCacheSingleton = <T>(
  promiseFun: CachePromiseFun<T>, {
    expries = 200,
    skipArgsDiff = false,
  }: PromiseCacheSingletonOptions = {}
): CachePromiseFun<T> => {
  // 当前没有或者传递参数不是函数，直接报错
  if (!promiseFun || typeof promiseFun !== 'function') {
    throw new Error('The current params "promiseFun" must be function')
  }

  // expries 不应该是 0,是 0 其实没有意义，直接报错
  if (expries === 0) {
    throw new Error('The current params "expries" must be greater than 0')
  }

  // 当前缓存的 Promsie 对象
  let currentPendingPromise: Promise<T> | null = null
  // 上一次的请求
  let preTimeoutHandler: number | null = null
  // 上一次的参数字符串
  let preArgsStr: string = ''

  return async (...args: any[]) => {
    // 不跳过参数对比，就进行比对以及删除上一个缓存
    if (!skipArgsDiff) {
      const currentArgsStr: string = JSON.stringify(args)
      
      // 如果参数不等，直接删除当前的 Promise 缓存,再次进行请求
      if (preArgsStr !== currentArgsStr) {
        currentPendingPromise = null
        if (preTimeoutHandler) {
          window.clearTimeout(preTimeoutHandler)
        }
        preArgsStr = currentArgsStr
      }
    }


    // 当前有正在 pending 的 Promise 对象，直接返回
    if (currentPendingPromise) {
      return currentPendingPromise
    }
    
    currentPendingPromise = promiseFun(...args)

    let value: T | null = null

    try {
      value = await currentPendingPromise
    } catch (error) {
      // 发生错误后立即死亡
      currentPendingPromise = null
      throw error
    }

    preTimeoutHandler = window.setTimeout(() => {
      currentPendingPromise = null
    }, expries)

    return value
  }
}
```