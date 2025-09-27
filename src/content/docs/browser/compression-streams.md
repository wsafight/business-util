---
title: 浏览器内置压缩流 API (Compression Streams)
description: 利用浏览器原生 Compression Streams API 高效处理数据流压缩和解压缩
---

## Compression Streams API 简介

Compression Streams API 是浏览器提供的原生 API，允许 Web 应用程序直接在浏览器中使用 gzip、deflate 或 deflate-raw 算法压缩和解压缩数据流。这一 API 基于 Streams API 构建，可以高效处理大型文件和数据流，而不会阻塞主线程或占用过多内存。

Compression Streams API 的主要优势包括：

- **原生性能**：直接利用浏览器内置的压缩算法，无需加载额外的 JavaScript 库
- **流式处理**：支持流式处理大型文件，避免一次性加载整个文件到内存
- **异步操作**：基于 Promise 和 Streams API，不会阻塞主线程
- **简洁的 API**：使用简单直观的接口进行压缩和解压缩操作

## 浏览器兼容性

Compression Streams API 的浏览器支持情况如下：

| 浏览器 | 支持情况 | 最低版本 |
|--------|---------|---------|
| Chrome | ✅ 支持 | 80+ |
| Edge | ✅ 支持 | 80+ |
| Safari | ✅ 支持 | 14.1+ |
| Firefox | ❌ 不支持 | - |
| IE | ❌ 不支持 | - |

在使用前，建议先检查浏览器是否支持该 API：

```js
// 检查浏览器是否支持 Compression Streams API
function checkCompressionSupport() {
  const isCompressionSupported = 'CompressionStream' in window;
  const isDecompressionSupported = 'DecompressionStream' in window;
  
  return {
    isCompressionSupported,
    isDecompressionSupported,
    isFullySupported: isCompressionSupported && isDecompressionSupported
  };
}

const support = checkCompressionSupport();
if (!support.isFullySupported) {
  console.warn('当前浏览器不完全支持 Compression Streams API，建议使用替代方案');
  // 可以在这里加载替代库
}
```

## 基本使用方法

### 压缩数据

使用 `CompressionStream` 构造函数创建一个压缩流，可以将任何 ReadableStream 管道传输到该压缩流中：

```js
// 示例：压缩字符串数据
async function compressString() {
  const text = '这是一段需要压缩的文本数据...'.repeat(1000);
  
  // 将字符串转换为 Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // 创建可读流
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    }
  });
  
  // 创建压缩流（gzip 格式）
  const compressionStream = new CompressionStream('gzip');
  
  // 管道传输并获取压缩后的数据流
  const compressedStream = readableStream.pipeThrough(compressionStream);
  
  // 读取压缩后的结果
  const compressedData = await new Response(compressedStream).arrayBuffer();
  
  console.log('原始大小:', data.byteLength, '字节');
  console.log('压缩后大小:', compressedData.byteLength, '字节');
  console.log('压缩率:', ((1 - compressedData.byteLength / data.byteLength) * 100).toFixed(2) + '%');
  
  return compressedData;
}
```

### 解压数据

使用 `DecompressionStream` 构造函数可以解压压缩过的数据：

```js
// 示例：解压数据
async function decompressData(compressedData) {
  // 创建可读流
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(compressedData));
      controller.close();
    }
  });
  
  // 创建解压流（需与压缩时使用的算法一致）
  const decompressionStream = new DecompressionStream('gzip');
  
  // 管道传输并获取解压后的数据流
  const decompressedStream = readableStream.pipeThrough(decompressionStream);
  
  // 读取解压后的结果
  const decompressedData = await new Response(decompressedStream).arrayBuffer();
  
  // 转换回字符串
  const decoder = new TextDecoder();
  const text = decoder.decode(decompressedData);
  
  console.log('解压后文本长度:', text.length);
  
  return text;
}
```

## 实际应用场景

### 1. 压缩网络请求和响应

Compression Streams API 特别适合优化网络传输，通过在客户端压缩数据后再发送，可以显著减少传输的数据量：

```js
// 示例：压缩数据并发送到服务器
async function sendCompressedData(data) {
  try {
    // 转换数据并创建可读流
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(JSON.stringify(data));
    
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(uint8Array);
        controller.close();
      }
    });
    
    // 创建压缩流
    const compressionStream = new CompressionStream('gzip');
    const compressedStream = readableStream.pipeThrough(compressionStream);
    
    // 发送压缩数据
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
      },
      body: compressedStream
    });
    
    const result = await response.json();
    console.log('上传成功:', result);
    return result;
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
}
```

