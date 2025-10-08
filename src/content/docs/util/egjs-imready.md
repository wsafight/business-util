---
title: 图像与视频加载检测库 egjs-imready 详解
description: 深入解析 Naver 开发的 egjs-imready 库，用于检测容器中图像和视频的加载状态，提升页面交互体验
---

# egjs-imready 库详解与工具实现

## 1. 概念介绍与核心价值

[egjs-imready](https://github.com/naver/egjs-imready) 是由韩国 Naver 公司开发的一款轻量级 JavaScript 库，专门用于检测容器中的所有图像和视频是否加载完成。它解决了网页开发中常见的媒体资源加载检测问题，为开发者提供了一种可靠、高效的方式来监听媒体元素的加载状态。

### 核心价值

- **精确检测**：能够准确检测图像、视频等媒体资源的加载状态
- **高性能**：采用高效的检测机制，不会阻塞主线程
- **事件驱动**：通过事件机制提供加载进度和完成通知
- **易于集成**：简单的 API 设计，易于与现有项目集成
- **自动处理**：自动处理各种边缘情况，如图片加载失败、视频元数据加载等

## 2. 安装与基本使用

### 2.1 安装方法

你可以通过 npm 或 yarn 安装 egjs-imready：

```bash
# 使用 npm
npm install @egjs/imready

# 使用 yarn
yarn add @egjs/imready

# 使用 pnpm
pnpm add @egjs/imready
```

或者直接通过 CDN 引入：

```html
<script src="https://unpkg.com/@egjs/imready@latest/dist/imready.min.js"></script>
```

### 2.2 基本使用示例

```javascript
// 导入库（ES Module 方式）
import { ImReady } from '@egjs/imready';

// 或者在全局环境下使用
// const ImReady = eg.ImReady;

// 创建实例
const im = new ImReady();

// 获取所有需要检测的图片节点
const images = document.querySelectorAll('img');

// 检查所有图像并监听事件
im.check(images)
  .on('readyElement', e => {
    // 单个元素加载完成时触发
    console.log(`已加载 ${e.readyCount}/${e.totalCount}`);
    // 更新进度条
    const progress = Math.floor(e.readyCount / e.totalCount * 100);
    document.getElementById('progress').innerText = `${progress}%`;
  })
  .on('ready', e => {
    // 所有元素加载完成时触发
    console.log('所有媒体资源加载完成');
    document.getElementById('status').innerText = '加载完成';
  })
  .on('error', e => {
    // 资源加载出错时触发
    console.error('资源加载错误:', e);
  });
```

## 3. API 详解

### 3.1 ImReady 类

`ImReady` 是库的主类，用于创建实例并检测媒体资源加载状态。

```javascript
const im = new ImReady(options);
```

**选项参数**：

```javascript
interface ImReadyOptions {
  // 是否检查子元素中的图像，默认为 true
  checkChildElements?: boolean;
  // 是否检查 CSS 背景图像，默认为 false
  checkCssBackground?: boolean;
  // 是否使用 data-src 等属性作为图像源，默认为 false
  useDataAttribute?: boolean;
  // 自定义图像源属性列表
  attributePrefixes?: string[];
}
```

### 3.2 核心方法

#### check(target)

开始检查指定目标元素中的媒体资源加载状态。

**参数**：
- `target`: HTMLElement | HTMLElement[] | NodeList - 要检查的元素或元素列表

**返回值**：ImReady 实例（支持链式调用）

```javascript
im.check(document.getElementById('container'));
```

#### ready(target)

检查指定目标是否已经准备就绪（所有资源已加载）。

**参数**：
- `target`: HTMLElement - 要检查的容器元素

**返回值**：Promise<ImReadyReactiveResult> - 包含检查结果的 Promise

```javascript
im.ready(document.getElementById('container')).then(result => {
  if (result.isReady) {
    console.log('容器已准备就绪');
  }
});
```

#### destroy()

销毁 ImReady 实例，清理所有事件监听器和资源。

```javascript
im.destroy();
```

### 3.3 事件

ImReady 提供了丰富的事件机制，让开发者可以实时获取加载状态变化：

- **readyElement**: 当单个元素加载完成时触发
- **ready**: 当所有元素加载完成时触发
- **error**: 当资源加载出错时触发
- **readyAll**: 当所有内容（包括延迟加载的内容）加载完成时触发

## 4. 实际业务场景

### 4.1 服务器端渲染 PDF

使用 [puppeteer](https://github.com/puppeteer/puppeteer) 工具在服务端把网页生成 PDF 时，需要确保所有图片都加载完成，以避免生成的 PDF 中缺少图片。

```javascript
const puppeteer = require('puppeteer');

async function generatePDF(url, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // 注入 egjs-imready 库
  await page.addScriptTag({
    url: 'https://unpkg.com/@egjs/imready@latest/dist/imready.min.js'
  });
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // 等待所有图片加载完成
  await page.evaluate(async () => {
    return new Promise((resolve) => {
      const im = new eg.ImReady();
      im.check(document.querySelectorAll('img'))
        .on('ready', () => resolve());
      
      // 设置超时以防加载时间过长
      setTimeout(resolve, 10000);
    });
  });
  
  // 生成 PDF
  await page.pdf({ path: outputPath, format: 'A4' });
  
  await browser.close();
}
```

### 4.2 图片库懒加载与初始化

在图片库应用中，需要确保所有图片加载完成后再初始化交互功能，如滑动、缩放等。

```javascript
function initGallery() {
  const im = new eg.ImReady();
  const galleryContainer = document.getElementById('image-gallery');
  
  im.check(galleryContainer)
    .on('readyElement', e => {
      // 更新加载进度
      updateLoadingProgress(e.readyCount, e.totalCount);
    })
    .on('ready', () => {
      // 所有图片加载完成后初始化图片库交互功能
      initGalleryInteractions();
      showGallery();
    });
}
```

### 4.3 预加载关键资源

在单页应用切换页面时，可以使用 egjs-imready 预加载新页面的关键图像资源。

```javascript
async function preloadPageResources(pageUrl) {
  // 获取新页面的 HTML
  const response = await fetch(pageUrl);
  const html = await response.text();
  
  // 创建临时 DOM 元素解析 HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 提取所有图片 URL
  const images = tempDiv.querySelectorAll('img');
  const imageUrls = Array.from(images).map(img => img.src);
  
  // 创建临时图片元素并加载
  const im = new eg.ImReady();
  const tempImages = imageUrls.map(url => {
    const img = new Image();
    img.src = url;
    return img;
  });
  
  return new Promise(resolve => {
    im.check(tempImages)
      .on('ready', () => resolve());
  });
}
```

## 5. 原理解析

### 5.1 图像加载检测原理

egjs-imready 主要基于 HTMLImageElement 的 `complete` 属性和 `load`/`error` 事件来检测图像是否加载完成。

HTMLImageElement 的只读属性 `complete` 是一个布尔值，表示图片是否完全加载完成。当以下任意一条为 true 时，则认为图片完全加载完成：

- 没有 src 也没有 srcset 属性
- 没有 srcset 且 src 为空字符串
- 图像资源已经完全获取，并已经进入（呈现 / 合成）队列
- 图片元素先前已确定图像是完全可用的并且可以使用
- 由于错误或者禁用图像，图像未能显示

### 5.2 视频加载检测原理

对于视频元素，egjs-imready 会监听 `loadedmetadata`、`loadeddata` 和 `error` 事件来确定视频是否加载完成。

## 6. 自定义工具实现

基于 egjs-imready 库，我们可以实现一个简单但实用的媒体资源加载管理器工具，用于在实际项目中更方便地处理媒体资源加载。

```javascript
/**
 * 媒体资源加载管理器
 * 基于 egjs-imready 实现，提供更便捷的媒体资源加载检测功能
 */
class MediaLoader {
  constructor(options = {}) {
    this.options = {
      checkChildElements: true,
      checkCssBackground: false,
      useDataAttribute: false,
      ...options
    };
    this.imReady = null;
    this.isLoading = false;
    this.callbacks = {
      progress: [],
      complete: [],
      error: []
    };
  }
  
  /**
   * 初始化 ImReady 实例
   */
  _init() {
    if (!window.eg || !window.eg.ImReady) {
      throw new Error('egjs-imready 库未加载，请先引入该库');
    }
    
    this.imReady = new window.eg.ImReady(this.options);
    
    // 设置事件监听
    this.imReady
      .on('readyElement', (e) => {
        const progress = { 
          readyCount: e.readyCount, 
          totalCount: e.totalCount,
          percentage: Math.floor(e.readyCount / e.totalCount * 100)
        };
        this.callbacks.progress.forEach(cb => cb(progress));
      })
      .on('ready', (e) => {
        this.isLoading = false;
        this.callbacks.complete.forEach(cb => cb(e));
      })
      .on('error', (e) => {
        this.callbacks.error.forEach(cb => cb(e));
      });
  }
  
  /**
   * 加载指定元素中的媒体资源
   * @param {HTMLElement|HTMLElement[]|NodeList} target - 要加载的元素或元素列表
   * @returns {MediaLoader} 返回实例本身，支持链式调用
   */
  load(target) {
    if (!this.imReady) {
      this._init();
    }
    
    this.isLoading = true;
    this.imReady.check(target);
    return this;
  }
  
  /**
   * 监听加载进度事件
   * @param {Function} callback - 回调函数，接收 progress 对象参数
   * @returns {MediaLoader} 返回实例本身，支持链式调用
   */
  onProgress(callback) {
    if (typeof callback === 'function') {
      this.callbacks.progress.push(callback);
    }
    return this;
  }
  
  /**
   * 监听加载完成事件
   * @param {Function} callback - 回调函数
   * @returns {MediaLoader} 返回实例本身，支持链式调用
   */
  onComplete(callback) {
    if (typeof callback === 'function') {
      this.callbacks.complete.push(callback);
    }
    return this;
  }
  
  /**
   * 监听加载错误事件
   * @param {Function} callback - 回调函数
   * @returns {MediaLoader} 返回实例本身，支持链式调用
   */
  onError(callback) {
    if (typeof callback === 'function') {
      this.callbacks.error.push(callback);
    }
    return this;
  }
  
  /**
   * 销毁实例，清理资源
   */
  destroy() {
    if (this.imReady) {
      this.imReady.destroy();
      this.imReady = null;
    }
    this.isLoading = false;
    this.callbacks = {
      progress: [],
      complete: [],
      error: []
    };
  }
  
  /**
   * 创建并返回一个新的 MediaLoader 实例
   * @param {Object} options - 配置选项
   * @returns {MediaLoader} 新的实例
   */
  static create(options = {}) {
    return new MediaLoader(options);
  }
}

// 使用示例
function setupImageGallery() {
  const galleryLoader = MediaLoader.create({
    checkChildElements: true,
    checkCssBackground: true
  });
  
  galleryLoader
    .load(document.querySelectorAll('.gallery-container'))
    .onProgress(progress => {
      console.log(`加载进度: ${progress.percentage}% (${progress.readyCount}/${progress.totalCount})`);
      document.getElementById('progress-bar').style.width = `${progress.percentage}%`;
    })
    .onComplete(() => {
      console.log('所有媒体资源加载完成');
      document.getElementById('gallery-loading').style.display = 'none';
      document.getElementById('gallery-content').style.display = 'block';
    })
    .onError(error => {
      console.error('资源加载错误:', error);
    });
  
  // 页面卸载时销毁实例
  window.addEventListener('beforeunload', () => {
    galleryLoader.destroy();
  });
}
```

## 7. 性能优化与最佳实践

### 7.1 性能优化建议

1. **按需检测**：只检测可见区域或关键区域的媒体资源
2. **合理设置超时**：为加载过程设置合理的超时时间
3. **避免重复检测**：对已经检测过的元素避免重复检测
4. **销毁不需要的实例**：不再使用时及时销毁 ImReady 实例，释放资源

### 7.2 最佳实践

1. **与懒加载结合**：egjs-imready 可以与图片懒加载库结合使用，先懒加载再检测
2. **渐进式增强**：将 egjs-imready 作为渐进式增强功能，确保基本功能不受影响
3. **加载状态反馈**：利用 `readyElement` 事件提供加载进度反馈，提升用户体验
4. **错误处理**：实现 `error` 事件处理，确保即使部分资源加载失败，应用仍能正常运行

## 8. 总结

egjs-imready 是一个专注于媒体资源加载检测的优秀库，通过它可以轻松实现对网页中图像和视频加载状态的精确监控。本文详细介绍了该库的概念、安装方法、API 使用、实际应用场景和原理解析，并基于该库实现了一个简单但实用的媒体资源加载管理器工具。

在实际项目中，合理使用 egjs-imready 可以帮助开发者更好地控制媒体资源的加载过程，提供更流畅的用户体验，避免因资源未加载完成而导致的各种问题。结合本文提供的最佳实践和自定义工具，可以进一步提升开发效率和应用性能。
