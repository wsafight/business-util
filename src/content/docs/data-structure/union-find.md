---
title: 并查集 (Union-Find)
description: 一种用于处理动态连通性问题的数据结构，能够高效地进行元素的合并和查询操作
---

## 1. 什么是并查集？

并查集（Union-Find），也称为不相交集合（Disjoint Set），是一种用于处理动态连通性问题的数据结构。它主要支持两种操作：合并两个集合和判断两个元素是否属于同一个集合。

并查集的核心思想是使用树结构来表示集合，其中每个节点都有一个父节点，最终所有节点都会指向某个根节点，表示它们属于同一个集合。通过巧妙的路径压缩和按秩合并等优化手段，并查集可以在接近常数时间内完成操作。

并查集在以下场景中特别有用：
- 网络连接问题
- 社交网络中的朋友圈计算
- 编译器中的变量引用分析
- 图像处理中的连通区域识别
- Kruskal算法中的最小生成树构建

## 2. 并查集的基本概念

### 2.1 连通性

在并查集中，我们说两个元素是连通的，当且仅当它们属于同一个集合。连通性是一种等价关系，具有以下三个性质：
- **自反性**：任何元素都与其自身连通
- **对称性**：如果元素p与q连通，那么q与p也连通
- **传递性**：如果元素p与q连通，且q与r连通，那么p与r也连通

### 2.2 连通分量

连通分量是指图中相互连通的最大子集。在并查集中，连通分量的数量会随着合并操作的进行而减少。初始时，每个元素自身就是一个连通分量。

### 2.3 基本操作

并查集主要支持以下三个基本操作：
- **MakeSet**：创建一个新的集合，初始时每个元素构成一个单独的集合
- **Find**：查找元素所属的集合（通常用根节点表示）
- **Union**：合并两个元素所属的集合

## 3. 并查集的实现原理

并查集通常使用数组来实现，其中每个元素对应数组中的一个索引，数组的值表示该元素的父节点。

### 3.1 数据结构设计

基本的数据结构包括：
- **parent数组**：存储每个节点的父节点
- **size/rank数组**：用于优化合并操作，记录每个根节点对应的树的大小或高度
- **count变量**：记录当前连通分量的数量

### 3.2 初始化

初始化时，每个元素都指向自己作为父节点，表示每个元素都是一个独立的集合。同时，每个集合的大小为1，连通分量的数量等于元素的数量。

### 3.3 Find操作

Find操作用于查找元素所属的集合，即找到该元素所在树的根节点。在查找过程中，可以进行路径压缩优化，使树的结构更加扁平，从而提高后续操作的效率。

### 3.4 Union操作

Union操作用于合并两个元素所属的集合。为了保持树的平衡，通常会采用按秩合并（Union by Rank）或按大小合并（Union by Size）的策略，将较小的树连接到较大的树上。

## 4. 并查集的TypeScript实现

下面是一个完整的并查集TypeScript实现，包含路径压缩和按大小合并优化：

