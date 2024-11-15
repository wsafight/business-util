---
title: 压缩传递对象的 JavaScript 工具库 u-node
description: 压缩传递对象的 JavaScript 工具库 u-node
---

[μ-node](https://github.com/ananthakumaran/u) 是一个用于对 JavaScript 对象进行编码/解码的 JavaScript 库。该库库的主要目的是压缩数据从而减少数据存储或者网络传输。通过定义状态规范完成对应数据的处理。同时还可以通过版本控制来升级对应状态。

## 使用实例

该库的作者只写了一些基本类型的规范。但实际上可以做的远不止如此。例如：

```js
import { fromJson, encode, decode } from "u-node";
import isEqual from "lodash.isequal";

/** 定义状态规范，数组中数据表明该数据的类型 */
const heroSpec = {
  /** varchar 表明当前数据是一个可变字符串 */
  name: ["varchar"],
  /** 布尔类型 */
  isMelee: ['boolean'],
  /** oneOf 表明从该数组中后面的数据中选择一个数据 */
  sex: ["oneOf", "male", "female"],
  /** ["fixedchar", 10] 表明当前数据是一个定长为 10 的字符串，如 '1996-05-21' */
  birthday: ["fixedchar", 10],
  /** tuple 表明该数据是一个元组。同时是两个数字类型 */
  attack: ["tuple", ["integer"] /* min */, ["integer"] /* max */],
  /** array + oneOf 表明是一个多选项  */
  positioning: ["array", ["oneOf", "carry", "support", "ganker"]],
  /** 对应数据是对象直接使用对象字面量继续处理即可  */
  growing: {
    strength: ["integer"],
    agility: ["integer"],
    intelligence: ["integer"],
  },
};

const heroV1 = fromJson(1, heroSpec);

const source = {
  name: "卡尔",
  positioning: ['carry', 'ganker'],
  isMelee: false,
  birthday: '2005-06-06',
  attack: [2, 10],
  positioning:['carry', 'support'],
  growing: {
    // 此处必须是整数，所以成长点数都 x 10
    strength: 24,
    agility: 18,
    intelligence: 40
  }
};

var heroStr = encode(heroV1, source);
//=> bIibytqfYdAaVcd2005-06-06c卡尔c
const data = decode([heroV1], heroStr); 

// true
isEqual(data, source);
```

我们对比一下 JSON.stringify 与 u-node encode。

```js
'bIibytqfYdAaVcd2005-06-06c卡尔c'

'{"name":"卡尔","positioning":["carry","support"],"isMelee":false,"birthday":"2005-06-06","attack":[2,10],"growing":{"strength":24,"agility":18,"intelligence":40}}'
```

## 实际场景

### 存储传递查询条件

### 用户分享数据存储

## 源码解析
