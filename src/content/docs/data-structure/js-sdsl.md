---
title: "JS-SDSL 数据结构库"
subtitle: "参考 C++ STL 实现的高性能 JavaScript 数据结构库"
description: "一个功能丰富、性能优秀的 JavaScript 数据结构库，提供了一系列高效、可靠的数据结构实现，参考 C++ STL 设计理念"
---

## 1. 什么是 JS-SDSL？

[JS-SDSL](https://github.com/js-sdsl/js-sdsl)（JavaScript Standard Data Structure Library）是一个高性能的 JavaScript 数据结构库，它参考了 C++ STL（Standard Template Library）的设计理念，但专为 JavaScript 环境优化。这个库提供了丰富的数据结构实现，帮助开发者在 JavaScript 项目中高效地处理各种数据结构操作。

JS-SDSL 的主要特点包括：
- 高性能：经过精心优化的数据结构实现
- 丰富的数据结构：提供多种常用数据结构
- TypeScript 支持：完整的类型定义
- 模块化设计：可以按需导入所需的数据结构
- 兼容性好：支持现代浏览器和 Node.js 环境

## 2. 为什么选择 JS-SDSL

在 JavaScript 开发中，选择使用 JS-SDSL 数据结构库具有以下优势：

### 2.1 性能优势
JS-SDSL 的数据结构实现经过精心优化，在大多数操作上比原生 JavaScript 数据结构或其他第三方库具有更好的性能，特别是在处理大量数据时。

### 2.2 类型安全
完整的 TypeScript 类型支持可以帮助开发者在编译时发现潜在问题，提高代码质量和开发效率。

### 2.3 数据结构丰富性
JS-SDSL 提供了丰富的数据结构实现，包括一些在原生 JavaScript 中不存在但在算法和数据处理中非常有用的结构，如有序集合、双端队列等。

### 2.4 标准化 API
统一的 API 设计风格，使开发者可以用一致的方式操作不同的数据结构，降低学习成本。

### 2.5 可靠性和稳定性
经过严格测试的实现，确保数据结构的正确性和稳定性，减少因自行实现数据结构而引入的潜在问题。

## 3. 安装和基本使用

### 3.1 安装

可以使用 npm 或 yarn 安装 JS-SDSL：

```bash
# 使用 npm
npm install js-sdsl

# 使用 yarn
yarn add js-sdsl
```

### 3.2 基本导入方式

JS-SDSL 提供了两种导入方式：完整导入和按需导入。

#### 完整导入

```javascript
// 导入全部数据结构
const { 
  Stack, 
  Queue, 
  PriorityQueue, 
  Vector, 
  LinkList, 
  Deque, 
  OrderedSet, 
  OrderedMap, 
  HashSet, 
  HashMap 
} = require('js-sdsl');
```

#### 按需导入

为了减小打包体积，推荐使用按需导入的方式：

```javascript
// 只导入需要的数据结构
const { Stack } = require('js-sdsl/dist/stack');
const { Queue } = require('js-sdsl/dist/queue');
```

### 3.3 TypeScript 支持

JS-SDSL 提供了完整的 TypeScript 类型定义，无需额外安装类型声明文件：

```typescript
import { Stack, Queue, PriorityQueue } from 'js-sdsl';

// 类型安全的使用方式
const stack = new Stack<number>();
stack.push(1); // 正确
// stack.push('hello'); // 编译时错误
```

## 4. 核心数据结构详解

JS-SDSL 提供了以下核心数据结构：

### 4.1 Stack（栈）

栈是一种后进先出（LIFO, Last In First Out）的数据结构，适合需要后进先出处理的场景。

**特点：**
- 只能在一端（栈顶）进行插入和删除操作
- 提供 push、pop、top 等基本操作
- 时间复杂度：push/pop 均为 O(1)
- 适用于括号匹配、函数调用跟踪、撤销操作等场景

**使用示例：**

```javascript
const { Stack } = require('js-sdsl');

// 创建一个栈
const stack = new Stack<number>();

// 添加元素
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.top()); // 输出: 3
console.log(stack.size()); // 输出: 3
console.log(stack.pop()); // 输出: 3
console.log(stack.size()); // 输出: 2
console.log(stack.isEmpty()); // 输出: false

// 遍历栈
for (const item of stack) {
  console.log(item); // 依次输出: 1, 2
}

// 清空栈
stack.clear();
console.log(stack.isEmpty()); // 输出: true
```

### 4.2 Queue（队列）

队列是一种先进先出（FIFO, First In First Out）的数据结构，适合需要按顺序处理的场景。

**特点：**
- 只能在一端（队尾）插入，另一端（队首）删除
- 提供 push、pop、front 等基本操作
- 时间复杂度：push/pop 均为 O(1)
- 适用于任务队列、消息队列、广度优先搜索等场景

**使用示例：**

```javascript
const { Queue } = require('js-sdsl');

// 创建一个队列
const queue = new Queue<string>();

// 添加元素
queue.push('A');
queue.push('B');
queue.push('C');

console.log(queue.front()); // 输出: 'A'
console.log(queue.size()); // 输出: 3
console.log(queue.pop()); // 输出: 'A'
console.log(queue.size()); // 输出: 2

// 遍历队列
for (const item of queue) {
  console.log(item); // 依次输出: 'B', 'C'
}

// 清空队列
queue.clear();
console.log(queue.isEmpty()); // 输出: true
```

### 4.3 PriorityQueue（优先队列）

优先队列是一种特殊的队列，其中的元素按照优先级排序，具有最高优先级的元素总是位于队首。

**特点：**
- 元素按照优先级自动排序
- 提供 push、pop、top 等基本操作
- 基于堆实现，push/pop 操作的时间复杂度为 O(log n)
- 适用于任务调度、Dijkstra算法、事件处理等场景

**使用示例：**

```javascript
const { PriorityQueue } = require('js-sdsl');

// 创建一个最小优先队列
const pq = new PriorityQueue<number>({
  comparator: (x, y) => x - y
});

// 添加元素
pq.push(5);
pq.push(3);
pq.push(7);

console.log(pq.top()); // 输出: 3
console.log(pq.pop()); // 输出: 3
console.log(pq.top()); // 输出: 5

// 自定义对象的优先队列
const taskQueue = new PriorityQueue<{ name: string; priority: number }>({
  comparator: (a, b) => a.priority - b.priority
});

taskQueue.push({ name: '任务A', priority: 3 });
taskQueue.push({ name: '任务B', priority: 1 });
taskQueue.push({ name: '任务C', priority: 2 });

console.log(taskQueue.top()); // 输出: { name: '任务B', priority: 1 }
console.log(taskQueue.size()); // 输出: 3

// 清空优先队列
taskQueue.clear();
console.log(taskQueue.isEmpty()); // 输出: true
```

### 4.4 Vector（向量）

Vector 是一个受保护的数组实现，提供了类似数组的功能，但增加了更多的安全检查和便捷方法。

**特点：**
- 动态大小的数组实现
- 不能直接操作 length 属性
- 提供丰富的数组操作方法
- 随机访问的时间复杂度为 O(1)
- 适用于需要频繁随机访问元素的场景

**使用示例：**

```javascript
const { Vector } = require('js-sdsl');

// 创建一个向量
const vector = new Vector<number>();

// 添加元素
vector.pushBack(1);
vector.pushBack(2);
vector.pushBack(3);

console.log(vector.at(1)); // 输出: 2
console.log(vector.size()); // 输出: 3
vector.insert(1, 4); // 在索引 1 处插入 4
console.log(vector.toArray()); // 输出: [1, 4, 2, 3]

vector.eraseElementByPos(1); // 删除索引 1 处的元素
console.log(vector.toArray()); // 输出: [1, 2, 3]

// 查找元素
console.log(vector.find(2)); // 输出: 1
console.log(vector.find(5)); // 输出: -1

// 清空向量
vector.clear();
console.log(vector.isEmpty()); // 输出: true
```

### 4.5 LinkList（链表）

LinkList 是一个双向链表实现，适合频繁进行插入和删除操作的场景。

**特点：**
- 非连续内存地址的链表实现
- 插入和删除操作的时间复杂度为 O(1)（在已知位置的情况下）
- 访问操作的时间复杂度为 O(n)
- 适用于需要频繁在中间位置进行插入删除的场景

**使用示例：**

```javascript
const { LinkList } = require('js-sdsl');

// 创建一个链表
const list = new LinkList<string>();

// 添加元素
list.pushBack('A');
list.pushBack('B');
list.pushFront('C'); // 在链表头部添加元素

console.log(list.front()); // 输出: 'C'
console.log(list.back()); // 输出: 'B'
console.log(list.size()); // 输出: 3

// 在指定位置插入元素
list.insert(1, 'D');
console.log(list.toArray()); // 输出: ['C', 'D', 'A', 'B']

// 删除元素
list.eraseElementByPos(1);
console.log(list.toArray()); // 输出: ['C', 'A', 'B']

// 查找元素
console.log(list.find('A')); // 输出: 1
console.log(list.find('X')); // 输出: -1

// 清空链表
list.clear();
console.log(list.isEmpty()); // 输出: true
```

### 4.6 Deque（双端队列）

Deque（Double-Ended Queue）是一种双端队列，可以在两端进行插入和删除操作。

**特点：**
- 可以在两端进行插入和删除操作
- 向前和向后插入元素或按索引获取元素的时间复杂度为 O(1)
- 结合了栈和队列的特点
- 适用于需要同时从两端操作的场景

**使用示例：**

```javascript
const { Deque } = require('js-sdsl');

// 创建一个双端队列
const deque = new Deque<number>();

// 添加元素
deque.pushBack(1);
deque.pushBack(2);
deque.pushFront(3);

console.log(deque.front()); // 输出: 3
console.log(deque.back()); // 输出: 2
console.log(deque.size()); // 输出: 3

// 从两端删除元素
console.log(deque.popFront()); // 输出: 3
console.log(deque.popBack()); // 输出: 2
console.log(deque.size()); // 输出: 1
console.log(deque.toArray()); // 输出: [1]

// 清空双端队列
deque.clear();
console.log(deque.isEmpty()); // 输出: true
```

### 4.7 OrderedSet（有序集合）

OrderedSet 是一个由红黑树实现的有序集合，保证元素按照一定的顺序排列。

**特点：**
- 元素自动排序（默认为升序）
- 不允许重复元素
- 基于红黑树实现，插入、删除和查找操作的时间复杂度为 O(log n)
- 支持范围查询和有序遍历
- 适用于需要维护有序集合的场景，如排行榜、区间查询等

**使用示例：**

```javascript
const { OrderedSet } = require('js-sdsl');

// 创建一个有序集合
const set = new OrderedSet<number>();

// 添加元素
set.insert(3);
set.insert(1);
set.insert(2);
set.insert(3); // 重复元素，不会被添加

console.log(set.size()); // 输出: 3
console.log(set.toArray()); // 输出: [1, 2, 3]

// 检查元素是否存在
console.log(set.has(2)); // 输出: true
console.log(set.has(4)); // 输出: false

// 删除元素
set.eraseElementByVal(2);
console.log(set.toArray()); // 输出: [1, 3]

// 获取首个和最后一个元素
console.log(set.front()); // 输出: 1
console.log(set.back()); // 输出: 3

// 范围查询
const rangeResult = [];
for (const item of set.range(1, 3)) {
  rangeResult.push(item);
}
console.log(rangeResult); // 输出: [1, 3]

// 清空集合
set.clear();
console.log(set.isEmpty()); // 输出: true
```

### 4.8 OrderedMap（有序映射）

OrderedMap 是一个由红黑树实现的有序映射，保证键值对按照键的顺序排列。

**特点：**
- 键值对自动按键排序
- 不允许重复键
- 基于红黑树实现，插入、删除和查找操作的时间复杂度为 O(log n)
- 支持范围查询和有序遍历
- 适用于需要按键有序的映射场景，如按字母顺序排列的字典等

**使用示例：**

```javascript
const { OrderedMap } = require('js-sdsl');

// 创建一个有序映射
const map = new OrderedMap<string, number>();

// 添加键值对
map.set('c', 3);
map.set('a', 1);
map.set('b', 2);

console.log(map.size()); // 输出: 3
console.log(map.get('b')); // 输出: 2

// 遍历键值对（按键排序）
for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
  // 依次输出: 'a: 1', 'b: 2', 'c: 3'
}

// 删除键值对
map.eraseElementByKey('b');
console.log(map.has('b')); // 输出: false

// 获取所有键
const keys = [];
for (const key of map.keys()) {
  keys.push(key);
}
console.log(keys); // 输出: ['a', 'c']

// 获取所有值
const values = [];
for (const value of map.values()) {
  values.push(value);
}
console.log(values); // 输出: [1, 3]

// 清空映射
map.clear();
console.log(map.isEmpty()); // 输出: true
```

### 4.9 HashSet（哈希集合）

HashSet 是参考 ES6 Set polyfill 实现的哈希集合，适合需要快速查找元素的场景。

**特点：**
- 基于哈希表实现，查找、插入和删除操作的平均时间复杂度为 O(1)
- 不允许重复元素
- 元素顺序不确定
- 适合需要频繁判断元素是否存在的场景

**使用示例：**

```javascript
const { HashSet } = require('js-sdsl');

// 创建一个哈希集合
const set = new HashSet<string>();

// 添加元素
set.insert('apple');
set.insert('banana');
set.insert('orange');

console.log(set.size()); // 输出: 3
console.log(set.has('banana')); // 输出: true
console.log(set.has('grape')); // 输出: false

// 删除元素
set.eraseElementByVal('banana');
console.log(set.has('banana')); // 输出: false

// 遍历集合
for (const item of set) {
  console.log(item);
  // 输出: 'apple', 'orange'（顺序可能不同）
}

// 清空集合
set.clear();
console.log(set.isEmpty()); // 输出: true
```

### 4.10 HashMap（哈希映射）

HashMap 是参考 ES6 Set polyfill 实现的哈希映射，适合需要快速查找键值对的场景。

**特点：**
- 基于哈希表实现，查找、插入和删除操作的平均时间复杂度为 O(1)
- 不允许重复键
- 键值对顺序不确定
- 适合需要快速键值映射的场景

**使用示例：**

```javascript
const { HashMap } = require('js-sdsl');

// 创建一个哈希映射
const map = new HashMap<string, number>();

// 添加键值对
map.set('one', 1);
map.set('two', 2);
map.set('three', 3);

console.log(map.size()); // 输出: 3
console.log(map.get('two')); // 输出: 2
console.log(map.has('four')); // 输出: false

// 更新值
map.set('two', 22);
console.log(map.get('two')); // 输出: 22

// 删除键值对
map.eraseElementByKey('two');
console.log(map.has('two')); // 输出: false

// 遍历键值对
for (const [key, value] of map) {
  console.log(`${key}: ${value}`);
  // 输出: 'one: 1', 'three: 3'（顺序可能不同）
}

// 清空映射
map.clear();
console.log(map.isEmpty()); // 输出: true
```

## 5. 性能对比

JS-SDSL 的设计目标之一是提供高性能的数据结构实现。以下是 JS-SDSL 与原生 JavaScript 数据结构的一些性能对比：

### 5.1 时间复杂度对比

| 操作 | JS-SDSL Vector | 原生 Array | JS-SDSL LinkList | JS-SDSL OrderedSet | 原生 Set | JS-SDSL HashMap | 原生 Map |
|------|---------------|------------|------------------|---------------------|----------|-----------------|----------|
| 随机访问 | O(1) | O(1) | O(n) | O(log n) | O(1) | O(1) | O(1) |
| 头部插入 | O(n) | O(n) | O(1) | O(log n) | O(1) | - | O(1) |
| 尾部插入 | O(1) | O(1) | O(1) | O(log n) | O(1) | O(1) | O(1) |
| 中间插入 | O(n) | O(n) | O(1) | O(log n) | O(1) | - | O(1) |
| 头部删除 | O(n) | O(n) | O(1) | O(log n) | O(1) | - | O(1) |
| 尾部删除 | O(1) | O(1) | O(1) | O(log n) | O(1) | O(1) | O(1) |
| 中间删除 | O(n) | O(n) | O(1) | O(log n) | O(1) | - | O(1) |
| 查找 | O(n) | O(n) | O(n) | O(log n) | O(1) | O(1) | O(1) |

### 5.2 实际性能测试

根据 JS-SDSL 的官方文档，在各种操作上，JS-SDSL 通常比原生 JavaScript 数据结构或其他第三方库具有更好的性能，特别是在处理大量数据时。

以下是一些典型场景的性能测试示例：

```javascript
const { Vector, LinkList } = require('js-sdsl');

// 测试插入性能
function testInsertion() {
  const vector = new Vector<number>();
  const array = [];
  const list = new LinkList<number>();
  
  const count = 100000;
  
  console.log('测试插入性能（', count, '个元素）:');
  
  // 测试 Vector 尾部插入
  const startVector = performance.now();
  for (let i = 0; i < count; i++) {
    vector.pushBack(i);
  }
  const endVector = performance.now();
  console.log('Vector 尾部插入:', endVector - startVector, 'ms');
  
  // 测试 Array 尾部插入
  const startArray = performance.now();
  for (let i = 0; i < count; i++) {
    array.push(i);
  }
  const endArray = performance.now();
  console.log('Array 尾部插入:', endArray - startArray, 'ms');
  
  // 测试 LinkList 尾部插入
  const startList = performance.now();
  for (let i = 0; i < count; i++) {
    list.pushBack(i);
  }
  const endList = performance.now();
  console.log('LinkList 尾部插入:', endList - startList, 'ms');
}

// 运行测试
testInsertion();
```

## 6. 与其他数据结构库的对比

JS-SDSL 与其他 JavaScript 数据结构库相比，具有以下特点：

| 特性 | JS-SDSL | Lodash | Immutable.js | Collections.js |
|------|---------|--------|--------------|----------------|
| 性能 | 非常高 | 中等 | 较低 | 中等 |
| 类型支持 | 完整的 TypeScript | 部分 | 部分 | 部分 |
| 数据结构丰富度 | 高 | 中 | 中 | 中 |
| 按需导入 | 支持 | 支持 | 支持 | 有限支持 |
| 包体积 | 小（按需导入时） | 大 | 大 | 中 |
| 易用性 | 高 | 高 | 中等 | 中等 |

## 7. 适用场景

JS-SDSL 适用于以下场景：

1. **需要高性能数据结构的应用**：如算法题解、数据处理等
2. **需要有序集合/映射的场景**：如排行榜、区间查询等
3. **需要频繁进行插入删除操作的场景**：如实时数据处理
4. **需要严格数据结构约束的场景**：避免直接操作底层属性导致的问题
5. **TypeScript 项目**：利用完整的类型定义提升开发体验

## 8. 最佳实践

### 8.1 选择合适的数据结构

根据具体需求选择最合适的数据结构：

- 需要快速随机访问：选择 Vector
- 需要频繁插入删除：选择 LinkList 或 Deque
- 需要按键排序：选择 OrderedMap
- 需要按值排序：选择 OrderedSet
- 需要快速查找：选择 HashSet 或 HashMap
- 需要优先级管理：选择 PriorityQueue

### 8.2 按需导入

只导入需要的数据结构，减少打包体积：

```javascript
// 推荐方式
import { Vector } from 'js-sdsl/dist/vector';

// 不推荐方式
import { Vector, LinkList, Stack } from 'js-sdsl';
```

### 8.3 利用 TypeScript 类型

为数据结构指定明确的类型，提高代码安全性：

```typescript
// 推荐方式
const vector = new Vector<number>();
vector.pushBack(1); // 正确
// vector.pushBack('hello'); // 编译时错误

// 不推荐方式
const vector = new Vector(); // 类型为 any
```

### 8.4 注意内存使用

对于大型数据集，注意内存使用情况：

```javascript
// 处理完大型数据集后及时清空
const largeDataset = new Vector<number>();
// ... 处理数据 ...
largeDataset.clear(); // 释放内存
```

### 8.5 性能优化技巧

- 预先分配容量：对于已知大小的数据，使用 reserve 方法预先分配容量
- 批量操作：尽量使用批量操作方法，减少重复的边界检查
- 避免频繁类型转换：保持数据类型一致性，减少运行时类型检查

## 9. 代码示例：综合应用

下面是一个使用 JS-SDSL 多种数据结构实现的简单任务管理系统示例：

```javascript
const { PriorityQueue, HashMap, OrderedSet } = require('js-sdsl');

// 任务类型定义
class Task {
  constructor(id, title, priority, tags = []) {
    this.id = id;
    this.title = title;
    this.priority = priority; // 数字越小，优先级越高
    this.completed = false;
    this.tags = tags;
    this.createdAt = new Date();
  }
}

// 任务管理系统
class TaskManager {
  constructor() {
    // 使用优先队列存储待处理任务
    this.pendingTasks = new PriorityQueue({
      comparator: (a, b) => a.priority - b.priority
    });
    
    // 使用哈希映射存储所有任务
    this.allTasks = new HashMap();
    
    // 使用有序集合存储任务标签
    this.tags = new OrderedSet();
  }
  
  // 添加任务
  addTask(task) {
    if (this.allTasks.has(task.id)) {
      throw new Error(`任务 ID ${task.id} 已存在`);
    }
    
    this.allTasks.set(task.id, task);
    
    if (!task.completed) {
      this.pendingTasks.push(task);
    }
    
    // 添加标签
    for (const tag of task.tags) {
      this.tags.insert(tag);
    }
    
    return task;
  }
  
  // 获取下一个待处理任务（优先级最高的）
  getNextTask() {
    return this.pendingTasks.top() || null;
  }
  
  // 完成任务
  completeTask(taskId) {
    const task = this.allTasks.get(taskId);
    if (!task) {
      throw new Error(`任务 ID ${taskId} 不存在`);
    }
    
    task.completed = true;
    
    // 重新构建优先队列，移除已完成的任务
    // 注意：实际应用中可能需要更高效的实现方式
    const newQueue = new PriorityQueue({
      comparator: (a, b) => a.priority - b.priority
    });
    
    // 遍历所有待处理任务
    const tempTasks = [];
    while (!this.pendingTasks.isEmpty()) {
      const t = this.pendingTasks.pop();
      if (t && t.id !== taskId && !t.completed) {
        tempTasks.push(t);
        newQueue.push(t);
      }
    }
    
    // 恢复临时保存的任务
    for (const t of tempTasks) {
      this.pendingTasks.push(t);
    }
    
    return task;
  }
  
  // 获取所有任务
  getAllTasks() {
    const tasks = [];
    for (const [, task] of this.allTasks) {
      tasks.push(task);
    }
    return tasks;
  }
  
  // 获取所有标签
  getAllTags() {
    return this.tags.toArray();
  }
  
  // 获取任务数量
  getTaskCount() {
    return this.allTasks.size();
  }
  
  // 获取待处理任务数量
  getPendingTaskCount() {
    return this.pendingTasks.size();
  }
}

// 使用示例
const taskManager = new TaskManager();

// 添加任务
taskManager.addTask(new Task('t1', '修复首页bug', 1, ['bug', 'frontend']));
taskManager.addTask(new Task('t2', '添加用户认证功能', 2, ['feature', 'auth']));
taskManager.addTask(new Task('t3', '优化数据库查询', 3, ['performance', 'backend']));
taskManager.addTask(new Task('t4', '编写API文档', 2, ['documentation', 'backend']));

// 获取下一个待处理任务
const nextTask = taskManager.getNextTask();
console.log('下一个待处理任务:', nextTask.title);

// 完成任务
taskManager.completeTask('t1');
console.log('待处理任务数量:', taskManager.getPendingTaskCount());

// 获取所有标签
console.log('所有标签:', taskManager.getAllTags());

// 获取所有任务
const allTasks = taskManager.getAllTasks();
console.log('所有任务数量:', allTasks.length);
```

## 10. 常见问题解答

### 10.1 JS-SDSL 与原生 JavaScript 数据结构有什么区别？

JS-SDSL 提供了一些原生 JavaScript 中不存在的数据结构，如 OrderedSet、OrderedMap 等。对于原生已有的数据结构（如数组、集合、映射），JS-SDSL 提供了更丰富的操作方法和更好的性能，特别是在处理大量数据时。

### 10.2 JS-SDSL 适合在生产环境中使用吗？

是的，JS-SDSL 是一个稳定、成熟的库，已经在许多项目中得到应用。它经过了严格的测试，并且提供了完善的文档和类型支持。

### 10.3 如何在浏览器环境中使用 JS-SDSL？

JS-SDSL 支持浏览器环境，可以通过 CDN 引入或使用打包工具（如 Webpack、Rollup 等）进行打包。

```html
<!-- 通过 CDN 引入 -->
<script src="https://cdn.jsdelivr.net/npm/js-sdsl"></script>
<script>
  const { Vector } = jsSdsl;
  const vector = new Vector();
  // ...
</script>
```

### 10.4 JS-SDSL 支持哪些 JavaScript 运行时？

JS-SDSL 支持所有现代 JavaScript 运行时，包括 Node.js、浏览器、Deno 等。

## 11. 总结

JS-SDSL 是一个功能丰富、性能优秀的 JavaScript 数据结构库，它参考了 C++ STL 的设计理念，提供了多种常用数据结构的高效实现。无论是在算法题解、数据处理还是实际项目开发中，JS-SDSL 都能帮助开发者更高效地处理各种数据结构相关的问题。

通过使用 JS-SDSL，开发者可以：
- 利用高性能的数据结构提升应用性能
- 享受完整的 TypeScript 类型支持
- 避免重复造轮子，专注于业务逻辑开发
- 编写更加清晰、健壮的代码

如果你在 JavaScript 项目中需要高效的数据结构实现，不妨尝试一下 JS-SDSL！

参考资料：
- [JS-SDSL 官方文档](https://js-sdsl.github.io/js-sdsl/)
- [JS-SDSL GitHub 仓库](https://github.com/js-sdsl/js-sdsl)