### 2. 结合文件系统访问 API 处理大型文件

将 Compression Streams API 与 [浏览器文件操作 API](./browser-fs-access.md) 结合，可以高效处理大型文件的压缩和解压缩：

```js
import { fileOpen, fileSave } from 'browser-fs-access';

// 示例：压缩本地文件
async function compressLocalFile() {
  try {
    // 打开文件选择器
    const file = await fileOpen({
      mimeTypes: ['*/*'], // 允许选择任何类型的文件
      description: '请选择要压缩的文件'
    });
    
    // 创建可读流
    const readableStream = file.stream();
    
    // 创建压缩流
    const compressionStream = new CompressionStream('gzip');
    const compressedStream = readableStream.pipeThrough(compressionStream);
    
    // 保存压缩后的文件
    await fileSave(new Response(compressedStream), {
      fileName: file.name + '.gz',
      description: '压缩文件',
      extensions: ['.gz']
    });
    
    console.log('文件压缩成功');
  } catch (error) {
    console.error('文件压缩失败:', error);
  }
}

// 示例：解压本地文件
async function decompressLocalFile() {
  try {
    // 打开压缩文件
    const compressedFile = await fileOpen({
      mimeTypes: ['application/gzip', 'application/x-gzip'],
      extensions: ['.gz'],
      description: '请选择要解压的文件'
    });
    
    // 创建可读流
    const readableStream = compressedFile.stream();
    
    // 创建解压流
    const decompressionStream = new DecompressionStream('gzip');
    const decompressedStream = readableStream.pipeThrough(decompressionStream);
    
    // 保存解压后的文件（移除 .gz 扩展名）
    const originalFileName = compressedFile.name.replace(/\.gz$/, '');
    await fileSave(new Response(decompressedStream), {
      fileName: originalFileName,
      description: '解压文件'
    });
    
    console.log('文件解压成功');
  } catch (error) {
    console.error('文件解压失败:', error);
  }
}
```

### 3. 处理大文件上传进度

对于大文件压缩上传，我们可以结合 ReadableStream 和 TransformStream 来实现进度跟踪：

```js
// 示例：压缩上传大文件并显示进度
async function compressAndUploadWithProgress(file, onProgress) {
  try {
    let uploadedBytes = 0;
    const totalBytes = file.size;
    
    // 创建进度跟踪转换流
    const progressTransform = new TransformStream({
      transform(chunk, controller) {
        uploadedBytes += chunk.byteLength;
        if (onProgress) {
          onProgress({ loaded: uploadedBytes, total: totalBytes });
        }
        controller.enqueue(chunk);
      }
    });
    
    // 管道文件流 -> 压缩流 -> 进度流
    const compressedUploadStream = file.stream()
      .pipeThrough(new CompressionStream('gzip'))
      .pipeThrough(progressTransform);
    
    // 上传文件
    const response = await fetch('/api/large-upload', {
      method: 'POST',
      headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: compressedUploadStream
    });
    
    return await response.json();
  } catch (error) {
    console.error('压缩上传失败:', error);
    throw error;
  }
}

// 使用示例
const fileInput = document.querySelector('input[type="file"]');
const progressBar = document.querySelector('.progress-bar');

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (file) {
    await compressAndUploadWithProgress(file, (progress) => {
      const percent = Math.round((progress.loaded / progress.total) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent}%`;
    });
  }
});
```

## 不同压缩算法的比较

Compression Streams API 支持三种压缩算法：gzip、deflate 和 deflate-raw。它们之间的主要区别如下：

| 压缩算法 | 描述 | 优点 | 适用场景 |
|--------|------|------|---------|
| gzip | 最常用的压缩格式，包含头部和校验信息 | 广泛支持，兼容性好 | 网络传输、文件存储 |
| deflate | 基本的压缩算法，不包含头部校验信息 | 压缩率较好 | 对大小敏感的应用 |
| deflate-raw | 原始的 deflate 压缩，无任何头部信息 | 压缩后体积最小 | 内部数据传输 |

以下是不同算法的使用示例：

```js
// 比较不同压缩算法
async function compareCompressionAlgorithms(data) {
  const encoder = new TextEncoder();
  const input = encoder.encode(data);
  
  const results = {};
  const algorithms = ['gzip', 'deflate', 'deflate-raw'];
  
  for (const algorithm of algorithms) {
    const startTime = performance.now();
    
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(input);
        controller.close();
      }
    });
    
    const compressionStream = new CompressionStream(algorithm);
    const compressedStream = readableStream.pipeThrough(compressionStream);
    
    const compressedData = await new Response(compressedStream).arrayBuffer();
    
    const endTime = performance.now();
    
    results[algorithm] = {
      size: compressedData.byteLength,
      time: endTime - startTime,
      compressionRatio: (1 - compressedData.byteLength / input.byteLength) * 100
    };
  }
  
  console.table(results);
  return results;
}
```

## 降级方案

对于不支持 Compression Streams API 的浏览器，我们可以使用第三方库作为降级方案。以下是一个简单的降级实现示例：

```js
// 压缩工具类（带降级支持）
class CompressionUtil {
  constructor() {
    this.support = checkCompressionSupport();
    // 可以在这里加载替代库，如 pako 或 fflate
    this.fallbackLibrary = null;
  }
  
