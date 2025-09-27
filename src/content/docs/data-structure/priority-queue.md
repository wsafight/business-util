---
title: 优先队列 (Priority Queue)
description: 一种特殊的队列数据结构，元素按优先级排序，最高优先级的元素始终优先被处理
---

## 1. 什么是优先队列？

优先队列是一种特殊的队列数据结构，其中每个元素都有一个相关的优先级。与普通队列的先进先出（FIFO）顺序不同，优先队列中的元素按照优先级被处理，具有最高优先级的元素总是第一个从队列中被取出。

优先队列在以下场景中特别有用：
- **操作系统的任务调度**：优先处理高优先级的任务
- **图算法**：如Dijkstra最短路径算法、Prim最小生成树算法
- **网络流量管理**：优先处理重要的网络数据包
- **事件驱动系统**：按事件优先级处理
- **模拟系统**：模拟现实世界中的优先级场景
- **任务管理系统**：根据任务紧急程度进行调度

## 2. 优先队列的特点

优先队列具有以下特点：
- **优先级排序**：元素按照优先级进行排序，而不是插入顺序
- **动态调整**：插入和删除操作会自动调整元素位置以维护优先级顺序
- **高效操作**：使用堆实现时，可以在O(log n)时间内完成插入和删除操作
- **灵活的优先级定义**：可以根据具体需求定义不同的优先级规则
- **接口简单**：主要提供入队、出队、查看队首等基本操作

## 3. 优先队列的基本操作

优先队列通常支持以下核心操作：

| 操作 | 描述 | 时间复杂度（堆实现） |
|------|------|----------------------|
| `enqueue(item, priority)` | 向队列中添加一个元素及其优先级 | O(log n) |
| `dequeue()` | 移除并返回具有最高优先级的元素 | O(log n) |
| `peek()` | 返回具有最高优先级的元素，但不移除它 | O(1) |
| `isEmpty()` | 检查队列是否为空 | O(1) |
| `size()` | 返回队列中元素的数量 | O(1) |
| `clear()` | 清空队列中的所有元素 | O(1) |

## 4. 优先队列的实现方式

优先队列可以通过多种数据结构来实现，每种实现方式都有其优缺点：

### 4.1 基于数组的实现

最简单的实现方式是使用数组存储元素，并在入队时保持数组有序：

```typescript
class ArrayPriorityQueue<T> {
  private elements: { element: T; priority: number }[] = [];
  
  // 入队操作
  enqueue(element: T, priority: number): void {
    const item = { element, priority };
    
    // 找到合适的位置插入元素，保持数组有序
    let inserted = false;
    for (let i = 0; i < this.elements.length; i++) {
      if (priority < this.elements[i].priority) {
        this.elements.splice(i, 0, item);
        inserted = true;
        break;
      }
    }
    
    // 如果没有找到合适位置（优先级最低），则插入到数组末尾
    if (!inserted) {
      this.elements.push(item);
    }
  }
  
  // 出队操作
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.elements.shift()?.element || null;
  }
  
  // 查看队首元素
  peek(): T | null {
    return this.isEmpty() ? null : this.elements[0].element;
  }
  
  // 检查队列是否为空
  isEmpty(): boolean {
    return this.elements.length === 0;
  }
  
  // 获取队列大小
  size(): number {
    return this.elements.length;
  }
}
```

**时间复杂度**：
- 入队操作：O(n)，因为需要找到合适的位置插入元素
- 出队操作：O(1)，直接移除数组首元素

### 4.2 基于堆的实现

堆是实现优先队列的理想数据结构，因为它可以在 O(log n) 的时间复杂度内完成插入和删除操作。以下是使用 TypeScript 实现的最小堆优先队列：

