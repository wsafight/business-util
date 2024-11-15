---
title: 搜索和更改代码结构的工具 comby
description: 搜索和更改代码结构的工具 comby
---

Comby 是一个用于搜索和更改代码结构的工具。

## 实例

如下所示：

```bash
comby 'swap(:[1], :[2])' 'swap(:[2], :[1])' -stdin .js <<< 'swap(x, y)'

# 结果
------ /dev/null
++++++ /dev/null
@|-1,1 +1,1 ============================================================
-|swap(x, y)
+|swap(y, x)

```

### 去除 continue

comby 也会忽略空白，以下是去除循环中的 continue。

```bash
comby 'for (:[1]) { continue; }' 'for (:[1]) { }'
```

```js
for (i = 0; i < 10; i++) {
  continue;
}
```

```js
for (i = 0; i < 10; i++) {}
```

