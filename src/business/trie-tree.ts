/**
 * 前缀树 (用于构建查询数据)
 *  题目：给你100000个长度不超过10的单词。对于每一个单词，我们要判断他出没出现过。
 *  如果出现了，求第一次出现在第几个位置。
 *  分析：这题当然可以用hash来解决，但是本文重点介绍的是trie树，因为在某些方面它的用途更大。
 *  比如说对于某一个单词，我们要询问它的前缀是否出现过。这样hash就不好搞了，而用trie还是很简单。
 */

export class TrieTree {
  root: Record<string, any>

  constructor() {
    this.root = Object.create(null)
  }

  insert(word: string) {
    let node = this.root
    for (const c of word) {
      if (!node[c]) node[c] = Object.create(null)
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
