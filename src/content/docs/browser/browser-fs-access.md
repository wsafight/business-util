---
title: 浏览器文件系统访问 API 与 browser-fs-access 库
description: 深入探索现代浏览器的文件系统访问能力及 browser-fs-access 库的使用方法
---

在 Web 应用开发中，与本地文件系统交互一直是一个挑战。回想几年前，要在浏览器中读取本地文件进行业务处理几乎是不可能完成的任务，开发者不得不转向浏览器插件或原生应用程序。然而，随着 Web 技术的快速发展，这一局面已经彻底改变。

## 文件系统访问 API 概述

文件系统访问 API（File System Access API）是现代 Web 提供的原生接口，允许 Web 应用在用户明确授权的前提下，对本地文件系统进行读写操作。这一 API 为 Web 应用带来了革命性的能力提升：

- 构建完整的浏览器端文本编辑器或 IDE
- 开发图像和视频编辑工具
- 实现强大的导入/导出功能
- 创建数据可视化和分析工具
- 开发离线优先的应用程序

## 原生 API 使用指南

### 文件读取

文件系统访问 API 提供 `showOpenFilePicker()` 方法来唤起文件选择器：

```js
// 保存文件句柄引用
let fileHandle;

async function openFile() {
  try {
    // 打开文件选择器
    [fileHandle] = await window.showOpenFilePicker();

    // 判断选择类型
    if (fileHandle.kind === 'file') {
      // 读取文件内容
      const file = await fileHandle.getFile();
      const content = await file.text(); // 或使用 file.arrayBuffer() 读取二进制
      console.log('文件内容:', content);
    } else if (fileHandle.kind === 'directory') {
      console.log('选择的是目录');
    }
  } catch (error) {
    // 用户取消操作会抛出 AbortError
    if (error.name !== 'AbortError') {
      console.error('文件选择失败:', error);
    }
  }
}
```

`showOpenFilePicker()` 支持丰富的配置选项：

```js
const pickerOpts = {
  // 是否允许多选
  multiple: false,
  // 排除"所有文件"选项
  excludeAcceptAllOption: true,
  // 文件类型限制
  types: [
    {
      description: '图片文件',
      accept: {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.svg']
      }
    },
    {
      description: '文本文件',
      accept: {
        'text/plain': ['.txt', '.md'],
        'text/html': ['.html', '.htm']
      }
    }
  ]
};

async function openSpecificFiles() {
  try {
    const fileHandles = await window.showOpenFilePicker(pickerOpts);
    // 处理选中的文件...
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('文件选择失败:', error);
    }
  }
}
```

### 文件保存

使用 `showSaveFilePicker()` 方法让用户选择保存位置：

```js
async function saveFile(content, fileName = 'document.txt') {
  try {
    // 唤起保存文件选择器
    const newHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: '文本文件',
          accept: { 'text/plain': ['.txt'] }
        }
      ]
    });

    // 创建可写流
    const writableStream = await newHandle.createWritable();

    // 写入内容
    await writableStream.write(content);

    // 关闭流（必须调用，否则文件不会保存）
    await writableStream.close();
    console.log('文件保存成功');
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('文件保存失败:', error);
    }
  }
}
```

### 文件夹操作

文件系统访问 API 也支持目录级别的操作：

```js
async function openDirectory() {
  try {
    const directoryHandle = await window.showDirectoryPicker({
      mode: 'read' // 或 'readwrite' 用于读写权限
    });

    // 遍历目录内容
    for await (const [name, handle] of directoryHandle.entries()) {
      const path = `${directoryHandle.name}/${name}`;
      console.log(`${path} (${handle.kind})`);

      if (handle.kind === 'file') {
        const file = await handle.getFile();
        console.log(`  大小: ${file.size} 字节`);
        console.log(`  类型: ${file.type || '未知'}`);
        console.log(`  修改时间: ${file.lastModified}`);
      }
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('打开目录失败:', error);
    }
  }
}

// 递归遍历目录
async function traverseDirectory(directoryHandle, path = '') {
  const files = [];

  for await (const [name, handle] of directoryHandle.entries()) {
    const fullPath = path ? `${path}/${name}` : name;

    if (handle.kind === 'file') {
      files.push({ path: fullPath, handle });
    } else if (handle.kind === 'directory') {
      const subFiles = await traverseDirectory(handle, fullPath);
      files.push(...subFiles);
    }
  }

  return files;
}
```

### 文件句柄持久化

使用 IndexedDB 存储文件句柄，实现"重新打开最近文件"功能：

