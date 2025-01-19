---
title: TypeScript 代码执行工具
description: ts-node 是一个用于直接执行 TypeScript 代码的 Node.js 实现
---

随着 Node v23.6.0 的发布，我们已经可以在 Node.js 中直接运行 TypeScript 代码。

```
node yourapp.ts
```

但是在当前版本中，Node.js 中当前对 TypeScript 的支持是通过类型剥离实现的：Node.js 所做的就是删除与类型相关的所有语法。它从不转译任何东西。

<del> ts-node 现在已经可以结束他的使命了 </del>

ts-node 是一个用于直接执行 TypeScript 代码的 Node.js 实现，它允许开发者在不预先编译的情况下运行 TypeScript 文件。ts-node 结合了 TypeScript 编译器和 Node.js，使得开发和测试 TypeScript 代码更加便捷。

## 核心功能

- 即时编译和执行：
  ts-node 在运行时即时编译 TypeScript 代码，并将其传递给 Node.js 以执行。这避免了需要先手动编译 TypeScript 代码为 JavaScript 的步骤。

- REPL 环境：
  提供一个 REPL（Read-Eval-Print Loop）环境，可以在其中直接输入和执行 TypeScript 代码，类似于 Node.js REPL。
  
- 集成 TypeScript 配置：
  ts-node 可以读取和使用项目中的 tsconfig.json 配置文件，以确保代码按照指定的 TypeScript 编译选项执行。

## 安装

可以通过 npm 安装 ts-node：

```bash
npm install -g ts-node
```

或者在项目中本地安装：

```bash
npm install --save-dev ts-node
```

## 基本用法

- 直接运行 TypeScript 文件：

  ```bash
  ts-node src/index.ts
  ```

  这条命令会即时编译并运行 src/index.ts 文件中的 TypeScript 代码。

- 使用 REPL：

  ```bash
  ts-node
  ```

  进入 REPL 环境后，可以直接输入和执行 TypeScript 代码。

- 指定 tsconfig.json：
  如果需要使用特定的 tsconfig.json 配置文件，可以使用 --project 选项：
  ```bash
  ts-node --project tsconfig.json src/index.ts
  ```

## 配合其他工具

- 与 nodemon 配合：
  在开发过程中，可以结合 nodemon 使用 ts-node，以便在代码更改时自动重启应用：
  ```bash
  nodemon --exec ts-node src/index.ts
  ```
- 测试框架集成：

  许多测试框架（如 Mocha、Jest）都支持与 ts-node 集成，以便直接编写和运行 TypeScript 测试代码。

  mocha 配置

  ```bash
  mocha --require ts-node/register src/**/*.spec.ts
  ```

  jest.config.js 配置

  ```js
  module.exports = {
    transform: {
      "^.+\\.ts$": "ts-jest",
    },
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js"],
  };
  ```

## 性能优化
在大型项目中，运行 TypeScript 代码的性能可能会受到影响。可以使用一些选项来优化 ts-node 的性能：

- 跳过类型检查： 使用 --transpile-only 选项跳过类型检查，只进行转译：
    ```bash
    ts-node --transpile-only src/index.ts
    ```
- 启用缓存： 使用 --cache 选项启用编译结果的缓存，以加快后续运行速度：
    ```bash
    ts-node --cache src/index.ts
    ```
- 使用 swc 编译器： swc 是一个速度非常快的 TypeScript/JavaScript 编译器，可以与 ts-node 配合使用：

    首先安装 ts-node 和 @swc/core：
    ```bash
    npm install ts-node @swc/core @swc/helpers
    ```
    然后使用 ts-node 时指定 swc 作为编译器：
    ```bash
    ts-node --swc src/index.ts
    ```
## 总结

ts-node 是一个强大的工具，使开发者能够在 Node.js 环境中直接运行 TypeScript 代码，而无需预先编译。它简化了开发流程，提高了开发效率，特别适合于快速开发和测试 TypeScript 应用程序。通过结合其他工具（如 nodemon 和测试框架），ts-node 能够在开发工作流中发挥更大的作用。