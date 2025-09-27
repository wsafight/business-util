---
title: "哈希表 (Hash Table)"
subtitle: "高效的键值对存储与检索数据结构"
description: "一种通过哈希函数将键映射到值的数据结构，提供平均O(1)时间复杂度的查找、插入和删除操作，是计算机科学中使用最广泛的数据结构之一"
---

## 1. 什么是哈希表？

哈希表（Hash Table）是一种通过哈希函数将键（Key）映射到值（Value）的数据结构。它提供了平均时间复杂度为 O(1) 的查找、插入和删除操作，是计算机科学中使用最广泛的数据结构之一。

哈希表的核心组件包括：
- **哈希函数**：将键转换为数组索引的函数
- **数组**：存储数据的底层结构，也称为桶（Buckets）
- **冲突解决策略**：处理不同键映射到相同索引的情况

哈希表的关键优势在于其高效的查找性能，特别适合需要频繁进行数据检索的场景。

## 2. 哈希表的工作原理

哈希表的工作原理可以分为以下几个步骤：

1. **计算哈希值**：使用哈希函数将键转换为数组索引
2. **存储数据**：将键值对存储在计算得到的数组索引位置
3. **处理冲突**：当多个键映射到相同索引时，使用冲突解决策略
4. **查找数据**：通过相同的哈希函数计算索引，然后在该位置查找数据

```
输入键 → 哈希函数 → 数组索引 → 存储/检索数据
    ↓
  冲突处理
```

## 3. 哈希函数

哈希函数是哈希表的核心组件，它决定了键如何映射到数组索引。一个好的哈希函数应该具备以下特性：

- **确定性**：相同的键应该始终产生相同的哈希值
- **均匀分布**：将键均匀地分布在数组中，减少冲突
- **高效计算**：计算速度快，不应成为性能瓶颈
- **防碰撞性**：尽可能减少不同键产生相同哈希值的概率

### 3.1 常见的哈希函数设计方法

#### 3.1.1 直接定址法
直接使用键的某个线性函数作为哈希值：`hash(key) = a * key + b`
适用于键的范围较小且连续的情况。

#### 3.1.2 除留余数法
使用键除以某个数的余数作为哈希值：`hash(key) = key % m`
其中 m 通常是一个质数，且接近数组的大小。

#### 3.1.3 数字分析法
分析键的各位数字，选择分布均匀的几位作为哈希值。
适用于键的位数较多且某些位分布均匀的情况。

#### 3.1.4 平方取中法
取键的平方的中间几位作为哈希值。
适用于无法确定哪些位分布均匀的情况。

#### 3.1.5 折叠法
将键分割成若干部分，然后合并这些部分（通常是相加）作为哈希值。
适用于键的位数较多的情况。

### 3.2 字符串哈希函数示例

对于字符串类型的键，常用的哈希函数包括：

```typescript
/**
 * DJB2 哈希函数实现
 * @param str 输入字符串
 * @returns 哈希值
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    // hash = hash * 33 + c
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash >>> 0; // 转换为无符号整数
}

/**
 * FNV-1a 哈希函数实现
 * @param str 输入字符串
 * @returns 哈希值
 */
function fnv1aHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // 32位FNV质数: 16777619
    hash *= 16777619;
  }
  return hash >>> 0;
}
```

## 4. 哈希冲突解决策略

哈希冲突是指两个不同的键通过哈希函数计算得到相同的索引。常用的冲突解决策略包括：

### 4.1 链地址法（Separate Chaining）

将具有相同哈希值的元素存储在同一个链表中。当查找元素时，先找到对应的链表，然后遍历链表查找目标键。

优点：
- 实现简单
- 不会影响其他元素的位置
- 负载因子可以超过1

缺点：
- 需要额外的内存空间存储链表指针
- 当链表过长时，查找性能会下降

### 4.2 开放地址法（Open Addressing）

