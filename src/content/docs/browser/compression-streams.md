---
title: 浏览器原生压缩流 API (Compression Streams)
description: 利用浏览器原生 Compression Streams API 高效处理数据流压缩和解压缩
---

## Compression Streams API 概述

Compression Streams API 是浏览器提供的原生接口，允许 Web 应用直接在浏览器中使用 gzip、deflate 或 deflate-raw 算法压缩和解压缩数据流。该 API 基于 Streams API 构建，可以高效处理大型文件和数据流，而不会阻塞主线程或占用过多内存。

### 主要优势

- **原生性能**：直接利用浏览器内置的压缩算法，无需加载额外的 JavaScript 库
- **流式处理**：支持流式处理大型文件，避免一次性加载整个文件到内存
- **异步操作**：基于 Promise 和 Streams API，不会阻塞主线程
- **简洁的 API**：接口直观，易于集成到现有代码中

## 浏览器兼容性

Compression Streams API 的浏览器支持情况（截至 2025 年 12 月）：

| 浏览器 | 支持情况 | 最低版本 |
|--------|----------|----------|
| Chrome | ✅ 支持 | 80+ |
| Edge | ✅ 支持 | 80+ |
| Safari | ✅ 支持 | 16.4+ |
| Firefox | ✅ 支持 | 113+ |
| Opera | ✅ 支持 | 67+ |
| IE | ❌ 不支持 | - |

建议在使用前检查浏览器是否支持该 API：

```js
// 检查 Compression Streams API 支持情况
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
  console.warn('当前浏览器不完全支持 Compression Streams API');
  // 可以在这里加载降级方案
}
```

## 基本用法

### 压缩数据

使用 `CompressionStream` 构造函数创建压缩流：

```js
// 压缩字符串数据
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

  // 创建 gzip 压缩流
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

使用 `DecompressionStream` 构造函数解压数据：

```js
// 解压数据
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

  return text;
}
```

## 实际应用场景

### 1. 压缩网络请求

通过在客户端压缩数据后再发送，可以显著减少传输的数据量：

```js
// 压缩数据并发送到服务器
async function sendCompressedData(data) {
  try {
    // 转换数据
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

    return await response.json();
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
}

// 使用示例
await sendCompressedData({
  username: 'user123',
  actions: Array(1000).fill({ type: 'click', x: 100, y: 200 })
});
```

### 2. 结合文件系统 API 处理文件

将 Compression Streams API 与 [浏览器文件操作 API](./browser-fs-access.md) 结合，可以高效处理文件的压缩和解压缩：

```js
import { fileOpen, fileSave } from 'browser-fs-access';

// 压缩本地文件
async function compressLocalFile() {
  try {
    // 打开文件选择器
    const file = await fileOpen({
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
    });

    console.log('文件压缩成功');
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('文件压缩失败:', error);
    }
  }
}

