---
title: 结构化代码搜索与替换工具 Comby
description: Comby 是一款强大的代码重写工具，用于结构化搜索和替换，支持多种编程语言
---

## 什么是 Comby

Comby 是一款功能强大的命令行工具，专门用于结构化搜索和替换代码，能够识别和处理代码中的结构化模式，实现比传统正则表达式更加灵活和精确的代码转换。它使用 OCaml 语言开发，支持几乎所有主流编程语言，特别适合复杂的代码重构和转换任务。

### 核心价值

- **结构化匹配**：不同于传统正则表达式，Comby 能够理解代码的语法结构，准确匹配嵌套表达式、注释和字符串
- **多语言支持**：支持几乎所有主流编程语言，无需为每种语言学习不同的替换语法
- **简洁的语法**：使用直观的模式语法，使得复杂的代码搜索和替换变得简单
- **批量处理**：可以一次性处理多个文件或整个项目，提高代码重构效率
- **保留代码格式**：在替换过程中保留原始代码的格式和缩进，保持代码风格一致性

## 安装 Comby

Comby 提供多种安装方式，适用于不同的操作系统环境：

### macOS 安装

使用 Homebrew 安装：
```bash
brew install comby
```

### Linux 安装

基于 Debian 的系统（如 Ubuntu）：
```bash
# 添加 PPA 仓库
sudo add-apt-repository ppa:mvdan/github-cli -y
sudo apt-get update
# 安装 comby
sudo apt-get install comby
```

基于 Arch Linux 的系统：
```bash
sudo pacman -S comby
```

### Windows 安装

使用 Scoop 包管理器安装：
```powershell
scoop install comby
```