```typescript
/**
 * 并查集接口
 */
interface UnionFind {
  /**
   * 将两个元素连接起来
   * @param p 第一个元素
   * @param q 第二个元素
   */
  union(p: number, q: number): void;
  
  /**
   * 判断两个元素是否连通
   * @param p 第一个元素
   * @param q 第二个元素
   * @returns 如果两个元素连通则返回true，否则返回false
   */
  connected(p: number, q: number): boolean;
  
  /**
   * 返回当前连通分量的数量
   * @returns 连通分量的数量
   */
  count(): number;
  
  /**
   * 查找元素所属集合的根节点
   * @param x 要查找的元素
   * @returns 元素所属集合的根节点
   */
  find(x: number): number;
}

/**
 * 并查集类实现
 */
class UnionFindImpl implements UnionFind {
  // 连通分量个数
  private countNum: number;
  
  // 存储每个节点的父节点
  private readonly parent: number[];
  
  // 记录每个根节点对应的树的大小，用于按大小合并
  private readonly size: number[];
  
  /**
   * 构造函数
   * @param n 元素数量
   */
  constructor(n: number) {
    // 初始化连通分量数量为元素数量
    this.countNum = n;
    
    // 初始化parent数组和size数组
    this.parent = new Array<number>(n);
    this.size = new Array<number>(n);
    
    // 初始时，每个元素的父节点是自己，每个集合的大小为1
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.size[i] = 1;
    }
  }
  
  /**
   * 获取连通分量数量
   * @returns 连通分量数量
   */
  public count(): number {
    return this.countNum;
  }
  
  /**
   * 查找元素所属集合的根节点（带路径压缩）
   * @param x 要查找的元素
   * @returns 根节点
   */
  public find(x: number): number {
    // 路径压缩：将x到根节点路径上的所有节点直接连接到根节点
    while (this.parent[x] !== x) {
      // 父节点指向祖父节点，缩短路径
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  
  /**
   * 合并两个元素所属的集合（按大小合并）
   * @param p 第一个元素
   * @param q 第二个元素
   */
  public union(p: number, q: number): void {
    // 找到p和q所属集合的根节点
    const rootP = this.find(p);
    const rootQ = this.find(q);
    
    // 如果已经在同一个集合中，无需合并
    if (rootP === rootQ) {
      return;
    }
    
    // 按大小合并：将较小的树连接到较大的树上
    if (this.size[rootP] > this.size[rootQ]) {
      // p所在的树更大，将q所在的树连接到p所在的树上
      this.parent[rootQ] = rootP;
      // 更新p所在树的大小
      this.size[rootP] += this.size[rootQ];
    } else {
      // q所在的树更大或两者相等，将p所在的树连接到q所在的树上
      this.parent[rootP] = rootQ;
      // 更新q所在树的大小
      this.size[rootQ] += this.size[rootP];
    }
    
    // 合并后，连通分量数量减1
    this.countNum--;
  }
  
  /**
   * 判断两个元素是否连通
   * @param p 第一个元素
   * @param q 第二个元素
   * @returns 如果两个元素连通则返回true，否则返回false
   */
  public connected(p: number, q: number): boolean {
    // 两个元素连通当且仅当它们的根节点相同
    return this.find(p) === this.find(q);
  }
  
  /**
   * 获取指定索引的父节点
   * @param x 索引
   * @returns 父节点索引
   */
  public getParent(x: number): number {
    return this.parent[x];
  }
  
  /**
   * 获取指定根节点对应的树的大小
   * @param root 根节点索引
   * @returns 树的大小
   */
  public getSize(root: number): number {
    return this.size[root];
  }
}
```

## 5. 并查集的高级实现与优化

并查集有几种常见的优化策略，下面介绍两种主要的优化方式：

### 5.1 路径压缩优化

路径压缩是并查集中最重要的优化，它可以显著减少树的高度，从而提高查找操作的效率。路径压缩有两种常见的实现方式：

#### 5.1.1 路径分裂（Path Splitting）

```typescript
/**
 * 路径分裂优化的find方法
 * @param x 要查找的元素
 * @returns 根节点
 */
private findPathSplitting(x: number): number {
  while (this.parent[x] !== x) {
    const next = this.parent[x];
    this.parent[x] = this.parent[next];
    x = next;
  }
  return x;
}
```

#### 5.1.2 路径折叠（Path Halving）

```typescript
/**
 * 路径折叠优化的find方法
 * @param x 要查找的元素
 * @returns 根节点
 */
private findPathHalving(x: number): number {
  while (this.parent[x] !== x) {
    this.parent[x] = this.parent[this.parent[x]];
    x = this.parent[x];
  }
  return x;
}
```

#### 5.1.3 完全路径压缩

