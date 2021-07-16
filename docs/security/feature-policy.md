# 确保站点安全与隐私的响应头 Feature Policy

最近朋友询问我有关下载图片的问题，我毫不犹豫的扔出了许久之前的开发代码。

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
之前下载文件代码也包括下载文件流数据，具体可以直接参考[文件下载](../util/down-file.md)

但很可惜，朋友的一句”并没有形成下载“顿时让我非常受挫。