当发生冲突时，寻找数组中的其他位置存储元素。常见的开放地址法包括：

#### 4.2.1 线性探测
按顺序查找下一个可用位置：`hash(key, i) = (hash(key) + i) % m`，其中 i 是尝试次数。

优点：实现简单
缺点：容易产生聚集（Clustering）现象

#### 4.2.2 二次探测
使用二次函数计算下一个位置：`hash(key, i) = (hash(key) + i²) % m`

优点：减少了聚集现象
缺点：可能存在二次聚集

#### 4.2.3 双重哈希
使用另一个哈希函数计算下一个位置：`hash(key, i) = (hash1(key) + i * hash2(key)) % m`

优点：几乎消除了聚集现象
缺点：实现复杂，需要设计两个哈希函数

### 4.3 再哈希法（Rehashing）

当哈希表的负载因子过高时，创建一个更大的新数组，并重新计算所有现有元素的哈希值，将它们移动到新数组中。

负载因子 = 元素数量 / 数组大小

通常当负载因子超过0.75时进行扩容，扩容后的数组大小一般为原来的2倍。

## 5. 哈希表的TypeScript实现

下面是一个使用链地址法解决冲突的哈希表完整实现：

```typescript
/**
 * 链表节点，用于存储哈希表中的键值对
 */
class ForwardListNode<K, V> {
  public key: K;
  public value: V;
  public next: ForwardListNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/**
 * 哈希表类 - 基于链地址法实现的通用哈希表
 */
class HashTable<K, V> {
  private size = 0; // 当前存储的元素数量
  private buckets: (ForwardListNode<K, V> | null)[]; // 桶数组
  private readonly loadFactor: number = 0.75; // 负载因子阈值
  private bucketSize: number; // 桶的数量

  /**
   * 构造函数
   * @param bucketSize 初始桶数量，默认为97（质数）
   */
  constructor(bucketSize: number = 97) {
    this.bucketSize = bucketSize;
    this.size = 0;
    this.buckets = new Array(this.bucketSize).fill(null);
  }

  /**
   * 计算键的哈希值
   * @param key 要计算哈希值的键
   * @returns 哈希值（数组索引）
   * @private
   */
  private hash(key: K): number {
    if (key === null || key === undefined) {
      return 0;
    }
    
    // 处理不同类型的键
    let keyToHash: string;
    if (typeof key === 'string') {
      keyToHash = key;
    } else if (typeof key === 'number' || typeof key === 'boolean') {
      keyToHash = String(key);
    } else if (typeof key === 'object') {
      // 对于对象类型，使用JSON序列化或提供自定义哈希函数
      keyToHash = JSON.stringify(key);
    } else {
      keyToHash = String(key);
    }
    
    // 使用DJB2哈希算法的变体
    let h = 0;
    for (let i = 0; i < keyToHash.length; i++) {
      h = (h << 5 | h >> 27); // 循环移位
      h += keyToHash.charCodeAt(i);
    }
    return (h >>> 0) % this.bucketSize; // 确保是正数
  }

  /**
   * 扩容哈希表
   * 当元素数量达到容量的75%时触发
   * @private
   */
  private resize(): void {
    const oldBuckets = this.buckets;
    const oldBucketSize = this.bucketSize;
    
    // 创建新的更大的桶数组
    this.bucketSize *= 2;
    // 确保新的桶大小是质数
    while (!this.isPrime(this.bucketSize)) {
      this.bucketSize++;
    }
    
    this.buckets = new Array(this.bucketSize).fill(null);
    this.size = 0;
    
    // 重新插入所有元素
    for (let i = 0; i < oldBucketSize; i++) {
      let current = oldBuckets[i];
      while (current) {
        this.put(current.key, current.value);
        current = current.next;
      }
    }
  }

  /**
   * 检查一个数是否为质数
   * @param n 要检查的数
   * @returns 是否为质数
   * @private
   */
  private isPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    
    return true;
  }

  /**
   * 插入或更新键值对
   * @param key 键
   * @param value 值
   * @returns 哈希值索引
   */
  put(key: K, value: V): number {
    // 检查是否需要扩容
    if (this.size >= this.bucketSize * this.loadFactor) {
      this.resize();
    }

    const index = this.hash(key);
    
    // 检查键是否已存在，如果存在则更新值
    let current = this.buckets[index];
    while (current) {
      if (current.key === key) {
        current.value = value;
        return index;
      }
      current = current.next;
    }
    
    // 键不存在，创建新节点并插入到链表头部
    const newNode = new ForwardListNode(key, value);
    newNode.next = this.buckets[index];
    this.buckets[index] = newNode;
    
    this.size++;
    return index;
  }

  /**
   * 查找指定键的值
   * @param key 要查找的键
   * @returns 键对应的值，如果键不存在则返回null
   */
  find(key: K): V | null {
    const index = this.hash(key);
    
    if (!this.buckets[index]) {
      return null;
    }

    let current = this.buckets[index];
    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }
    
    return null;
  }

  /**
   * 删除指定键的键值对
   * @param key 要删除的键
   * @returns 是否成功删除
   */
  delete(key: K): boolean {
    const index = this.hash(key);
    
    if (!this.buckets[index]) {
      return false;
    }

    // 使用虚拟头节点简化删除逻辑
    const dummy = new ForwardListNode<K, V>({} as K, {} as V);
    dummy.next = this.buckets[index];
    
    let current = dummy.next;
    let previous = dummy;
    
    while (current) {
      if (current.key === key) {
        // 找到要删除的节点
        previous.next = current.next;
        this.size--;
        break;
      }
      previous = current;
      current = current.next;
    }
    
    // 更新桶中的链表头
    this.buckets[index] = dummy.next;
    
    return true;
  }

  /**
   * 检查哈希表是否为空
   * @returns 是否为空
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * 获取哈希表中元素的数量
   * @returns 元素数量
   */
  count(): number {
    return this.size;
  }

  /**
   * 获取所有的键
   * @returns 键的数组
   */
  keys(): K[] {
    const keys: K[] = [];
    
    for (let i = 0; i < this.bucketSize; i++) {
      let current = this.buckets[i];
      while (current) {
        keys.push(current.key);
        current = current.next;
      }
    }
    
    return keys;
  }

  /**
   * 获取所有的值
   * @returns 值的数组
   */
  values(): V[] {
    const values: V[] = [];
    
    for (let i = 0; i < this.bucketSize; i++) {
      let current = this.buckets[i];
      while (current) {
        values.push(current.value);
        current = current.next;
      }
    }
    
    return values;
  }

  /**
   * 获取所有的键值对
   * @returns 键值对数组
   */
  entries(): [K, V][] {
    const entries: [K, V][] = [];
    
    for (let i = 0; i < this.bucketSize; i++) {
      let current = this.buckets[i];
      while (current) {
        entries.push([current.key, current.value]);
        current = current.next;
      }
    }
    
    return entries;
  }

  /**
   * 检查是否包含指定的键
   * @param key 要检查的键
   * @returns 是否包含该键
   */
  containsKey(key: K): boolean {
    return this.find(key) !== null;
  }

  /**
   * 检查是否包含指定的值
   * @param value 要检查的值
   * @returns 是否包含该值
   */
  containsValue(value: V): boolean {
    for (let i = 0; i < this.bucketSize; i++) {
      let current = this.buckets[i];
      while (current) {
        if (current.value === value) {
          return true;
        }
        current = current.next;
      }
    }
    return false;
  }

  /**
   * 清空哈希表
   */
  clear(): void {
    this.buckets = new Array(this.bucketSize).fill(null);
    this.size = 0;
  }

  /**
   * 遍历哈希表中的所有键值对
   * @param callback 遍历回调函数
   */
  forEach(callback: (key: K, value: V) => void): void {
    for (let i = 0; i < this.bucketSize; i++) {
      let current = this.buckets[i];
      while (current) {
        callback(current.key, current.value);
        current = current.next;
      }
    }
  }

  /**
   * 获取当前的负载因子
   * @returns 负载因子
   */
  getLoadFactor(): number {
    return this.size / this.bucketSize;
  }

  /**
   * 获取当前的桶数量
   * @returns 桶数量
   */
  getBucketSize(): number {
    return this.bucketSize;
  }
}
```

