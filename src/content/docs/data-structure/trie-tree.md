---
title: "前缀树 (Trie Tree)"
subtitle: "高效的字符串检索与前缀匹配数据结构"
description: "一种树形数据结构，专门用于高效存储和检索字符串集合，特别适合前缀匹配、自动完成和拼写检查等功能"
---

## 1. 什么是前缀树？

前缀树（Trie Tree），也称为字典树或单词查找树，是一种树形数据结构，专门用于高效地存储和检索字符串集合中的键。它的名称 "Trie" 源自于 "retrieval"（检索），体现了其主要用途是快速检索字符串。

前缀树的核心特点是：
- 树的每个节点代表一个字符
- 从根节点到某一节点的路径上，所有经过的字符连接起来，即为该节点对应的字符串
- 每个节点可以有多个子节点，但同一父节点下的子节点字符互不相同
- 某些节点被标记为单词的结束
- 共享前缀的字符串在树中共享相同的路径

## 2. 前缀树的工作原理

### 2.1 数据结构组成

前缀树由节点组成，每个节点包含以下元素：
- 子节点映射：通常是一个对象或数组，存储当前节点的所有子节点
- 标记位：表示该节点是否是某个单词的结尾
- 可选的附加信息：如单词频率、权重等

### 2.2 基本操作原理

- **插入操作**：从根节点开始，沿着字符串的字符逐个创建或遍历节点，最后将末尾节点标记为单词结束
- **查找操作**：从根节点开始，沿着字符串的字符逐个遍历节点，如果能够完整遍历且末尾节点被标记为单词结束，则说明字符串存在
- **前缀匹配**：从根节点开始，沿着前缀的字符逐个遍历节点，如果能够完整遍历，则说明存在以该前缀开头的字符串
- **删除操作**：从根节点开始找到要删除的单词，然后递归地删除不再需要的节点

## 3. 前缀树与哈希表的比较

我们当然可以用哈希表来解决字符串查询问题，但前缀树在某些方面具有独特的优势：

| 特性 | 前缀树 | 哈希表 |
|------|--------|--------|
| 前缀查询 | ✅ 高效支持 | ❌ 难以高效实现 |
| 前缀匹配 | ✅ 快速查找所有以特定前缀开头的单词 | ❌ 不支持 |
| 空间效率 | ✅ 对于有大量共同前缀的字符串集合更节省空间 | ❌ 对于共同前缀字符串不共享存储 |
| 字典序遍历 | ✅ 可以按字典序遍历所有字符串 | ❌ 无法保证顺序 |
| 无哈希冲突 | ✅ 不存在哈希冲突问题 | ❌ 可能存在哈希冲突 |
| 单次查找时间 | O(m)，m为字符串长度 | O(1) 平均，但受哈希函数和冲突影响 |
| 内存开销 | 可能较高，尤其对于稀疏数据集 | 通常较小，对于随机数据集 |

## 4. 前缀树的应用场景

前缀树在计算机科学和实际应用中有广泛的用途，特别是在前端开发中，可用于实现以下功能：

### 4.1 自动完成和提前输入功能
在用户输入时提供实时建议，如搜索引擎、IDE代码编辑器中的自动补全功能。

### 4.2 拼写检查和纠正
检测单词拼写错误并提供纠正建议，如文字处理软件、浏览器地址栏的拼写检查。

### 4.3 搜索优化
快速匹配搜索关键词，提高搜索效率，如数据库索引、全文搜索引擎。

### 4.4 字符串排序
按字典序对大量字符串进行高效排序，时间复杂度为O(n)，其中n为所有字符串的总长度。

### 4.5 电话号码和IP地址存储
高效存储和检索电话号码、IP地址等结构化字符串，如电话簿、路由表。

### 4.6 文本预测
根据用户输入的历史记录预测可能输入的下一个单词，如智能输入法、聊天机器人。

### 4.7 敏感词过滤
高效识别和过滤文本中的敏感词，如内容审核系统。

## 5. 前缀树的TypeScript实现

下面是一个完整的前缀树实现，包含常用操作和详细注释：

