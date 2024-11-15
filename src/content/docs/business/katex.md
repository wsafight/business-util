---
title: 网页公式排版工具 KaTeX
description: 网页公式排版工具 KaTeX
---

如果你在做教育方向的前端研发，一定离不开繁杂的公式。

我们当然可以提前把公式做成图片，然后通过引入图片来解决当前问题，但是面对不同的试题和不同的平台来说，图片这一方案无疑捉襟见肘。

对于前端浏览器来说，输入 HTML 以及 css。由引擎生成 DOM 和 CSSOM。我们需要一个输入字符串，生成公式的一套 js。

以排版系统来说，大多数人第一个想到的一定是 TeX，TeX 排版系统是高德纳教授为了排版他的七卷本著作 《计算机程序设计艺术》 而编制的。仅仅使用文字就能够生成复杂的排版。

我们迫切需要一个公式排版系统。

[KaTeX](https://github.com/KaTeX/KaTeX) 是一个面向浏览器(node 预渲染)的数学排版库。KaTeX 版面设计基于 Donald Knuth 的 TeX。


这里我写出几个比较常用的公式：

```js
c = \pm\sqrt{a^2 + b^2}
```

我们可以直接写一个页面

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>KaTeX demo</title>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@0.13.2/dist/katex.min.css" integrity="sha384-Cqd8ihRLum0CCg8rz0hYKPoLZ3uw+gES2rXQXycqnL5pgVQIflxAUDS7ZSjITLb5" crossorigin="anonymous">
    <script src="//cdn.jsdelivr.net/npm/katex@0.13.2/dist/katex.min.js" integrity="sha384-1Or6BdeNQb0ezrmtGeqQHFpppNd7a/gw29xeiSikBbsb44xu3uAo8c7FwbF5jhbd" crossorigin="anonymous"></script>
</head>
<body>
<div id="demo1"></div>
<script>
    const demo1 = document.getElementById('demo1')
    katex.render("c = \\pm\\sqrt{a^2 + b^2}", demo1, {
        throwOnError: false
    });
</script>

</body>
</html>
```

我们可以逐步学习 LaTeX 语法，但我们也可以使用 [公式转化工具](https://demo.wiris.com/mathtype/en/developers.php) 来进行导出。

更进一步来说，KaTeX 仅仅可以排列数学化学公式，如果我们想要写出更加漂亮的页面排版。我们可以使用 [LaTeX.js](https://github.com/michael-brade/LaTeX.js) 。你可以在 [playground](https://latex.js.org/playground.html) 中尽情尝试。