## 6. 哈希表的使用示例

### 6.1 基本操作示例

```typescript
// 创建一个哈希表实例
const hashTable = new HashTable<string, number>();

// 添加元素
const index1 = hashTable.put("apple", 1);
const index2 = hashTable.put("banana", 2);
const index3 = hashTable.put("orange", 3);

console.log(`apple 存储在索引: ${index1}`);
console.log(`banana 存储在索引: ${index2}`);
console.log(`orange 存储在索引: ${index3}`);

// 获取元素
console.log(hashTable.find("apple")); // 输出: 1
console.log(hashTable.find("watermelon")); // 输出: null

// 更新元素
const index4 = hashTable.put("apple", 10); // 覆盖已存在的值
console.log(hashTable.find("apple")); // 输出: 10

// 检查是否包含键
console.log(hashTable.containsKey("banana")); // 输出: true
console.log(hashTable.containsKey("pear")); // 输出: false

// 检查是否包含值
console.log(hashTable.containsValue(10)); // 输出: true
console.log(hashTable.containsValue(5)); // 输出: false

// 获取大小
console.log(hashTable.count()); // 输出: 3

// 删除元素
console.log(hashTable.delete("orange")); // 输出: true
console.log(hashTable.find("orange")); // 输出: null
console.log(hashTable.count()); // 输出: 2

// 遍历哈希表
hashTable.forEach((key, value) => {
  console.log(`${key}: ${value}`);
});
// 输出:
// apple: 10
// banana: 2

// 获取所有键和值
console.log(hashTable.keys()); // 输出: ["apple", "banana"]
console.log(hashTable.values()); // 输出: [10, 2]
console.log(hashTable.entries()); // 输出: [["apple", 10], ["banana", 2]]

// 检查是否为空
console.log(hashTable.isEmpty()); // 输出: false

// 获取负载因子和桶大小
console.log(`负载因子: ${hashTable.getLoadFactor().toFixed(2)}`);
console.log(`桶大小: ${hashTable.getBucketSize()}`);

// 清空哈希表
hashTable.clear();
console.log(hashTable.isEmpty()); // 输出: true
console.log(hashTable.count()); // 输出: 0
```

