export function selfCurry(fn: any) {
  function inner(len: number, arg: any[] = []) {
    if (len <= 0) {
      return fn.apply(null, arg)
    }
    return function () {
      const currentArgs: any[] = arg.concat(Array.prototype.slice.call(arguments))
      return inner(len - arg.length, currentArgs)
    }
  }

  return inner(fn.length)
}