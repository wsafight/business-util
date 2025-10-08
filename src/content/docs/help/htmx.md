---
title: 更强大的超文本标记语言 htmx
---

# htmx - 重新定义前端开发的无JS革命

## 什么是 htmx

htmx 是一个轻量级 JavaScript 库，让你可以直接在 HTML 中使用 AJAX、CSS 过渡、WebSockets 和服务器推送事件，通过简单的 HTML 属性构建现代用户界面，结合了简单性和超文本的强大功能。

htmx 的核心理念是"**HTML即API**"，它将复杂的交互逻辑封装为声明式语法，让开发者无需编写大量 JavaScript 代码即可实现动态交互效果。

## 主要特点

- **体积小**：仅约 14KB min.gz，无外部依赖
- **代码量减少**：与 React 相比，减少了约 67% 的代码量 <mcreference link="http://m.toutiao.com/group/7524381942578528809/" index="1">1</mcreference>
- **简单易用**：通过 HTML 属性直接实现复杂交互，无需学习复杂的前端框架
- **后端友好**：完美契合 Django、Laravel、Flask 等传统后端框架的设计理念
- **可扩展性**：支持自定义功能和扩展
- **实时通信**：内置 WebSockets 和服务器发送事件 (SSE) 支持
- **兼容性**：htmx 2.0 保持与 1.x 版本 99% 的兼容性

## 安装方法

### 通过 CDN 引入

最简单的方法是通过 CDN 直接引入 htmx：

```html
<!-- 使用最新版本 -->
<script src="https://unpkg.com/htmx.org@2.0.3"></script>

<!-- 或者使用 jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.3"></script>
```

### 通过包管理器安装

使用 npm、yarn 或 pnpm 安装：

```bash
# npm
npm install htmx.org

# yarn
yarn add htmx.org

# pnpm
pnpm add htmx.org
```

然后在项目中引入：

```javascript
import htmx from 'htmx.org';
```

### 在 Spring Boot 项目中使用

通过 Maven 或 Gradle 引入 WebJars：

```xml
<!-- Maven -->
<dependency>
    <groupId>org.webjars.npm</groupId>
    <artifactId>htmx.org</artifactId>
    <version>2.0.1</version>
</dependency>
```

然后在 HTML 中引入：

```html
<script src="/webjars/htmx.org/dist/htmx.js"></script>
```

## 基础语法和核心属性

htmx 的核心是通过 `hx-*` 系列属性来增强 HTML 元素的功能。以下是最常用的一些属性：

### 请求属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `hx-get` | 发送 GET 请求 | `<button hx-get="/data">加载数据</button>` |
| `hx-post` | 发送 POST 请求 | `<form hx-post="/submit">...</form>` |
| `hx-put` | 发送 PUT 请求 | `<button hx-put="/update">更新</button>` |
| `hx-delete` | 发送 DELETE 请求 | `<button hx-delete="/remove">删除</button>` |

### 触发属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `hx-trigger` | 定义触发请求的事件 | `<input hx-trigger="keyup delay:300ms">` |
| `hx-target` | 指定更新的目标元素 | `<button hx-target="#result">加载</button>` |
| `hx-swap` | 指定如何替换内容 | `<button hx-swap="outerHTML">替换</button>` |

### 其他常用属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `hx-vals` | 提供额外的请求参数 | `<button hx-vals='{"id": 1}'>查看</button>` |
| `hx-confirm` | 显示确认对话框 | `<button hx-confirm="确定要删除吗？">删除</button>` |
| `hx-push-url` | 更新浏览器 URL | `<button hx-push-url="true">导航</button>` |
| `hx-indicator` | 显示加载指示器 | `<button hx-indicator="#spinner">加载</button>` |

## 示例代码

### 实时搜索

下面的示例展示如何使用 htmx 实现实时搜索功能：

```html
<!-- 搜索输入框 -->
<input type="text" hx-get="/search" 
       hx-trigger="keyup delay:300ms" 
       hx-target="#search-results" 
       placeholder="搜索...">

<!-- 搜索结果容器 -->
<div id="search-results"></div>
```

这段代码会在用户输入时（按键抬起 300ms 后）向 `/search` 发送 GET 请求，并将响应内容更新到 `#search-results` 元素中。

### 异步表单提交

使用 htmx 实现表单的异步提交：

```html
<form hx-post="/submit" hx-target="#form-result" hx-swap="outerHTML">
    <div>
        <label>用户名:</label>
        <input type="text" name="username" required>
    </div>
    <div>
        <label>邮箱:</label>
        <input type="email" name="email" required>
    </div>
    <button type="submit">提交</button>
</form>

<div id="form-result"></div>
```

当表单提交时，htmx 会异步发送 POST 请求到 `/submit`，并将响应替换 `#form-result` 元素的内容。

### 加载更多内容

实现"加载更多"功能：

```html
<div id="content">
    <!-- 初始内容 -->
</div>

<button hx-get="/load-more" 
        hx-target="#content" 
        hx-swap="beforeend" 
        hx-trigger="click">
    加载更多
</button>
```

点击按钮时，htmx 会从 `/load-more` 获取内容，并将其追加到 `#content` 元素的末尾。

### WebSockets 实时更新

使用 htmx 实现 WebSockets 实时通信：

