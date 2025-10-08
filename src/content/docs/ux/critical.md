---
title: 提取关键路径 CSS 工具 Critical
---

# Critical 工具技术指南

## 1. 概念介绍与核心价值

[Critical](https://github.com/addyosmani/critical) 是一个专注于前端性能优化的工具，主要用于从 HTML 页面中提取并内联**关键路径 CSS**（Critical CSS）。

**关键路径 CSS** 是指渲染首屏内容所必需的最小 CSS 样式集合。通过将这部分 CSS 内联到 HTML 的 `<head>` 标签中，可以显著提升页面的加载性能和用户体验。

**核心价值：**
- 消除首屏渲染阻塞，实现页面内容的快速展示
- 提高首屏加载速度，减少用户等待时间
- 优化关键性能指标，如 FCP (首次内容绘制) 和 LCP (最大内容绘制)
- 改善用户体验，降低页面跳出率

**典型应用场景：**
- 响应式网站的首屏性能优化
- 大型单页应用的加载性能提升
- 对首屏加载速度有严格要求的商业网站
- SEO 优化，提高页面的可访问性评分

## 2. 工作原理

Critical 工具的工作原理主要基于以下几个关键步骤：

### 2.1 页面分析

首先，Critical 会加载并分析目标 HTML 页面，识别页面的结构和样式依赖关系。这一过程包括：
- 解析 HTML 文档结构
- 识别引用的外部 CSS 文件
- 分析 DOM 元素与 CSS 选择器的匹配关系

### 2.2 关键 CSS 提取

基于页面分析结果，Critical 会提取出渲染首屏内容所必需的 CSS 样式。这一步骤主要包括：
- 确定视口大小（默认为 1300x900）
- 分析哪些 DOM 元素会在首屏可见
- 提取这些可见元素所需的 CSS 样式规则
- 移除冗余和不必要的样式

### 2.3 CSS 优化与内联

提取完成后，Critical 会对关键 CSS 进行优化并内联到 HTML 中：
- 压缩 CSS 代码，减少体积
- 将优化后的 CSS 插入到 HTML 的 `<head>` 标签内
- 对原始的外部 CSS 引用添加 `rel="preload"` 属性，实现异步加载

### 2.4 非关键 CSS 异步加载

为了确保非关键 CSS 不会阻塞页面渲染，Critical 会将原始的外部 CSS 引用转换为异步加载方式。常用的异步加载技术包括：
- 使用 `rel="preload"` 配合 `onload` 事件
- 使用 `loadCSS` 等专用的 CSS 异步加载库
- 通过 JavaScript 动态创建 `<link>` 标签加载 CSS

## 3. 安装与基本使用

### 3.1 安装

Critical 可以作为 npm 包安装到项目中：

```bash
# 全局安装
npm install -g critical

# 或者本地安装到项目
npm install critical --save-dev
```

### 3.2 基本使用方法

#### 3.2.1 命令行方式

安装完成后，可以直接通过命令行使用 Critical：

```bash
# 基本语法
critical [options] <input> [output]

# 示例：从 index.html 提取关键 CSS 并输出到 critical.css
critical index.html --output critical.css

# 示例：直接内联到 HTML 文件
critical index.html --inline --output index-critical.html

# 示例：指定视口大小
critical index.html --width 1200 --height 800 --inline --output index-critical.html
```

#### 3.2.2 Node.js API 方式

Critical 也可以通过 Node.js API 在构建脚本或自动化工作流中使用：

```javascript
const critical = require('critical');

// 异步方式
critical.generate({
  src: 'index.html',
  dest: 'index-critical.html',
  inline: true,
  width: 1300,
  height: 900
}).then(() => {
  console.log('Critical CSS 已生成并内联！');
});

// 或者使用同步方式
const { css } = critical.sync({
  src: 'index.html',
  width: 1300,
  height: 900
});
console.log('提取的关键 CSS:', css);
```

#### 3.2.3 在构建工具中集成

Critical 可以轻松集成到常见的前端构建工具中，如 webpack、gulp、grunt 等。

**webpack 集成示例：**

```javascript
// webpack.config.js
const HtmlCriticalPlugin = require('html-critical-webpack-plugin');

module.exports = {
  // ... 其他 webpack 配置
  plugins: [
    new HtmlCriticalPlugin({
      base: path.resolve(__dirname, 'dist'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: true,
      extract: true,
      width: 1300,
      height: 900,
      penthouse: {
        blockJSRequests: false,
      }
    })
  ]
};
```

**gulp 集成示例：**

```javascript
// gulpfile.js
const gulp = require('gulp');
const critical = require('critical').stream;

gulp.task('critical', () => {
  return gulp.src('dist/*.html')
    .pipe(critical({
      base: 'dist/',
      inline: true,
      css: ['dist/css/main.css'],
      width: 1300,
      height: 900
    }))
    .pipe(gulp.dest('dist'));
});
```

## 4. API 详解

### 4.1 critical.generate(options)

异步生成关键 CSS 并可选择内联到 HTML 中。

**参数：**
- `options` (Object): 配置选项对象
  - `src` (String): 源 HTML 文件路径
  - `dest` (String): 输出文件路径
  - `inline` (Boolean): 是否内联关键 CSS 到 HTML 中
  - `css` (Array): 要提取关键 CSS 的外部样式文件路径数组
  - `width` (Number): 视口宽度，默认为 1300
  - `height` (Number): 视口高度，默认为 900
  - `minify` (Boolean): 是否压缩生成的 CSS，默认为 true
  - `extract` (Boolean): 是否从 HTML 中提取链接的 CSS，默认为 false
  - `ignore` (Object): 忽略特定选择器的规则
  - `penthouse` (Object): 传递给 penthouse（底层提取库）的配置项

**返回值：** Promise，解析为生成结果对象

### 4.2 critical.sync(options)

同步方式提取关键 CSS，但不会自动内联到 HTML。

**参数：** 与 `generate` 方法相同

**返回值：** Object，包含提取的 CSS 内容和其他信息
  - `css` (String): 提取的关键 CSS 内容
  - `html` (String): 处理后的 HTML 内容（如果设置了内联）
  - `uncritical` (String): 非关键 CSS 内容（如果启用了提取）

### 4.3 critical.stream(options)

返回一个可用于流处理的转换流，适用于 gulp 等构建工具。

**参数：** 与 `generate` 方法相同

**返回值：** Transform Stream，可用于流处理管道

## 5. 实际应用场景

### 5.1 响应式网站优化

对于响应式网站，Critical 可以根据不同的视口尺寸提取相应的关键 CSS，进一步优化各种设备上的首屏加载体验。

```javascript
const critical = require('critical');

// 为移动设备提取关键 CSS
critical.generate({
  src: 'index.html',
  dest: 'mobile-critical.html',
  inline: true,
  width: 375,
  height: 667,
  penthouse: {
    forceInclude: [
      '.mobile-menu',
      '.responsive-image'
    ]
  }
});

// 为桌面设备提取关键 CSS
critical.generate({
  src: 'index.html',
  dest: 'desktop-critical.html',
  inline: true,
  width: 1920,
  height: 1080
});
```

### 5.2 大型单页应用优化

在大型单页应用中，CSS 文件往往非常庞大。使用 Critical 可以仅提取首屏所需的样式，显著提升应用的启动性能。

```javascript
const critical = require('critical');

// 配置提取选项
const criticalConfig = {
  src: 'dist/index.html',
  dest: 'dist/index.html',
  inline: true,
  width: 1300,
  height: 900,
  // 确保包含所有首屏需要的关键选择器
  penthouse: {
    forceInclude: [
      '.app-header',
      '.hero-section',
      '.main-navigation',
      /\.btn-primary/,
      /\.loading-spinner/
    ],
    // 忽略那些绝对不在首屏的样式
    blockSelector: [
      '.modal',
      '.footer',
      '.offscreen-content'
    ]
  }
};

// 执行关键 CSS 提取
critical.generate(criticalConfig).then(() => {
  console.log('SPA 关键 CSS 优化完成！');
});
```

### 5.3 多页面网站批量处理

对于多页面网站，可以批量处理所有 HTML 文件，为每个页面提取其特有的关键 CSS。

```javascript
const fs = require('fs');
const path = require('path');
const critical = require('critical');

// 获取所有 HTML 文件
const htmlFiles = fs.readdirSync('dist')
  .filter(file => file.endsWith('.html'));

// 批量处理每个 HTML 文件
async function processAllFiles() {
  for (const file of htmlFiles) {
    const inputPath = path.join('dist', file);
    const outputPath = path.join('dist', `critical-${file}`);
    
    try {
      await critical.generate({
        src: inputPath,
        dest: outputPath,
        inline: true,
        width: 1300,
        height: 900
      });
      console.log(`已处理: ${file}`);
    } catch (error) {
      console.error(`处理 ${file} 时出错:`, error);
    }
  }
}

processAllFiles().then(() => {
  console.log('所有文件处理完成！');
});
```

## 6. 高级用法与最佳实践

### 6.1 自定义视口大小

根据目标用户的设备分布，调整视口大小以提取最适合的关键 CSS。

```javascript
critical.generate({
  // ... 其他配置
  width: 1280,  // 根据 Google Analytics 数据设置最常见的设备宽度
  height: 800   // 根据 Google Analytics 数据设置最常见的设备高度
});
```

### 6.2 处理动态内容

对于包含大量动态内容的页面，可以使用 `forceInclude` 选项确保关键的动态元素样式被包含在内。

```javascript
critical.generate({
  // ... 其他配置
  penthouse: {
    forceInclude: [
      // 明确包含可能在首屏的动态类
      '.dynamic-content',
      '.user-generated-content',
      // 使用正则表达式匹配多个相关选择器
      /\.component-\w+/
    ]
  }
});
```

### 6.3 结合其他性能优化技术

Critical 工具可以与其他前端性能优化技术结合使用，获得更好的优化效果。

**与 HTTP/2 服务推送结合：**

```javascript
// 在服务器端配置（如 Express）
app.get('/', (req, res) => {
  // 推送非关键 CSS
  res.push('/css/non-critical.css', {
    status: 200,
    method: 'GET',
    request: {
      accept: 'text/css'
    },
    response: {
      'content-type': 'text/css'
    }
  }).end(fs.readFileSync('./public/css/non-critical.css'));
  
  // 发送包含内联关键 CSS 的 HTML
  res.sendFile('./public/index.html');
});
```

**与预加载和预取结合：**

```html
<!-- 在 HTML 头部 -->
<head>
  <!-- 内联关键 CSS -->
  <style>/* 关键 CSS 内容 */</style>
  
  <!-- 预加载非关键 CSS -->
  <link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  
  <!-- 预取其他页面资源 -->
  <link rel="prefetch" href="/css/other-page.css">
  <link rel="prefetch" href="/js/heavy-component.js">
</head>
```

### 6.4 自动化工作流集成

将 Critical 集成到项目的自动化构建工作流中，确保每次构建都能生成最新的关键 CSS。

**package.json 脚本示例：**

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "postbuild": "npm run critical",
    "critical": "node critical.js"
  }
}
```

**critical.js 脚本：**

```javascript
const critical = require('critical');

