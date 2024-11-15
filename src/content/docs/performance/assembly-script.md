---
title: 利用 "ts" 编译 WebAssembly
description: 利用 "ts" 编译 WebAssembly
---

[WASM](https://www.wasm.com.cn/) 是一个可移植、体积小、加载快并且兼容 Web 的全新格式。

WASM 当前目标就是充分发挥硬件能力以达到原生执行效率。如果当前在开发 cpu 密集型任务时候，使用 WASM 无疑能大量提升性能。

但使用 rust 或 go 语言来编写 wasm 太繁琐了（新语法，新工具链），于是我选择了 [AssemblyScript](https://www.assemblyscript.org/) ，它对前端友好且不需要额外学习，所以我可以更专注的编写业务。

当我们编写 Fibonacci 算法时：

```ts
export function fib(n: i32): i32 {
  var a = 0, b = 1
  if (n > 0) {
    while (--n) {
      let t = a + b
      a = b
      b = t
    }
    return b
  }
  return a
}
```

上述代码会编译结果为:

```wat
;; INFO asc module.ts --textFile module.wat --binaryFile module.wasm -O3 --runtime stub
(module
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (memory $0 0)
 (export "fib" (func $module/fib))
 (export "memory" (memory $0))
 (func $module/fib (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 1
  local.set $1
  local.get $0
  i32.const 0
  i32.gt_s
  if
   loop $while-continue|0
    local.get $0
    i32.const 1
    i32.sub
    local.tee $0
    if
     local.get $1
     local.get $2
     i32.add
     local.get $1
     local.set $2
     local.set $1
     br $while-continue|0
    end
   end
   local.get $1
   return
  end
  i32.const 0
 )
)
```

我们可以在页面中这样使用：
```js

loader.instantiate(module_wasm, { /* imports */ })
  .then(({ exports }) => {
    const output = document.getElementById('output')
    for (let i = 0; i <= 10; ++i) {
      output.value += `fib(${i}) = ${exports.fib(i)}\n`
    }
  })
``` 

大家可以通过 [AssemblyScript 官网](https://www.assemblyscript.org/) 继续学习。
