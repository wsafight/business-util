---
title: 代码行数统计工具 cloc
description: cloc 是一款强大的开源代码统计工具，用于精确统计项目中的代码行数、注释行数和空行数
---

## 什么是 cloc

cloc（Count Lines of Code）是一款功能强大的开源命令行工具，专门用于统计源代码文件中的代码行数、注释行数和空行数。它使用Perl语言开发，支持多平台使用（Windows、Linux、macOS等）和超过300种编程语言的识别，可以帮助开发者快速了解项目规模、代码组成和质量。

### 核心价值

- **精确统计**：区分代码行、注释行和空行，提供准确的项目规模评估
- **多语言支持**：支持超过300种编程语言，适应各种技术栈的项目
- **灵活配置**：提供丰富的参数选项，满足不同场景的统计需求
- **跨平台兼容**：可在Windows、Linux、macOS等主流操作系统上运行
- **高效分析**：支持分析单个文件、整个目录、压缩文件甚至版本控制工具中的代码

## 安装 cloc

cloc 提供多种安装方式，适用于不同的操作系统环境：

### npm 全局安装

```bash
npm install -g cloc
```

### Linux 系统

基于 Debian 的系统（如 Ubuntu）：
```bash
sudo apt-get update
sudo apt-get install cloc
```

基于 Red Hat 的系统（如 Fedora）：
```bash
sudo yum install cloc
```

基于 Arch Linux 的系统：
```bash
sudo pacman -S cloc
```

### macOS 系统

使用 Homebrew 安装：
```bash
brew install cloc
```

使用 MacPorts 安装：
```bash
sudo port install cloc
```

### Windows 系统

方法一：使用 Chocolatey 包管理器安装
```bash
choco install cloc
```

方法二：直接下载可执行文件
1. 访问 [cloc GitHub 发布页面](https://github.com/AlDanial/cloc/releases)
2. 下载最新版本的 `cloc-xxx.exe` 文件
3. 重命名为 `cloc.exe` 并放置在系统 PATH 环境变量包含的目录中（如 `C:\Windows\System32`）

## 基本使用方法

### 统计当前目录的代码行数

最简单的用法是在项目根目录下执行以下命令：

```bash
cloc .
```

执行后，cloc 会分析当前目录及其子目录中的所有文件，并生成统计报告。

![cloc png](./cloc.png)

### 统计指定文件或目录

```bash
# 统计单个文件
cloc example.js

# 统计多个文件
cloc file1.py file2.py

# 统计指定目录
cloc ./src
```

### 统计压缩文件中的代码

cloc 支持直接分析压缩文件，无需解压：

```bash
cloc project.zip
cloc source.tar.gz
```

## 常用参数详解

cloc 提供了丰富的命令行参数，以下是一些常用的选项：

### 排除特定目录

```bash
# 排除单个目录
cloc . --exclude-dir=node_modules

# 排除多个目录（用逗号分隔）
cloc . --exclude-dir=node_modules,build,dist
```

### 按文件统计

显示每个文件的详细统计信息：

```bash
cloc --by-file .
```

### 显示百分比信息

将空白行和注释行显示为相对于代码行的百分比：

```bash
cloc --by-percent c .
```

### 指定编程语言

只统计特定的编程语言：

```bash
# 只统计 JavaScript 和 Python 文件
cloc . --lang=javascript,python
```

### 自定义文件扩展名

当 cloc 无法识别某些文件类型时，可以手动指定：

```bash
cloc . --include-ext=xyz --force-lang=xyz,Python
```

## 高级用法

### 代码差异比较

比较两个版本的代码，统计新增、修改和删除的行数：

```bash
cloc --diff old_version/ new_version/
```

### 自定义输出格式

cloc 支持多种输出格式，包括：

```bash
# CSV 格式输出
cloc --csv . > report.csv

# JSON 格式输出
cloc --json . > report.json

# XML 格式输出
cloc --xml . > report.xml
```

### 过滤特定文件

使用正则表达式过滤文件：

```bash
# 只统计以 .test.js 结尾的文件
cloc --match-f='\.test\.js$' .

# 排除所有以 .min.js 结尾的文件
cloc --not-match-f='\.min\.js$' .
```

## 输出结果解释

执行 cloc 命令后，会生成类似如下的统计报告：

```
     15 text files.
     15 unique files.
      0 files ignored.

-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
JavaScript                     8            120             80            450
HTML                           3             15              5            120
CSS                            4             20             10             80
-------------------------------------------------------------------------------
SUM:                          15            155             95            650
-------------------------------------------------------------------------------
```

报告各列的含义：

- **Language**：编程语言类型
- **files**：该语言的文件数量
- **blank**：空行数
- **comment**：注释行数
- **code**：实际代码行数

## cloc 在项目管理中的应用

cloc 不仅是一个简单的代码统计工具，还可以在项目管理中发挥重要作用：

### 项目规模评估

通过统计代码行数，可以快速了解项目的整体规模和复杂度，为项目规划和资源分配提供参考。

### 开发进度跟踪

定期使用 cloc 统计代码量变化，可以量化团队的开发进度，评估工作效率。

### 代码质量分析

通过分析代码行与注释行的比例，可以在一定程度上评估代码的可读性和可维护性。良好的代码通常有适当的注释比例。

### 代码重构评估

在进行代码重构前后使用 cloc 统计，可以评估重构的效果，如代码量减少、注释比例提高等。

## 使用示例

### 示例1：分析前端项目

```bash
# 分析前端项目，排除第三方依赖
cloc . --exclude-dir=node_modules,dist,build
```

### 示例2：比较两个版本的API变化

```bash
# 比较v1和v2版本的API接口代码变化
cloc --diff api/v1 api/v2
```

### 示例3：生成详细的项目报告

```bash
# 生成包含百分比和按文件统计的详细报告，并导出为CSV
cloc --by-file --by-percent c . --csv > project_report.csv
```

## 最佳实践

1. **合理排除第三方代码**：在统计项目代码时，应排除 node_modules、vendor 等第三方依赖目录，以获得更准确的项目自身代码量

2. **定期统计跟踪**：可以将 cloc 集成到 CI/CD 流程中，定期生成代码统计报告，跟踪项目发展趋势

3. **结合其他指标**：代码行数只是评估项目的一个维度，应结合复杂度、bug率、测试覆盖率等其他指标综合评估

4. **注意代码质量**：不要单纯追求代码行数的增加，更应关注代码质量和可维护性

## 总结

cloc 是一款功能强大、灵活易用的代码统计工具，通过提供精确的代码行数统计，可以帮助开发团队更好地了解项目规模、跟踪开发进度和评估代码质量。无论是小型个人项目还是大型企业级应用，cloc 都能提供有价值的统计信息，为项目管理和决策提供数据支持。

通过掌握 cloc 的基本用法和高级功能，开发者可以更有效地利用这一工具，提升项目管理水平和代码质量。
