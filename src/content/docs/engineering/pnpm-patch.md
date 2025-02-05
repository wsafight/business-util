---
title: 使用 pnpm patch 修补依赖库
---

当线上出现某个 npm 包的紧急 bug 时，我们应该怎么办？

- fork 主库，修复 Bug
- 分支
    - 提交代码，等待合并 PR 后，等待新版本发包
    - 本地 npm publish 一个新包
- 升级项目中的 npm 依赖

即使我们忽略项目维护者，使用 npm publish 新包的策略，但是它还是太慢了。

此时 pnpm patch 是非常有用的工具。



注：如果当前并没有使用 pnpm 包管理工具
 - [bun 原生支持](https://bun.sh/docs/install/patch)
 - [yarn 原生支持](https://yarnpkg.com/cli/patch)
 - [npm patch-package](https://www.npmjs.com/package/patch-package) 