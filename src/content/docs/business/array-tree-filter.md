---
title: 树组件查询
description: 查询已经生成的树组件中的数据，以此来进行查询操作。
---

查询已经生成的树组件中的数据，以此来进行查询操作。

通过 BFS 来搜索树的数据。

```ts
/** 过滤项配置 */
interface FilterOptions {
  /** 子节点对应的名称 */
  childrenKeyName?: string;
}

/** 默认配置项目 */
const DEFAULT_OPTIONS = {
  childrenKeyName: 'children'
}

/**
 * 
 * @param data 树形数据
 * @param filterFn 过滤函数
 * @param options 配置项
 */
function arrayTreeFilter<T>(
  data: T[],
  filterFn: (item: T, level: number) => boolean,
  options: FilterOptions = {...DEFAULT_OPTIONS}
) {
  let children = data || [];
  const result: T[] = [];
  let level = 0;
  do {
    let foundItem: T = children.filter(function(item) {
      return filterFn(item, level);
    })[0];
    if (!foundItem) {
      break;
    }
    result.push(foundItem);
    const childrenKeyName = options?.childrenKeyName ?? 'children'
    children = (foundItem as any)[childrenKeyName] || [];
    level += 1;
  } while (children.length > 0);
  return result;
}
```

