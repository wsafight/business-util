---
title: 对比 switch (true) 和 if else 判断
description: 对比 switch (true) 和 if else 判断
---

刚刚学习编程的时候，我们就使用分支判断，其中 if 的适用性要比 switch 宽泛很多。当年我使用过除法的方式把 if 判断改为了 switch。

这一次，我学到了一个新的模式： switch (true)

通常我们会用 if 判断当前代码。

```js
const user = {
  firstName: "Seán",
  lastName: "Barry",
  email: "my.address@email.com",
  number: "00447123456789",
};

if (!user) {
  throw new Error("User must be defined.");
} else if (!user.firstName) {
  throw new Error("User's first name must be defined");
} else if (typeof user.firstName !== "string") {
  throw new Error("User's first name must be a string");
} else if (// ... lots more validation here)

return user;
```

但我们也可以使用 switch：

```js
const user = {
  firstName: "Seán",
  lastName: "Barry",
  email: "my.address@email.com",
  number: "00447123456789",
};

switch (true) {
  case !user:
    throw new Error("User must be defined.");
  case !user.firstName:
    throw new Error("User's first name must be defined");
  case typeof user.firstName !== "string":
    throw new Error("User's first name must be a string");
  default:
    return user;
}
```

它更好？或者更坏？