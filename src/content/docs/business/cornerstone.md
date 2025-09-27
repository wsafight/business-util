---
title: 交互式医学图像工具 Cornerstone.js
description: 基于 Web 的医学成像平台，用于在浏览器中显示和处理 DICOM 图像
date: 2024-01-15
---

## 1. 什么是 Cornerstone.js？

Cornerstone.js 是一个开源的 JavaScript 库，专门用于在 Web 浏览器中高效加载、解析和显示医学图像，特别是 DICOM（数字成像和通信在医学领域）格式的图像。它是由 OHIF (Open Health Imaging Foundation) 维护的项目，为开发者提供了一个强大的工具，用于构建医学影像查看器和相关应用。

Cornerstone.js 提供了完整的基于 Web 的医学成像平台，其核心组件是一个轻量级库，可以在支持 HTML5 画布元素的现代 Web 浏览器中显示医学图像。

## 2. 核心特点

### 2.1 高性能图像渲染
- 支持大尺寸医学图像的快速渲染，包括 CT 扫描、MRI、X 光片等
- 利用 GPU 加速（WebGL），提供平滑的图像缩放、平移、旋转等交互操作
- 通过基于 requestAnimationFrame 的 Rendering Loop 来更新视口变换

### 2.2 跨平台兼容性
- 基于 Web 技术开发，可以在不同的操作系统和设备上运行
- 支持 Windows、Linux、macOS 以及移动设备等

### 2.3 灵活的扩展性
- 提供了一组灵活的 API，允许开发人员自定义和扩展功能
- 模块化设计，各组件可以一起使用，也可以单独使用

### 2.4 开源免费
- 使用 MIT 许可证发布，可以自由使用和分发
- 活跃的社区支持和持续更新

## 3. 核心组件

Cornerstone.js 生态系统包含多个重要组件，每个组件负责不同的功能：

### 3.1 cornerstone-core
- 用途：Cornerstone.js 的核心库，负责图像渲染、管理和基本交互
- 安装：`npm install cornerstone-core`

### 3.2 cornerstone-tools
- 用途：提供丰富的交互工具，如测量工具、标注工具、窗宽窗位调整工具等
- 安装：`npm install cornerstone-tools`

### 3.3 cornerstone-math
- 用途：提供数学计算相关的工具和函数，用于支持医学影像的显示和交互操作
- 安装：`npm install cornerstone-math`

### 3.4 cornerstone-wado-image-loader
- 用途：专门用于从 Web 访问 DICOM 影像数据，并将其加载到 Cornerstone.js 中进行显示
- WADO 代表 "Web Access to DICOM Objects"，是一种通过 HTTP 协议访问 DICOM 数据的标准方法
- 安装：`npm install cornerstone-wado-image-loader`

### 3.5 cornerstone-web-image-loader
- 用途：用于加载非 DICOM 格式的图像（如 PNG、JPEG 等）到 Cornerstone.js 中进行显示
- 安装：`npm install cornerstone-web-image-loader`

## 4. 安装方法

### 4.1 使用 npm 安装

```bash
# 安装核心组件和常用工具
npm install --save cornerstone-core cornerstone-math cornerstone-tools hammerjs cornerstone-wado-image-loader dicom-parser
```

### 4.2 通过 CDN 引入

```html
<!-- 在 HTML 文件中引入 -->
<script src="https://cdn.jsdelivr.net/npm/cornerstone-core@2.3.1/dist/cornerstone.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-math@0.1.8/dist/cornerstoneMath.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-tools@6.0.8/dist/cornerstoneTools.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dicom-parser@1.8.8/dist/dicomParser.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.3.0/dist/cornerstoneWADOImageLoader.min.js"></script>
```

## 5. 基本使用示例

### 5.1 在 Vue 项目中使用

下面是一个在 Vue 项目中使用 Cornerstone.js 显示 DICOM 图像的示例：

```javascript
// 1. 引入依赖
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as Hammer from "hammerjs";
import * as cornerstoneMath from "cornerstone-math";
import * as dicomParser from "dicom-parser";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";

// 2. 添加 HTML 元素用于显示图像
// <div id="cornerstone" class="cornerstone"></div>

// 3. 初始化配置
function initCornerstone() {
  // 注册并挂载 cornerstone 及其工具，固定操作
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  
  // 初始化工具
  cornerstoneTools.init();
  
  // 获取显示图像的 DOM 元素
  let element = document.querySelector("#cornerstone");
  
  // 启用该元素用于显示 cornerstone 图像
  cornerstone.enable(element);
  
  // 定义要加载的 DICOM 图像 URL
  let imageId = 'wadouri:http://your-dicom-server/path/to/image.dcm';
  
  // 添加窗宽窗位工具（调整图像亮度和对比度）
  const WwwcTool = cornerstoneTools.WwwcTool;
  cornerstoneTools.addTool(WwwcTool);
  
  // 绑定工具操作到鼠标左键
  cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
  
  // 加载并显示图像
  cornerstone.loadAndCacheImage(imageId).then(function (image) {
    cornerstone.displayImage(element, image);
  });
}

// 在组件挂载后调用初始化函数
// mounted() {
//   this.initCornerstone();
// }
```