```typescript
/**
 * 前缀树节点接口
 */
interface TrieNode {
  [key: string]: any; // 子节点映射
  isWord?: boolean;   // 标记是否是单词结尾
  count?: number;     // 词频统计
}

/**
 * 前缀树类 - 用于高效存储和检索字符串集合
 */
class TrieTree {
  private readonly root: TrieNode = Object.create(null); // 根节点，不存储字符

  /**
   * 向前缀树中插入一个单词
   * @param word 要插入的单词
   * @returns 前缀树实例，支持链式调用
   */
  insert(word: string): this {
    if (!word || typeof word !== 'string') {
      return this;
    }

    let node = this.root;
    for (const char of word) {
      // 如果字符节点不存在，则创建
      if (!node[char]) {
        node[char] = Object.create(null);
      }
      node = node[char]; // 移动到下一个节点
    }
    node.isWord = true;  // 标记单词结尾
    node.count = (node.count || 0) + 1; // 增加词频计数
    return this;
  }

  /**
   * 遍历到指定单词或前缀的节点
   * @param word 要遍历的单词或前缀
   * @returns 对应的节点，如果不存在则返回null
   * @private
   */
  private traverse(word: string): TrieNode | null {
    if (!word || typeof word !== 'string') {
      return null;
    }

    let node = this.root;
    for (const char of word) {
      node = node[char];
      if (!node) return null; // 路径不存在
    }
    return node;
  }

  /**
   * 查找一个单词是否存在于前缀树中
   * @param word 要查找的单词
   * @returns 单词是否存在
   */
  search(word: string): boolean {
    const node = this.traverse(word);
    return !!node && !!node.isWord; // 存在且是单词结尾
  }

  /**
   * 查找前缀树中是否存在以给定前缀开头的单词
   * @param prefix 要查找的前缀
   * @returns 是否存在以该前缀开头的单词
   */
  startsWith(prefix: string): boolean {
    return !!this.traverse(prefix); // 只需确认路径存在
  }

  /**
   * 获取以给定前缀开头的所有单词
   * @param prefix 要查找的前缀
   * @returns 以该前缀开头的所有单词列表
   */
  getWordsWithPrefix(prefix: string): string[] {
    const result: string[] = [];
    
    if (!prefix || typeof prefix !== 'string') {
      return result;
    }

    // 找到前缀对应的节点
    const node = this.traverse(prefix);
    if (!node) {
      return result; // 前缀不存在
    }

    // 从前缀节点开始深度优先搜索所有单词
    this.dfs(node, prefix, result);
    return result;
  }

  /**
   * 深度优先搜索辅助函数
   * @param node 当前节点
   * @param currentWord 当前形成的单词
   * @param result 结果数组
   * @private
   */
  private dfs(node: TrieNode, currentWord: string, result: string[]): void {
    // 如果当前节点是单词结尾，将单词加入结果
    if (node.isWord) {
      result.push(currentWord);
    }

    // 遍历所有子节点
    for (const char in node) {
      // 跳过特殊标记属性
      if (char === 'isWord' || char === 'count') continue;
      
      // 递归搜索子节点
      this.dfs(node[char], currentWord + char, result);
    }
  }

  /**
   * 获取前缀树中所有单词
   * @returns 前缀树中的所有单词列表
   */
  getAllWords(): string[] {
    return this.getWordsWithPrefix(''); // 空前缀表示获取所有单词
  }

  /**
   * 删除一个单词
   * @param word 要删除的单词
   * @returns 是否成功删除
   */
  delete(word: string): boolean {
    if (!word || typeof word !== 'string') {
      return false;
    }

    // 递归删除辅助函数
    const deleteHelper = (node: TrieNode, word: string, index: number): boolean => {
      // 如果已经处理完所有字符
      if (index === word.length) {
        // 如果不是单词结尾，说明单词不存在
        if (!node.isWord) {
          return false;
        }
        
        // 标记为非单词结尾
        node.isWord = false;
        
        // 如果该节点没有子节点，可以删除
        return Object.keys(node).length === (node.count ? 1 : 0);
      }

      const char = word[index];
      const nextNode = node[char];

      // 如果字符不存在，说明单词不存在
      if (!nextNode) {
        return false;
      }

      // 递归删除子节点
      const shouldDeleteChild = deleteHelper(nextNode, word, index + 1);

      // 如果子节点应该被删除
      if (shouldDeleteChild) {
        delete node[char];
        // 如果当前节点不是单词结尾且没有其他子节点，也可以删除
        return !node.isWord && Object.keys(node).length === (node.count ? 1 : 0);
      }

      return false;
    };

    return deleteHelper(this.root, word, 0);
  }

  /**
   * 统计单词出现的次数
   * @param word 要统计的单词
   * @returns 单词出现的次数
   */
  getWordCount(word: string): number {
    const node = this.traverse(word);
    return node && node.isWord ? (node.count || 0) : 0;
  }

  /**
   * 获取前缀树中单词的总数
   * @returns 单词总数
   */
  size(): number {
    const count: number[] = [0];
    this.countWords(this.root, count);
    return count[0];
  }

  /**
   * 统计单词数量的辅助函数
   * @param node 当前节点
   * @param count 计数数组（使用数组以便在递归中修改值）
   * @private
   */
  private countWords(node: TrieNode, count: number[]): void {
    if (node.isWord) {
      count[0]++;
    }

    for (const char in node) {
      if (char !== 'isWord' && char !== 'count') {
        this.countWords(node[char], count);
      }
    }
  }

  /**
   * 清空前缀树
   * @returns 前缀树实例，支持链式调用
   */
  clear(): this {
    this.root = Object.create(null);
    return this;
  }
}
```