### 6.2 实际应用示例

#### 6.2.1 单词计数

```typescript
/**
 * 统计文本中每个单词出现的次数
 * @param text 输入文本
 * @returns 单词计数哈希表
 */
function countWords(text: string): HashTable<string, number> {
  const wordCount = new HashTable<string, number>();
  
  // 分割文本为单词
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  // 统计每个单词的出现次数
  for (const word of words) {
    const count = wordCount.find(word) || 0;
    wordCount.put(word, count + 1);
  }
  
  return wordCount;
}

// 测试单词计数功能
const text = "Hello world, hello TypeScript. World is beautiful with TypeScript.";
const result = countWords(text);

console.log("单词计数结果:");
result.forEach((word, count) => {
  console.log(`${word}: ${count}`);
});
// 输出:
// hello: 2
// world: 2
// typescript: 2
// is: 1
// beautiful: 1
// with: 1
```

#### 6.2.2 用户会话管理

```typescript
interface UserSession {
  userId: string;
  userName: string;
  lastActive: Date;
  permissions: string[];
}

/**
 * 用户会话管理器
 */
class SessionManager {
  private sessions: HashTable<string, UserSession>;
  private readonly sessionTimeout: number = 3600000; // 1小时，单位毫秒

  constructor() {
    this.sessions = new HashTable<string, UserSession>();
    
    // 定期清理过期会话
    setInterval(() => this.cleanupExpiredSessions(), 60000); // 每分钟检查一次
  }

  /**
   * 创建新会话
   * @param sessionId 会话ID
   * @param userData 用户数据
   */
  createSession(sessionId: string, userData: Omit<UserSession, 'lastActive'>): void {
    const session: UserSession = {
      ...userData,
      lastActive: new Date()
    };
    this.sessions.put(sessionId, session);
  }

  /**
   * 获取会话
   * @param sessionId 会话ID
   * @returns 用户会话，如果不存在或已过期则返回null
   */
  getSession(sessionId: string): UserSession | null {
    const session = this.sessions.find(sessionId);
    if (!session) {
      return null;
    }
    
    // 检查会话是否过期
    const now = new Date().getTime();
    const lastActive = session.lastActive.getTime();
    
    if (now - lastActive > this.sessionTimeout) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    // 更新最后活动时间
    session.lastActive = new Date();
    this.sessions.put(sessionId, session);
    
    return session;
  }

  /**
   * 结束会话
   * @param sessionId 会话ID
   * @returns 是否成功结束
   */
  endSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * 清理过期会话
   */
  private cleanupExpiredSessions(): void {
    const now = new Date().getTime();
    const expiredSessionIds: string[] = [];
    
    this.sessions.forEach((sessionId, session) => {
      if (now - session.lastActive.getTime() > this.sessionTimeout) {
        expiredSessionIds.push(sessionId);
      }
    });
    
    // 删除所有过期会话
    for (const sessionId of expiredSessionIds) {
      this.sessions.delete(sessionId);
    }
    
    console.log(`清理了 ${expiredSessionIds.length} 个过期会话`);
  }

  /**
   * 获取活动会话数量
   * @returns 活动会话数量
   */
  getActiveSessionCount(): number {
    return this.sessions.count();
  }
}

// 测试会话管理器
const sessionManager = new SessionManager();

// 创建会话
sessionManager.createSession("session1", {
  userId: "user1",
  userName: "John Doe",
  permissions: ["read", "write"]
});

sessionManager.createSession("session2", {
  userId: "user2",
  userName: "Jane Smith",
  permissions: ["read"]
});

// 获取会话
const session1 = sessionManager.getSession("session1");
console.log("会话1:", session1);

const session3 = sessionManager.getSession("session3");
console.log("会话3 (不存在):", session3);

// 获取活动会话数量
console.log(`活动会话数量: ${sessionManager.getActiveSessionCount()}`);

// 结束会话
const ended = sessionManager.endSession("session2");
console.log(`会话2结束: ${ended}`);
console.log(`活动会话数量: ${sessionManager.getActiveSessionCount()}`);
```