```html
<div hx-ws="connect:/ws-endpoint">
    <!-- 接收 WebSocket 消息的区域 -->
    <div hx-ws="receive:message" hx-swap="beforeend"></div>
</div>

<!-- 发送消息的表单 -->
<form hx-ws="send:submit">
    <input type="text" name="message" placeholder="输入消息...">
    <button type="submit">发送</button>
</form>
```

这个示例展示了如何使用 htmx 连接 WebSocket 端点，并接收和发送消息。

## 与后端框架结合

htmx 特别适合与传统后端框架结合使用，下面是一些常见的组合方式：

### Flask + htmx

Flask 是一个轻量级的 Python Web 框架，与 htmx 结合可以快速开发动态 Web 应用：

```python
# app.py
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search')
def search():
    query = request.args.get('query', '')
    # 这里应该是实际的搜索逻辑
    results = [f'结果 {i}' for i in range(3) if query in f'结果 {i}']
    return render_template('search_results.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)
```

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Flask + htmx 示例</title>
    <script src="https://unpkg.com/htmx.org@2.0.3"></script>
</head>
<body>
    <h1>Flask + htmx 示例</h1>
    
    <input type="text" name="query" 
           hx-get="/search" 
           hx-trigger="keyup delay:300ms" 
           hx-target="#search-results" 
           placeholder="搜索...">
    
    <div id="search-results"></div>
</body>
</html>
```

```html
<!-- templates/search_results.html -->
{% if results %}
    <ul>
        {% for result in results %}
            <li>{{ result }}</li>
        {% endfor %}
    </ul>
{% else %}
    <p>没有找到结果</p>
{% endif %}
```

### Django + htmx

Django 是一个功能强大的 Python Web 框架，与 htmx 结合可以显著减少前端代码量：

```python
# views.py
from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request, 'index.html')


def load_comments(request, post_id):
    # 这里应该是实际的数据库查询
    comments = [f'评论 {i} 关于帖子 {post_id}' for i in range(3)]
    return render(request, 'comments.html', {'comments': comments})
```

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Django + htmx 示例</title>
    <script src="https://unpkg.com/htmx.org@2.0.3"></script>
</head>
<body>
    <h1>Django + htmx 示例</h1>
    
    <div>
        <h2>帖子标题</h2>
        <p>帖子内容...</p>
        
        <button hx-get="/comments/1/" 
                hx-target="#comments-container" 
                hx-swap="innerHTML">
            加载评论
        </button>
        
        <div id="comments-container"></div>
    </div>
</body>
</html>
```

```html
<!-- templates/comments.html -->
{% if comments %}
    <h3>评论：</h3>
    <ul>
        {% for comment in comments %}
            <li>{{ comment }}</li>
        {% endfor %}
    </ul>
{% else %}
    <p>暂无评论</p>
{% endif %}
```

## htmx 2.0 新特性

htmx 2.0 于 2024 年 6 月发布，带来了以下主要改进：

- **体积更小**：通过取消 IE 支持和模块化架构，将核心体积压缩至 14KB <mcreference link="http://m.toutiao.com/group/7541716731165770240/" index="4">4</mcreference>
- **性能优化**：提升了整体性能和响应速度
- **WebSockets 和 SSE 增强**：改进了 WebSockets 和服务器发送事件的实现，使其更加稳定和高效 <mcreference link="https://blog.csdn.net/gitblog_01010/article/details/144287648" index="2">2</mcreference>
- **新的扩展功能**：添加了一些新的扩展，增强了 htmx 的功能和灵活性
- **文档更新**：更新了项目的文档，使其更加详细和易于理解

## 最佳实践

### 1. 保持简单

htmx 的优势在于简单性，尽量避免过度使用复杂的属性组合。如果发现自己需要编写大量 JavaScript 代码来配合 htmx，可能是设计方式有问题。

### 2. 合理使用后端渲染

htmx 最适合的场景是"后端渲染 + 局部更新"，充分利用这一模式可以最大化开发效率。

### 3. 优化网络请求

使用 `hx-trigger` 的 `delay` 参数可以避免频繁的网络请求，特别是在搜索等场景中：

```html
<input hx-trigger="keyup delay:300ms">
```

### 4. 提供反馈

使用 `hx-indicator` 显示加载状态，提升用户体验：

```html
<div id="spinner" class="hidden">加载中...</div>
<button hx-indicator="#spinner">加载数据</button>
```

### 5. 优雅降级

确保在 JavaScript 不可用的情况下，页面仍然可以正常工作。

## 适用场景

htmx 特别适合以下场景：

- **表单密集型应用**：需要大量表单提交和验证的应用
- **内容管理系统**：需要频繁更新内容而不刷新页面的系统
- **数据展示应用**：需要动态加载和更新数据的应用
- **后端主导的项目**：团队中后端开发者较多，前端资源有限的项目
- **希望保持轻量的项目**：不希望引入大型前端框架的项目

## 不适用场景

尽管 htmx 功能强大，但它并不适合所有场景：

- **复杂的单页应用**：需要大量客户端状态管理的应用
- **高度交互的游戏**：需要复杂动画和交互的游戏
- **离线优先的应用**：需要在离线状态下大量工作的应用

## 社区和资源

htmx 拥有活跃的社区和丰富的资源：

- **GitHub 仓库**：https://github.com/bigskysoftware/htmx
- **官方文档**：https://htmx.org/docs/
- **示例库**：https://htmx.org/examples/
- **社区论坛**：https://htmx.org/discord/

## 附录

- [超媒体系统（在线阅读）](https://hypermedia.systems/book/contents/)
