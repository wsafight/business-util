---
title: 浏览器文件系统访问 API 与 browser-fs-access 库
description: 深入探索现代浏览器的文件系统访问能力及 browser-fs-access 库的使用方法
---

在 Web 应用开发中，与本地文件系统交互一直是一个挑战。回想几年前，要实现浏览器读取本地文件进行业务处理几乎是不可能完成的任务，开发者不得不转向浏览器插件或原生应用程序。然而，随着 Web 技术的发展，这一局面已经彻底改变。

## 文件系统访问 API 简介

文件系统访问 API（File System Access API）是一种现代 Web API，它允许 Web 应用程序在用户明确授权的情况下，对用户的本地文件系统进行读写访问。这一 API 为 Web 应用带来了革命性的能力提升，使其能够实现以下功能：

- 构建完整的浏览器端文本编辑器或 IDE
- 开发图像和视频编辑工具
- 实现更强大的导入/导出功能
- 创建数据可视化和分析工具
- 开发离线优先的应用程序

## 原生 API 的基本使用

### 文件读取

文件系统访问 API 提供了 `showOpenFilePicker()` 方法来打开文件选择器，让用户选择文件：

```js
// 文件句柄
let fileHandle;

async function getFile() {
  try {
    // 打开文件选择器并且选择文件
    [fileHandle] = await window.showOpenFilePicker();

    // 判断选择的是文件还是目录
    if (fileHandle.kind === 'file') {
      // 读取文件内容
      const file = await fileHandle.getFile();
      const content = await file.text(); // 或者使用 file.arrayBuffer() 读取二进制数据
      console.log('文件内容:', content);
    } else if (fileHandle.kind === 'directory') {
      console.log('选择的是目录');
    }
  } catch (error) {
    console.error('文件选择失败:', error);
  }
}
```

`showOpenFilePicker()` 支持多种配置选项，用于限制文件类型和选择行为：

```js
const pickerOpts = {
  // 是否允许选择多个文件
  multiple: false,
  // 是否排除"所有文件"选项
  excludeAcceptAllOption: true,
  // 文件类型限制
  types: [
    {
      description: '图片文件',
      accept: {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg']
      }
    },
    {
      description: '文本文件',
      accept: {
        'text/plain': ['.txt', '.md']
      }
    }
  ]
};

async function openSpecificFiles() {
  try {
    const fileHandles = await window.showOpenFilePicker(pickerOpts);
    // 处理选中的文件...
  } catch (error) {
    console.error('文件选择失败:', error);
  }
}
```

### 文件保存

使用 `showSaveFilePicker()` 方法可以让用户选择保存文件的位置和名称：

```js
async function saveFile() {
  try {
    // 展示保存文件的选择器
    const newHandle = await window.showSaveFilePicker({
      suggestedName: 'document.txt',
      types: [
        {
          description: '文本文件',
          accept: {'text/plain': ['.txt']}
        }
      ]
    });

    // 创建文件流
    const writableStream = await newHandle.createWritable();

    // 写入文件内容
    const content = '这是要保存的文件内容';
    await writableStream.write(content);

    // 关闭文件流
    await writableStream.close();
    console.log('文件保存成功');
  } catch (error) {
    console.error('文件保存失败:', error);
  }
}
```

### 文件夹操作

文件系统访问 API 也支持文件夹级别的操作：

```js
async function openDirectory() {
  try {
    const directoryHandle = await window.showDirectoryPicker({
      mode: 'read'
    });

    // 遍历文件夹内容
    for await (const [name, handle] of directoryHandle.entries()) {
      console.log(`${name} 是 ${handle.kind}`);
      
      // 如果是文件，可以读取内容
      if (handle.kind === 'file') {
        const file = await handle.getFile();
        console.log(`${name} 的大小: ${file.size} 字节`);
      }
    }
  } catch (error) {
    console.error('打开目录失败:', error);
  }
}
```

## browser-fs-access 库介绍

尽管原生的文件系统访问 API 功能强大，但它存在浏览器兼容性问题。为了解决这个问题，Google Chrome Labs 开发了 [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) 库，这是一个优雅的 ponyfill 库，它：

- 在支持原生 API 的浏览器中使用原生实现
- 在不支持的浏览器中自动降级使用传统的文件输入和下载链接
- 提供统一简洁的 API 接口
- 简化了文件和目录操作的复杂性

### 安装与基本使用

你可以通过多种方式使用 browser-fs-access 库：

```bash
# 使用 npm 安装
npm install browser-fs-access

# 或使用 yarn
# yarn add browser-fs-access
```

也可以直接通过 CDN 引入：

```html
<script type="module">
  import {
    fileOpen,
    directoryOpen,
    fileSave,
  } from 'https://unpkg.com/browser-fs-access';
</script>
```

基本使用示例：

