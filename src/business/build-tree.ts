export interface Item {
  id?: number;
  parentId?: number | null;
  [key: string]: any;
}

export interface TreeItem extends Item{
  children: TreeItem[];
}

export interface Config {
  id: string;
  parentId: string;
  dataField: string | null;
}

const defaultConfig: Config = {
  id: 'id',
  parentId: 'parentId',
  dataField: 'data',
};

function buildTree(treeItems: Item[], id = 0): TreeItem[] {
  return treeItems
    // 找到当前节点所有的孩子
    .filter(item => item.parentId === id)
    // 继续递归找
    .map(item => ({ ...item, children: buildTree(treeItems, item.id) }));
}


function buildTreeOptimize(items: any[]) {
  // 由业务决定是否需要对 items 深拷贝一次。这里暂时不做

  // 把每个子节点保存起来，以便后面插入父节点
  const treeDataByParentId = new Map()

  // 对每节点循环，找其父节点，并且放到数组中
  items.forEach(item => {
    // map 中有父数据，插入，没有，构建并插入
    treeDataByParentId.has(item.parentId) ? treeDataByParentId.get(item.parentId).push(item) : treeDataByParentId.set(item.parentId, [item])
  })

  // 树第一层
  const treeRoots: any[] = []

  // 对每一个节点循环，找其子节点
  items.forEach(item => {
    // 子节点插入当前节点
    item.children = (treeDataByParentId.get(item.id) || [])
    // 当前节点不具备父节点，插入第一层数组中
    if (!item.parentId) {
      treeRoots.push({ item })
    }
  })

  // 返回树结构
  return treeRoots
}



/**
 * 第三次优化
 */
export function arrayToTree(items: Item[], config: Partial<Config> = {}): TreeItem[] {
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
