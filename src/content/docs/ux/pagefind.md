---
title: 静态网站搜索工具 pagefind
description: 静态网站搜索工具 pagefind
---

pagefind 与其他网站搜索工具不同，该库只需要当前网站静态文件的文件夹。也就是说它可以适用于 Hugo、Eleventy、Jekyll、Next、Astro、SvelteKit，并在其构建后运行。


例如我们可以在 astro build 直接使用 pagefind。

```bash
"build": "astro build && pagefind --site dist",
```

pagefind 这个命令会在 dist 文件夹中生成 pagefind 文件夹。

