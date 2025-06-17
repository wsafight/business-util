---
title: 驼峰命名转化工具 camelcase-keys
description: 驼峰命名转化工具 camelcase-keys
---

[camelcase-keys](https://github.com/sindresorhus/camelcase-keys) 是一个用于将对象键名从下划线格式(snake_case)转换为驼峰格式(camelCase)的工具。它可以递归处理嵌套对象和数组，确保所有层级的键名都被转换。
主要功能特点：

- 支持递归转换嵌套对象结构
- 自动处理数组中的对象元素
- 保留原始值不变，仅修改键名格式

```TypeScript
import camelcaseKeys from 'camelcase-keys';

camelcaseKeys({}, {
  deep: true
})
```

再配合 [type-fest](https://github.com/sindresorhus/type-fest) 库中的 CamelCasedPropertiesDeep 方法。即可以实现 ts 类型转换。
