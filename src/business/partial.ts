let _ = Object.create(null)

function partial(fn: any) {
  const args = [].slice.call(arguments, 1)
  return args.length < 1 ? fn :
    function () {
      const innerArgs = [].slice.call(arguments)
      const c: any[] = innerArgs.concat() ?? []
      for (let i = 0; i < c.length; i++) {
        if (c[i] === _) {
          c[i] = innerArgs.shift()
        }
      }
      // @ts-ignore
      return fn.apply(this, c.concat(args))
    }
}