#### 6.2.3 两数之和问题

使用哈希表解决经典的两数之和问题，时间复杂度为O(n)：

```typescript
/**
 * 两数之和问题
 * 在数组中找到和为目标值的两个数的索引
 * @param nums 输入数组
 * @param target 目标和
 * @returns 两个数的索引数组
 */
function twoSum(nums: number[], target: number): number[] {
  // 使用哈希表存储已经遍历过的数字及其索引
  const numMap = new HashTable<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    // 检查互补数是否已经在哈希表中
    if (numMap.containsKey(complement)) {
      return [numMap.find(complement)!, i];
    }
    
    // 将当前数字及其索引加入哈希表
    numMap.put(nums[i], i);
  }
  
  // 如果没有找到答案，返回空数组
  return [];
}

// 测试两数之和函数
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(`两数之和结果: [${result}]`); // 输出: [0, 1]
```

#### 6.2.4 缓存实现

使用哈希表实现一个简单的LRU（Least Recently Used）缓存：

```typescript
/**
 * LRU缓存节点
 */
class CacheNode<K, V> {
  public key: K;
  public value: V;
  public prev: CacheNode<K, V> | null = null;
  public next: CacheNode<K, V> | null = null;
  
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/**
 * LRU缓存实现
 */
class LRUCache<K, V> {
  private capacity: number;
  private cache: HashTable<K, CacheNode<K, V>>;
  private head: CacheNode<K, V>; // 最近使用的节点
  private tail: CacheNode<K, V>; // 最久未使用的节点
  
  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new HashTable<K, CacheNode<K, V>>();
    
    // 创建虚拟头尾节点
    this.head = new CacheNode<K, V>({} as K, {} as V);
    this.tail = new CacheNode<K, V>({} as K, {} as V);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  /**
   * 添加节点到链表头部（最近使用）
   */
  private addToHead(node: CacheNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }
  
  /**
   * 从链表中移除节点
   */
  private removeNode(node: CacheNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }
  
  /**
   * 将节点移到链表头部（标记为最近使用）
   */
  private moveToHead(node: CacheNode<K, V>): void {
    this.removeNode(node);
    this.addToHead(node);
  }
  
  /**
   * 移除链表尾部节点（最久未使用）
   */
  private removeTail(): CacheNode<K, V> {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }
  
  /**
   * 获取缓存中的值
   */
  get(key: K): V | null {
    const node = this.cache.find(key);
    if (!node) {
      return null;
    }
    
    // 将访问的节点移到链表头部
    this.moveToHead(node);
    return node.value;
  }
  
  /**
   * 设置缓存中的值
   */
  put(key: K, value: V): void {
    const node = this.cache.find(key);
    
    if (node) {
      // 如果键已存在，更新值并移到链表头部
      node.value = value;
      this.moveToHead(node);
    } else {
      // 如果键不存在，创建新节点
      const newNode = new CacheNode(key, value);
      this.cache.put(key, newNode);
      this.addToHead(newNode);
      
      // 如果超出容量，移除最久未使用的节点
      if (this.cache.count() > this.capacity) {
        const tailNode = this.removeTail();
        this.cache.delete(tailNode.key);
      }
    }
  }
  
  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.count();
  }
}

// 测试LRU缓存
const cache = new LRUCache<string, number>(2);
cache.put("one", 1);
cache.put("two", 2);
console.log(cache.get("one")); // 输出: 1
cache.put("three", 3); // 这会导致键 "two" 被移除
console.log(cache.get("two")); // 输出: null (已被移除)
console.log(cache.get("three")); // 输出: 3
```

