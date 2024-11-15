---
title: 通过 Dinero 和 Intl 处理货币数据
description: 通过 Dinero 和 Intl 处理货币数据
---

通过 [货币格式化](./currency) 我们可以把当前数值转换为货币风格。

同时我们可以确立一个主币种，然后所有币种之间的转换的汇率都基于主币种。这样我们就能转换所有的货币的价值。

但是世界上也有一些货币是以 5 为基数的。也有很多货币的单位基数也是不一样的。这样的话，仅仅使用 10 进制是不够用的。

甚至不同的语言和地点可能具有完全不同的格式样式。例如，美式英语中十美元应该写成“$10.00”。但是，在加拿大法语中，相同的金额将是“10,00 $ US”。

这时候，当前的代码就不够用了。我们需要 Intl 以及更加丰富的代码库 [Dinero](https://v2.dinerojs.com/) 。

```js
import { dinero, toFormat } from 'dinero.js';
import { USD } from '@dinero.js/currencies';

function intlFormat(dineroObject, locale, options = {}) {
  function transformer({ amount, currency }) {
    return amount.toLocaleString(locale, {
      ...options,
      style: 'currency',
      currency: currency.code,
    });
  };

  return toFormat(dineroObject, transformer);
};

const d = dinero({ amount: 1000, currency: USD });

intlFormat(d, 'en-US'); // "$10.00"
intlFormat(d, 'fr-CA'); // "10,00 $ US"
```