---
title: 使用 JS 编写脚本的工具 zx
description: 使用 JS 编写脚本的工具 zx
---

Bash 很棒，但是对于开发者来说，我们需要学习更多的语法，对于前端构建或者 node 服务来说，用 JavaScript 是个不错的选择。[zx](https://github.com/google/zx) 对 child_process 进行了包装并且提供了合适的默认值。

```zx
await $`cat package.json | grep name`

let branch = await $`git branch --show-current`
await $`dep deploy --branch=${branch}`

await Promise.all([
  $`sleep 1; echo 1`,
  $`sleep 2; echo 2`,
  $`sleep 3; echo 3`,
])

let name = 'foo bar'
await $`mkdir /tmp/${name}`
```

当我们第一眼看到 $ 时候，我们最先想到什么呢？

```js

```

我们仍旧需要使用 $ 符号添加命令，即 $`command` 来进行命令。

接下来我们解析源代码

## 配置项
对于任何一些项目，我们第一个考虑的就是配置项目。

- shell

  指定使用什么 shell，默认为 bash

- prefix

  命令运行的前缀，默认 set -euo pipefail;

- quote

  指定用于在命令替换期间转义特殊字符的函数，默认为 [shq](https://github.com/mk-pmb/shq-js)

- verbose

  是否详细输出所有的执行命令



```js

$.verbose = true

try {
    $.shell = await which('bash')
    $.prefix = 'set -euo pipefail;'
} catch (e) {
    // Bash not found, no prefix.
    $.prefix = ''
}

$.quote = shq

// 当前执行文件夹路径，通过 cd 函数修改
$.cwd = undefined

// 把 $ 导如 global，这样我们可以直接修改 $
Object.assign(global, {
    $,
    // ...
})
```

后续我们直接使用 $`cat package.json | grep name`

```js
export function $(pieces, ...args) {
  let __from = (new Error().stack.split('at ')[2]).trim()
  let cmd = pieces[0], i = 0
  let verbose = $.verbose
  while (i < args.length) {
    let s
    if (Array.isArray(args[i])) {
      s = args[i].map(x => $.quote(substitute(x))).join(' ')
    } else {
      s = $.quote(substitute(args[i]))
    }
    cmd += s + pieces[++i]
  }
  if (verbose) console.log('$', colorize(cmd))
  let options = {
    cwd: $.cwd,
    shell: typeof $.shell === 'string' ? $.shell : true,
    windowsHide: true,
  }
  let child = spawn($.prefix + cmd, options)
  let promise = new ProcessPromise((resolve, reject) => {
    child.on('exit', code => {
      child.on('close', () => {
        let output = new ProcessOutput({
          code, stdout, stderr, combined,
          message: `${stderr || '\n'}    at ${__from}`
        });
        (code === 0 || promise._nothrow ? resolve : reject)(output)
      })
    })
  })
  if (process.stdin.isTTY) {
    process.stdin.pipe(child.stdin)
  }
  let stdout = '', stderr = '', combined = ''
  function onStdout(data) {
    if (verbose) process.stdout.write(data)
    stdout += data
    combined += data
  }
  function onStderr(data) {
    if (verbose) process.stderr.write(data)
    stderr += data
    combined += data
  }
  child.stdout.on('data', onStdout)
  child.stderr.on('data', onStderr)
  promise._stop = () => {
    child.stdout.off('data', onStdout)
    child.stderr.off('data', onStderr)
  }
  promise.child = child
  return promise
}
```

### prefix

该配置指定命令的前缀

```js
$.prefix = 'set -euo pipefail'
```


### quote

```js

```

## 函数

### cd

```js
cd('/tmp')
await $`pwd` // outputs /tmp
```

我们可以学习一下源码:

```js
export function cd(path) {
  if ($.verbose) console.log('$', colorize(`cd ${path}`))
  // 没有当前文件，直接报错
  if (!existsSync(path)) {
    let __from = (new Error().stack.split('at ')[2]).trim()
    console.error(`cd: ${path}: No such directory`)
    console.error(`    at ${__from}`)
    process.exit(1)
  }
  // 把 $.cwd 变量变为 path
  $.cwd = path
}
```
我们可以看到当前 cd 并没有直接切换到文件目录，而是通过存储，懒执行。

### fetch

```js
let resp = await fetch('')
if (resp.ok) {
  console.log(await resp.text())
}
```

函数直接调用了 [node-fetch](https://www.npmjs.com/package/node-fetch) 库

```js
// Purpose of async keyword here is readability. It makes clear for the reader what this func is async.
export async function fetch(url, init) {
  if ($.verbose) {
    if (typeof init !== 'undefined') {
      console.log('$', colorize(`fetch ${url}`), init)
    } else {
      console.log('$', colorize(`fetch ${url}`))
    }
  }
  return nodeFetch(url, init)
}
```

### question

问题

```js
import {createInterface} from 'readline'

export async function question(query, options) {
  let completer = undefined
  // 是否是数组  
  if (Array.isArray(options?.choices)) {
    completer = function completer(line) {
      const completions = options.choices
      const hits = completions.filter((c) => c.startsWith(line))
      return [hits.length ? hits : completions, line]
    }
  }
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    completer,
  })
  const question = (q) => new Promise((resolve) => rl.question(q ?? '', resolve))
  let answer = await question(query)
  rl.close()
  return answer
}
```

### sleep

```js
export const sleep = promisify(setTimeout)
```

### nothrow

```js
export function nothrow(promise) {
  promise._nothrow = true
  return promise
}
```