---
title: 奇怪的 parseInt(0.0000005)
description: 奇怪的 parseInt(0.0000005)
---

```js
['1', '2', '3'].map(parseInt)

// => [1, NaN, NaN] 
```

上面的题目您一定不陌生，原因是 parseInt 还接受第二个参数：

即是 **parseInt(numericalString, radix)**,而第二个参数是第一个参数所在的基数。

```js
const number = parseInt('100', 2);
number; // 4
```

当然，如果第二个值为 falsy(false, 0 ,'', null, undefined) 值的话，则默认为 10。
所以：

```js
['1', '2', '3'].map(parseInt)
// parseInt('1', 0) => 1

// 当前 1 进制，遇到 2 无法转换
// parseInt('2', 1) => NaN 

// 当前 2 进制，遇到 3 无法转换
// parseInt('3', 2) => NaN 

// => [1, NaN, NaN] 
```

这是细节上的考量，我们今天要解的问题是：

```js
parseInt(0.0000005);
// => 5

// 字符串是正确的
parseInt('0.0000005');
// => 0

// 少一个 0 也没错
parseInt(0.000005);
// => 0
```

原因为：


由于 0.0000005 === 5e-7， 所以内部将其转换为

```js
parseInt(5e-7);
```

如果第一个参数不是字符串，内部则将其转换为字符串，然后进行解析，并返回解析后的整数。然后就会变成
```js
parseInt('5e-7');
// => 5

parseInt('5adfdfdf');
// => 5
```

最终 **parseInt** 会忽略 e - 7,变为 5。

同样 999999999999999999999 === 1e+21 , 所以 parseInt(999999999999999999999) === 1。

如果当前数字类型为 bigInt，则不会发生该情况。parseInt(999999999999999999990n) === 1e+21。为什么呢？