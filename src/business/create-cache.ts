export default function createCache () {
  const cache = new Map()
  return function (name: string, create: () => any | any) {
    if (cache.has(name)) {
      return cache.get(name)
    }
    const ret = (create instanceof Function) ? create() : create
    cache.set(name, ret)
    return ret
  }
}