  async initFallback() {
    if (!this.fallbackLibrary && !this.support.isFullySupported) {
      // 动态加载替代库
      try {
        // 这里使用 pako 作为示例
        const module = await import('https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.esm.mjs');
        this.fallbackLibrary = module;
      } catch (error) {
        console.error('加载降级库失败:', error);
      }
    }
    return this.fallbackLibrary;
  }
  
  async compress(data, algorithm = 'gzip') {
    if (this.support.isCompressionSupported) {
      // 使用原生 API
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(data);
          controller.close();
        }
      });
      
      const compressionStream = new CompressionStream(algorithm);
      const compressedStream = readableStream.pipeThrough(compressionStream);
      
      return await new Response(compressedStream).arrayBuffer();
    } else {
      // 使用降级库
      await this.initFallback();
      if (this.fallbackLibrary) {
        // 这里假设 fallbackLibrary 提供了类似的 API
        return this.fallbackLibrary.deflate(data);
      }
      throw new Error('当前环境不支持压缩功能');
    }
  }
  
  async decompress(data, algorithm = 'gzip') {
    if (this.support.isDecompressionSupported) {
      // 使用原生 API
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(data));
          controller.close();
        }
      });
      
      const decompressionStream = new DecompressionStream(algorithm);
      const decompressedStream = readableStream.pipeThrough(decompressionStream);
      
      return await new Response(decompressedStream).arrayBuffer();
    } else {
      // 使用降级库
      await this.initFallback();
      if (this.fallbackLibrary) {
        // 这里假设 fallbackLibrary 提供了类似的 API
        return this.fallbackLibrary.inflate(data);
      }
      throw new Error('当前环境不支持解压功能');
    }
  }
}

// 使用示例
const compressionUtil = new CompressionUtil();

async function compressWithFallback(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  try {
    const compressedData = await compressionUtil.compress(data);
    console.log('压缩成功，大小:', compressedData.byteLength, '字节');
    return compressedData;
  } catch (error) {
    console.error('压缩失败:', error);
    return data; // 返回原始数据
  }
}
```

## 性能优化和最佳实践

1. **流式处理大文件**：对于大型文件，始终使用流式处理而不是一次性加载整个文件到内存

2. **选择合适的压缩算法**：根据具体需求选择最适合的压缩算法
   - 追求兼容性：选择 gzip
   - 追求最小体积：选择 deflate 或 deflate-raw
   
3. **实现进度监控**：对于长时间运行的压缩/解压操作，实现进度监控以提升用户体验

4. **错误处理**：实现全面的错误处理，特别是在处理网络传输和文件操作时

5. **资源管理**：确保正确关闭流，避免内存泄漏

6. **降级方案**：为不支持的浏览器提供优雅的降级方案

7. **压缩率与性能平衡**：注意不同压缩算法和参数对性能的影响，在压缩率和性能之间找到平衡

## 总结

Compression Streams API 为 Web 应用提供了强大而高效的数据压缩和解压缩能力，无需依赖第三方库。通过与 Streams API、Fetch API 和 File System Access API 等结合使用，可以实现各种复杂的数据处理场景，如大文件上传、数据优化存储等。

虽然目前浏览器支持还不够全面，但通过实现适当的降级方案，我们可以在支持的浏览器中充分利用其性能优势，同时为不支持的浏览器提供替代解决方案。

随着 Web 标准的不断发展，Compression Streams API 有望在未来得到更广泛的支持，成为 Web 应用优化数据传输和存储的重要工具。



