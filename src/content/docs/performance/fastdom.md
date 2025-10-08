---
title: 通过批处理避免布局抖动 FastDom
---

# FastDom 技术指南

## 1. 概念介绍与核心价值

FastDom 是一个专注于解决浏览器布局抖动（Layout Thrashing）问题的轻量级前端性能优化库。它由 Wilson Page 创建并开源，旨在通过智能批处理 DOM 读写操作，显著提升 Web 应用的渲染性能和流畅度。

**核心价值：**
- 消除频繁 DOM 读写操作引起的布局抖动
- 提高动画和交互的流畅度，实现更接近 60FPS 的体验
- 作为应用程序/库和 DOM 之间的抽象层，协调 DOM 访问
- 通过批处理读写操作减少不必要的浏览器回流（Reflow）

## 2. 工作原理

### 2.1 浏览器渲染流程与布局抖动问题

要理解 FastDom 的工作原理，首先需要了解浏览器的基本渲染流程：

1. 处理 HTML 标记并构建 DOM 树
2. 处理 CSS 标记并构建 CSSOM 树
3. 将 DOM 与 CSSOM 合并成一个渲染树（Render Tree）
4. 根据渲染树进行布局（Layout/Reflow），计算每个节点的几何信息
5. 将各个节点绘制（Paint）到屏幕上

**布局抖动（Layout Thrashing）** 发生在 JavaScript 代码交替执行 DOM 读取操作（如 `offsetWidth`、`clientHeight`、`getComputedStyle`）和写入操作（如修改元素样式、添加/删除元素）时。每次读取操作会强制浏览器重新计算布局，导致性能下降。

### 2.2 FastDom 的读写分离策略

FastDom 通过以下核心策略解决布局抖动问题：

- **批处理读写操作**：将所有 DOM 读取操作和写入操作分别收集到两个队列中
- **统一调度执行**：利用 `window.requestAnimationFrame()` 在每一帧的适当时机统一执行所有读取操作，然后再统一执行所有写入操作
- **读写顺序保证**：确保所有读取操作在写入操作之前执行，避免重复布局计算
- **单例模式**：在整个应用程序范围内协调 DOM 访问，确保最优性能

## 3. 安装与基本使用

### 3.1 安装

可以通过 npm 或 yarn 安装 FastDom：

```bash
# 使用 npm
npm install fastdom

# 使用 yarn
yarn add fastdom
```

### 3.2 基本用法

#### 3.2.1 引入与实例化

```javascript
// ES Module 方式引入
import fastdom from 'fastdom';

// CommonJS 方式引入
const fastdom = require('fastdom');
```

FastDom 默认使用单例模式，无需手动实例化，直接使用导入的 `fastdom` 对象即可。

#### 3.2.2 基本读写操作

```javascript
// 执行读取操作
fastdom.measure(() => {
  const width = element.offsetWidth;
  console.log('元素宽度:', width);
});

// 执行写入操作
fastdom.mutate(() => {
  element.style.width = '300px';
});
```

#### 3.2.3 链式调用

```javascript
fastdom
  .measure(() => {
    // 读取操作
    this.width = element.offsetWidth;
  })
  .mutate(() => {
    // 写入操作，依赖于前面的读取结果
    element.style.width = (this.width * 2) + 'px';
  });
```

## 4. API 详解

### 4.1 核心方法

#### 4.1.1 fastdom.measure(callback)

安排一个 DOM 读取操作，将回调函数添加到读取队列中。

- **参数**：`callback` - 包含 DOM 读取操作的函数
- **返回值**：返回 fastdom 实例，支持链式调用

#### 4.1.2 fastdom.mutate(callback)

安排一个 DOM 写入操作，将回调函数添加到写入队列中。

- **参数**：`callback` - 包含 DOM 写入操作的函数
- **返回值**：返回 fastdom 实例，支持链式调用

#### 4.1.3 fastdom.clear()

清空所有待执行的读取和写入队列。

- **返回值**：返回 fastdom 实例

#### 4.1.4 fastdom.throttle(callback)

创建一个被 FastDom 节流的函数，确保函数内的 DOM 操作被正确批处理。

- **参数**：`callback` - 要被节流的函数
- **返回值**：返回一个新的被节流的函数

### 4.2 高级方法

#### 4.2.1 fastdom.extend(decorator)

扩展 FastDom 实例，添加自定义功能。

- **参数**：`decorator` - 装饰器函数，接收 fastdom 实例作为参数
- **返回值**：返回被扩展的 fastdom 实例

#### 4.2.2 fastdom.createInstance()

创建一个新的独立的 FastDom 实例，而不是使用默认单例。