## 7. 哈希表的时间和空间复杂度

### 7.1 时间复杂度

- **平均情况**：
  - 查找（find）：O(1)
  - 插入（put）：O(1)
  - 删除（delete）：O(1)
- **最坏情况**（发生大量冲突时）：
  - 查找（find）：O(n)
  - 插入（put）：O(n)
  - 删除（delete）：O(n)
- **扩容操作**：O(n)

### 7.2 空间复杂度

- 整体空间复杂度：O(n)
- 其中n是哈希表中存储的元素数量
- 实际空间占用取决于实现方式和负载因子

## 8. 哈希表的优化技巧

### 8.1 选择合适的哈希函数
- 一个好的哈希函数应该尽可能减少冲突，将键均匀分布在数组中
- 对于字符串，可以使用成熟的哈希算法如DJB2、FNV-1a等
- 对于自定义对象，确保实现了适当的哈希方法

### 8.2 合理设置初始容量和负载因子
- 根据预期的数据量设置合适的初始容量
- 选择适当的负载因子阈值（通常为0.75）
- 对于写多读少的场景，可以适当降低负载因子

### 8.3 使用适当的冲突解决策略
- 链地址法实现简单，适合大多数场景
- 开放地址法在空间紧张的情况下更有优势
- 双重哈希可以有效减少冲突和聚集现象

