---
title: 树形数组过滤工具 (arrayTreeFilter)
description: 一个高效的树形结构数据过滤函数，使用广度优先搜索 (BFS) 算法查询树组件中的数据
---

## arrayTreeFilter 函数介绍

`arrayTreeFilter` 是一个专门用于树形结构数据过滤的实用函数，它采用**广度优先搜索 (BFS)**算法，从树的顶部开始逐层查找符合条件的节点。该函数特别适合在前端树组件中进行数据查询、路径查找或节点定位等操作。

**主要功能与特点：**
- 使用广度优先搜索算法遍历树形结构
- 支持自定义过滤条件函数
- 可配置子节点属性名
- 返回从根节点到目标节点的完整路径
- 泛型支持，适用于各种数据结构

## 函数定义与参数说明

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
 * 使用广度优先搜索过滤树形数组，返回符合条件的节点路径
 * @param data 树形数据数组
 * @param filterFn 过滤函数，接收当前节点和层级，返回布尔值表示是否匹配
 * @param options 配置项，可自定义子节点属性名
 * @returns 从根节点到匹配节点的完整路径数组
 */
function arrayTreeFilter<T>(
  data: T[],
  filterFn: (item: T, level: number) => boolean,
  options: FilterOptions = {...DEFAULT_OPTIONS}
): T[] {
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
    const childrenKeyName = options?.childrenKeyName ?? 'children';
    children = (foundItem as any)[childrenKeyName] || [];
    level += 1;
  } while (children.length > 0);
  return result;
}
```

## 参数详解

- **data**: 树形结构的根节点数组，包含需要搜索的完整树数据
- **filterFn**: 过滤函数，用于判断节点是否符合条件
  - **item**: 当前遍历到的节点对象
  - **level**: 当前节点的层级深度（从0开始）
  - **返回值**: 布尔值，表示节点是否匹配条件
- **options**: 配置选项对象（可选）
  - **childrenKeyName**: 子节点在对象中的属性名，默认为 'children'

## 返回值

函数返回一个数组，包含从根节点到第一个匹配节点的完整路径上的所有节点。如果没有找到匹配的节点，则返回空数组。

## 使用示例

### 基础示例：查找特定ID的节点路径

```ts
// 定义测试数据
const treeData = [
  {
    id: 1,
    name: '根节点',
    children: [
      {
        id: 2,
        name: '子节点1',
        children: [
          { id: 3, name: '孙节点1' },
          { id: 4, name: '孙节点2' }
        ]
      },
      {
        id: 5,
        name: '子节点2',
        children: [
          { id: 6, name: '孙节点3' }
        ]
      }
    ]
  }
];

// 查找ID为6的节点路径
const result = arrayTreeFilter(treeData, (item: any) => item.id === 6);

console.log(result);
/* 输出:
[
  { id: 1, name: '根节点', children: [...] },
  { id: 5, name: '子节点2', children: [...] },
  { id: 6, name: '孙节点3' }
]
*/
```

### 示例2：基于层级和名称的复合过滤

```ts
// 查找层级为2且名称包含'产品'的节点
const result = arrayTreeFilter(productsTree, (item: any, level) => {
  return level === 2 && item.name.includes('产品');
});
```

### 示例3：自定义子节点属性名

```ts
// 测试数据使用 customChildren 作为子节点属性名
const customTree = [
  {
    id: 1,
    name: '公司',
    customChildren: [
      {
        id: 2,
        name: '技术部',
        customChildren: [
          { id: 3, name: '前端组' },
          { id: 4, name: '后端组' }
        ]
      }
    ]
  }
];

// 自定义子节点属性名进行搜索
const result = arrayTreeFilter(customTree, 
  (item: any) => item.id === 3, 
  { childrenKeyName: 'customChildren' }
);
```

### 示例4：实际业务场景 - 查找部门路径

```ts
// 部门树形结构
const departments = [
  {
    id: 'D001',
    name: '总部',
    children: [
      {
        id: 'D002',
        name: '研发中心',
        children: [
          { id: 'D003', name: '前端团队' },
          { id: 'D004', name: '后端团队' },
          { id: 'D005', name: '测试团队' }
        ]
      },
      {
        id: 'D006',
        name: '市场部'
      }
    ]
  }
];

// 查找特定员工所在的完整部门路径
function findDepartmentPath(employeeId: string): string[] {
  // 假设我们有一个函数可以根据员工ID获取其所在部门ID
  const departmentId = getDepartmentByEmployee(employeeId);
  
  // 使用 arrayTreeFilter 查找部门路径
  const path = arrayTreeFilter(departments, (item: any) => item.id === departmentId);
  
  // 提取路径中的部门名称
  return path.map(dept => dept.name);
}

// 使用示例
const employeeDepartmentPath = findDepartmentPath('E12345');
console.log(employeeDepartmentPath); // 例如: ['总部', '研发中心', '前端团队']
```

## 工作原理：广度优先搜索 (BFS)

该函数使用**广度优先搜索**算法遍历树形结构，其核心流程如下：

1. 从根节点数组开始，逐层向下搜索
2. 在每一层中，使用过滤函数检查每个节点是否匹配条件
3. 如果找到匹配节点，将其加入结果数组，并继续搜索其子节点
4. 如果当前层没有找到匹配节点，则结束搜索
5. 最终返回从根节点到匹配节点的完整路径

**注意：** 该函数会在找到第一个匹配的节点后停止搜索，如果需要查找所有匹配节点，需要对函数进行修改。

## 性能考量

- **时间复杂度**: O(n)，其中 n 是树中节点的总数。在最坏情况下，需要遍历树中的所有节点。
- **空间复杂度**: O(h)，其中 h 是树的高度。主要用于存储结果路径和当前层的节点。
- **优化建议**: 对于大型树形结构，可以考虑在过滤函数中加入提前终止条件，以提高搜索效率。

## 最佳实践

1. **合理设计过滤函数**：尽量使过滤条件简单明确，避免在过滤函数中执行复杂的计算
2. **处理空数据情况**：函数已内置对空数据的处理，但仍建议在调用前进行数据校验
3. **类型安全**：利用TypeScript的泛型特性，为不同的数据结构创建类型定义
4. **避免重复搜索**：对于频繁使用的搜索条件，可以考虑缓存结果
5. **组合使用**：可以与其他数组方法（如map、reduce）组合使用，实现更复杂的树形数据操作

## 输入输出示例

#### 输入输出示例
输入：
```ts
const tree = [
  {
    id: 1,
    name: '中国',
    children: [
      {
        id: 2,
        name: '北京',
        children: [
          { id: 3, name: '朝阳区' },
          { id: 4, name: '海淀区' }
        ]
      },
      {
        id: 5,
        name: '上海'
      }
    ]
  }
];

// 查找ID为3的节点路径
const result = arrayTreeFilter(tree, (item: any) => item.id === 3);
console.log(result.map(node => node.name));
```

输出：
```
['中国', '北京', '朝阳区']
```

