// 单向链表节点
class ForwardListNode {
  public key: string;
  public value: any;
  public next: ForwardListNode | null = null

  constructor(key: string, value: any) {
    this.key = key
    this.value = value
  }
}

class HashTable {
  private size = 0
  private buckets: any

  constructor(private readonly bucketSize: number = 97) {
    this.size = 0
    this.buckets = new Array(this.bucketSize)
  }

  hash(key: string) {
    let h = 0
    for (let n = key.length, i = 0; i !== n; i++) {
      h = (h << 5 | h >> 27)
      h += key[i].charCodeAt(0)
    }
    return (h >>> 0) % this.bucketSize
  }

  put(key: string, value: any) {
    let index = this.hash(key)
    let node = new ForwardListNode(key, value)
    if (!this.buckets[index]) {
      this.buckets[index] = node
    } else {
      node.next = this.buckets[index]
      this.buckets[index] = node
    }
    this.size++
    return index
  }

  isEmpty() {
    return this.size === 0
  }

  count() {
    return this.size
  }

  delete(key: string) {
    let index = this.hash(key)
    if (!this.buckets[index]) {
      return false
    }

    // 虚拟头节点
    let dummy = new ForwardListNode('head', null)
    dummy.next = this.buckets[index]
    let cur = dummy.next
    let pre = dummy
    while (cur) {
      if (cur.key === key) {
        pre.next = cur.next
        cur = pre.next
        this.size--
      } else {
        pre = cur
        cur = cur.next
      }
    }
    this.buckets[index] = dummy.next
    return true
  }

  find(key: string) {
    let index = this.hash(key)
    if (!this.buckets[index]) {
      return null
    }

    let p = this.buckets[index]
    while (p) {
      if (p.key == key) {
        return p.value
      }
      p = p.next
    }
    return null
  }


}