### 8.4 定期清理过期或无用的数据
- 对于长时间运行的应用，定期清理可以减少内存占用
- 实现惰性删除策略，只在必要时清理数据

### 8.5 使用不可变对象作为键
- 使用不可变对象作为键可以避免哈希值变化导致的问题
- 在JavaScript中，尽量使用原始类型或不可变对象作为Map的键

### 8.6 预计算常用哈希值
- 对于频繁使用的键，可以预计算其哈希值并缓存
- 避免在热点路径上重复计算哈希值

### 8.7 监控和调优
- 监控哈希表的性能指标，如冲突率、负载因子等
- 根据实际使用情况调整哈希表的参数

## 9. JavaScript中的原生哈希表

JavaScript提供了几种原生的哈希表实现：

### 9.1 Object

`Object`是JavaScript中最基本的哈希表实现：

```javascript
const obj = {};
obj["key1"] = "value1";
obj["key2"] = "value2";

console.log(obj["key1"]); // 输出: "value1"
console.log("key2" in obj); // 输出: true
```

### 9.2 Map

`Map`是ES6引入的更完善的哈希表实现：

```javascript
const map = new Map();
map.set("key1", "value1");
map.set("key2", "value2");

console.log(map.get("key1")); // 输出: "value1"
console.log(map.has("key2")); // 输出: true
```

### 9.3 WeakMap

`WeakMap`是一种特殊的Map，它的键必须是对象，并且不会阻止键被垃圾回收：

```javascript
const weakMap = new WeakMap();
const key = {};
weakMap.set(key, "value");

console.log(weakMap.get(key)); // 输出: "value"
```

### 9.4 Set和WeakSet

虽然不是键值对存储，但Set和WeakSet也是基于哈希表实现的：

```javascript
// Set存储唯一值
const set = new Set([1, 2, 3, 3]);
console.log(set.size); // 输出: 3

// WeakSet只能存储对象，且不会阻止垃圾回收
const weakSet = new WeakSet();
weakSet.add({});
```

### 9.5 选择合适的实现

| 特性 | Object | Map | WeakMap | Set | WeakSet |
|------|--------|-----|---------|-----|---------|
| 键类型 | 字符串或Symbol | 任意类型 | 只能是对象 | N/A | 只能是对象 |
| 值类型 | 任意 | 任意 | 任意 | 任意 | N/A |
| 键顺序 | 插入顺序（ES6+） | 插入顺序 | 不适用 | 插入顺序 | 不适用 |
| 大小获取 | 需手动计算 | 直接通过size属性 | 不支持 | 直接通过size属性 | 不支持 |
| 迭代 | for...in (包含原型链) | for...of, entries(), keys(), values() | 不支持 | for...of, entries(), keys(), values() | 不支持 |
| 垃圾回收 | 不会自动回收键 | 不会自动回收键 | 会自动回收不再引用的键 | 不会自动回收值 | 会自动回收不再引用的值 |
| 性能 | 适合少量键值对 | 适合频繁增删改查 | 适合存储对象的元数据 | 适合存储唯一值 | 适合存储对象的集合 |

## 10. 哈希表的高级主题

### 10.1 布隆过滤器（Bloom Filter）

布隆过滤器是一种空间效率很高的概率型数据结构，用于判断一个元素是否在一个集合中。它可能会出现误判（说存在实际不存在），但不会漏判（说不存在实际存在）。

布隆过滤器可以作为哈希表的前置过滤器，减少不必要的查找操作，提高性能：

