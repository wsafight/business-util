# js 脚本动态加载

针对于项目来说，往往一些代码不需要在首屏加载。

对于现代浏览器来说，我们不需要用这些机制，直接使用 import 即可。

```ts

/**
 * 动态添加css
 * @param {String}  url 指定要加载的css地址
 */
function loadLink(url: string) {
  const doc = document;
  const link = doc.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", url);

  const heads = doc.getElementsByTagName("head");
  if (heads.length) {
    heads[0].appendChild(link);
  }
  else {
    doc.documentElement.appendChild(link);
  }
}
```

```ts
/**
 * 动态添加一组css
 * @param {String}  url 指定要加载的css地址
 */
function loadLinks(urls: string[] | string) {
  if (typeof (urls) !== 'object') {
    urls = [urls];
  }
  if (urls.length) {
    urls.forEach(url => {
      loadLink(url);
    });
  }
}
```

<div style="float: right">更新时间: {docsify-updated}</div>
