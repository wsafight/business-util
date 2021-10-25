# 基于数字范围生成高性能正则

快速编写一份正确匹配数字范围正则表达式非常复杂。[to-regex-range](https://github.com/micromatch/to-regex-range) 可以帮助我们快速构建正则。

我们可以这样使用它.

```ts
const toRegexRange = require('to-regex-range');

const source = toRegexRange('15', '95');
//=> 1[5-9]|[2-8][0-9]|9[0-5]

const regex = new RegExp(`^${source}$`);
console.log(regex.test('14')); //=> false
console.log(regex.test('50')); //=> true
console.log(regex.test('94')); //=> true
console.log(regex.test('96')); //=> false

console.log(toRegexRange('-10', '10'));
//=> -[1-9]|-?10|[0-9]

console.log(toRegexRange('-10', '10', { capture: true }));
//=> (-[1-9]|-?10|[0-9])
```


