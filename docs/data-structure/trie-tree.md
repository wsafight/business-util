# 前缀树 (用于构建查询数据)

我们当然可以用 hash 来解决数据查询问题，但前缀树在某些方面它的用途更大。

比如说对于某一个单词，我们要询问它的前缀是否出现过。这样 hash 就不好搞了，而用 trie 还是很简单。

同时，前缀树在前端开发中，可用于以下程序：
      
- 自动完成和提前输入功能
- 拼写检查
- 搜索
- 排序
- 此外 trie 树可以用来存储电话号码，IP 地址和对象等

```ts
class TrieTree {
  private readonly root: Record<string, any> = Object.create(null)


  insert(word: string) {
    let node = this.root
    for (const c of word) {
      if (!node[c]) {
        node[c] = Object.create(null)
      }
      node = node[c]
    }
    node.isWord = true
  }

  traverse(word: string) {
    let node = this.root
    for (const c of word) {
      node = node[c]
      if (!node) return null
    }
    return node
  }

  search(word: string) {
    const node = this.traverse(word)
    return !!node && !!node.isWord
  }

  startsWith(prefix: string) {
    return !!this.traverse(prefix)
  }
}

```