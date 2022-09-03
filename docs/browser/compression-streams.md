# 浏览器内置的压缩 API Compression Streams

Compression Streams API 可以使用 gzip 或 deflate（或 deflate-raw）格式压缩和解压缩数据流。

不过目前仅只有 Chrome 和 Safari 支持这个 API。所以我们仍旧需要判断使用。

```js
const isSupport = 'CompressionStream' in window
if (!isSupport) {
  throw new Error("Your browser doesn't support the CompressionStream API, Please use Chrome or Safari")
  // 使用其他工具类
}
```

加载并转化文件，保存文件在 [浏览器文件操作](./browser-fs-access)

```js
// 获取后端文件
const readableStream = await fetch('xxxx.pdf').then(
  (response) => response.body
)

// gzip 压缩
const compressedReadableStream = readableStream.pipeThrough(
  new CompressionStream('gzip')
);

// 保存文件压缩文件
await fileSave(new Response(compressedReadableStream), {
  fileName: 'xxxx.zip',
  extensions: ['.zip'],
});
```

当然也有解压 API。

```js
const decompressedReadableStream = compressedReadableStream.pipeThrough(
  new DecompressionStream('gzip')
);
```