critical.generate({
  src: 'dist/index.html',
  dest: 'dist/index.html',
  inline: true,
  width: 1300,
  height: 900,
  minify: true
}).then(() => {
  console.log('Critical CSS 生成完成！');
});
```

### 6.5 性能监控与迭代优化

使用 Chrome DevTools、Lighthouse 等工具监控关键 CSS 优化效果，并根据实际情况进行迭代优化。

**性能监控指标：**
- 首次内容绘制 (FCP)
- 最大内容绘制 (LCP)
- 累积布局偏移 (CLS)
- 首屏加载时间
- 页面完全加载时间

## 7. 与其他方案的对比

### 7.1 与手动提取关键 CSS 对比

| 特性 | Critical 工具 | 手动提取 |
|------|-------------|---------|
| 自动化程度 | 完全自动化 | 手动操作 |
| 维护成本 | 低，自动更新 | 高，需要手动维护 |
| 精确度 | 高，基于实际渲染分析 | 依赖开发人员经验 |
| 效率 | 高，可以批量处理 | 低，逐个页面处理 |
| 学习曲线 | 低，简单配置即可使用 | 高，需要深入理解 CSS 和渲染原理 |

### 7.2 与其他关键 CSS 工具对比

| 工具 | 优势 | 劣势 |
|------|------|------|
| Critical | 成熟稳定，配置灵活，广泛使用 | 对于复杂动态页面可能需要额外配置 |
| Penthouse | 底层提取引擎，支持更多高级配置 | 仅提供核心提取功能，不包含完整工作流 |
| Google Critical CSS | 免费在线工具，简单易用 | 无法处理本地文件，有使用限制 |
| PurgeCSS | 更强大的未使用 CSS 移除功能 | 主要关注移除未使用代码，而非首屏优化 |

## 8. 常见问题与解决方案

### 8.1 提取的 CSS 不完整

**问题描述：** 提取的关键 CSS 未包含所有首屏元素样式，导致页面闪烁。

**解决方案：**
- 调整视口尺寸，确保覆盖目标设备
- 使用 `forceInclude` 选项明确包含关键选择器
- 检查是否有动态加载的 CSS 未被正确处理

```javascript
critical.generate({
  // ... 其他配置
  penthouse: {
    forceInclude: [
      '.essential-element',
      '.may-be-missed',
      /\.dynamic-class-.*/
    ],
    blockJSRequests: false  // 允许加载 JavaScript 以确保动态内容被正确处理
  }
});
```

### 8.2 内联 CSS 体积过大

**问题描述：** 提取的关键 CSS 体积过大，影响 HTML 加载性能。

**解决方案：**
- 进一步优化和压缩 CSS
- 分割首屏内容，减少必要的初始元素
- 考虑使用增量关键 CSS 技术
- 定期审核和重构 CSS 代码

```javascript
critical.generate({
  // ... 其他配置
  minify: true,  // 启用压缩
  penthouse: {
    strict: true  // 更严格地移除非关键 CSS
  }
});
```

### 8.3 处理复杂的单页应用

**问题描述：** 在复杂的单页应用中，关键 CSS 提取效果不佳。

**解决方案：**
- 使用无头浏览器预渲染应用状态
- 为不同路由生成不同的关键 CSS
- 结合应用的代码分割策略
- 考虑使用 Service Worker 进行客户端优化

## 9. 总结

Critical 工具是前端性能优化中一个非常有价值的工具，通过提取和内联关键路径 CSS，可以显著提升页面的首屏加载速度和用户体验。它的主要优势在于：

1. **简单易用**：提供了命令行、API 和构建工具集成多种使用方式，适合不同场景
2. **自动化程度高**：完全自动化的关键 CSS 提取过程，减少人工干预
3. **配置灵活**：提供丰富的配置选项，可以根据项目需求进行定制
4. **广泛兼容**：可以与各种前端框架和构建工具无缝集成

在实际项目中，Critical 工具应该作为前端性能优化策略的重要组成部分，与其他优化技术（如资源压缩、懒加载、CDN 等）结合使用，以达到最佳的优化效果。

随着 Web 性能对用户体验和业务指标的影响日益显著，掌握 Critical 等性能优化工具的使用技巧，将成为现代前端开发者的必备技能。