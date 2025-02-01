---
title: 多运行时版本管理器 mise
---

如果你只使用 node，建议使用基于 rust 构建的 node 版本工具 [fnm](fnm.vercel.app)。个人已经使用 2 年了。

但如果你是一个多语言玩家，或者一个项目中需要多种语言。就不要使用特定语言的版本管理工具了。直接上 [mise](https://mise.jdx.dev/) 即可。

mise 通过 toml 文件保存所有的版本定义，开发者可以把该文件 Git 存储库中以便于和团队其他成员共享，从而确保每个人都使用完全相同的工具版本。

```toml
[tools]
node = '23'
python = '3'
ruby = 'latest'
```

同时它支持任务功能，可以替代 npm 或者 make 等工具。

mise 使用 Rust 语言编写。这表示它有较好的性能。

支持语言:

- Bun
- Deno
- Elixir
- Go
- Java
- Node.js
- Python
- Ruby
- Rust
- Swift
- Zig


