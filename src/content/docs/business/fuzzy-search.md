---
title: 模糊搜索
description: 字符串进行模糊搜索
---

微小而快速的 js 模糊搜索库 [fuzzysearch](https://github.com/bevacqua/fuzzysearch)

对于基于轻量级用户输入的过滤数据非常有用。

代码解析如下所示:
```ts
function fuzzysearch (needle: string, haystack: string) {
  const hlen = haystack.length;
  const nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  // 只有每个字符都能在干草堆中找到并且出现在前面的匹配之后，该方法才会返回 true。
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    const nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
```