## 6. 前缀树的使用示例

### 6.1 基本操作示例

```typescript
// 创建前缀树实例
const trie = new TrieTree();

// 插入单词
trie.insert("apple");
trie.insert("application");
trie.insert("banana");
trie.insert("app");
trie.insert("app"); // 重复插入，会增加词频

// 搜索单词
console.log(trie.search("apple"));  // 输出: true
console.log(trie.search("app"));    // 输出: true
console.log(trie.search("appl"));   // 输出: false

// 前缀匹配
console.log(trie.startsWith("app")); // 输出: true
console.log(trie.startsWith("ban")); // 输出: true
console.log(trie.startsWith("bat")); // 输出: false

// 获取以某前缀开头的所有单词
console.log(trie.getWordsWithPrefix("app")); // 输出: ["app", "apple", "application"]

// 获取所有单词
console.log(trie.getAllWords()); // 输出: ["app", "apple", "application", "banana"]

// 获取单词出现次数
console.log(trie.getWordCount("app"));    // 输出: 2
console.log(trie.getWordCount("apple"));  // 输出: 1

// 获取单词总数
console.log(trie.size()); // 输出: 4

// 删除单词
console.log(trie.delete("apple")); // 输出: true
console.log(trie.search("apple")); // 输出: false

// 清空前缀树
trie.clear();
console.log(trie.size()); // 输出: 0
```

### 6.2 自动完成功能示例

下面是一个使用前缀树实现搜索框自动完成功能的示例：

```javascript
// HTML结构示例：<input type="text" id="searchInput"><ul id="suggestions"></ul>

// 初始化前缀树并添加单词
const trie = new TrieTree();
const words = [
  "apple", "application", "app", "apartment", "banana",
  "ball", "cat", "car", "computer", "code",
  "design", "development", "data", "database", "debug"
];

// 将所有单词添加到前缀树
words.forEach(word => trie.insert(word));

// 获取DOM元素
const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('suggestions');

// 添加输入事件监听器
searchInput.addEventListener('input', () => {
  const prefix = searchInput.value.trim();
  
  // 清空建议列表
  suggestionsList.innerHTML = '';
  
  // 如果输入为空，不显示建议
  if (!prefix) {
    return;
  }
  
  // 获取以输入为前缀的所有单词
  const suggestions = trie.getWordsWithPrefix(prefix);
  
  // 限制显示的建议数量
  const MAX_SUGGESTIONS = 5;
  const displaySuggestions = suggestions.slice(0, MAX_SUGGESTIONS);
  
  // 显示建议
  displaySuggestions.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    
    // 添加点击事件，将建议填入输入框
    li.addEventListener('click', () => {
      searchInput.value = word;
      suggestionsList.innerHTML = '';
    });
    
    suggestionsList.appendChild(li);
  });
});

// 点击页面其他地方关闭建议列表
document.addEventListener('click', (event) => {
  if (event.target !== searchInput && !suggestionsList.contains(event.target)) {
    suggestionsList.innerHTML = '';
  }
});
```

