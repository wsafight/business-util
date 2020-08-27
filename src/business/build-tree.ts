const buildTree = (treeItems: any[],  id = 0): any[] =>
  treeItems
    // 找到当前节点所有的孩子
    .filter(item => item.parentId === id)
    // 继续递归找
    .map(item => ({ ...item, children: buildTree(treeItems, item.id) }));



function buildTreeOptimize (items: any[]) {
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
      treeRoots.push({item})
    }
  })

  // 返回树结构
  return treeRoots
}

buildTree([])
buildTreeOptimize([])