或者从 [GitHub 发布页面](https://github.com/comby-tools/comby/releases) 下载预构建的二进制文件。

### 从源码编译

对于高级用户，可以从源码编译安装：
```bash
# 克隆仓库
git clone https://github.com/comby-tools/comby.git
cd comby
# 编译并安装
dune build @install
dune install
```

## 基本语法

Comby 的基本语法非常直观，核心是模式匹配和替换：

```bash
comby '搜索模式' '替换模式' 输入文件 [选项]
```

### 模式变量

Comby 使用 `:[变量名]` 来定义模式变量，这些变量可以匹配任意代码片段：

- `:[1]`, `:[2]`, ...：数字变量，用于在替换模式中引用匹配的内容
- `:[name]`：命名变量，可以提高代码的可读性

### 基本选项

- `-in FILE`：指定输入文件
- `-stdout`：将结果输出到标准输出
- `-matcher MATCHER`：指定匹配器类型（如 `go`、`javascript`、`python` 等）
- `-i`：忽略大小写
- `-json`：以 JSON 格式输出结果

## 基本使用示例

### 简单的变量交换

```bash
comby 'swap(:[1], :[2])' 'swap(:[2], :[1])' -stdin .js <<< 'swap(x, y)'

# 结果
------ /dev/null
++++++ /dev/null
@|-1,1 +1,1 ============================================================
-|swap(x, y)
+|swap(y, x)
```

### 去除循环中的 continue

Comby 会忽略代码中的空白字符，使匹配更加灵活：

```bash
comby 'for (:[1]) { continue; }' 'for (:[1]) { }' example.js
```

转换前：
```js
for (i = 0; i < 10; i++) {
  continue;
}
```

转换后：
```js
for (i = 0; i < 10; i++) {}
```

### 替换函数调用

将 `console.log()` 替换为自定义的日志函数：

```bash
comby 'console.log(:[args])' 'logger.info(:[args])' -matcher javascript *.js
```

## 高级功能

### 多文件批量处理

处理整个目录下的特定类型文件：

```bash
# 处理当前目录下所有 JavaScript 文件
comby 'var :[name] = :[value];' 'const :[name] = :[value];' -matcher javascript .

# 递归处理所有 JavaScript 文件
comby 'var :[name] = :[value];' 'const :[name] = :[value];' -matcher javascript -r .
```

### 条件匹配

使用 `where` 子句进行条件匹配：

```bash
# 只替换字符串字面量中的 console.log
comby 'console.log(:[args])' 'logger.info(:[args])' -where 'in_string' -matcher javascript *.js
```

### 复合模式

组合多个模式进行复杂的代码转换：

```bash
comby '{:[declarations]} function :[name](:[params]) {:[body]}' 'async function :[name](:[params]) {:[declarations] :[body]}' -matcher javascript *.js
```

### 使用配置文件

对于复杂的转换任务，可以使用 `.comby.yaml` 配置文件：

```yaml
rewrites:
  - match: 'function :[name](:[params]) {:[body]}'
    replace: 'const :[name] = (:[params]) => {:[body]}'
    matcher: 'javascript'
  - match: 'var :[name] = :[value];'
    replace: 'let :[name] = :[value];'
    matcher: 'javascript'
```

然后使用配置文件：
```bash
comby -config .comby.yaml -r .
```

## 实际应用场景

### 代码重构

Comby 非常适合进行大规模的代码重构，例如：

```bash
# 将旧的回调风格 API 转换为 Promise 风格
comby ':[fn](:[args], function(:[err], :[result]) {:[callback_body]})' ':[fn](:[args]).then(:[result] => {:[callback_body]}).catch(:[err] => {console.error(:[err])})' -matcher javascript -r .
```

### 代码迁移

在语言版本升级或框架迁移时，Comby 可以帮助自动化代码转换：

```bash
# 将 Python 2 的 print 语句转换为 Python 3 的 print 函数
comby 'print :[args]' 'print(:[args])' -matcher python -r .
```

### 代码规范化

统一项目中的代码风格和模式：

```bash
# 标准化导入语句顺序
comby 'import :[lib] from :[path];' '// 第三方库\nimport :[lib] from :[path];' -matcher javascript -r src/external
comby 'import :[lib] from :[path];' '// 项目内部模块\nimport :[lib] from :[path];' -matcher javascript -r src/internal
```

### 安全审计

查找并修复潜在的安全问题：

```bash
# 查找可能的 SQL 注入漏洞
comby 'db.query("SELECT * FROM :[table] WHERE id = "+:[user_input])' 'db.query("SELECT * FROM :[table] WHERE id = ?", [:[user_input]])' -matcher javascript -r .
```

## 与其他工具的对比

| 工具 | 优势 | 劣势 |
|------|------|------|
| Comby | 结构化匹配、多语言支持、语法简洁 | 学习曲线较正则稍高 |
| 正则表达式 | 广泛支持、简单模式下使用方便 | 难以处理嵌套结构、对代码语法不敏感 |
| sed/grep | 系统内置、轻量级 | 不支持结构化匹配、处理复杂模式困难 |
| IDE 重构工具 | 集成度高、有图形界面 | 通常仅限于特定语言、跨项目使用不便 |

## 最佳实践

1. **从小范围开始**：在处理整个项目前，先在小范围测试 Comby 命令

2. **使用版本控制**：在应用 Comby 进行大规模更改前，确保代码已提交到版本控制系统

3. **备份重要文件**：对于关键文件，可以先创建备份再进行替换

4. **组合使用选项**：灵活组合 `-matcher`、`-r`、`-in` 等选项，提高匹配精度

5. **编写可重用模式**：对于常用的转换模式，保存为配置文件以便重复使用

6. **结合其他工具**：可以与 `find`、`grep` 等命令结合使用，创建更强大的工作流

## 总结

Comby 是一款功能强大的代码搜索和替换工具，通过其独特的结构化匹配能力，使得复杂的代码重构和转换任务变得简单高效。无论是日常的代码清理、大规模的代码重构，还是跨版本的代码迁移，Comby 都能提供强大的支持。

通过掌握 Comby 的基本语法和高级功能，开发者可以显著提高代码维护和重构的效率，保持代码库的整洁和一致性。对于任何需要处理大量代码的开发者来说，Comby 都是一个不可或缺的工具。