```typescript
/**
 * 基于最小堆实现的优先队列
 * @template T 元素类型
 */
class MinHeapPriorityQueue<T> {
  // 使用数组存储堆元素
  private readonly heap: { element: T; priority: number }[] = [];
  
  /**
   * 获取父节点索引
   * @param index 当前节点索引
   * @returns 父节点索引
   */
  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }
  
  /**
   * 获取左子节点索引
   * @param index 当前节点索引
   * @returns 左子节点索引
   */
  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }
  
  /**
   * 获取右子节点索引
   * @param index 当前节点索引
   * @returns 右子节点索引
   */
  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }
  
  /**
   * 交换两个元素的位置
   * @param index1 第一个元素索引
   * @param index2 第二个元素索引
   */
  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  /**
   * 向上调整堆（堆化）
   * @param index 需要调整的元素索引
   */
  private siftUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);
    
    // 当当前节点不是根节点且其父节点的优先级大于当前节点的优先级时，交换它们
    while (currentIndex > 0 && this.heap[parentIndex].priority > this.heap[currentIndex].priority) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }
  
  /**
   * 向下调整堆（堆化）
   * @param index 需要调整的元素索引
   */
  private siftDown(index: number): void {
    let currentIndex = index;
    let smallestChildIndex = currentIndex;
    const leftChildIndex = this.getLeftChildIndex(currentIndex);
    const rightChildIndex = this.getRightChildIndex(currentIndex);
    const size = this.heap.length;
    
    // 找出当前节点、左子节点和右子节点中优先级最小的节点
    if (leftChildIndex < size && this.heap[leftChildIndex].priority < this.heap[smallestChildIndex].priority) {
      smallestChildIndex = leftChildIndex;
    }
    
    if (rightChildIndex < size && this.heap[rightChildIndex].priority < this.heap[smallestChildIndex].priority) {
      smallestChildIndex = rightChildIndex;
    }
    
    // 如果优先级最小的节点不是当前节点，则交换它们并继续向下调整
    if (currentIndex !== smallestChildIndex) {
      this.swap(currentIndex, smallestChildIndex);
      this.siftDown(smallestChildIndex);
    }
  }
  
  /**
   * 向队列中添加一个元素及其优先级
   * @param element 要添加的元素
   * @param priority 元素的优先级（数字越小优先级越高）
   */
  enqueue(element: T, priority: number): void {
    const node = { element, priority };
    this.heap.push(node);
    // 向上调整堆，维护堆的性质
    this.siftUp(this.heap.length - 1);
  }
  
  /**
   * 移除并返回具有最高优先级的元素
   * @returns 具有最高优先级的元素，如果队列为空则返回null
   */
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    
    const minElement = this.heap[0].element;
    const lastElement = this.heap.pop();
    
    // 如果队列不为空，将最后一个元素移到队首并向下调整堆
    if (this.heap.length > 0 && lastElement) {
      this.heap[0] = lastElement;
      this.siftDown(0);
    }
    
    return minElement;
  }
  
  /**
   * 返回具有最高优先级的元素，但不移除它
   * @returns 具有最高优先级的元素，如果队列为空则返回null
   */
  peek(): T | null {
    return this.isEmpty() ? null : this.heap[0].element;
  }
  
  /**
   * 检查队列是否为空
   * @returns 如果队列为空则返回true，否则返回false
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }
  
  /**
   * 返回队列中元素的数量
   * @returns 队列中元素的数量
   */
  size(): number {
    return this.heap.length;
  }
  
  /**
   * 清空队列
   */
  clear(): void {
    this.heap.length = 0;
  }
}
```

### 4.3 最大堆优先队列实现

有时候我们需要优先级高的元素先出队（数字越大优先级越高），这时候可以使用最大堆来实现：

