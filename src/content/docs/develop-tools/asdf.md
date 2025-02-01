---
title: 多运行时版本管理器 asdf
---

如果你只使用 node，建议使用基于 rust 构建的 node 版本工具 [fnm](fnm.vercel.app)。个人已经使用 2 年了。

但如果你是一个多语言玩家，或者一个项目中需要多种语言。就不要使用特定语言的版本管理工具了。直接上 [asdf](https://asdf-vm.com/) 即可。

asdf 通过一个文件 .tool-versions 保存所有的版本定义，开发者可以把该文件 Git 存储库中以便于和团队其他成员共享，从而确保每个人都使用完全相同的工具版本。

asdf 本身是 go 语言编写，但是不同的运行时管理都通过 Shell 脚本来处理。

目前官方支持如下语言：

- Node.js
- Ruby
- Erlang
- Elixir

社区包含诸多语言

- Python
- Golang
- Zig
- Php
- Deno
- Rust
- (...)[https://github.com/asdf-community]


以下命令对比 fnm 

### 安装

fnm

```bash
# 安装 node 某一版本
fnm install 23.7.0
```

asdf

```bash
# asdf install <name> <version>
asdf install nodejs 23.7.0

```

### 使用

fnm

```bash
# 使用当前目录中定义的本地版本的 Node
fnm use 23.7.0

# 设置默认 node 版本
fnm default 23.7.0
```

asdf

```bash
# 设置软件包会话版本
# 为当前 shell 会话将版本设置为一个名为 ASDF_${LANG}_VERSION 的环境变量
asdf shell nodejs  23.7.0

# 设置软件包全局版本
# 将版本写到 $HOME/.tool-versions 文件中
asdf global nodejs  23.7.0

# 将版本写到 $PWD/.tool-versions 文件中，如果有需要也会创建此文件。
asdf local nodejs  23.7.0
```

### 查看当前版本

fnm

```bash
fnm current
# v23.7.0
```

asdf

```bash
asdf current
# asdf current
# erlang          17.3          /Users/kim/.tool-versions
# nodejs          6.11.5        /Users/kim/cool-node-project/.tool-versions
```

### 卸载版本

fnm

```bash
fnm uninstall 23.6.1
```

asdf

```bash
# asdf uninstall <name> <version>
asdf uninstall nodejs 23.6.1
```