```js
import {
  fileOpen,
  directoryOpen,
  fileSave,
} from 'browser-fs-access';

// 打开并读取文件
async function openAndReadFile() {
  try {
    // 打开文件
    const blob = await fileOpen({
      mimeTypes: ['image/*'],
      // 不允许多选
      multiple: false,
      // 文件类型描述
      description: '请选择一张图片',
    });

    // 处理文件内容
    const imageUrl = URL.createObjectURL(blob);
    document.querySelector('#preview').src = imageUrl;
  } catch (error) {
    console.error('文件打开失败:', error);
  }
}

// 保存文件
async function saveFileWithLibrary() {
  try {
    // 创建要保存的内容
    const textContent = '这是通过 browser-fs-access 库保存的内容';
    const blob = new Blob([textContent], { type: 'text/plain' });

    // 保存文件
    await fileSave(blob, {
      fileName: 'example.txt',
      description: '文本文件',
      extensions: ['.txt'],
    });
  } catch (error) {
    console.error('文件保存失败:', error);
  }
}

// 读取整个目录
async function readDirectory() {
  try {
    // 打开目录选择器
    const blobs = await directoryOpen({
      recursive: true, // 递归读取子目录
      extensions: ['.md', '.txt'], // 只读取特定扩展名的文件
    });

    // 处理目录中的文件
    for (const [path, blob] of Object.entries(blobs)) {
      console.log(`文件路径: ${path}, 大小: ${blob.size} 字节`);
    }
  } catch (error) {
    console.error('读取目录失败:', error);
  }
}
```

## 浏览器兼容性

原生文件系统访问 API 的浏览器支持情况如下：

| 浏览器 | 支持情况 |
|--------|---------|
| Chrome | ✅ 支持 |
| Edge | ✅ 支持 |
| Firefox | ❌ 不支持 |
| Safari | ❌ 不支持 |
| IE | ❌ 不支持 |

使用 browser-fs-access 库可以在不支持原生 API 的浏览器中提供降级体验，使其在所有现代浏览器中都能正常工作。

## 实际应用场景

以下是一些使用文件系统访问 API 和 browser-fs-access 库的实际应用场景：

### 1. 在线代码编辑器

```js
// 简化版的在线编辑器示例
let currentFileHandle;

async function openCodeFile() {
  try {
    const file = await fileOpen({
      mimeTypes: ['text/plain', 'text/javascript', 'application/json'],
      extensions: ['.js', '.json', '.html', '.css']
    });
    
    const content = await file.text();
    document.querySelector('#editor').value = content;
    document.title = file.name;
  } catch (error) {
    console.error('打开文件失败:', error);
  }
}

async function saveCodeFile() {
  try {
    const content = document.querySelector('#editor').value;
    const blob = new Blob([content], { type: 'text/plain' });
    
    await fileSave(blob, {
      fileName: document.title,
      extensions: ['.txt', '.js']
    });
  } catch (error) {
    console.error('保存文件失败:', error);
  }
}
```

### 2. 图片处理应用

```js
// 简单的图片处理应用示例
async function loadAndProcessImage() {
  try {
    const blob = await fileOpen({
      mimeTypes: ['image/*'],
    });
    
    // 读取图片并显示预览
    const imageUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = async () => {
      // 处理图片 (例如调整大小、滤镜等)
      const processedCanvas = processImage(img);
      
      // 将处理后的图片转换为 blob
      const processedBlob = await new Promise(resolve => {
        processedCanvas.toBlob(resolve, 'image/png');
      });
      
      // 提供保存选项
      document.querySelector('#save-btn').onclick = () => {
        fileSave(processedBlob, {
          fileName: 'processed-image.png',
          extensions: ['.png']
        });
      };
    };
  } catch (error) {
    console.error('处理图片失败:', error);
  }
}

function processImage(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // 设置画布大小
  canvas.width = img.width;
  canvas.height = img.height;
  // 绘制并处理图片
  ctx.filter = 'grayscale(100%)'; // 转为黑白
  ctx.drawImage(img, 0, 0);
  return canvas;
}
```

## 最佳实践与注意事项

1. **用户授权优先**：始终确保在访问用户文件前获得明确授权，并仅请求完成任务所需的最低权限

2. **错误处理**：实现全面的错误处理，考虑用户取消操作、权限不足等情况

3. **性能优化**：对于大文件操作，考虑使用流处理或分块读取，避免占用过多内存

4. **安全性考虑**：不要假设用户选择的文件格式与扩展名一致，始终验证文件内容

5. **存储持久化**：使用 IndexedDB 存储文件句柄引用，以便用户后续访问时不需要重新选择

6. **渐进式增强**：结合 browser-fs-access 库实现跨浏览器兼容，为不支持的浏览器提供替代方案

## 总结

文件系统访问 API 为 Web 应用提供了前所未有的本地文件操作能力，而 browser-fs-access 库则解决了浏览器兼容性问题，使这一能力能够在更广泛的环境中应用。通过这些工具，开发者可以构建更接近原生体验的 Web 应用，为用户提供更强大、更便捷的功能。

无论是开发在线编辑器、媒体处理工具还是数据导入导出功能，文件系统访问 API 和 browser-fs-access 库都是现代 Web 开发中不可或缺的工具。