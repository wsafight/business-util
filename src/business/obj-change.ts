/**
 * 监控对象变更
 * @param {*} data
 */
const createProxy = (data: Record<string, any>,list: any[] =[]) => {
  if (typeof data === 'object' && data.toString() === '[object Object]') {
    for (let k in data) {
      if(list.includes(k)){
        if (typeof data[k] === 'object') {
          defineObjectReactive(data, k, data[k])
        } else {
          defineBasicReactive(data, k, data[k])
        }
      }
    }
  }
}

function defineObjectReactive(obj: Record<string, any>, key: string, value: any) {
  // 递归
  // createProxy(value)
  obj[key] = new Proxy(value, {
    set(target, property, val, receiver) {
      if (property !== 'length') {
        setTimeout(() => {
          //  钩子函数
          // method.createHookFunction('updated',val)
        }, 0);
      }
      return Reflect.set(target, property, val, receiver)
    }
  })
}

function defineBasicReactive(obj: Record<string, any>, key: string, value: any) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: false,
    get() {
      return value
    },
    set(newValue) {
      if (value === newValue) return
      console.log(`发现 ${key} 属性 ${value} -> ${newValue}`)
      value = newValue
    }
  })
}