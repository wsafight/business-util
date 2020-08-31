/**
 * 前缀树 (用于构建查询数据)
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
