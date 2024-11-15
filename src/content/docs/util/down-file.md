---
title: 文件下载
description: 文件下载
---

从浏览器下载文件是一件很正常的操作。我们通常会处理两种情况的文件。一种是服务器发送未生成文件的文件流，另一种是下载已经生成的文件。

我们可以通过传入不同的参数来决定哪一种情况的下载。
```ts
/**
 * 下载文件
 * @param urlOrFilename
 * @param content
 * @param mime
 */
export default function downloadFile(
  urlOrFilename: string,
  content?: BlobPart,
  mime?: string,
  bom?: string) {
  // 如果传递第二个参数，走下载流,否则直接请求 url
  if (content) {
    downloadContent(content, urlOrFilename, mime, bom)
  } else {
    downloadUrl(urlOrFilename)
  }
}
```

## 通过文件流下载文件

通过文件流下载的代码使用了 [file-download](https://github.com/kennethjiang/js-file-download/blob/master/file-download.js) 库。该库对各种浏览器进行了兼容。

```ts
/**
 * https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param filename
 * @param content
 * @param mime
 */
function downloadContent(data: string | ArrayBuffer | ArrayBufferView | Blob,
                         filename: string,
                         mime?: string,
                         bom?: string) {
  // 如果当前 bom 为 null, IE 11 报错
  const blobData = (typeof bom !== 'undefined') ? [bom, data] : [data]
  const blob = new Blob(blobData, {
    // 当前没有指定类型，直接使用任意格式
    type: mime || 'application/octet-stream'
  });

  // IE9 以上的 IE 浏览器都会报一个 request URI too large 的错误, 直接使用 msSaveBlob
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    // 兼容 webkitURL
    const blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);

    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);

    // 当前浏览器不支持 h5 download，打开
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }

    document.body.appendChild(tempLink);
    tempLink.click();

    // 修复移动端 safari 浏览器下载 bug "webkit blob resource error 1"
    setTimeout(function () {
      document.body.removeChild(tempLink);
      // 释放 url 对象
      window.URL.revokeObjectURL(blobURL);
    }, 200)
  }
}
```

## 下载已生成文件

早期的文件下载通过 window.open 携带参数打开新的浏览器标签页，通过浏览器来决定如何处理当前文件(展示或者下载)，但是弹出标签页非常影响用户体验。

然后开发者通过创建具有 download 属性的 a 标签进行下载。该方案针对图片等会发生直接跳转且无法实现跨域。

```ts
const url = 'fileApi/AccountTemplate.xlsx'
const link = document.createElement('a')
link.style.display = 'none'
link.href = url
link.setAttribute(
  'download',
  '导入学生账号模板'
)
document.body.appendChild(link)
link.click()
```

最佳的方案是 iframe ，因为可以直接无感知下载文件。

```ts
function downloadUrl(url: string) {
  let el: any = document.getElementById('iframeForDownload') as HTMLElement
  if (!el) {
    el = document.createElement('iframe')
    el.id = 'iframeForDownload'
    el.style.width = 0
    el.style.height = 0
    el.style.position = 'absolute'
    document.body.appendChild(el)
  }
  el.src = url 
}
```

但很可惜，出于沙盒安全性考虑，83 版本的 chrome 浏览器默认禁止了 iframe 嵌套页面。所以我们不但需要对当前代码进行修改，还需要对响应头进行修改。
