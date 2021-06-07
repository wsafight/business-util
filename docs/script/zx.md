# 使用 JavaScript 编写脚本的工具 zx

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

我们仍旧需要使用 $ 符号添加命令，即 $`command` 来进行命令。

接下来我们对比源码对各个函数进行解析

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
export function fetch(url, init) {
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