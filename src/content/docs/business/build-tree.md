---
title: 根据数组构建树
description: 根据的数组，通过 js 构建树结构对象
---

这里为了简化，就简单设定。如果当前树节点不具有父节点，则 parentId 为 0。对于其他需求，请自行设定配置项。

```typescript
interface TreeItem {
	id: number
    // 父节点的 id
	parentId: number
    // 当前树的名称
	name: string
}
```

## for 循环使用

事实上，在业务层面构建一棵树不算难。但是可能还是有一些算法基础不太好的小伙伴不能很快的写出来，此时我们可以用最简单的方式。直接多层 for 循环。

```ts
function buildTree(treeItems) {
  /** 构建第一层 */  
  const treeRoots = treeItems.filter(x => x.parentId === 0)
  
  for (let first of treeRoots) {
    /** 第一层子节点 */  
    first.children = treeItems.filter(x => x.partner === first.id)
      /** 构建第二层 */
      for(let second of first.children) {
        // ...       
      }
  }
}
```

该方案在实际业务基本不可以用，除非在实际业务中限制树的层级并且只有前几层。而且层级越大,代码量也就越大，性能也就越差。

但是基本上所有的树操作在所有的节点中寻并插入父节点，所以该方案作为树结构的基本思路，我在此时列出以便大家可以循序渐进的思考和改进。

## 递归构建

通过上述代码，很简单就可以发现我们可以把当前问题分解为多个子问题。而每个子问题都是在寻找该节点的子节点，并且插入父节点的 children 中。根据这一点，我们不难写出如下递归代码。

```javascript
/** 构建树 */
const buildTree = (treeItems, id = 0) =>
  treeItems
    // 找到当前节点所有的孩子
    .filter(item => item.parentId === id)
    // 继续递归找
    .map(item => ({ ...item, children: buildTree(treeItems, item.id) }));

```

根据当前递归，我们减少了代码的冗余，并且可以“无限”的构建下去。不计算递归本身的时间复杂度（后面有机会再说递归本身耗费的时间复杂度）的情况下，每一次都要遍历一次数组。而数组每一个数据都要便利一次，可以得出时间复杂度是 O(n<sup>2</sup>)。

对于大部分业务需求来说，现在可以结束了，因为在大部分业务场景中树结构本身不太会有很多的数据量。就算数据量很大的情况下，我们也可以通过组件延迟加载的方式解决。

## 利用对象引用构建树

上述方案是常规方案，但是问题在于，性能还是低下。

性能低下的原因之一在于递归更加耗费性能而且可能会导致栈溢出错误（js 到目前没有实现尾递归优化），这一点我们可以利用递归转循环来做(后面再说，现在没必要)。

同时在每次构建一个节点的孩子时，都需要遍历整个数组一次，这个也是很大的损耗。事实上，优秀的算法应该是可以**复用**前面已经计算过的属性。

那么我们是否能够通过一次循环解决子节点问题呢？答案也是肯定的。先上代码:

```javascript
function buildTreeOptimize (items) {
  // 由业务决定是否需要对 items 深拷贝一次。这里暂时不做
  
  // 把每个子节点保存起来，以便后面插入父节点
  const treeDataByParentId = new Map()
  
  // 对每节点循环，找其父节点，并且放到数组中    
  items.forEach(item => {
    // map 中有父数据，插入，没有，构建并插入   
    treeDataByParentId.has(item.parentId) ? treeDataByParentId.get(item.parentId).push(item) : treeDataByParentId.set(item.parentId, [item])
  })

  // 树第一层  
  const treeRoots = []
  
  // 对每一个节点循环，找其子节点
  items.forEach(item => {
    // 子节点插入当前节点  
    item.children = (treeDataByParentId.get(item.id) || [])
    // 当前节点不具备父节点，插入第一层数组中
    if (!item.parentId) {
      treeRoots.push(item)
    }
  })
    
  // 返回树结构
  return treeRoots
}

```

两次 for 循环完成了树的构建？该算法时间复杂度是O(n)!! 可以说相当快，毕竟对于之前的代码，每个节点查询一次都要 O(n) 一次。

在第一次循环中，我们帮助所有的节点寻找到了父节点。即都存储到了 map 中去。在这一步中，所有的子节点按照服务端给予的数据顺序依次插入。第二次循环中，我们直接在原 items 循环并插入第一布找到的子节点。插入节点.

其实这个算法的精妙之处在于第一步塞入 map 中的树对象和第二步塞入父节点中的树对象是是同一个对象!!!

表面上，第二步只是寻找每一个节点的子节点，但实际上在把当前节点修改的“同时”，map 中的对象节点也被改掉了，因为他们都是同一个对象(每一层的父子关系都搞定了)。所以最终仅仅只通过两次遍历便拿到关于树的数据。

大部分情况下上在业务层面做到这里就没什么太大问题了。例如 Element Tree 树形组件。以及 Ant Design 的 TreeSelect 组件。当然，同样的代码依然适合服务端开发。

## 一次循环解决问题

这次优化可以把两次循环简化为一次，但可读性下降。

```ts
 function arrayToTree(items: Item[], config: Partial<Config> = {}): TreeItem[] {
  const conf: Config = { ...defaultConfig, ...config };
  // the resulting unflattened tree
  const rootItems: TreeItem[] = [];

  // stores all already processed items with ther ids as key so we can easily look them up
  const lookup: { [id: string]: TreeItem } = {};

  // idea of this loop:
  // whenever an item has a parent, but the parent is not yet in the lookup object, we store a preliminary parent
  // in the lookup object and fill it with the data of the parent later
  // if an item has no parentId, add it as a root element to rootItems
  for (const item of items) {
    const itemId = item[conf.id];
    const parentId = item[conf.parentId];
    // look whether item already exists in the lookup table
    if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
      // item is not yet there, so add a preliminary item (its data will be added later)
      lookup[itemId] = { children: [] };
    }

    // add the current item's data to the item in the lookup table
    if (conf.dataField) {
      lookup[itemId][conf.dataField] = item;
    } else {
      lookup[itemId] = { ...item, children: lookup[itemId].children };
    }

    const TreeItem = lookup[itemId];

    if (parentId === null) {
      // is a root item
      rootItems.push(TreeItem);
    } else {
      // has a parent

      // look whether the parent already exists in the lookup table
      if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
        // parent is not yet there, so add a preliminary parent (its data will be added later)
        lookup[parentId] = { children: [] };
      }

      // add the current item to the parent
      lookup[parentId].children.push(TreeItem);
    }
  }

  return rootItems;
}
```