```js
// 保存文件句柄到 IndexedDB
async function saveFileHandle(key, handle) {
  const db = await openDB();
  const tx = db.transaction('handles', 'readwrite');
  await tx.objectStore('handles').put(handle, key);
}

// 从 IndexedDB 获取文件句柄
async function getFileHandle(key) {
  const db = await openDB();
  const tx = db.transaction('handles', 'readonly');
  return await tx.objectStore('handles').get(key);
}

// 打开或创建 IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FileHandlesDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('handles')) {
        db.createObjectStore('handles');
      }
    };
  });
}

// 验证文件句柄是否仍然有效
async function verifyFileHandle(handle) {
  try {
    // 请求权限（如果之前没有授予）
    const options = { mode: 'read' };
    if ((await handle.queryPermission(options)) === 'granted') {
      return true;
    }
    if ((await handle.requestPermission(options)) === 'granted') {
      return true;
    }
  } catch (error) {
    console.error('验证文件句柄失败:', error);
  }
  return false;
}
```

## browser-fs-access 库

虽然原生的文件系统访问 API 功能强大，但浏览器兼容性存在局限。Google Chrome Labs 开发的 [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) 库优雅地解决了这一问题：

- 支持原生 API 的浏览器使用原生实现
- 不支持的浏览器自动降级到传统的文件输入和下载链接
- 提供统一简洁的 API 接口
- 简化文件和目录操作的复杂度

### 安装方式

```bash
# npm
npm install browser-fs-access

# yarn
yarn add browser-fs-access

# pnpm
pnpm add browser-fs-access
```

或通过 CDN 直接引入：

```html
<script type="module">
  import {
    fileOpen,
    directoryOpen,
    fileSave,
  } from 'https://unpkg.com/browser-fs-access?module';
</script>
```

### 基本用法

```js
import { fileOpen, directoryOpen, fileSave } from 'browser-fs-access';

// 打开并读取文件
async function openAndReadFile() {
  try {
    const blob = await fileOpen({
      mimeTypes: ['image/*'],
      multiple: false,
      description: '请选择一张图片',
    });

    // 处理文件
    const imageUrl = URL.createObjectURL(blob);
    document.querySelector('#preview').src = imageUrl;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('文件打开失败:', error);
    }
  }
}

// 保存文件
async function saveFileWithLibrary() {
  try {
    const textContent = '这是通过 browser-fs-access 库保存的内容';
    const blob = new Blob([textContent], { type: 'text/plain' });

    await fileSave(blob, {
      fileName: 'example.txt',
      extensions: ['.txt'],
    });
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('文件保存失败:', error);
    }
  }
}

// 读取整个目录
async function readDirectory() {
  try {
    const filesInDirectory = await directoryOpen({
      recursive: true,
      mode: 'read',
    });

    for (const file of filesInDirectory) {
      console.log(`${file.webkitRelativePath}: ${file.size} 字节`);
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('读取目录失败:', error);
    }
  }
}
```

## 浏览器兼容性

原生文件系统访问 API 的浏览器支持情况（截至 2025 年 12 月）：

| 浏览器 | 支持情况 | 版本要求 | 备注 |
|--------|----------|----------|------|
| Chrome | ✅ 完全支持 | 86+ | 需要安全上下文（HTTPS） |
| Edge | ✅ 完全支持 | 86+ | 与 Chrome 一致 |
| Firefox | ⚠️ 部分支持 | 114+（Nightly） | 默认未启用，需手动开启配置 |
| Safari | ⚠️ 实验中 | 18.2+ | 默认未启用，可通过 flag 开启 |
| Opera | ✅ 完全支持 | 72+ | 与 Chrome 一致 |
| IE | ❌ 不支持 | - | - |

使用 browser-fs-access 库可以在所有现代浏览器中获得一致的体验。

## 实际应用场景

### 1. 在线代码编辑器

```js
class CodeEditor {
  constructor() {
    this.currentFileHandle = null;
    this.currentFileName = 'untitled.txt';
  }

  async openFile() {
    try {
      const file = await fileOpen({
        mimeTypes: ['text/plain', 'text/javascript', 'application/json', 'text/css', 'text/html'],
        extensions: ['.js', '.json', '.html', '.css', '.md', '.txt']
      });

      const content = await file.text();
      this.setContent(content);
      this.currentFileName = file.name;
      this.updateTitle();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('打开文件失败:', error);
      }
    }
  }

  async saveFile() {
    try {
      const content = this.getContent();
      const blob = new Blob([content], { type: 'text/plain' });

      await fileSave(blob, {
        fileName: this.currentFileName,
        extensions: ['.txt', '.js', '.json', '.html', '.css', '.md']
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('保存文件失败:', error);
      }
    }
  }

  setContent(content) {
    document.querySelector('#editor').value = content;
  }

  getContent() {
    return document.querySelector('#editor').value;
  }

  updateTitle() {
    document.title = `${this.currentFileName} - 代码编辑器`;
  }
}

// 使用示例
const editor = new CodeEditor();
document.querySelector('#open-btn').onclick = () => editor.openFile();
document.querySelector('#save-btn').onclick = () => editor.saveFile();
```