```typescript
/**
 * 布隆过滤器实现
 */
class BloomFilter {
  private size: number;
  private bitArray: Uint8Array;
  private hashFunctions: ((str: string) => number)[];
  
  constructor(size: number = 10000, hashCount: number = 3) {
    this.size = size;
    this.bitArray = new Uint8Array(size).fill(0);
    
    // 创建多个哈希函数
    this.hashFunctions = [];
    for (let i = 0; i < hashCount; i++) {
      this.hashFunctions.push((str: string) => {
        // 使用不同的种子生成不同的哈希函数
        let hash = 0;
        for (let j = 0; j < str.length; j++) {
          hash = (hash * 31 + str.charCodeAt(j) + i) % size;
        }
        return hash;
      });
    }
  }
  
  /**
   * 添加元素到布隆过滤器
   */
  add(str: string): void {
    this.hashFunctions.forEach(hashFunc => {
      const index = hashFunc(str);
      this.bitArray[index] = 1;
    });
  }
  
  /**
   * 判断元素是否可能在集合中
   */
  mayContain(str: string): boolean {
    return this.hashFunctions.every(hashFunc => {
      const index = hashFunc(str);
      return this.bitArray[index] === 1;
    });
  }
}

// 布隆过滤器与哈希表结合使用示例
const bloomFilter = new BloomFilter();
const userDatabase = new HashTable<string, string>();

// 添加用户
bloomFilter.add("user1@example.com");
userDatabase.put("user1@example.com", "User One");

bloomFilter.add("user2@example.com");
userDatabase.put("user2@example.com", "User Two");

// 查找用户
function findUser(email: string): string | null {
  // 先检查布隆过滤器
  if (!bloomFilter.mayContain(email)) {
    return null; // 肯定不存在
  }
  
  // 布隆过滤器说可能存在，再到哈希表中查找
  return userDatabase.find(email);
}

console.log(findUser("user1@example.com")); // 输出: "User One"
console.log(findUser("nonexistent@example.com")); // 输出: null
```

### 10.2 一致性哈希（Consistent Hashing）

一致性哈希是一种特殊的哈希算法，主要用于分布式系统中，当哈希表的大小发生变化时，能够最小化键的重新映射。

一致性哈希的主要应用场景包括：
- 分布式缓存系统
- 负载均衡
- 分布式数据库分片

### 10.3 并行哈希表

在多核处理器环境下，传统哈希表可能会成为性能瓶颈。并行哈希表通过并发控制机制允许多个线程同时访问和修改哈希表，提高性能。

## 11. 常见问题和解决方案

### 11.1 哈希冲突过多

**问题**：当大量键映射到相同的哈希值时，哈希表性能会下降。

**解决方案**：
- 使用更好的哈希函数，确保键的均匀分布
- 降低负载因子，提前进行扩容
- 考虑使用不同的冲突解决策略

### 11.2 内存占用过高

**问题**：哈希表可能占用大量内存，特别是当负载因子较低时。

**解决方案**：
- 调整初始容量和负载因子
- 使用更紧凑的数据结构
- 定期清理过期数据
- 考虑使用WeakMap/WeakSet等自动垃圾回收的结构

### 11.3 性能退化

**问题**：在高负载情况下，哈希表性能可能会严重退化。

**解决方案**：
- 监控负载因子和冲突率
- 及时扩容
- 优化哈希函数
- 考虑使用更高效的哈希表实现

## 12. 总结

哈希表是一种极其重要的数据结构，它通过哈希函数将键映射到值，提供了平均O(1)时间复杂度的查找、插入和删除操作。哈希表在计算机科学的各个领域都有广泛的应用，如数据库索引、缓存系统、编译器设计等。

一个好的哈希表实现需要考虑多个因素，包括哈希函数的选择、冲突解决策略、扩容机制等。在实际应用中，我们可以使用JavaScript提供的原生实现（如Object、Map和WeakMap），也可以根据特定需求实现自定义的哈希表。

通过合理使用哈希表，我们可以显著提高程序的性能，特别是在需要频繁进行查找、插入和删除操作的场景中。哈希表的高效性使其成为解决许多算法问题的首选数据结构。

随着技术的发展，哈希表也在不断演进，出现了各种优化版本和变种，如布隆过滤器、一致性哈希等，这些扩展进一步增强了哈希表在不同场景下的适用性和性能。
```