- **返回值**：返回一个新的 FastDom 实例

## 5. 实际应用场景

### 5.1 高频动画优化

在处理需要频繁更新 DOM 的动画时，FastDom 可以显著提升性能：

```javascript
function animate(element) {
  fastdom.measure(() => {
    const currentWidth = element.offsetWidth;
    const targetWidth = 400;
    const progress = (currentWidth / targetWidth) * 100;
    
    fastdom.mutate(() => {
      element.style.width = progress < 100 ? (currentWidth + 5) + 'px' : targetWidth + 'px';
      
      if (progress < 100) {
        requestAnimationFrame(() => animate(element));
      }
    });
  });
}
```

### 5.2 列表渲染优化

在渲染大量列表项时，FastDom 可以有效避免布局抖动：

```javascript
function renderList(items) {
  const container = document.getElementById('list-container');
  
  // 先读取容器的当前状态
  fastdom.measure(() => {
    const containerWidth = container.offsetWidth;
    
    // 再执行所有写入操作
    fastdom.mutate(() => {
      container.innerHTML = '';
      
      items.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.style.width = (containerWidth * 0.8) + 'px';
        listItem.textContent = item.name;
        container.appendChild(listItem);
      });
    });
  });
}
```

### 5.3 响应式布局调整

在窗口大小改变时，使用 FastDom 优化布局调整：

```javascript
window.addEventListener('resize', () => {
  fastdom.measure(() => {
    const viewportWidth = window.innerWidth;
    
    fastdom.mutate(() => {
      if (viewportWidth < 768) {
        document.body.classList.add('mobile-layout');
        document.body.classList.remove('desktop-layout');
      } else {
        document.body.classList.add('desktop-layout');
        document.body.classList.remove('mobile-layout');
      }
    });
  });
});
```

## 6. 高级用法与最佳实践

### 6.1 结合 requestAnimationFrame

虽然 FastDom 内部已经使用了 `requestAnimationFrame`，但在处理复杂动画时，可以进一步结合使用：

```javascript
function complexAnimation() {
  fastdom.measure(() => {
    // 读取DOM状态
    
    requestAnimationFrame(() => {
      fastdom.mutate(() => {
        // 执行动画帧更新
      });
    });
  });
}
```

### 6.2 避免不必要的读写操作

- 尽可能缓存 DOM 引用，避免重复查找
- 只读取必要的 DOM 属性，减少布局计算
- 合并多个写入操作为一次，减少重绘

### 6.3 错误处理

在 FastDom 的回调函数中添加错误处理，避免一个操作失败导致整个队列阻塞：

```javascript
fastdom.measure(() => {
  try {
    // 可能出错的读取操作
  } catch (error) {
    console.error('FastDom measure error:', error);
  }
});

fastdom.mutate(() => {
  try {
    // 可能出错的写入操作
  } catch (error) {
    console.error('FastDom mutate error:', error);
  }
});
```

### 6.4 性能监控

对于性能关键的应用，可以监控 FastDom 队列的长度，监控队列的长度：

```javascript
const originalMeasure = fastdom.measure;
const originalMutate = fastdom.mutate;

// 扩展 measure 方法添加监控
fastdom.measure = function(callback) {
  const startTime = performance.now();
  const result = originalMeasure.call(this, () => {
    try {
      callback();
    } finally {
      const endTime = performance.now();
      console.log('FastDom measure took:', endTime - startTime, 'ms');
    }
  });
  return result;
};

// 类似地扩展 mutate 方法
```

## 7. 与其他方案的对比

| 方案 | 优势 | 劣势 |
|------|------|------|
| 原生读写分离 | 无需额外库，简单直接 | 手动管理复杂，容易出错 |
| FastDom | 自动批处理，使用简单，性能稳定 | 引入额外依赖 |
| requestAnimationFrame 单独使用 | 浏览器原生支持，精确控制时机 | 仍需手动管理读写顺序 |
| CSS 动画/过渡 | 性能最佳，由浏览器优化 | 适用场景有限，复杂交互难以实现 |

## 8. 总结

FastDom 是一个专注于解决 DOM 布局抖动问题的优秀工具，通过智能批处理 DOM 读写操作，能够显著提升 Web 应用的渲染性能和用户体验。它的核心价值在于提供了一种简单、可靠的方式来协调 DOM 访问，避免不必要的浏览器回流和重绘。

在现代 Web 开发中，特别是对于需要频繁操作 DOM 或实现复杂动画效果的应用，FastDom 是一个值得考虑的性能优化方案。通过合理使用 FastDom，可以使你的 Web 应用更加流畅，为用户提供更好的体验。

官方仓库：https://github.com/wilsonpage/fastdom
