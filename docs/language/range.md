# 取得范围数据

当我们开发的过程中，往往遇到需要固定数据数组，如 [1,2,3,4,5,6] 或者 ['a', 'b', 'c'] 等。

而其他类型语言通常有 [1..6] 这种语法。

range 有如下语法

```ts
// Plain syntax:
range(from, to, step);

// Ruby style syntax:
range('from..to', step);

range(1, 5); // [1, 2, 3, 4, 5]
range(-2, 2); // [-2, -1, 0, 1, 2]
range(0, 0.5, 0.1); // Approximately, JS floats are not exact: [0.1, 0.2, 0.3, 0.4, 0.5]

range('a', 'd'); // ['a', 'b', 'c', 'd']
range('A', 'D'); // ['A', 'B', 'C', 'D']
range('y', 'B'); // ['y', 'z', 'A', 'B']
range('Y', 'b'); // ['Y', 'Z', 'a', 'b']

range(0, 9, 3); // [0, 3, 6, 9]
range('a', 'e', 2); // ['a', 'c', 'e']

range(5, 0); // [5, 4, 3, 2, 1, 0]
range('e', 'a'); ['e', 'd', 'c', 'b', 'a']

range('1..5'); // range(1, 5)
range('a..z'); // range('a', 'z')

// Steps:
range('1..5', 2); // range(1, 5, 2)

// Exclusive ranges:
range('1...5'); // [1, 2, 3, 4]
```

代码如下
```ts
let letters: string = 'abcdefghijklmnopqrstuvwxyz';
letters = letters.toUpperCase() + letters + letters.toUpperCase();

function range(from: string | number, to?: number | string, step: number = 1) {
  let isExclusive, isReversed, isNumberRange, index, finalIndex, parts, tmp;

  let method: string;
  const self: (string | number)[]  = [];

  // Ruby style range? `range('a..z') or `range('a..z', 2)`
  if (arguments.length == 1 || typeof from === 'string' && typeof to == 'number') {
    isExclusive = (from as string).indexOf('...') > -1;
    step = to as number;

    parts = (from as string).split(/\.{2,3}/);
    from = parts[0];
    to = parts[1];
  }

  // Check if the first range part is numeric.
  // `isNaN` is broken, but NaN is the only value that doesn't equal itself.
  isNumberRange = Number(from) == Number(from);

  // 是数字范围
  if (isNumberRange) {
    // JS floats are broken: `0.1 + 0.2 == 0.3 + 4e-17 == 0.30000000000000004`.
    // Dirty fix to make `range(0, 1, 0.1)` work as expected.
    finalIndex = Number(to) + 1e-16;
    index = Number(from);
  } else {

    index = letters.indexOf(from as string);
    method = (from == (from as string).toLowerCase() && to == (to as string).toUpperCase()) ? 'lastIndexOf' : 'indexOf';
    // @ts-ignore
    finalIndex = letters[method](to as string);
  }

  isReversed = index > finalIndex;
  if (isReversed) {
    tmp = index;
    index = finalIndex;
    finalIndex = tmp;
  }

  while (index <= finalIndex) {
    self.push(isNumberRange ? index : letters.charAt(index));
    index += step;
  }

  if (isReversed) self.reverse();
  if (isExclusive) self.pop();

  return self;
}
```

<div style="float: right">更新时间: {docsify-updated}</div>