### 6.3 拼写检查功能示例

下面是一个使用前缀树实现简单拼写检查的示例：

```typescript
// 初始化前缀树并添加词典单词
const dictionary = new TrieTree();
const dictionaryWords = [
  "hello", "world", "javascript", "typescript", "programming",
  "computer", "science", "algorithm", "data", "structure",
  "trie", "tree", "search", "autocomplete", "spelling"
];

dictionaryWords.forEach(word => dictionary.insert(word));

/**
 * 检查单词拼写是否正确
 * @param word 要检查的单词
 * @returns 是否拼写正确
 */
function checkSpelling(word: string): boolean {
  return dictionary.search(word);
}

/**
 * 获取拼写建议
 * @param word 拼写可能错误的单词
 * @returns 可能的正确拼写建议列表
 */
function getSpellingSuggestions(word: string): string[] {
  const suggestions: string[] = [];
  
  // 简单的编辑距离为1的建议生成
  // 1. 替换一个字符
  for (let i = 0; i < word.length; i++) {
    for (let c = 97; c <= 122; c++) { // a-z
      const char = String.fromCharCode(c);
      if (char !== word[i]) {
        const newWord = word.slice(0, i) + char + word.slice(i + 1);
        if (dictionary.search(newWord)) {
          suggestions.push(newWord);
        }
      }
    }
  }
  
  // 2. 插入一个字符
  for (let i = 0; i <= word.length; i++) {
    for (let c = 97; c <= 122; c++) { // a-z
      const char = String.fromCharCode(c);
      const newWord = word.slice(0, i) + char + word.slice(i);
      if (dictionary.search(newWord)) {
        suggestions.push(newWord);
      }
    }
  }
  
  // 3. 删除一个字符
  for (let i = 0; i < word.length; i++) {
    const newWord = word.slice(0, i) + word.slice(i + 1);
    if (dictionary.search(newWord)) {
      suggestions.push(newWord);
    }
  }
  
  // 去重并返回
  return [...new Set(suggestions)];
}

// 测试拼写检查功能
console.log(checkSpelling("javascript")); // 输出: true
console.log(checkSpelling("javascripts")); // 输出: false
console.log(getSpellingSuggestions("javescript")); // 可能输出: ["javascript"]
console.log(getSpellingSuggestions("js")); // 可能输出: [] 或其他匹配项
```

### 6.4 敏感词过滤示例

下面是一个使用前缀树实现敏感词过滤的示例：

```typescript
// 创建敏感词前缀树
const sensitiveWordsTrie = new TrieTree();
const sensitiveWords = ["bad", "evil", "ugly", "terrible", "worst"];

sensitiveWords.forEach(word => sensitiveWordsTrie.insert(word));

/**
 * 过滤文本中的敏感词
 * @param text 要过滤的文本
 * @param replacement 替换字符，默认为 '*'
 * @returns 过滤后的文本
 */
function filterSensitiveWords(text: string, replacement: string = '*'): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  const result = [];
  let i = 0;
  
  while (i < text.length) {
    let currentPos = i;
    let currentNode = sensitiveWordsTrie.traverse(text[i]);
    let lastMatchPos = -1;
    
    if (currentNode) {
      // 尝试匹配尽可能长的敏感词
      let j = i + 1;
      while (j < text.length) {
        if (!currentNode || !currentNode[text[j]]) {
          break;
        }
        currentNode = currentNode[text[j]];
        j++;
        
        // 如果找到一个完整的敏感词
        if (currentNode.isWord) {
          lastMatchPos = j;
        }
      }
      
      // 如果找到敏感词，进行替换
      if (lastMatchPos !== -1) {
        result.push(replacement.repeat(lastMatchPos - i));
        i = lastMatchPos;
        continue;
      }
    }
    
    // 不是敏感词，直接添加
    result.push(text[i]);
    i++;
  }
  
  return result.join('');
}

// 测试敏感词过滤功能
const text = "This is a bad example with some evil words.";
const filteredText = filterSensitiveWords(text);
console.log(filteredText); // 输出: "This is a *** example with some **** words."
```

## 7. 前缀树的时间和空间复杂度

### 7.1 时间复杂度

