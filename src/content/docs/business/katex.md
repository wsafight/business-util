---
title: 网页公式排版工具 KaTeX
description: 网页公式排版工具 KaTeX
---

[KaTeX](https://github.com/KaTeX/KaTeX) 是一个面向浏览器和 Node.js 环境的高性能数学公式排版库，其版面设计基于 Donald Knuth 的 TeX 排版系统。KaTeX 以其渲染速度快、占用资源少和输出质量高而著称，特别适合在网页中实时渲染复杂的数学公式。

## 1. 为什么选择 KaTeX

在教育、科学和技术领域的前端开发中，我们经常需要在网页上展示复杂的数学公式。传统的解决方案包括：

- **图片方案**：将公式预先渲染为图片后引入，但这种方式不灵活，难以适应不同的显示设备和分辨率
- **MathJax**：功能全面但体积较大，渲染速度相对较慢
- **服务器端渲染**：增加服务器负担，无法实时交互

相比之下，KaTeX 具有以下显著优势：

- **极高的渲染速度**：比其他解决方案快得多，几乎可以实现即时渲染
- **轻量级**：核心库体积小，加载迅速
- **高质量输出**：使用与 TeX 相同的排版算法，确保数学公式的专业外观
- **服务端渲染支持**：可用于 Node.js 环境进行预渲染
- **自动换行**：支持长公式的自动换行功能
- **响应式设计**：生成的公式可以适应不同屏幕尺寸

## 2. 安装与基本使用

### 2.1 安装方法

KaTeX 提供多种安装和使用方式，适应不同的项目需求：

#### 2.1.1 通过 CDN 使用

最简单的方法是直接通过 CDN 引入 KaTeX 的 CSS 和 JavaScript 文件：

```html
<!-- 引入 KaTeX 的样式文件 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">

<!-- 引入 KaTeX 的核心脚本 -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>

<!-- 可选：引入自动渲染脚本 -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js"></script>
```

#### 2.1.2 通过 NPM 安装

对于现代前端项目，可以使用 NPM 或 Yarn 安装 KaTeX：

```bash
# 使用 npm
npm install katex

# 使用 yarn
yarn add katex
```

然后在项目中导入：

```javascript
// 导入 KaTeX 的样式
import 'katex/dist/katex.min.css';

// 导入 KaTeX 核心模块
import katex from 'katex';

// 可选：导入自动渲染模块
import renderMathInElement from 'katex/contrib/auto-render';
```

### 2.2 基本使用示例

#### 2.2.1 手动渲染单个公式

使用 `katex.render()` 方法可以手动渲染单个数学公式：

```html
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KaTeX 基础示例</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>
</head>
<body>
    <div id="formula-container"></div>
    
    <script>
        // 获取容器元素
        const container = document.getElementById('formula-container');
        
        // 渲染数学公式
        katex.render("c = \pm\sqrt{a^2 + b^2}", container, {
            throwOnError: false, // 遇到错误时不抛出异常
            displayMode: true    // 以块级元素模式渲染
        });
    </script>
</body>
</html>
```

#### 2.2.2 自动渲染页面中的所有公式

使用 `auto-render` 扩展可以自动识别并渲染页面中的所有数学公式：

```html
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KaTeX 自动渲染示例</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js"></script>
</head>
<body>
    <p>勾股定理可以表示为：$a^2 + b^2 = c^2$</p>
    
    <p>以下是一个复杂的数学公式：</p>
    <p>$$\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$</p>
    
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},  // 块级公式
                    {left: "$", right: "$", display: false}    // 行内公式
                ]
            });
        });
    </script>
</body>
</html>
```

## 3. 核心 API 详解

KaTeX 提供了一系列 API 来满足不同场景下的公式渲染需求。以下是最常用的核心 API：

### 3.1 katex.render()

```javascript
katex.render(formula, element, options)
```

- **参数说明**：
  - `formula`：要渲染的 LaTeX 公式字符串
  - `element`：公式渲染的目标 DOM 元素
  - `options`：可选的配置对象
- **返回值**：无
- **功能**：将 LaTeX 公式渲染到指定的 DOM 元素中

### 3.2 katex.renderToString()

```javascript
const html = katex.renderToString(formula, options)
```

- **参数说明**：
  - `formula`：要渲染的 LaTeX 公式字符串
  - `options`：可选的配置对象
- **返回值**：包含渲染后公式的 HTML 字符串
- **功能**：将 LaTeX 公式渲染为 HTML 字符串，适用于服务端渲染或需要手动控制 DOM 的场景

### 3.3 renderMathInElement()

```javascript
renderMathInElement(element, options)
```

- **参数说明**：
  - `element`：要搜索并渲染公式的根 DOM 元素
  - `options`：可选的配置对象
- **返回值**：无
- **功能**：自动搜索并渲染指定 DOM 元素内的所有数学公式

### 3.4 配置选项

KaTeX 提供了多种配置选项来定制渲染行为：

| 选项 | 类型 | 默认值 | 描述 |
|-----|------|-------|------|
| `displayMode` | Boolean | false | 是否以块级元素模式渲染 |
| `throwOnError` | Boolean | true | 遇到无法识别的命令时是否抛出异常 |
| `errorColor` | String | '#cc0000' | 错误公式的颜色 |
| `strict` | Boolean/String | 'warn' | 严格模式设置，可选值：true, false, 'ignore', 'warn' |
| `trust` | Boolean | false | 是否信任输入的 LaTeX 代码（允许潜在不安全的命令） |
| `output` | String | 'htmlAndMathml' | 输出格式，可选值：'html', 'mathml', 'htmlAndMathml' |

## 4. 常用公式示例

以下是一些常见的数学公式及其在 KaTeX 中的表示方法：

### 4.1 基本运算

| 公式描述 | LaTeX 代码 | 渲染结果 |
|---------|-----------|---------|
| 平方根 | `\sqrt{a^2 + b^2}` | √(a² + b²) |
| n 次方根 | `\sqrt[n]{x}` | xⁿ√ |
| 分数 | `\frac{a}{b}` | a/b |
| 求和 | `\sum_{i=1}^{n} i` | ∑ⁿᵢ₌₁ i |
| 乘积 | `\prod_{i=1}^{n} i` | ∏ⁿᵢ₌₁ i |
| 极限 | `\lim_{x \to \infty} f(x)` | limₓ→∞ f(x) |
| 积分 | `\int_{a}^{b} f(x) dx` | ∫ᵇₐ f(x) dx |
| 偏导数 | `\frac{\partial f}{\partial x}` | ∂f/∂x |

### 4.2 常用符号

| 符号名称 | LaTeX 代码 | 渲染结果 |
|---------|-----------|---------|
| 希腊字母 | `\alpha`, `\beta`, `\gamma`, `\delta` | α, β, γ, δ |
| 箭头 | `\rightarrow`, `\Rightarrow`, `\leftrightarrow` | →, ⇒, ↔ |
| 逻辑符号 | `\forall`, `\exists`, `\in`, `\subset` | ∀, ∃, ∈, ⊂ |
| 运算符 | `\pm`, `\mp`, `\times`, `\div` | ±, ∓, ×, ÷ |
| 比较符号 | `\leq`, `\geq`, `\neq`, `\approx` | ≤, ≥, ≠, ≈ |

### 4.3 矩阵和行列式

```latex
\begin{pmatrix} a & b \\ c & d \end{pmatrix}
```

渲染结果：

(a b
c d)

```latex
\begin{vmatrix} a & b \\ c & d \end{vmatrix}
```

渲染结果：

|a b|
|c d|

### 4.4 方程组

```latex
\begin{cases}
  x + y = 5 \\
  2x - y = 1
\end{cases}
```

渲染结果：

{x + y = 5
2x - y = 1}

## 5. 高级功能

### 5.1 支持的扩展包

KaTeX 支持多种扩展包来增强其功能：

#### 5.1.1 mhchem - 化学公式支持

```html
<!-- 引入 mhchem 扩展 -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/mhchem.min.js"></script>
```

使用示例：

```latex
\ce{H2O + CO2 -> H2CO3}
```

渲染结果：H₂O + CO₂ → H₂CO₃

#### 5.1.2 copy-tex - 复制公式支持

```html
<!-- 引入 copy-tex 扩展 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/copy-tex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/copy-tex.min.js"></script>
```

这个扩展允许用户复制渲染后的公式时，同时复制对应的 LaTeX 代码。

#### 5.1.3 render-a11y-string - 无障碍支持

```html
<!-- 引入 render-a11y-string 扩展 -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/render-a11y-string.min.js"></script>
```

这个扩展为公式添加无障碍文本描述，提高视障用户的可访问性。

### 5.2 自定义宏

KaTeX 允许定义自定义宏，以简化重复使用的复杂表达式：

```javascript
katex.render("\\myMacro", element, {
    macros: {
        "\\myMacro": "\\frac{1}{2} x^2 + c"
    }
});
```

### 5.3 自定义颜色

可以使用 `\color{color}{expression}` 命令为公式的特定部分设置颜色：

```latex
\color{red}{x^2} + \color{blue}{y^2} = \color{green}{r^2}
```

## 6. 框架集成

KaTeX 可以与各种前端框架和工具集成，以下是一些常见的集成示例：

### 6.1 React 集成

```javascript
import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function KatexFormula({ formula, displayMode = false }) {
  const [html, setHtml] = React.useState('');
  
  React.useEffect(() => {
    try {
      const renderedHtml = katex.renderToString(formula, {
        displayMode,
        throwOnError: false
      });
      setHtml(renderedHtml);
    } catch (error) {
      console.error('Error rendering formula:', error);
      setHtml(formula);
    }
  }, [formula, displayMode]);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

// 使用示例
function App() {
  return (
    <div>
      <h1>React KaTeX 示例</h1>
      <p>行内公式：<KatexFormula formula="a^2 + b^2 = c^2" /></p>
      <p>块级公式：</p>
      <KatexFormula formula="\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}" displayMode={true} />
    </div>
  );
}
```

### 6.2 Vue 集成

```vue
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'KaTeX',
  props: {
    formula: {
      type: String,
      required: true
    },
    displayMode: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.renderFormula();
  },
  watch: {
    formula() {
      this.renderFormula();
    },
    displayMode() {
      this.renderFormula();
    }
  },
  methods: {
    renderFormula() {
      try {
        katex.render(this.formula, this.$el, {
          displayMode: this.displayMode,
          throwOnError: false
        });
      } catch (error) {
        console.error('Error rendering formula:', error);
        this.$el.textContent = this.formula;
      }
    }
  }
};
</script>

<!-- 使用示例 -->
<template>
  <div>
    <h1>Vue KaTeX 示例</h1>
    <p>行内公式：<katex :formula="'a^2 + b^2 = c^2'" /></p>
    <p>块级公式：</p>
    <katex :formula="'\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}'" :display-mode="true" />
  </div>
</template>

<script>
import KaTeX from './components/KaTeX.vue';

export default {
  components: {
    KaTeX
  }
};
</script>
```

### 6.3 Markdown 集成

KaTeX 可以与 Markdown 解析器集成，实现 Markdown 文档中的公式渲染：

#### 6.3.1 与 Markdown-it 集成

```javascript
const MarkdownIt = require('markdown-it');
const markdownItKatex = require('markdown-it-katex');

const md = new MarkdownIt();
md.use(markdownItKatex);

const markdown = `# 数学公式示例

行内公式：$E = mc^2$

块级公式：

$$\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
`;

const html = md.render(markdown);
console.log(html);
```

#### 6.3.2 与 Remark 集成

```javascript
const remark = require('remark');
const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');
const remarkRehype = require('remark-rehype');
const rehypeStringify = require('rehype-stringify');

async function processMarkdown(markdown) {
  const result = await remark()
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

// 使用示例
const markdown = `# 数学公式示例

行内公式：$E = mc^2$

块级公式：

$$\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
`;

processMarkdown(markdown).then(html => {
  console.log(html);
});
```

## 7. 服务端渲染

KaTeX 也支持在 Node.js 环境中进行服务端渲染，这对于需要预渲染公式或生成静态网站的场景非常有用：

```javascript
const katex = require('katex');
const fs = require('fs');
const path = require('path');

// 读取 KaTeX 样式文件
const katexCSS = fs.readFileSync(path.resolve(__dirname, 'node_modules/katex/dist/katex.min.css'), 'utf8');

// 渲染公式
const formula = "c = \\pm\\sqrt{a^2 + b^2}";
const html = katex.renderToString(formula, {
  displayMode: true,
  throwOnError: false
});

// 生成完整的 HTML 页面
const completeHTML = `
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KaTeX 服务端渲染示例</title>
    <style>${katexCSS}</style>
</head>
<body>
    <h1>服务端渲染的公式</h1>
    <div>${html}</div>
</body>
</html>
`;

// 写入文件
fs.writeFileSync('katex-server-rendered.html', completeHTML);
console.log('HTML 文件已生成');
```

## 8. 最佳实践

### 8.1 性能优化

1. **使用适当的引入方式**：对于简单页面，使用 CDN 引入；对于复杂项目，使用 NPM 安装并按需导入
2. **延迟加载**：如果页面中有大量公式，可以考虑延迟加载 KaTeX 脚本
3. **避免频繁重渲染**：尽量避免在用户交互过程中频繁重新渲染公式
4. **使用服务端渲染**：对于静态内容，可以考虑在服务端预渲染公式

```javascript
// 延迟加载 KaTeX 示例
function loadKaTeX(callback) {
  if (window.katex) {
    callback();
    return;
  }
  
  // 动态创建 CSS 链接
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css';
  document.head.appendChild(link);
  
  // 动态创建脚本
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js';
  script.onload = function() {
    callback();
  };
  document.body.appendChild(script);
}

// 使用延迟加载的 KaTeX
loadKaTeX(function() {
  // 现在可以安全地使用 katex 对象
  katex.render("E = mc^2", document.getElementById('formula'), {
    throwOnError: false
  });
});
```

### 8.2 错误处理

1. **设置 `throwOnError: false`**：在生产环境中，避免因公式错误导致整个应用崩溃
2. **提供回退方案**：当公式渲染失败时，显示原始的 LaTeX 代码
3. **添加错误提示**：对于重要的公式，可以添加视觉提示或日志记录错误

```javascript
function safeRenderFormula(formula, element, options = {}) {
  const defaultOptions = {
    throwOnError: false,
    errorColor: '#cc0000'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    katex.render(formula, element, mergedOptions);
    return true;
  } catch (error) {
    console.error('KaTeX 渲染错误:', error);
    // 显示原始公式作为回退
    element.textContent = formula;
    element.classList.add('katex-error');
    return false;
  }
}
```

### 8.3 可访问性考虑

1. **添加描述**：为复杂公式添加文本描述，帮助视障用户理解
2. **使用语义化标签**：将公式放在适当的语义化标签中
3. **设置 aria 属性**：为公式容器添加适当的 ARIA 属性

```html
<div class="formula-container" role="math" aria-label="勾股定理：a的平方加b的平方等于c的平方">
  <!-- KaTeX 渲染的公式将插入这里 -->
</div>

<script>
  const container = document.querySelector('.formula-container');
  katex.render("a^2 + b^2 = c^2", container);
</script>
```

## 9. 常见问题与解决方案

### 9.1 公式显示不完整或有错误

**问题描述**：某些复杂公式可能无法正确渲染，或者显示不完整。

**解决方法**：
- 检查 LaTeX 语法是否正确
- 确认是否使用了 KaTeX 支持的命令（部分高级 LaTeX 命令可能不受支持）
- 尝试简化公式或分成多个小公式
- 更新到最新版本的 KaTeX

### 9.2 公式渲染速度慢

**问题描述**：页面中有大量公式时，渲染速度可能会变慢。

**解决方法**：
- 使用延迟加载技术
- 考虑服务端预渲染
- 对于非关键公式，可以使用图片作为替代
- 避免不必要的重渲染

### 9.3 公式与页面样式冲突

**问题描述**：KaTeX 的样式可能与页面的其他样式发生冲突。

**解决方法**：
- 使用较新版本的 KaTeX，其样式隔离更好
- 在引入 KaTeX CSS 之前引入页面的基础样式
- 使用 CSS 命名空间或更具体的选择器来避免冲突
- 如有必要，自定义 KaTeX 的样式覆盖默认样式

### 9.4 移动端显示问题

**问题描述**：在移动设备上，公式可能显示过大或难以阅读。

**解决方法**：
- 使用响应式设计原则调整公式大小
- 为移动设备添加特定的 CSS 规则
- 考虑在小屏幕上使用简化版本的公式
- 启用 KaTeX 的自动换行功能

## 10. 总结与资源

KaTeX 是一个功能强大、性能优异的数学公式排版库，特别适合在网页环境中使用。它不仅提供了高质量的公式渲染能力，还支持多种扩展和框架集成，使其成为教育、科学和技术领域前端开发的理想选择。

### 10.1 官方资源

- **官方网站**：[KaTeX.org](https://katex.org/)
- **GitHub 仓库**：[github.com/KaTeX/KaTeX](https://github.com/KaTeX/KaTeX)
- **官方文档**：[KaTeX Documentation](https://katex.org/docs/)
- **支持的函数列表**：[Supported Functions](https://katex.org/docs/supported.html)

### 10.2 学习资源

- **LaTeX 数学公式语法指南**：学习 LaTeX 数学公式的基本语法
- **在线公式编辑器**：[Wiris MathType](https://demo.wiris.com/mathtype/en/developers.php) - 可视化编辑公式并导出 LaTeX 代码
- **KaTeX 在线演示**：[KaTeX Live](https://katex.org/live/) - 实时预览 LaTeX 公式的渲染效果

### 10.3 相关工具

- **LaTeX.js**：[LaTeX.js](https://github.com/michael-brade/LaTeX.js) - 将完整的 LaTeX 文档转换为 HTML
- **MathLive**：[MathLive](https://cortexjs.io/mathlive/) - 交互式数学公式编辑器，支持 KaTeX 渲染
- **MathJax**：如果需要支持更多 LaTeX 命令，可以考虑使用 [MathJax](https://www.mathjax.org/)，虽然它体积更大但支持更全面

通过合理使用 KaTeX，你可以在网页中轻松展示专业、美观的数学公式，为用户提供更好的阅读和学习体验。

