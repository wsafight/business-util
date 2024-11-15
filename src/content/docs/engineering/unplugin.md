---
title: 构建工具统一插件工具 unplugin
description: 构建工具统一插件工具 unplugin
---

对于前端构建工作来说，某些情况下开发中需要编写插件来针对特定需求。但是当前编写的插件仅仅针对当前的构建工具。如果当前需求也较为普遍，可能构建系统也需要此插件。此时我们需要再次编写（不同的构建系统提供了不同的构建 api）。这样不利于维护和更新工作。

[unplugin](https://github.com/unjs/unplugin) 使用 Rollup 插件 API 扩展为统一的插件接口，并在使用的构建工具的基础上提供兼容的层。

代码如下所示：

```ts
import { createUnplugin } from 'unplugin'

export const unplugin = createUnplugin((options: UserOptions) => {
  return {
    name: 'my-first-unplugin',
    // webpack's id filter is outside of loader logic,
    // an additional hook is needed for better perf on webpack
    transformInclude (id) {
      return id.endsWith('.vue')
    },
    // just like rollup transform
    transform (code) {
      return code.replace(/<template>/, `<template><div>Injected</div>`)
    },
    // more hooks coming
  }
})

// 导出 vite    插件
export const vitePlugin = unplugin.vite
// 导出 rollup  插件
export const rollupPlugin = unplugin.rollup
// 导出 webpack 插件
export const webpackPlugin = unplugin.webpack
// 导出 esbuild 插件
export const esbuildPlugin = unplugin.esbuild
```

如此，我们就可以专注于插件的核心工具，而不需要在意构建系统间的区别了。