// 解压本地文件
async function decompressLocalFile() {
  try {
    // 打开压缩文件
    const compressedFile = await fileOpen({
      extensions: ['.gz', '.tgz'],
      description: '请选择要解压的文件'
    });

    // 创建可读流
    const readableStream = compressedFile.stream();

    // 创建解压流
    const decompressionStream = new DecompressionStream('gzip');
    const decompressedStream = readableStream.pipeThrough(decompressionStream);

    // 保存解压后的文件
    const originalFileName = compressedFile.name.replace(/\.gz$/, '');
    await fileSave(new Response(decompressedStream), {
      fileName: originalFileName,
    });

    console.log('文件解压成功');
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('文件解压失败:', error);
    }
  }
}
```

### 3. 带进度的大文件压缩上传

对于大文件压缩上传，结合 TransformStream 实现进度跟踪：

```js
// 压缩上传大文件并显示进度
async function compressAndUploadWithProgress(file, onProgress) {
  try {
    let processedBytes = 0;
    const totalBytes = file.size;

    // 创建进度跟踪转换流
    const progressTransform = new TransformStream({
      transform(chunk, controller) {
        processedBytes += chunk.byteLength;
        if (onProgress) {
          onProgress({ loaded: processedBytes, total: totalBytes });
        }
        controller.enqueue(chunk);
      }
    });

    // 管道: 文件流 -> 压缩流 -> 进度流
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

### 4. 批量文件压缩工具

```js
// 批量压缩文件
async function batchCompressFiles(files) {
  const results = [];

  for (const file of files) {
    try {
      const startTime = performance.now();

      // 创建压缩流
      const compressedStream = file.stream()
        .pipeThrough(new CompressionStream('gzip'));

      // 获取压缩后的数据
      const compressedResponse = new Response(compressedStream);
      const compressedBlob = await compressedResponse.blob();

      const endTime = performance.now();

      results.push({
        originalName: file.name,
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressionRatio: ((1 - compressedBlob.size / file.size) * 100).toFixed(2) + '%',
        duration: (endTime - startTime).toFixed(2) + 'ms'
      });
    } catch (error) {
      results.push({
        originalName: file.name,
        error: error.message
      });
    }
  }

  return results;
}

// 使用示例
const files = await fileOpen({ multiple: true });
const results = await batchCompressFiles(files);
console.table(results);
```

## 压缩算法对比

Compression Streams API 支持三种压缩算法：

| 算法 | 描述 | 优点 | 适用场景 |
|------|------|------|----------|
| `gzip` | 最常用的压缩格式，包含头部和校验信息 | 广泛支持，兼容性好 | 网络传输、文件存储 |
| `deflate` | 基本的压缩算法，不包含头部和校验信息 | 压缩率较好，体积较小 | 对大小敏感的应用 |
| `deflate-raw` | 原始的 deflate 压缩，无任何封装 | 压缩后体积最小 | 内部数据传输 |

不同算法的使用方式相同，只需更改构造函数参数：

```js
// 使用不同的压缩算法
const algorithms = ['gzip', 'deflate', 'deflate-raw'];

async function compressWithAlgorithm(data, algorithm = 'gzip') {
  const encoder = new TextEncoder();
  const input = encoder.encode(data);

  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(input);
      controller.close();
    }
  });

  const compressionStream = new CompressionStream(algorithm);
  const compressedStream = readableStream.pipeThrough(compressionStream);

  return await new Response(compressedStream).arrayBuffer();
}

// 对比不同算法的压缩效果
async function compareAlgorithms(text) {
  const results = {};

  for (const algorithm of algorithms) {
    const compressed = await compressWithAlgorithm(text, algorithm);
    results[algorithm] = {
      size: compressed.byteLength,
      ratio: ((1 - compressed.byteLength / text.length) * 100).toFixed(2) + '%'
    };
  }

  return results;
}
```

## 降级方案

对于不支持 Compression Streams API 的浏览器，可以使用第三方库作为降级方案：

```js
// 压缩工具类（带降级支持）
class CompressionUtil {
  constructor() {
    this.support = this.checkSupport();
    this.fallbackLibrary = null;
  }

  checkSupport() {
    return {
      isCompressionSupported: 'CompressionStream' in window,
      isDecompressionSupported: 'DecompressionStream' in window,
      isFullySupported: 'CompressionStream' in window && 'DecompressionStream' in window
    };
  }

  async initFallback() {
    if (!this.fallbackLibrary && !this.support.isFullySupported) {
      // 动态加载替代库（如 pako 或 fflate）
      try {
        this.fallbackLibrary = await import('https://esm.sh/pako@2.1.0');
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
        const pako = this.fallbackLibrary;
        const compressed = pako.gzip(data);
        return compressed.buffer;
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
        const pako = this.fallbackLibrary;
        const decompressed = pako.ungzip(new Uint8Array(data));
        return decompressed.buffer;
      }
      throw new Error('当前环境不支持解压功能');
    }
  }
}

// 使用示例
const compressionUtil = new CompressionUtil();

async function compressText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  try {
    const compressedData = await compressionUtil.compress(data);
    console.log('压缩成功，大小:', compressedData.byteLength, '字节');
    return compressedData;
  } catch (error) {
    console.error('压缩失败:', error);
    return data;
  }
}
```

## 性能优化建议

1. **流式处理大文件**
   - 始终使用流式处理，避免一次性加载整个文件
   - 利用 `pipeThrough()` 链式处理数据流

2. **选择合适的压缩算法**
   - 追求兼容性：选择 `gzip`
   - 追求最小体积：选择 `deflate` 或 `deflate-raw`

3. **实现进度监控**
   - 对于长时间运行的压缩/解压操作，使用 TransformStream 实现进度跟踪
   - 为用户提供实时反馈

4. **错误处理**
   - 捕获和处理网络传输、文件操作中的错误
   - 区分用户取消操作和真正的错误

5. **资源管理**
   - 确保正确关闭流，避免内存泄漏
   - 及时释放不再需要的对象 URL

6. **压缩率与性能平衡**
   - 注意不同压缩算法对性能的影响
   - 在压缩率和处理速度之间找到平衡

## 总结

Compression Streams API 为 Web 应用提供了强大而高效的数据压缩和解压缩能力，无需依赖第三方库。通过与 Streams API、Fetch API 和 File System Access API 等结合使用，可以实现各种复杂的数据处理场景。

随着浏览器支持的不断完善，Compression Streams API 已成为优化数据传输和存储的重要工具，值得在现代 Web 应用中广泛采用。