```typescript
/**
 * 完全路径压缩的find方法（递归实现）
 * @param x 要查找的元素
 * @returns 根节点
 */
private findComplete(x: number): number {
  if (this.parent[x] !== x) {
    this.parent[x] = this.findComplete(this.parent[x]);
  }
  return this.parent[x];
}
```

### 5.2 按秩合并优化

除了按大小合并外，还可以按秩合并（Union by Rank）来优化树的结构：

```typescript
/**
 * 按秩合并优化的并查集实现
 */
class UnionFindByRank implements UnionFind {
  private countNum: number;
  private readonly parent: number[];
  private readonly rank: number[]; // rank表示树的高度上限
  
  constructor(n: number) {
    this.countNum = n;
    this.parent = new Array<number>(n);
    this.rank = new Array<number>(n).fill(0);
    
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }
  
  public count(): number {
    return this.countNum;
  }
  
  public find(x: number): number {
    while (this.parent[x] !== x) {
      // 路径压缩
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  
  public union(p: number, q: number): void {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    
    if (rootP === rootQ) {
      return;
    }
    
    // 按秩合并：将秩较小的树连接到秩较大的树上
    if (this.rank[rootP] < this.rank[rootQ]) {
      this.parent[rootP] = rootQ;
    } else if (this.rank[rootP] > this.rank[rootQ]) {
      this.parent[rootQ] = rootP;
    } else {
      // 秩相等时，任意选择一个作为父节点，并增加其秩
      this.parent[rootQ] = rootP;
      this.rank[rootP]++;
    }
    
    this.countNum--;
  }
  
  public connected(p: number, q: number): boolean {
    return this.find(p) === this.find(q);
  }
}
```

## 6. 并查集的时间复杂度分析

### 6.1 时间复杂度

并查集的时间复杂度与操作次数和优化方式有关：

- **普通实现**：Find和Union操作的时间复杂度为O(log n)
- **带路径压缩**：平均时间复杂度接近O(1)，理论上为O(α(n))，其中α(n)是阿克曼函数的反函数，在实际应用中可以视为常数
- **带按秩合并**：Find和Union操作的时间复杂度为O(log n)
- **同时使用路径压缩和按秩合并**：时间复杂度为O(α(n))，近似于常数

### 6.2 空间复杂度

并查集的空间复杂度为O(n)，其中n是元素的数量，主要用于存储parent数组、size/rank数组和count变量。

## 7. 并查集的应用场景

### 7.1 社交网络中的朋友圈计算

并查集可以用来计算社交网络中的朋友圈数量，以及判断两个用户是否属于同一个朋友圈：

```typescript
/**
 * 社交网络朋友圈计算
 */
function findCircleNum(friendships: number[][]): number {
  const n = friendships.length;
  const uf = new UnionFindImpl(n);
  
  // 遍历所有朋友关系
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // 如果i和j是朋友，合并他们所在的集合
      if (friendships[i][j] === 1) {
        uf.union(i, j);
      }
    }
  }
  
  // 返回朋友圈数量（连通分量数量）
  return uf.count();
}

// 测试用例
const friendships = [
  [1, 1, 0],
  [1, 1, 0],
  [0, 0, 1]
];
console.log("朋友圈数量:", findCircleNum(friendships)); // 输出: 2
```

### 7.2 Kruskal算法实现最小生成树

并查集可以用于Kruskal算法中，帮助检测边的添加是否会形成环：