| 操作 | 时间复杂度 | 说明 |
|------|------------|------|
| 插入 (insert) | O(m) | m为单词长度 |
| 查找 (search) | O(m) | m为单词长度 |
| 前缀匹配 (startsWith) | O(m) | m为前缀长度 |
| 获取所有单词 (getAllWords) | O(n) | n为所有单词的总字符数 |
| 删除 (delete) | O(m) | m为单词长度 |
| 获取单词计数 (getWordCount) | O(m) | m为单词长度 |

### 7.2 空间复杂度

- **整体空间复杂度**：O(n)，其中n是前缀树中所有单词的总字符数
- 在最坏情况下（没有共同前缀的单词集合），空间复杂度会接近所有单词的总长度
- 在最好情况下（有大量共同前缀的单词集合），空间复杂度会显著低于存储所有单词的空间
- 具体空间使用还取决于实现方式，例如使用数组还是对象存储子节点

## 8. 前缀树的优化技巧

### 8.1 路径压缩
对于只有一个子节点且不是单词结尾的节点，可以将路径压缩，减少节点数量，提高空间效率和查询速度。

```typescript
// 压缩路径示例
interface CompressedTrieNode {
  [key: string]: any;
  isWord?: boolean;
  count?: number;
  path?: string; // 压缩后的路径
}
```

### 8.2 分支合并
对于相同路径的不同单词，可以合并共同前缀的分支，进一步节省空间。

### 8.3 字符集优化
如果字符集有限（如仅小写字母），可以使用数组代替对象来存储子节点，提高访问速度和空间效率。

```typescript
// 使用数组存储子节点的示例
class OptimizedTrie {
  private children: OptimizedTrie[] = [];
  private isWord: boolean = false;
  
  // 假设只处理小写字母a-z
  getChild(char: string): OptimizedTrie | null {
    const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
    return this.children[index] || null;
  }
  
  setChild(char: string, node: OptimizedTrie): void {
    const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
    this.children[index] = node;
  }
  
  // 其他方法...
}
```

### 8.4 惰性删除
对于删除操作，可以只标记节点为非单词结尾，而不实际删除节点，以提高性能。

### 8.5 缓存热门查询
对于频繁查询的前缀，可以缓存其结果，减少重复计算。

### 8.6 并行构建
对于大规模数据集，可以考虑并行构建前缀树，提高初始化速度。

### 8.7 持久化
对于需要长期使用的前缀树，可以实现序列化和反序列化功能，支持从磁盘加载和保存。

## 9. 扩展实现：压缩前缀树和双数组Trie

### 9.1 压缩前缀树 (Compressed Trie)

压缩前缀树是前缀树的一种空间优化版本，它通过合并只有一个子节点的路径来减少节点数量。

压缩前缀树的主要特点：
- 合并单一路径的节点，减少内存使用
- 每个节点可以存储多个字符，而不仅仅是一个
- 适合存储有大量共同前缀的字符串集合

### 9.2 双数组Trie (Double-Array Trie)

双数组Trie是一种更高级的Trie实现，它使用两个数组（base数组和check数组）来存储Trie结构，具有极高的空间效率和查询速度。

双数组Trie的主要特点：
- 使用两个整数数组表示Trie结构
- 空间利用率高，特别适合大规模词汇
- 查询速度极快，接近O(1)的时间复杂度
- 构建过程相对复杂

## 10. 总结

前缀树是一种强大的数据结构，特别适合处理字符串集合，尤其是在需要前缀匹配和自动完成功能的场景中表现出色。它通过共享前缀来节省空间，同时提供高效的插入、查询和删除操作。

在前端开发中，前缀树可以用于实现搜索自动完成、拼写检查、敏感词过滤等功能，提升用户体验。通过合理的实现和优化，前缀树可以在保持高效性能的同时，处理大量的字符串数据。

与哈希表等其他数据结构相比，前缀树在处理字符串前缀相关操作时具有明显优势，但在某些简单的字符串查找场景中，哈希表可能更为高效。在实际应用中，应根据具体需求选择合适的数据结构，或结合多种数据结构的优势。

前缀树的变种（如压缩前缀树、双数组Trie等）在特定场景下可以提供更好的性能和空间效率，但实现复杂度也相应增加。在选择具体实现时，需要权衡实现复杂度、性能需求和空间限制等因素。