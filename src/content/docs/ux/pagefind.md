---
title: 静态网站搜索工具 Pagefind
description: 高性能、低带宽的静态网站搜索引擎
---

[Pagefind](https://pagefind.app/) 是一个完全静态的搜索库，旨在在大型网站上表现出色，同时使用尽可能少的用户带宽，并且无需托管任何基础设施。它与其他网站搜索工具不同，只需要当前网站静态文件的文件夹，适用于 Hugo、Eleventy、Jekyll、Next、Astro、SvelteKit 等各类网站框架。

## 核心特点

### 轻量级与高性能

- **极低的带宽消耗**：Pagefind 的搜索索引被分割成小块，浏览器中搜索时只需要加载搜索索引的一小部分
- **高效的搜索性能**：即使是拥有 10,000 个页面的网站，也可以在浏览器中进行全文搜索，总网络负载不到 300kB（包括 Pagefind 库本身）
- **针对大多数网站优化**：对于普通网站，总网络负载通常接近 100kB

### 零配置基础使用

- **简单集成**：在任何网站框架构建后运行，安装过程始终相同
- **无需服务器**：完全在客户端运行，无需额外的服务器或后端服务
- **自动索引**：自动识别和索引网站内容，大多数情况下无需配置即可开始使用

### 强大的功能支持

- **多语言网站支持**：零配置支持多语言网站
- **富过滤引擎**：适用于知识库类网站的强大过滤功能
- **自定义排序属性**：支持按照自定义属性对搜索结果进行排序
- **自定义元数据跟踪**：可以跟踪和索引自定义元数据
- **自定义内容权重**：可以为不同内容设置不同的搜索权重
- **支持页面内段落搜索**：可以返回页面特定部分的搜索结果
- **跨多域名搜索**：支持在多个域名之间进行搜索
- **灵活的索引能力**：使用 NodeJS 索引库可以索引任何内容（如 PDF、JSON 文件或字幕）

## 安装与基本使用

### 安装方法

Pagefind 可以通过 npm 或直接下载二进制文件安装：

```bash
# 使用 npm 安装
npm install pagefind --save-dev

# 或使用 yarn 安装
yarn add pagefind --dev
```

### 基本使用流程

Pagefind 的使用非常简单，只需要在网站构建后运行 Pagefind 命令即可：

#### 步骤 1：构建你的网站

首先，使用你常用的网站构建工具构建你的静态网站：

```bash
# 以 Astro 为例
npm run build
# 或直接使用 astro 命令
astro build
```

#### 步骤 2：运行 Pagefind 进行索引

网站构建完成后，运行 Pagefind 命令来索引网站内容：

```bash
# 基本语法：pagefind --site <网站构建目录>
pagefind --site dist
```

这条命令会在 `dist` 文件夹中生成一个 `pagefind` 文件夹，包含搜索索引和必要的 JavaScript 代码。

#### 步骤 3：集成到你的网站构建流程

为了方便，可以将 Pagefind 命令集成到你的网站构建流程中：

```json
// 在 package.json 中
{
  "scripts": {
    "build": "astro build && pagefind --site dist"
  }
}
```

这样，每次运行 `npm run build` 时，Pagefind 会自动为你的网站生成搜索索引。

## 在网站中添加搜索功能

Pagefind 提供了两种方式在网站中添加搜索功能：使用预构建的 UI 组件或使用 JavaScript API 自定义搜索界面。

### 使用预构建的 UI 组件

Pagefind 提供了一个无需配置的预构建 UI 组件，可以轻松集成到你的网站中：

```html
<!-- 在你的 HTML 中添加一个搜索框容器 -->
<div id="search" class="pagefind-search"></div>

<!-- 在页面底部添加 Pagefind 的 JavaScript -->
<script src="/pagefind/pagefind-ui.js"></script>
<script>
  // 初始化搜索 UI
  window.addEventListener('DOMContentLoaded', (event) => {
    new PagefindUI({
      element: "#search",
      // 可以添加更多配置选项
      showImages: false,
      excerptLength: 150
    });
  });
</script>
```

### 使用 JavaScript API 自定义搜索界面

如果你需要更多控制权，可以使用 Pagefind 的 JavaScript API 来自定义搜索界面：

```javascript
// 导入 Pagefind
import * as pagefind from '/pagefind/pagefind.js';

// 初始化搜索
const search = await pagefind.search("关键词");

// 获取结果
const results = await search.results();

// 处理结果
for (const result of results) {
  console.log("标题:", result.data.meta.title);
  console.log("URL:", result.url);
  console.log("摘要:", result.data.excerpt);
}

// 可以使用过滤功能
const filteredResults = await pagefind.search("关键词", {
  filters: {
    type: ["blog", "article"]
  }
});
```

## 配置选项

Pagefind 提供了多种配置选项，可以根据需要进行调整：

### 命令行选项

```bash
# 设置网站构建目录
pagefind --site dist

# 设置输出目录
pagefind --site dist --output-subdir pagefind

# 设置页面根 URL
pagefind --site dist --root-url https://example.com

# 设置排除的文件模式
pagefind --site dist --exclude "*.pdf,*.json"

# 设置强制包含的文件模式
pagefind --site dist --include "*.html,*.md"

# 设置调试模式
pagefind --site dist --verbose
```

### HTML 元数据配置

你可以在 HTML 中添加特定的元数据来控制 Pagefind 的索引行为：

```html
<!-- 设置页面标题 -->
<meta property="og:title" content="页面标题">

<!-- 设置页面描述 -->
<meta property="og:description" content="页面描述">

<!-- 设置页面图片 -->
<meta property="og:image" content="/image.jpg">

<!-- 设置自定义过滤字段 -->
<meta class="pagefind-filter" data-key="category" content="技术">
<meta class="pagefind-filter" data-key="tags" content="前端,JavaScript">

<!-- 设置自定义排序字段 -->
<meta class="pagefind-sort" data-key="date" content="2023-01-15">

<!-- 设置内容权重 -->
<h1 class="pagefind-weight-100">重要标题</h1>
<p class="pagefind-weight-10">次要内容</p>

<!-- 排除特定元素不被索引 -->
<div class="pagefind-ignore">不被索引的内容</div>
```

## 高级功能

### 多语言支持

Pagefind 可以自动检测和索引多语言网站：

```bash
# 自动检测多语言
pagefind --site dist

# 或手动指定语言
pagefind --site dist --language zh,en,ja
```

在预构建的 UI 中，可以添加语言切换功能：

```javascript
new PagefindUI({
  element: "#search",
  showLanguages: true,
  language: "zh"
});
```

### 自定义索引内容

对于非 HTML 内容（如 PDF、JSON 文件等），可以使用 Pagefind 的 NodeJS API 进行自定义索引：

```javascript
// 使用 NodeJS API 自定义索引
const pagefind = require("pagefind");

const { index } = await pagefind.createIndex();

// 添加自定义文档
await index.addDoc({
  url: "/custom-page",
  title: "自定义页面",
  content: "这里是页面内容...",
  language: "zh",
  filters: {
    category: "自定义"
  },
  sort: {
    date: "2023-01-15"
  }
});

// 保存索引
await index.save();
```

### 搜索结果过滤

Pagefind 提供了强大的过滤功能，可以根据自定义字段过滤搜索结果：

```javascript
// 使用 API 进行过滤搜索
const search = await pagefind.search("关键词", {
  filters: {
    category: ["技术", "教程"],
    tags: "JavaScript"
  },
  sort: {
    date: "desc"
  }
});

// 预构建 UI 中的过滤配置
new PagefindUI({
  element: "#search",
  filters: {
    category: ["所有分类", "技术", "教程", "新闻"]
  },
  sort: [
    { label: "相关度", value: "relevance" },
    { label: "最新发布", value: "date:desc" }
  ]
});
```

## 工作原理

Pagefind 的工作原理可以分为两个主要阶段：

1. **索引阶段**：
   - 扫描网站的静态文件
   - 提取和分析文本内容
   - 构建搜索索引并分割成小块
   - 生成必要的 JavaScript 代码和搜索 UI

2. **搜索阶段**：
   - 用户在浏览器中输入搜索关键词
   - 加载必要的索引块（而不是整个索引）
   - 在浏览器中执行搜索算法
   - 返回并显示相关的搜索结果

这种设计使得 Pagefind 可以在不消耗大量带宽的情况下，为大型网站提供高效的搜索功能。

## 实际应用案例

Pagefind 已经被用于许多大型网站，包括：

- **MDN 文档**：由 Pagefind 索引的 MDN 文档示例 <mcurl name="MDN by Pagefind" url="https://mdn.pagefind.app"></mcurl>
- **Godot 文档**：由 Pagefind 索引的 Godot 游戏引擎文档 <mcurl name="Godot by Pagefind" url="https://godot.pagefind.app"></mcurl>
- **XKCD 漫画**：由 Pagefind 索引的 XKCD 漫画网站 <mcurl name="XKCD by Pagefind" url="https://xkcd.pagefind.app"></mcurl>

## 与其他搜索工具的比较

与其他静态网站搜索解决方案相比，Pagefind 的主要优势在于：

- **更低的带宽消耗**：相比其他解决方案，Pagefind 对用户带宽的消耗要低得多
- **更好的大型网站支持**：能够高效处理拥有数万个页面的网站
- **零基础设施需求**：完全在客户端运行，不需要服务器或后端服务
- **丰富的功能集**：提供多语言支持、过滤、排序等高级功能
- **简单的集成过程**：与任何静态网站框架兼容，集成过程简单

对于需要在静态网站中添加搜索功能的开发者来说，Pagefind 是一个轻量、高效且功能强大的选择。

