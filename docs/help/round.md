# 利用 Math.round 进行小数位的四舍五入

用于解决 0.1 + 0.2 = 0.30000000000000004 这种问题



用 fixed 格式化， toFixed 本身有问题
```
(11.545).toFixed(2)  =>  "11.54"
```
[math](https://mathjs.org) 过于庞大，仅仅只用于格式化两位小数太过笨重

原理 Math.round () 函数返回一个数字四舍五入后最接近的整数。
```js
  Math.round(3.44444444)
  // => 3
  Math.round(3.55555) 
  // => 4
  // 实现方式
  round(0.1 + 0.2, 2) 
  // => 0.3
 
  // 计算过程 =>
  round(0.30000000000000004 * 100) / 100
  round(30.000000000000004) / 100
  // 30 / 100 0.3
```

利用 + 号可以直接转换 字符串为 数字，** === Math.pow
  
```ts
/**
 *
 * @param number 数字
 * @param precision 小数位数
 */
function round(number: number, precision: number = 2) {
	return Math.round(+(number + 'e' + precision)) / (10 ** precision)
}
```

通常前端计算不需要那么高的精度，在计算完成直接调用该函数即可。

注意该函数会在 number 较小或较大的情况下出现问题，如数字本身就使用了科学计数法。

所以在这里做一个优化:

```ts
function round  (number: number, precision: number = 2) {
  const powNum = Math.pow(10, precision);
  return Math.round(number * powNum) / powNum;
};
```

<div style="float: right">更新时间: {docsify-updated}</div>

