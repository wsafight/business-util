# js 脚本动态加载

针对于项目来说，往往一些代码不需要在首屏加载。

对于现代浏览器来说，我们不需要用这些机制，直接使用 import 即可。

```ts
/**
 * 串行加载指定的脚本
 * 串行加载[异步]逐个加载，每个加载完成后加载下一个
 * 全部加载完成后执行回调
 * @param {Array|String}  scripts 指定要加载的脚本
 * @param {Object} options 属性设置
 * @param {Function} callback 成功后回调的函数
 * @return {Array} 所有生成的脚本元素对象数组
 */
function seriesLoadScripts(
  scripts: string | string[],
  options: Record<string, any>,
  callback: () => void
) {
  if (typeof (scripts) !== 'object') {
     scripts = [scripts];
  }
  const HEAD = document.getElementsByTagName('head')[0] || document.documentElement;
  const s: any[] = [];
  const last = scripts.length - 1;
  //递归
  const recursiveLoad = function (i: number) {
    s[i] = document.createElement('script');
    s[i].setAttribute('type', 'text/javascript');
    // Attach handlers for all browsers
    // 异步
    s[i].onload = s[i].onreadystatechange = function () {
      if (!/*@cc_on!@*/0 || this.readyState === 'loaded' || this.readyState === 'complete') {
        this.onload = this.onreadystatechange = null;
        this.parentNode.removeChild(this);
        if (i !== last) {
          recursiveLoad(i + 1);
        } else if (typeof (callback) === 'function') {
          callback()
        }
      }
    }
    // 同步
    s[i].setAttribute('src', scripts[i]);

    // 设置属性
    if (typeof options === 'object') {
      for (let attr in options) {
        s[i].setAttribute(attr, options[attr])
      }
    }
    HEAD.appendChild(s[i]);
  };
  recursiveLoad(0);
}
```

```ts
/**
 * 并行加载指定的脚本
 * 并行加载[同步]同时加载，不管上个是否加载完成，直接加载全部
 * 全部加载完成后执行回调
 * @param {Array|String}  scripts 指定要加载的脚本
 * @param {Object} options 属性设置
 * @param {Function} callback 成功后回调的函数
 * @return {Array} 所有生成的脚本元素对象数组
 */

function parallelLoadScripts(scripts: string[] | string, options: Record<string, any>, callback: () => void) {
  if (typeof (scripts) !== 'object') {
     scripts = [scripts];
  }
  const HEAD = document.getElementsByTagName('head')[0] || document.documentElement;
  const s: any[] = [];
  let loaded = 0;
  for (let i = 0; i < scripts.length; i++) {
    s[i] = document.createElement('script');
    s[i].setAttribute('type', 'text/javascript');
    // Attach handlers for all browsers
    // 异步
    s[i].onload = s[i].onreadystatechange = function () {
      if (!/*@cc_on!@*/0 || this.readyState === 'loaded' || this.readyState === 'complete') {
        loaded++;
        this.onload = this.onreadystatechange = null;
        this.parentNode.removeChild(this);
        if (loaded === scripts.length && typeof (callback) === 'function') callback();
      }
    };
    // 同步
    s[i].setAttribute('src', scripts[i]);

    // 设置属性
    if (typeof options === 'object') {
      for (let attr in options) {
        s[i].setAttribute(attr, options[attr]);
      }
    }

    HEAD.appendChild(s[i]);
  }
}
```

<div style="float: right">更新时间: {docsify-updated}</div>