```typescript
/**
 * 基于最大堆实现的优先队列
 * @template T 元素类型
 */
class MaxHeapPriorityQueue<T> {
  private readonly heap: { element: T; priority: number }[] = [];
  
  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }
  
  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }
  
  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }
  
  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  private siftUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);
    
    // 与最小堆的区别：优先级大的元素上浮
    while (currentIndex > 0 && this.heap[parentIndex].priority < this.heap[currentIndex].priority) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }
  
  private siftDown(index: number): void {
    let currentIndex = index;
    let largestChildIndex = currentIndex;
    const leftChildIndex = this.getLeftChildIndex(currentIndex);
    const rightChildIndex = this.getRightChildIndex(currentIndex);
    const size = this.heap.length;
    
    // 与最小堆的区别：找优先级最大的子节点
    if (leftChildIndex < size && this.heap[leftChildIndex].priority > this.heap[largestChildIndex].priority) {
      largestChildIndex = leftChildIndex;
    }
    
    if (rightChildIndex < size && this.heap[rightChildIndex].priority > this.heap[largestChildIndex].priority) {
      largestChildIndex = rightChildIndex;
    }
    
    if (currentIndex !== largestChildIndex) {
      this.swap(currentIndex, largestChildIndex);
      this.siftDown(largestChildIndex);
    }
  }
  
  enqueue(element: T, priority: number): void {
    const node = { element, priority };
    this.heap.push(node);
    this.siftUp(this.heap.length - 1);
  }
  
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    
    const maxElement = this.heap[0].element;
    const lastElement = this.heap.pop();
    
    if (this.heap.length > 0 && lastElement) {
      this.heap[0] = lastElement;
      this.siftDown(0);
    }
    
    return maxElement;
  }
  
  peek(): T | null {
    return this.isEmpty() ? null : this.heap[0].element;
  }
  
  isEmpty(): boolean {
    return this.heap.length === 0;
  }
  
  size(): number {
    return this.heap.length;
  }
  
  clear(): void {
    this.heap.length = 0;
  }
}
```

## 5. 优先队列的第三方库

除了自己实现优先队列外，我们还可以使用一些成熟的第三方库：

### 5.1 js-priority-queue

