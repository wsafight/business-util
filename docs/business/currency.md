# 货币格式化

针对不同的货币，有不同的表示格式。通常接口如下所示

```ts
/** 币种设置 */
interface CurrencySetting {
  /** 币种名称, 如 CNY USD 等 */
  name: string;
  /** 币种符号, 如 $ ¥ 等 */
  symbol: string;
  /** 符号位置 (前置 ｜ 后置) */
  symbolPosition: 'before' | 'after';
  /** 小数点 符号 */
  decimal: string;
  /** 分组字符串 通常 3 个一组，为 ,。辅助用户查看清晰  */
  group: string;
  /** 小数点保留位数, 默认值为 2 */
  precision: number;
}
```
基于此我们可以编写自己的代码。

```ts
// TODO
```

同时我们可以直接使用 [accounting.js](http://openexchangerates.github.io/accounting.js/) 或者 [Accounting-js](https://nashdot.github.io/accounting-js/) 库

<div style="float: right">更新时间: {docsify-updated}</div>
