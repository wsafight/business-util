---
title: 快速制作响应式邮件的框架 MJML
description: 深入解析 MJML 框架的核心特性、使用方法与最佳实践
---

## 1. MJML 框架介绍

[MJML](https://github.com/mjmlio/mjml)（Mailjet Markup Language）是一个开源的响应式电子邮件框架，专门设计用于解决传统 HTML 邮件开发中的复杂性和兼容性问题。

### 1.1 核心价值

- **简化响应式邮件开发**：通过语义化的标记语言，让开发者无需深入了解 HTML/CSS 的复杂性即可创建专业邮件
- **跨客户端兼容性**：自动处理各种邮件客户端（如 Outlook、Gmail、Apple Mail 等）的渲染差异
- **组件化开发体验**：提供丰富的内置组件库，加速邮件模板开发
- **原生响应式支持**：无需编写复杂的媒体查询，自动适配不同设备和屏幕尺寸

### 1.2 应用场景

- 营销邮件和推广活动
- 交易通知和订单确认
- 定期通讯和新闻邮件
- 企业内部通信
- 客户服务通知

## 2. 安装与基本使用

### 2.1 安装方式

#### 通过 NPM 安装

```bash
# 全局安装（作为命令行工具使用）
npm install -g mjml

# 项目内安装（作为依赖使用）
npm install mjml

# 使用 yarn 安装
yarn add mjml

# 使用 pnpm 安装
pnpm add mjml
```

#### 其他安装方式

- 直接从 [GitHub Releases](https://github.com/mjmlio/mjml/releases) 下载二进制文件
- 使用在线编辑器，无需本地安装：[MJML 在线编辑器](https://mjml.io/try-it-live)
- 集成到现有框架：如 React、Vue、Rails 等都有相应的 MJML 集成方案

### 2.2 基本使用方法

#### 命令行工具使用

```bash
# 编译 MJML 文件
mjml input.mjml -o output.html

# 实时监控文件变化并自动编译
mjml -w input.mjml -o output.html

# 输出到标准输出
mjml -s input.mjml

# 将 MJML v3 文件迁移到 v4 语法
mjml -m input.mjml
```

#### 在 Node.js 中使用

```js
import mjml2html from 'mjml';

// 基本转换
const htmlOutput = mjml2html(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>Hello World!</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`);

console.log(htmlOutput.html);

// 带选项的转换
const htmlOutputWithOptions = mjml2html(template, {
  validationLevel: 'soft', // 验证级别：'strict', 'soft' 或 'skip'
  beautify: true,          // 美化输出的 HTML
  minify: false,           // 压缩输出的 HTML
  keepComments: false      // 是否保留注释
});
```

#### 在线编辑器使用

MJML 提供了功能完善的在线编辑器，支持实时预览和语法高亮：

1. 访问 [MJML 在线编辑器](https://mjml.io/try-it-live)
2. 在左侧编辑 MJML 代码
3. 在右侧实时查看渲染效果
4. 完成后可导出为 HTML

## 3. MJML 基础结构

MJML 文档采用层次化的结构，由根元素和一系列嵌套的组件构成。

### 3.1 基本文档结构

```html
<mjml>
  <!-- 头部配置 -->
  <mj-head>
    <mj-title>邮件标题</mj-title>
    <mj-preview>邮件预览文本</mj-preview>
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto" />
    <mj-attributes>
      <mj-text font-family="Roboto, sans-serif" />
    </mj-attributes>
  </mj-head>
  
  <!-- 主体内容 -->
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello World!</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

### 3.2 结构说明

- **`<mjml>`**：根元素，包含整个邮件文档
- **`<mj-head>`**：邮件头部，包含元数据、样式定义和全局配置
  - `<mj-title>`：邮件标题，显示在邮件客户端的标题栏
  - `<mj-preview>`：邮件预览文本，在收件箱中显示
  - `<mj-font>`：引入外部字体
  - `<mj-attributes>`：定义全局属性和样式
- **`<mj-body>`**：邮件主体，包含可见内容
  - `<mj-section>`：内容区块，可包含一个或多个列
  - `<mj-column>`：内容列，可包含文本、图片、按钮等组件

## 4. 主要组件介绍

MJML 提供了丰富的内置组件，以下是最常用的核心组件：

### 4.1 基础布局组件

#### `<mj-section>`
定义邮件中的一个内容区块，相当于一个容器。

```html
<mj-section background-color="#f5f5f5" padding="20px">
  <!-- 内容列 -->
</mj-section>
```

主要属性：`background-color`、`padding`、`full-width`、`text-align`

#### `<mj-column>`
定义内容区块中的列，一个 section 可以包含多个 column。

```html
<mj-column width="50%" padding="10px">
  <!-- 内容组件 -->
</mj-column>
```

主要属性：`width`、`padding`、`background-color`

### 4.2 内容组件

#### `<mj-text>`
用于添加文本内容。

```html
<mj-text font-size="16px" color="#333" align="center">
  这是一段文本内容
</mj-text>
```

主要属性：`font-size`、`color`、`font-family`、`align`、`line-height`

#### `<mj-image>`
用于添加图片。

```html
<mj-image src="https://example.com/image.jpg" alt="示例图片" width="300px" />
```

主要属性：`src`、`alt`、`width`、`height`、`align`

#### `<mj-button>`
创建可点击的按钮。

```html
<mj-button href="https://example.com" background-color="#0070f3" color="white">
  点击查看
</mj-button>
```

主要属性：`href`、`background-color`、`color`、`font-size`、`border-radius`

#### `<mj-divider>`
添加分割线。

```html
<mj-divider border-color="#e0e0e0" border-width="2px" />
```

主要属性：`border-color`、`border-width`、`width`

### 4.3 高级组件

#### `<mj-social>`
添加社交媒体图标链接。

```html
<mj-social display="horizontal">
  <mj-social-element name="facebook" href="https://facebook.com" />
  <mj-social-element name="twitter" href="https://twitter.com" />
  <mj-social-element name="instagram" href="https://instagram.com" />
</mj-social>
```

主要属性：`display`（horizontal/vertical）、`icon-size`

#### `<mj-table>`
创建表格。

```html
<mj-table>
  <tr>
    <th>姓名</th>
    <th>职位</th>
  </tr>
  <tr>
    <td>张三</td>
    <td>工程师</td>
  </tr>
  <tr>
    <td>李四</td>
    <td>设计师</td>
  </tr>
</mj-table>
```

#### `<mj-hero>`
创建带有背景图片的英雄区域。

```html
<mj-hero mode="fluid-height" background-url="https://example.com/hero.jpg" background-width="600px" background-height="300px">
  <mj-text>英雄区域文本</mj-text>
</mj-hero>
```

## 5. 完整示例代码

### 5.1 基本通知邮件

```html
<mjml>
  <mj-head>
    <mj-title>订单确认通知</mj-title>
    <mj-preview>您的订单已确认，详情请查看邮件内容</mj-preview>
    <mj-attributes>
      <mj-text font-family="Arial, sans-serif" font-size="14px" color="#333333" />
      <mj-button background-color="#4CAF50" color="white" />
    </mj-attributes>
  </mj-head>
  
  <mj-body background-color="#f9f9f9">
    <mj-section background-color="white" padding="20px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold" align="center">订单确认</mj-text>
        <mj-divider border-color="#eeeeee" border-width="1px" margin="20px 0" />
        <mj-text>尊敬的客户：</mj-text>
        <mj-text>您的订单 #12345 已确认，我们将尽快为您发货。</mj-text>
        <mj-text>订单详情：</mj-text>
        <mj-table>
          <tr>
            <th>商品</th>
            <th>数量</th>
            <th>价格</th>
          </tr>
          <tr>
            <td>商品 A</td>
            <td>1</td>
            <td>¥99.00</td>
          </tr>
          <tr>
            <td>商品 B</td>
            <td>2</td>
            <td>¥198.00</td>
          </tr>
          <tr>
            <td colspan="2" align="right">总计：</td>
            <td>¥297.00</td>
          </tr>
        </mj-table>
        <mj-button href="https://example.com/orders/12345">查看订单详情</mj-button>
        <mj-text align="center" color="#999999" font-size="12px">
          如有疑问，请联系客服：support@example.com
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

### 5.2 营销推广邮件

```html
<mjml>
  <mj-head>
    <mj-title>限时特惠活动</mj-title>
    <mj-preview>全场商品8折起，限时3天，立即抢购！</mj-preview>
    <mj-font name="Montserrat" href="https://fonts.googleapis.com/css?family=Montserrat" />
    <mj-attributes>
      <mj-text font-family="Montserrat, sans-serif" />
      <mj-button background-color="#ff6b6b" color="white" font-weight="bold" />
    </mj-attributes>
  </mj-head>
  
  <mj-body>
    <!-- 头部横幅 -->
    <mj-section full-width="full-width" background-color="#4ecdc4">
      <mj-column>
        <mj-text color="white" align="center" font-size="16px" font-weight="bold">限时特惠活动</mj-text>
      </mj-column>
    </mj-section>
    
    <!-- 主要内容 -->
    <mj-section background-color="white">
      <mj-column>
        <mj-image src="https://example.com/promo-banner.jpg" alt="促销活动" width="100%" />
        <mj-text font-size="24px" font-weight="bold" align="center" margin="20px 0 10px 0">全场商品8折起</mj-text>
        <mj-text align="center" margin="0 0 20px 0">限时3天，立即抢购！活动截止至 2024年6月30日</mj-text>
        <mj-button href="https://example.com/promotion" width="200px" align="center">立即抢购</mj-button>
      </mj-column>
    </mj-section>
    
    <!-- 商品展示 -->
    <mj-section background-color="#f7f7f7" padding="20px">
      <mj-column width="33.33%">
        <mj-image src="https://example.com/product1.jpg" alt="商品1" width="100%" />
        <mj-text align="center" font-weight="bold">精品商品A</mj-text>
        <mj-text align="center" color="#ff6b6b">¥199.00 <span style="text-decoration: line-through; color: #999;">¥249.00</span></mj-text>
      </mj-column>
      <mj-column width="33.33%">
        <mj-image src="https://example.com/product2.jpg" alt="商品2" width="100%" />
        <mj-text align="center" font-weight="bold">精品商品B</mj-text>
        <mj-text align="center" color="#ff6b6b">¥299.00 <span style="text-decoration: line-through; color: #999;">¥399.00</span></mj-text>
      </mj-column>
      <mj-column width="33.33%">
        <mj-image src="https://example.com/product3.jpg" alt="商品3" width="100%" />
        <mj-text align="center" font-weight="bold">精品商品C</mj-text>
        <mj-text align="center" color="#ff6b6b">¥399.00 <span style="text-decoration: line-through; color: #999;">¥499.00</span></mj-text>
      </mj-column>
    </mj-section>
    
    <!-- 底部信息 -->
    <mj-section background-color="#292f36" padding="20px">
      <mj-column>
        <mj-text color="white" align="center" font-size="12px">
          © 2024 示例商城. 保留所有权利。<br />
          如不想接收此类邮件，请点击 <a href="https://example.com/unsubscribe" style="color: #4ecdc4;">取消订阅</a>
        </mj-text>
        <mj-social display="horizontal" align="center" padding="10px 0">
          <mj-social-element name="facebook" href="https://facebook.com" />
          <mj-social-element name="twitter" href="https://twitter.com" />
          <mj-social-element name="instagram" href="https://instagram.com" />
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

## 6. 开发工具与环境配置

### 6.1 编辑器支持

#### Visual Studio Code 插件

MJML 提供了 VS Code 插件，支持语法高亮、智能提示和实时预览：

1. 打开 VS Code
2. 按下 `Ctrl+Shift+X` 打开插件市场
3. 搜索 "MJML" 并安装 "vscode-mjml" 插件
4. 安装完成后，插件会自动激活，提供 MJML 文件的语法高亮和代码片段

#### 其他编辑器支持

- **Atom**：通过安装 `atom-mjml` 包获得支持
- **Sublime Text**：安装 `sublime-mjml` 包
- **WebStorm**：安装 MJML 插件

### 6.2 自动化构建

对于大型项目，可以集成 MJML 到自动化构建流程中：

```javascript
// gulpfile.js 示例
const gulp = require('gulp');
const mjml = require('gulp-mjml');
const mjmlEngine = require('mjml');
const rename = require('gulp-rename');

// 编译 MJML 文件
function compileMjml() {
  return gulp.src('./src/templates/*.mjml')
    .pipe(mjml(mjmlEngine, { validationLevel: 'soft' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('./dist'));
}

// 监控文件变化
function watchFiles() {
  gulp.watch('./src/templates/*.mjml', compileMjml);
}

exports.default = gulp.series(compileMjml, watchFiles);
```

## 7. 自定义组件开发

MJML 支持创建自定义组件，扩展框架功能：

### 7.1 创建基础组件

```javascript
// MyCustomComponent.js
import { BodyComponent } from 'mjml-core';

export default class MyCustomComponent extends BodyComponent {
  static endingTag = true;
  
  render() {
    return this.renderMJML(`
      <mj-section background-color="#f0f0f0" padding="20px">
        <mj-column>
          <mj-text font-size="18px" font-weight="bold">自定义组件内容</mj-text>
          <mj-text>${this.getContent()}</mj-text>
        </mj-column>
      </mj-section>
    `);
  }
}
```

### 7.2 注册和使用自定义组件

```javascript
// 在应用中注册组件
import { registerComponent } from 'mjml-core';
import MyCustomComponent from './MyCustomComponent';

registerComponent(MyCustomComponent);

// 在 MJML 中使用
const htmlOutput = mjml2html(`
  <mjml>
    <mj-body>
      <my-custom-component>
        这是自定义组件的内容
      </my-custom-component>
    </mj-body>
  </mjml>
`);
```

## 8. 最佳实践

### 8.1 设计与布局

- **保持简洁**：邮件设计应简洁明了，避免过多装饰元素
- **使用合适的字体**：选择网络安全字体或通过 `<mj-font>` 引入自定义字体
- **优化图片**：压缩图片并使用适当的尺寸，添加 alt 文本
- **设置回退颜色**：在使用背景图片时，同时设置背景颜色作为回退

### 8.2 代码优化

- **使用模板继承**：将常用的邮件结构抽象为基础模板
- **定义全局样式**：使用 `<mj-attributes>` 定义全局样式，保持一致性
- **避免内联样式**：尽可能使用 MJML 组件的属性而不是手动添加内联样式
- **组件复用**：创建可复用的组件，减少重复代码

### 8.3 兼容性考虑

- **测试不同客户端**：使用工具如 Litmus 或 Email on Acid 测试不同邮件客户端的显示效果
- **处理 Outlook 特殊性**：Outlook 有特殊的渲染行为，需要特别注意
- **移动优先设计**：从移动设备开始设计，然后扩展到桌面设备
- **避免 JavaScript**：大多数邮件客户端不支持 JavaScript

### 8.4 性能优化

- **减少文件大小**：删除不必要的代码和注释
- **使用 CDN**：图片和资源使用 CDN 加速
- **避免过多请求**：合并 CSS 和减少外部资源引用
- **使用缓存**：对于静态内容，考虑使用缓存策略

## 9. 常见问题与解决方案

### 9.1 显示问题

- **问题**：邮件在 Outlook 中显示不正确
  **解决方案**：检查是否使用了 Outlook 不支持的特性，使用条件注释针对 Outlook 添加特定样式

- **问题**：响应式布局在某些设备上不起作用
  **解决方案**：确保正确使用了 `<mj-section>` 和 `<mj-column>`，避免硬编码宽度

### 9.2 开发问题

- **问题**：编译速度慢
  **解决方案**：对于大型项目，考虑使用增量编译和缓存机制

- **问题**：自定义组件不生效
  **解决方案**：检查组件是否正确注册，确保类名和标签名正确对应

### 9.3 其他常见问题

- **问题**：邮件被标记为垃圾邮件
  **解决方案**：避免使用垃圾邮件触发器词汇，确保邮件内容与主题相关，添加取消订阅链接

- **问题**：邮件加载缓慢
  **解决方案**：优化图片大小，减少外部资源引用，使用延迟加载技术

## 10. 总结

MJML 框架通过提供语义化的标记语言和丰富的组件库，极大地简化了响应式电子邮件的开发过程。它的跨客户端兼容性保障机制和原生响应式支持能力，使得开发者可以专注于内容创作，而不必过多关注复杂的邮件客户端兼容性问题。

无论是简单的通知邮件还是复杂的营销活动邮件，MJML 都能提供高效的解决方案。通过结合现代开发工具和最佳实践，开发者可以快速创建专业、美观且兼容性良好的电子邮件模板，提升用户体验和邮件营销效果。