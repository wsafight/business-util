# 货币格式化

针对不同的货币，有不同的表示格式。通常接口如下所示

```ts
interface CurrencySetting {
  /** 货币名称，如 CNY USD 等 */
  name: string;
  /** 符号， 如 $ ¥ 等 */
  symbol: string;
  /** 精确度 小数点后几位, 默认值为 2 */
  precision?: number; 
  /** 隔离小数的分割符 (, | .) 等 */
  decimal: string;
  /** 分组符号，通常 3 个一组，为 ,。辅助用户查看清晰 */
  group: string;
  /** 符号位置 */
  symbolPosition: 'before' | 'after'
}
```
基于此我们可以编写自己的代码。

```ts
// TODO
```

同时我们可以直接使用 [accounting.js](http://openexchangerates.github.io/accounting.js/) 或者 [Accounting-js](https://nashdot.github.io/accounting-js/) 库