```typescript
/**
 * 边的接口
 */
interface Edge {
  from: number;
  to: number;
  weight: number;
}

/**
 * Kruskal算法实现最小生成树
 * @param n 节点数量
 * @param edges 边的列表
 * @returns 最小生成树的总权重
 */
function kruskalMST(n: number, edges: Edge[]): number {
  // 按权重对边进行排序
  edges.sort((a, b) => a.weight - b.weight);
  
  const uf = new UnionFindImpl(n);
  let totalWeight = 0;
  let edgeCount = 0;
  
  // 依次选择权重最小的边，如果不会形成环则添加到最小生成树中
  for (const edge of edges) {
    if (!uf.connected(edge.from, edge.to)) {
      uf.union(edge.from, edge.to);
      totalWeight += edge.weight;
      edgeCount++;
      
      // 当选择了n-1条边时，最小生成树构建完成
      if (edgeCount === n - 1) {
        break;
      }
    }
  }
  
  return totalWeight;
}

// 测试用例
const edges: Edge[] = [
  { from: 0, to: 1, weight: 10 },
  { from: 0, to: 2, weight: 6 },
  { from: 0, to: 3, weight: 5 },
  { from: 1, to: 3, weight: 15 },
  { from: 2, to: 3, weight: 4 }
];
console.log("最小生成树总权重:", kruskalMST(4, edges)); // 输出: 19
```

### 7.3 判断图中是否有环

并查集可以用来判断一个图是否包含环：

```typescript
/**
 * 判断无向图中是否有环
 * @param n 节点数量
 * @param edges 边的列表
 * @returns 如果图中有环则返回true，否则返回false
 */
function hasCycle(n: number, edges: [number, number][]): boolean {
  const uf = new UnionFindImpl(n);
  
  // 遍历所有边
  for (const [u, v] of edges) {
    // 如果两个节点已经在同一个集合中，说明添加这条边会形成环
    if (uf.connected(u, v)) {
      return true;
    }
    // 否则，合并这两个节点所在的集合
    uf.union(u, v);
  }
  
  return false;
}

// 测试用例
const edges1: [number, number][] = [[0, 1], [1, 2], [2, 0]];
console.log("图1是否有环:", hasCycle(3, edges1)); // 输出: true

const edges2: [number, number][] = [[0, 1], [1, 2], [2, 3]];
console.log("图2是否有环:", hasCycle(4, edges2)); // 输出: false
```

### 7.4 岛屿数量计算

并查集可以用来计算二维网格中的岛屿数量：

```typescript
/**
 * 计算二维网格中的岛屿数量
 * @param grid 二维网格，'1'表示陆地，'0'表示水域
 * @returns 岛屿数量
 */
function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) {
    return 0;
  }
  
  const m = grid.length;
  const n = grid[0].length;
  const uf = new UnionFindImpl(m * n + 1); // 多一个节点用于表示水域
  const waterNode = m * n;
  
  // 遍历网格中的每个单元格
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const index = i * n + j;
      
      // 如果当前单元格是水域，将其连接到waterNode
      if (grid[i][j] === '0') {
        uf.union(index, waterNode);
        continue;
      }
      
      // 检查四个方向的相邻单元格
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [di, dj] of directions) {
        const ni = i + di;
        const nj = j + dj;
        
        // 如果相邻单元格在网格范围内且也是陆地，合并它们
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === '1') {
          const neighborIndex = ni * n + nj;
          uf.union(index, neighborIndex);
        }
      }
    }
  }
  
  // 岛屿数量 = 连通分量数量 - 1（减去水域的连通分量）
  return uf.count() - 1;
}

// 测试用例
const grid = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1']
];
console.log("岛屿数量:", numIslands(grid)); // 输出: 3
```

## 8. 并查集的扩展应用

### 8.1 带权并查集

带权并查集是并查集的一个扩展，它不仅记录了元素的连通关系，还记录了元素之间的某种关系值：

