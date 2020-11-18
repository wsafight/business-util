type PromiseState = 'pending' | 'fulfilled' | 'rejected'

class MyPromise {
  private state: PromiseState = 'pending'
  private value: any = null;
  private reason: any = null;
  private onFulfilledFunc = Function.prototype;
  private onRejectedFunc = Function.prototype;

  private resolve(value: any) {
    if (this.state === 'pending') {
      this.value = value
      this.state = 'fulfilled'
      this.onFulfilledFunc(this.value)
    }
  }

  private reject(reason: any) {
    if (this.state === 'pending') {
      this.reason = reason
      this.state = 'rejected'
      this.onRejectedFunc(this.reason)
    }
  }

  constructor(executor: any) {
    executor(this.resolve, this.reject)
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