[js-priority-queue](https://github.com/adamhooper/js-priority-queue) 是一个轻量级的优先队列库。

#### 5.1.1 安装

```bash
npm install js-priority-queue
```

#### 5.1.2 使用示例

```javascript
const PriorityQueue = require('js-priority-queue');

// 创建一个最小优先队列
const pq = new PriorityQueue({
  comparator: (a, b) => a.priority - b.priority
});

// 添加元素
pq.queue({
  element: 'Task 1',
  priority: 3
});

pq.queue({
  element: 'Task 2',
  priority: 1
});

pq.queue({
  element: 'Task 3',
  priority: 2
});

// 获取队列大小
console.log(pq.length); // 输出: 3

// 获取优先级最高的元素
const highestPriority = pq.dequeue();
console.log(highestPriority); // 输出: { element: 'Task 2', priority: 1 }

// 查看队首元素但不移除
const nextElement = pq.peek();
console.log(nextElement); // 输出: { element: 'Task 3', priority: 2 }
```

### 5.2 Heapify

[Heapify](https://github.com/luciopaiva/heapify) 是一个高性能的堆实现库，支持多种堆类型。

#### 5.2.1 安装

```bash
npm install heapify
```

#### 5.2.2 使用示例

```javascript
const Heapify = require('heapify');

// 创建一个最小堆
const heap = new Heapify();

// 添加元素 (id, priority)
heap.push(1, 3); // Task 1 with priority 3
heap.push(2, 1); // Task 2 with priority 1
heap.push(3, 2); // Task 3 with priority 2

// 获取队列大小
console.log(heap.size); // 输出: 3

// 获取并移除优先级最高的元素
const highestPriorityId = heap.pop();
console.log(highestPriorityId); // 输出: 2

// 查看优先级最高的元素但不移除
const nextId = heap.peek();
console.log(nextId); // 输出: 3
```

### 5.3 使用JavaScript原生数据结构模拟优先队列

在某些简单场景下，我们也可以使用JavaScript的原生数据结构来模拟优先队列：

```javascript
// 使用数组和sort方法模拟优先队列
class SimplePriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element, priority) {
    this.items.push({ element, priority });
    // 每次添加后排序，确保优先级最高的元素在数组前面
    this.items.sort((a, b) => a.priority - b.priority);
  }
  
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift().element;
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[0].element;
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}
```

**注意**：这种实现方式的入队操作时间复杂度为O(n log n)，不适合处理大量数据。

## 6. 优先队列的应用场景

### 6.1 任务调度系统

优先队列非常适合实现任务调度系统，可以根据任务的优先级来决定执行顺序：

```typescript
// 任务类型定义
interface Task {
  id: string;
  description: string;
  priority: number; // 数字越小优先级越高
  deadline: Date;
  createdAt: Date;
}

// 创建任务调度系统
class TaskScheduler {
  private taskQueue: MinHeapPriorityQueue<Task>;
  
  constructor() {
    this.taskQueue = new MinHeapPriorityQueue<Task>();
  }
  
  // 添加任务
  addTask(task: Task): void {
    this.taskQueue.enqueue(task, task.priority);
    console.log(`Task ${task.id} added with priority ${task.priority}`);
  }
  
  // 执行下一个任务
  executeNextTask(): Task | null {
    if (this.taskQueue.isEmpty()) {
      console.log('No tasks in queue');
      return null;
    }
    
    const task = this.taskQueue.dequeue();
    if (task) {
      console.log(`Executing task ${task.id}: ${task.description}`);
      // 这里可以添加实际执行任务的逻辑
    }
    return task;
  }
  
  // 批量执行多个任务
  executeTasks(count: number): void {
    for (let i = 0; i < count && !this.taskQueue.isEmpty(); i++) {
      this.executeNextTask();
    }
  }
  
  // 获取等待中的任务数量
  getPendingTaskCount(): number {
    return this.taskQueue.size();
  }
  
  // 查找具有特定ID的任务（注意：这个操作的时间复杂度是O(n)）
  findTaskById(id: string): Task | null {
    // 由于优先队列不支持高效的随机访问，我们需要遍历整个队列
    const tasks: Task[] = [];
    let foundTask: Task | null = null;
    
    // 临时出队所有任务以查找目标任务
    while (!this.taskQueue.isEmpty()) {
      const task = this.taskQueue.dequeue()!;
      tasks.push(task);
      
      if (task.id === id) {
        foundTask = task;
      }
    }
    
    // 将所有任务重新入队
    for (const task of tasks) {
      this.taskQueue.enqueue(task, task.priority);
    }
    
    return foundTask;
  }
}

// 使用示例
const scheduler = new TaskScheduler();

scheduler.addTask({
  id: 'T1',
  description: '紧急修复bug',
  priority: 1,
  deadline: new Date(Date.now() + 3600000), // 1小时后
  createdAt: new Date()
});

scheduler.addTask({
  id: 'T2',
  description: '常规维护',
  priority: 3,
  deadline: new Date(Date.now() + 86400000), // 1天后
  createdAt: new Date()
});

scheduler.addTask({
  id: 'T3',
  description: '优化性能',
  priority: 2,
  deadline: new Date(Date.now() + 43200000), // 12小时后
  createdAt: new Date()
});

console.log(`Pending tasks: ${scheduler.getPendingTaskCount()}`);
scheduler.executeNextTask(); // 应该执行 T1
scheduler.executeNextTask(); // 应该执行 T3
scheduler.executeNextTask(); // 应该执行 T2
scheduler.executeNextTask(); // 队列为空
```

### 6.2 Dijkstra最短路径算法

Dijkstra算法是优先队列的经典应用之一，用于寻找图中从起始节点到其他所有节点的最短路径：

```typescript
// 图节点类型定义
interface GraphNode {
  id: string;
  neighbors: { node: string; weight: number }[];
}

// 使用优先队列实现 Dijkstra 算法
function dijkstra(graph: Record<string, GraphNode>, start: string): Record<string, { distance: number; previous: string | null }> {
  // 初始化结果对象
  const result: Record<string, { distance: number; previous: string | null }> = {};
  
  // 初始化优先队列
  const pq = new MinHeapPriorityQueue<string>();
  
  // 初始化所有节点的距离为无穷大
  Object.keys(graph).forEach(nodeId => {
    result[nodeId] = {
      distance: Infinity,
      previous: null
    };
  });
  
  // 设置起始节点的距离为0
  result[start].distance = 0;
  pq.enqueue(start, 0);
  
  // 当优先队列不为空时
  while (!pq.isEmpty()) {
    const currentNode = pq.dequeue();
    
    if (!currentNode) break;
    
    // 如果当前节点的距离已经大于已知的最短距离，则跳过
    // 这是因为优先队列中可能存在同一节点的多个条目
    if (result[currentNode].distance < Infinity) {
      // 遍历当前节点的所有邻居
      graph[currentNode].neighbors.forEach(neighbor => {
        const { node: neighborId, weight } = neighbor;
        const distanceToNeighbor = result[currentNode].distance + weight;
        
        // 如果找到更短的路径
        if (distanceToNeighbor < result[neighborId].distance) {
          result[neighborId].distance = distanceToNeighbor;
          result[neighborId].previous = currentNode;
          pq.enqueue(neighborId, distanceToNeighbor);
        }
      });
    }
  }
  
  return result;
}

// 使用示例
const graph: Record<string, GraphNode> = {
  'A': {
    id: 'A',
    neighbors: [{ node: 'B', weight: 1 }, { node: 'C', weight: 4 }]
  },
  'B': {
    id: 'B',
    neighbors: [{ node: 'A', weight: 1 }, { node: 'C', weight: 2 }, { node: 'D', weight: 5 }]
  },
  'C': {
    id: 'C',
    neighbors: [{ node: 'A', weight: 4 }, { node: 'B', weight: 2 }, { node: 'D', weight: 1 }]
  },
  'D': {
    id: 'D',
    neighbors: [{ node: 'B', weight: 5 }, { node: 'C', weight: 1 }]
  }
};

const shortestPaths = dijkstra(graph, 'A');
console.log(shortestPaths);
// 输出从 A 到各节点的最短路径和距离
// {
//   A: { distance: 0, previous: null },
//   B: { distance: 1, previous: 'A' },
//   C: { distance: 3, previous: 'B' },
//   D: { distance: 4, previous: 'C' }
// }

// 重构最短路径
function reconstructPath(shortestPaths: Record<string, { distance: number; previous: string | null }>, end: string): string[] {
  const path: string[] = [];
  let current: string | null = end;
  
  while (current !== null) {
    path.unshift(current);
    current = shortestPaths[current].previous;
  }
  
  return path;
}

const pathFromAToD = reconstructPath(shortestPaths, 'D');
console.log(`Shortest path from A to D: ${pathFromAToD.join(' -> ')}`);
// 输出: Shortest path from A to D: A -> B -> C -> D
```

### 6.3 Prim最小生成树算法

Prim算法用于构建加权无向图的最小生成树，同样可以利用优先队列来提高效率：

```typescript
// 使用优先队列实现 Prim 最小生成树算法
function prim(graph: Record<string, GraphNode>, start: string): { edges: { from: string; to: string; weight: number }[], totalWeight: number } {
  const mstEdges: { from: string; to: string; weight: number }[] = [];
  const visited = new Set<string>();
  const pq = new MinHeapPriorityQueue<{ from: string; to: string; weight: number }>();
  let totalWeight = 0;
  
  // 从起始节点开始
  visited.add(start);
  
  // 将起始节点的所有边加入优先队列
  graph[start].neighbors.forEach(neighbor => {
    pq.enqueue({ from: start, to: neighbor.node, weight: neighbor.weight }, neighbor.weight);
  });
  
  // 当优先队列不为空且未访问所有节点时
  while (!pq.isEmpty() && visited.size < Object.keys(graph).length) {
    const edge = pq.dequeue();
    
    if (!edge) break;
    
    const { from, to, weight } = edge;
    
    // 如果目标节点已访问，则跳过
    if (visited.has(to)) {
      continue;
    }
    
    // 将边加入最小生成树
    mstEdges.push(edge);
    totalWeight += weight;
    visited.add(to);
    
    // 将新加入节点的所有边加入优先队列
    graph[to].neighbors.forEach(neighbor => {
      if (!visited.has(neighbor.node)) {
        pq.enqueue({ from: to, to: neighbor.node, weight: neighbor.weight }, neighbor.weight);
      }
    });
  }
  
  return { edges: mstEdges, totalWeight };
}

// 使用示例
const mstResult = prim(graph, 'A');
console.log('Minimum Spanning Tree Edges:');
mstResult.edges.forEach(edge => {
  console.log(`${edge.from} -> ${edge.to} (weight: ${edge.weight})`);
});
console.log(`Total weight: ${mstResult.totalWeight}`);
// 输出示例:
// Minimum Spanning Tree Edges:
// A -> B (weight: 1)
// B -> C (weight: 2)
// C -> D (weight: 1)
// Total weight: 4
```

### 6.4 事件驱动模拟

优先队列可以用于实现事件驱动的模拟系统，按照事件的发生时间（优先级）来处理事件：

```typescript
// 事件类型定义
interface Event {
  id: string;
  type: string;
  time: number; // 事件发生时间，作为优先级
  data: any;    // 事件相关数据
}

// 事件处理器类型定义
interface EventHandler {
  (event: Event): void;
}

// 事件驱动模拟系统
class EventDrivenSimulator {
  private eventQueue: MinHeapPriorityQueue<Event>;
  private eventHandlers: Map<string, EventHandler[]>;
  private currentTime: number;
  
  constructor() {
    this.eventQueue = new MinHeapPriorityQueue<Event>();
    this.eventHandlers = new Map<string, EventHandler[]>();
    this.currentTime = 0;
  }
  
  // 注册事件处理器
  registerHandler(eventType: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }
  
  // 安排事件
  scheduleEvent(event: Event): void {
    if (event.time >= this.currentTime) {
      this.eventQueue.enqueue(event, event.time);
    }
  }
  
  // 运行模拟
  run(duration: number = Infinity): void {
    const endTime = this.currentTime + duration;
    
    while (!this.eventQueue.isEmpty()) {
      const nextEvent = this.eventQueue.peek();
      
      if (!nextEvent || nextEvent.time > endTime) {
        break; // 达到模拟结束时间或队列为空
      }
      
      // 处理下一个事件
      this.currentTime = nextEvent.time;
      this.eventQueue.dequeue();
      
      // 调用相应的事件处理器
      const handlers = this.eventHandlers.get(nextEvent.type);
      if (handlers) {
        handlers.forEach(handler => handler(nextEvent));
      }
    }
  }
  
  // 获取当前模拟时间
  getCurrentTime(): number {
    return this.currentTime;
  }
}

// 使用示例
const simulator = new EventDrivenSimulator();

// 注册事件处理器
simulator.registerHandler('arrival', (event) => {
  console.log(`Time ${event.time}: Customer ${event.data.id} arrived`);
  
  // 安排顾客离开事件
  simulator.scheduleEvent({
    id: `departure-${event.data.id}`,
    type: 'departure',
    time: event.time + Math.random() * 5 + 1, // 1-6时间单位后离开
    data: event.data
  });
});

simulator.registerHandler('departure', (event) => {
  console.log(`Time ${event.time}: Customer ${event.data.id} departed`);
});

// 安排一些顾客到达事件
for (let i = 1; i <= 5; i++) {
  simulator.scheduleEvent({
    id: `arrival-${i}`,
    type: 'arrival',
    time: Math.random() * 10, // 0-10时间单位后到达
    data: { id: i }
  });
}

// 运行模拟
simulator.run(20); // 运行20个时间单位
```

## 7. 优先队列的性能分析

### 7.1 时间复杂度

不同实现方式的优先队列具有不同的时间复杂度：

| 实现方式 | 入队操作 | 出队操作 | 查看队首元素 | 备注 |
|---------|---------|---------|------------|------|
| 基于有序数组 | O(n) | O(1) | O(1) | 简单但效率低 |
| 基于无序数组 | O(1) | O(n) | O(n) | 适用于入队频繁的场景 |
| 基于堆（最优） | O(log n) | O(log n) | O(1) | 综合性能最好 |
| 基于平衡二叉搜索树 | O(log n) | O(log n) | O(1) | 支持更多操作但实现复杂 |

### 7.2 空间复杂度

优先队列的空间复杂度为O(n)，其中n是队列中元素的数量，用于存储所有元素及其优先级。

### 7.3 性能比较

- **堆实现**是优先队列的最佳选择，因为它在入队和出队操作上都有很好的性能（O(log n)）
- **有序数组实现**适合出队操作频繁、入队操作较少的场景
- **无序数组实现**适合入队操作频繁、出队操作较少的场景
- **平衡二叉搜索树实现**提供了更丰富的功能，但实现复杂，通常在需要额外操作时才使用

## 8. 优先队列的优化技巧

### 8.1 懒删除策略

在某些情况下，我们可能需要从优先队列中删除任意元素，但标准的优先队列实现不支持高效的随机删除操作。这时可以使用懒删除策略：

```typescript
class LazyPriorityQueue<T> extends MinHeapPriorityQueue<T> {
  private readonly deletedSet: Set<T> = new Set();
  private sizeAdjustment: number = 0;
  
  // 标记元素为已删除
  delete(element: T): void {
    if (!this.deletedSet.has(element)) {
      this.deletedSet.add(element);
      this.sizeAdjustment++;
    }
  }
  
  // 重写出队操作，跳过已删除的元素
  override dequeue(): T | null {
    // 跳过所有已标记为删除的元素
    while (!super.isEmpty()) {
      const element = super.dequeue();
      if (element && !this.deletedSet.has(element)) {
        return element;
      } else if (element) {
        this.deletedSet.delete(element);
        this.sizeAdjustment--;
      }
    }
    return null;
  }
  
  // 重写查看队首元素操作
  override peek(): T | null {
    // 先保存当前队列中的所有元素
    const tempElements: T[] = [];
    let result: T | null = null;
    
    // 找到第一个未删除的元素
    while (!super.isEmpty()) {
      const element = super.dequeue();
      if (element) {
        tempElements.push(element);
        if (!this.deletedSet.has(element) && result === null) {
          result = element;
        }
      }
    }
    
    // 将所有元素放回队列
    for (const element of tempElements) {
      // 为了简化，这里我们假设每个元素只有一个优先级
      // 在实际应用中，你可能需要存储元素和优先级的映射关系
      super.enqueue(element, 0);
    }
    
    return result;
  }
  
  // 重写获取队列大小操作
  override size(): number {
    return super.size() - this.sizeAdjustment;
  }
}
```

### 8.2 批量操作优化

当需要处理大量元素时，可以考虑批量操作来减少堆调整的次数：

```typescript
class BatchPriorityQueue<T> extends MinHeapPriorityQueue<T> {
  // 批量添加元素
  enqueueBatch(elements: { element: T; priority: number }[]): void {
    // 先批量添加所有元素
    for (const { element, priority } of elements) {
      this.heap.push({ element, priority });
    }
    
    // 从最后一个非叶子节点开始，自底向上进行堆化
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      // @ts-ignore 访问父类的私有方法
      this.siftDown(i);
    }
  }
}
```

### 8.3 自定义比较器

支持自定义比较器可以使优先队列更加灵活：

```typescript
/**
 * 支持自定义比较器的优先队列
 * @template T 元素类型
 */
class ComparatorPriorityQueue<T> {
  private readonly heap: T[] = [];
  private readonly comparator: (a: T, b: T) => number;
  
  /**
   * 构造函数
   * @param comparator 自定义比较器函数，返回负数表示a的优先级高于b，返回正数表示b的优先级高于a
   */
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }
  
  // 其他方法与之前的实现类似，但使用自定义比较器
  private getParentIndex(index: number): number { return Math.floor((index - 1) / 2); }
  private getLeftChildIndex(index: number): number { return 2 * index + 1; }
  private getRightChildIndex(index: number): number { return 2 * index + 2; }
  
  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  private siftUp(index: number): void {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);
    
    while (currentIndex > 0 && this.comparator(this.heap[parentIndex], this.heap[currentIndex]) > 0) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }
  
  private siftDown(index: number): void {
    let currentIndex = index;
    let smallestChildIndex = currentIndex;
    const leftChildIndex = this.getLeftChildIndex(currentIndex);
    const rightChildIndex = this.getRightChildIndex(currentIndex);
    const size = this.heap.length;
    
    if (leftChildIndex < size && this.comparator(this.heap[smallestChildIndex], this.heap[leftChildIndex]) > 0) {
      smallestChildIndex = leftChildIndex;
    }
    
    if (rightChildIndex < size && this.comparator(this.heap[smallestChildIndex], this.heap[rightChildIndex]) > 0) {
      smallestChildIndex = rightChildIndex;
    }
    
    if (currentIndex !== smallestChildIndex) {
      this.swap(currentIndex, smallestChildIndex);
      this.siftDown(smallestChildIndex);
    }
  }
  
  enqueue(element: T): void {
    this.heap.push(element);
    this.siftUp(this.heap.length - 1);
  }
  
  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    
    const minElement = this.heap[0];
    const lastElement = this.heap.pop();
    
    if (this.heap.length > 0 && lastElement !== undefined) {
      this.heap[0] = lastElement;
      this.siftDown(0);
    }
    
    return minElement;
  }
  
  peek(): T | null {
    return this.isEmpty() ? null : this.heap[0];
  }
  
  isEmpty(): boolean {
    return this.heap.length === 0;
  }
  
  size(): number {
    return this.heap.length;
  }
}

// 使用示例：按字符串长度排序
const stringQueue = new ComparatorPriorityQueue<string>((a, b) => a.length - b.length);
stringQueue.enqueue("apple");
stringQueue.enqueue("banana");
stringQueue.enqueue("kiwi");
console.log(stringQueue.dequeue()); // 输出: kiwi (长度为4)
console.log(stringQueue.dequeue()); // 输出: apple (长度为5)
console.log(stringQueue.dequeue()); // 输出: banana (长度为6)
```

## 9. 优先队列的最佳实践

1. **选择合适的实现方式**：根据具体需求选择合适的优先队列实现。对于大多数场景，基于堆的实现是最佳选择。

2. **合理设置优先级策略**：设计合理的优先级策略，确保最重要的任务能够优先处理。可以考虑使用复合优先级（如`priority = basePriority * factor + tiebreaker`）来处理优先级相同的情况。

3. **注意内存使用**：对于大型优先队列，要注意内存使用情况。可以考虑设置队列大小上限，或者使用懒加载策略。

4. **处理并发访问**：在多线程环境中使用优先队列时，需要确保线程安全。可以使用锁机制或者并发安全的数据结构。

5. **考虑使用现有库**：除非有特殊需求，否则可以考虑使用成熟的优先队列库，而不是自己实现。

6. **避免频繁的堆调整**：如果需要批量添加元素，可以先收集所有元素，然后一次性构建堆，这样可以减少堆调整的次数。

7. **处理过期数据**：对于长时间运行的系统，要考虑如何处理过期的元素。可以使用懒删除策略或者定期清理机制。

8. **监控队列性能**：在生产环境中，要监控优先队列的性能指标，如队列长度、处理延迟等，以便及时发现问题。

## 10. 总结

优先队列是一种强大的数据结构，它可以根据元素的优先级来决定处理顺序。通过使用堆作为底层实现，优先队列可以在O(log n)的时间复杂度内完成插入和删除操作，具有很高的效率。

优先队列在计算机科学中有广泛的应用，包括任务调度、图算法、网络流量管理、事件驱动系统等。掌握优先队列的原理和实现，对于解决许多算法问题和实际应用场景都有很大的帮助。

在实际应用中，我们可以根据具体需求选择合适的优先队列实现方式，或者使用现有的第三方库。同时，我们也可以通过一些优化技巧来提高优先队列的性能，如懒删除策略、批量操作优化等。