### 5.2 基本 HTML 页面示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>Cornerstone.js 基本示例</title>
  <script src="https://cdn.jsdelivr.net/npm/cornerstone-core@2.3.1/dist/cornerstone.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/cornerstone-math@0.1.8/dist/cornerstoneMath.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/cornerstone-tools@6.0.8/dist/cornerstoneTools.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dicom-parser@1.8.8/dist/dicomParser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/cornerstone-wado-image-loader@3.3.0/dist/cornerstoneWADOImageLoader.min.js"></script>
  <style>
    #dicomImage {
      width: 512px;
      height: 512px;
      position: relative;
    }
  </style>
</head>
<body>
  <div id="dicomImage"></div>
  
  <script>
    // 等待页面加载完成
    document.addEventListener('DOMContentLoaded', function() {
      // 配置
      cornerstoneTools.external.cornerstone = cornerstone;
      cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
      cornerstoneTools.external.Hammer = Hammer;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      
      // 初始化工具
      cornerstoneTools.init();
      
      // 获取元素并启用
      const element = document.getElementById('dicomImage');
      cornerstone.enable(element);
      
      // 加载示例 DICOM 图像
      // 注意：这里使用的是示例图像 URL，实际使用时需要替换为您自己的 DICOM 服务器地址
      const imageId = 'wadouri:https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/examples/Renal_Cell_Carcinoma.dcm';
      
      // 添加常用工具
      cornerstoneTools.addTool(cornerstoneTools.PanTool);
      cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
      cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
      
      // 激活工具
      cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 }); // 中键平移
      cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 4 }); // 右键缩放
      cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 }); // 左键调整窗宽窗位
      
      // 加载并显示图像
      cornerstone.loadAndCacheImage(imageId).then(function(image) {
        cornerstone.displayImage(element, image);
      }).catch(function(error) {
        console.error('加载图像失败:', error);
      });
    });
  </script>
</body>
</html>
```

## 6. 图像加载器工作原理

图像加载器是 CornerstoneJS 架构中至关重要的组成部分，它负责将各种格式的医学图像数据转换为 Cornerstone 能够理解和渲染的格式。

### 6.1 图像加载器的核心职责
- 接收一个图像 ID (Image Id) 作为输入
- 返回一个包含 Promise 的图像加载对象 (Image Load Object)
- 当 Promise 解析时，提供 Cornerstone 能够显示的图像对象

### 6.2 工作流程
1. **注册阶段**：各种图像加载器向 Cornerstone 注册自己能够处理的图像 ID URL 方案
2. **请求阶段**：应用程序通过 `loadImage()` API 请求加载图像
3. **委派阶段**：Cornerstone 根据图像 ID 的 URL 方案，将请求委派给对应的图像加载器
4. **加载阶段**：图像加载器返回包含 Promise 的图像加载对象
5. **处理阶段**：图像加载器可能需要进行以下操作：
   - 通过 XMLHttpRequest 向远程服务器请求像素数据
   - 解压缩像素数据（如 JPEG 2000 格式）
   - 将像素数据转换为 Cornerstone 理解的格式（如 RGB 与 YBR 颜色空间转换）
6. **显示阶段**：当 Promise 解析后，使用 `displayImage()` API 显示图像

## 7. 常见应用场景

Cornerstone.js 广泛应用于以下医学影像相关场景：

1. **放射学影像查看器**：用于显示和分析 X 光片、CT 扫描、MRI 等图像
2. **远程医疗平台**：支持医生远程查看和诊断患者的医学影像
3. **医学教育系统**：用于医学图像教学和培训
4. **科研分析工具**：医学图像研究和分析
5. **电子健康记录 (EHR) 集成**：与患者电子健康记录系统集成，提供医学影像查看功能

## 8. 性能优化建议

1. **使用图像缓存**：利用 Cornerstone.js 的 `loadAndCacheImage()` 方法缓存已加载的图像，避免重复加载
2. **优化图像加载**：考虑使用分页和按需加载策略，特别是处理大量图像数据时
3. **Web Workers**：使用 Web Workers 处理影像数据，避免阻塞主线程
4. **错误处理**：实现全面的错误处理机制，以应对网络问题和服务器错误
5. **响应式设计**：根据设备性能和网络状况调整图像加载和渲染策略

## 9. 相关生态项目

1. **dcmjs**：用于处理 DICOM 数据的 JavaScript 库，与 Cornerstone.js 结合使用，可以实现完整的 DICOM 数据处理流程
2. **OHIF Viewer**：开源的医学图像查看器，支持 DICOMweb 协议，提供强大的图像查看和分析功能
3. **cornerstoneToolsExample**：基于 Cornerstone.js 和 CornerstoneTools 的开源项目示例，帮助开发者快速上手

## 10. 参考资源

- [官方 GitHub 仓库](https://github.com/cornerstonejs/cornerstone)
- [Cornerstone.js 文档](https://docs.cornerstonejs.org/)
- [DICOMweb 协议](https://www.dicomstandard.org/dicomweb/)
- [OHIF Viewer 项目](https://github.com/OHIF/Viewers)