```typescript
/**
 * 带权并查集实现
 */
class WeightedUnionFind {
  private readonly parent: number[];
  private readonly weight: number[]; // 记录节点到父节点的权重
  
  constructor(n: number) {
    this.parent = new Array<number>(n);
    this.weight = new Array<number>(n).fill(0);
    
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }
  
  public find(x: number): number {
    if (this.parent[x] !== x) {
      const root = this.find(this.parent[x]);
      // 路径压缩的同时更新权重
      this.weight[x] += this.weight[this.parent[x]];
      this.parent[x] = root;
    }
    return this.parent[x];
  }
  
  /**
   * 合并两个集合，并设置权重关系
   * @param x 第一个元素
   * @param y 第二个元素
   * @param w x到y的权重
   */
  public union(x: number, y: number, w: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) {
      return;
    }
    
    this.parent[rootX] = rootY;
    // 更新权重关系
    this.weight[rootX] = this.weight[y] - this.weight[x] + w;
  }
  
  /**
   * 获取两个元素之间的权重
   * @param x 第一个元素
   * @param y 第二个元素
   * @returns 如果两个元素连通，返回x到y的权重；否则返回undefined
   */
  public getWeight(x: number, y: number): number | undefined {
    if (this.find(x) !== this.find(y)) {
      return undefined;
    }
    return this.weight[x] - this.weight[y];
  }
}
```

### 8.2 扩展并查集处理对象

并查集可以扩展为处理对象类型的元素，而不仅仅是数字：

```typescript
/**
 * 通用并查集实现，支持任意类型的元素
 */
class GenericUnionFind<T> {
  private readonly parent: Map<T, T>;
  private readonly size: Map<T, number>;
  private countNum: number;
  
  constructor() {
    this.parent = new Map<T, T>();
    this.size = new Map<T, number>();
    this.countNum = 0;
  }
  
  /**
   * 添加一个新元素
   * @param x 要添加的元素
   */
  public add(x: T): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.size.set(x, 1);
      this.countNum++;
    }
  }
  
  /**
   * 查找元素所属集合的根节点
   * @param x 要查找的元素
   * @returns 根节点
   */
  public find(x: T): T {
    if (!this.parent.has(x)) {
      this.add(x);
      return x;
    }
    
    let current = x;
    while (this.parent.get(current) !== current) {
      // 路径压缩
      const parent = this.parent.get(current)!;
      const grandparent = this.parent.get(parent)!;
      this.parent.set(current, grandparent);
      current = grandparent;
    }
    return current;
  }
  
  /**
   * 合并两个元素所属的集合
   * @param x 第一个元素
   * @param y 第二个元素
   */
  public union(x: T, y: T): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) {
      return;
    }
    
    const sizeX = this.size.get(rootX)!;
    const sizeY = this.size.get(rootY)!;
    
    // 按大小合并
    if (sizeX > sizeY) {
      this.parent.set(rootY, rootX);
      this.size.set(rootX, sizeX + sizeY);
    } else {
      this.parent.set(rootX, rootY);
      this.size.set(rootY, sizeX + sizeY);
    }
    
    this.countNum--;
  }
  
  /**
   * 判断两个元素是否连通
   * @param x 第一个元素
   * @param y 第二个元素
   * @returns 如果两个元素连通则返回true，否则返回false
   */
  public connected(x: T, y: T): boolean {
    return this.find(x) === this.find(y);
  }
  
  /**
   * 获取连通分量数量
   * @returns 连通分量数量
   */
  public count(): number {
    return this.countNum;
  }
}

// 测试用例
const stringUf = new GenericUnionFind<string>();
stringUf.union("a", "b");
stringUf.union("b", "c");
console.log("a和c是否连通:", stringUf.connected("a", "c")); // 输出: true
console.log("a和d是否连通:", stringUf.connected("a", "d")); // 输出: false
```

## 9. 总结

并查集是一种高效的数据结构，特别适合处理动态连通性问题。它的核心操作（Find和Union）在经过路径压缩和按秩合并等优化后，可以达到接近常数的时间复杂度，使其在处理大规模数据时依然保持高效。

并查集的应用非常广泛，包括但不限于：社交网络分析、网络连接问题、编译器优化、图像处理、最小生成树算法等。通过扩展并查集，我们还可以处理更加复杂的问题，如带权关系的表示和任意类型元素的连通性判断。

掌握并查集的原理和实现，对于解决许多算法问题和实际应用场景都有很大的帮助。它的简洁实现和高效性能使其成为数据结构学习中的重要内容。
```