### 2. 图片处理应用

```js
class ImageProcessor {
  constructor() {
    this.currentImage = null;
    this.processedBlob = null;
  }

  async loadImage() {
    try {
      const blob = await fileOpen({
        mimeTypes: ['image/*'],
      });

      this.currentImage = await this.loadImageElement(blob);
      this.displayPreview(this.currentImage);

      // 启用保存按钮
      document.querySelector('#save-btn').disabled = false;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('加载图片失败:', error);
      }
    }
  }

  loadImageElement(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  processImage(options = {}) {
    if (!this.currentImage) return;

    const { grayscale = false, brightness = 100, contrast = 100 } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = this.currentImage.width;
    canvas.height = this.currentImage.height;

    // 应用滤镜
    let filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (grayscale) {
      filter += ' grayscale(100%)';
    }
    ctx.filter = filter;

    ctx.drawImage(this.currentImage, 0, 0);

    this.processedCanvas = canvas;
    this.displayPreview(this.currentImage); // 更新预览
  }

  async saveProcessed() {
    if (!this.processedCanvas) {
      alert('请先处理图片');
      return;
    }

    try {
      this.processedBlob = await new Promise(resolve => {
        this.processedCanvas.toBlob(resolve, 'image/png');
      });

      await fileSave(this.processedBlob, {
        fileName: 'processed-image.png',
        extensions: ['.png']
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('保存失败:', error);
      }
    }
  }

  displayPreview(img) {
    const preview = document.querySelector('#preview');
    preview.src = img.src || img.toDataURL();
  }
}
```

### 3. 批量文件处理工具

```js
class BatchProcessor {
  async processMultipleFiles() {
    try {
      const files = await fileOpen({
        multiple: true,
        mimeTypes: ['application/json', 'text/csv'],
      });

      const results = [];

      for (const file of files) {
        const content = await file.text();
        // 处理每个文件
        const processed = this.processContent(content);
        results.push({
          fileName: file.name,
          originalSize: file.size,
          result: processed
        });
      }

      // 导出处理结果
      await this.exportResults(results);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('批量处理失败:', error);
      }
    }
  }

  processContent(content) {
    // 自定义处理逻辑
    return JSON.parse(content);
  }

  async exportResults(results) {
    const report = JSON.stringify(results, null, 2);
    const blob = new Blob([report], { type: 'application/json' });

    await fileSave(blob, {
      fileName: `report-${Date.now()}.json`,
      extensions: ['.json']
    });
  }
}
```

## 最佳实践

1. **用户授权优先**
   - 始终在访问文件前获得明确授权
   - 仅请求完成任务所需的最低权限
   - 清晰告知用户为何需要文件访问权限

2. **全面的错误处理**
   - 区分用户取消操作和真正的错误
   - 为不同类型的错误提供友好的提示信息
   - 考虑权限不足、文件不存在等情况

3. **性能优化**
   - 大文件操作使用流处理，避免一次性加载到内存
   - 对于批量操作，考虑使用 Web Worker
   - 及时释放不再需要的对象 URL

4. **安全性考虑**
   - 验证文件类型，不依赖扩展名判断
   - 限制文件大小，防止资源耗尽
   - 对用户输入进行适当验证

5. **持久化存储**
   - 使用 IndexedDB 存储文件句柄引用
   - 实现最近文件列表功能
   - 定期清理过期的句柄引用

6. **渐进式增强**
   - 使用 browser-fs-access 实现跨浏览器兼容
   - 为不支持的浏览器提供替代方案
   - 功能检测优先于浏览器检测

## 总结

文件系统访问 API 为 Web 应用提供了前所未有的本地文件操作能力，而 browser-fs-access 库则解决了浏览器兼容性问题。通过这些工具，开发者可以构建更接近原生体验的 Web 应用。

无论是开发在线编辑器、媒体处理工具，还是实现数据导入导出功能，文件系统访问 API 和 browser-fs-access 库都是现代 Web 开发中的重要工具。
