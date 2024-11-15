---
title: Ponyfill
description: Ponyfill
---

大家可以查看两者区别，然后酌情处理。

Polyfill

```js
Number.isNaN = Number.isNaN || function (value) {
	return value !== value;
};
```

Ponyfill

```js
module.exports = function (value) {
	return value !== value;
};
var isNanPonyfill = require('is-nan-ponyfill');

isNanPonyfill(5);
```

我们可以看出 Ponyfill 更加适合尚未稳定的 api，以避免当前 api 在未来进行改动。