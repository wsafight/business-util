---
title: 切换中文简繁字体
description: 切换中文简繁字体
---

只用如下所示的 css 属性就可以完成中文字体切换。

```css
body {
  font-variant-east-asian: traditional;
}
```

但该功能需要当前浏览器内含繁体字字体， Windows 系统没有对应的繁体字体，所以不能默认使用。