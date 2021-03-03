# 跳表

Redis 使用跳表来构建有序列表 (Zset)。跳表的性能可以保证在查找，删除，添加等操作的时候在对数期望时间内完成，这个性能是可以和平衡树来相比较的，而且在实现方面比平衡树要优雅，这就是跳表的长处。跳表的缺点就是需要的存储空间比较大，属于利用空间来换取时间的数据结构。

如图所示:

![skip-table](./skip-table.png)

```ts

/** 定义了跳表索引的最大级数 */
const MAX_SKIP_NODE_LEVEL = 16;

interface SkipListNodeProps<T> {
  /** 存放了每个节点的数据 */
  data: T | null
  /** 当前节点处于整个跳表索引的级数  */
  maxLevel: number
  /** 存放着很多个索引
   * 如果用p表示当前节点，用level表示这个节点处于整个跳表索引的级数；那么p[level]表示在level这一层级p节点的下一个节点
   * p[level-n]表示level级下面n级的节点
   * */
  refer: SkipListNode<T>[]
}

class SkipListNode<T> implements SkipListNodeProps<T> {
  data: T | null;
  maxLevel: number;
  refer: SkipListNode<T>[];

  constructor({
                data = null,
                maxLevel = 0,
                refer = new Array(MAX_SKIP_NODE_LEVEL)
              } = {}) {
    this.data = data;
    this.maxLevel = maxLevel;
    this.refer = refer
  }
}
```

```ts
class SkipList<T> {
  head: SkipListNode<T>
  levelCount: number

  constructor() {
    this.head = new SkipListNode();
    this.levelCount = 1;
  }

  randomLevel() {
    let level = 1;
    for (let i = 1; i < MAX_SKIP_NODE_LEVEL; i++) {
      if (Math.random() < 0.5) {
        level++;
      }
    }
    return level;
  }

  insert(value:T) {
    const level = this.randomLevel();
    const newNode = new SkipListNode({
      data: value,
      maxLevel: level
    })
    const update = (new Array(level) as any).fill(new SkipListNode());
    let p = this.head;
    for(let i = level - 1; i >= 0; i--) {
      while(p.refer[i] !== undefined && p.refer[i].data < value) {
        p = p.refer[i];
      }
      update[i] = p;
    }
    for(let i = 0; i < level; i++) {
      newNode.refer[i] = update[i].refer[i];
      update[i].refer[i] = newNode;
    }
    if(this.levelCount < level) {
      this.levelCount = level;
    }
  }

  find(value: T) {
    if(!value){return null}
    let p = this.head;
    for(let i = this.levelCount - 1; i >= 0; i--) {
      while(p.refer[i] !== undefined && p.refer[i].data < value) {
        p = p.refer[i];
      }
    }

    if(p.refer[0] !== undefined && p.refer[0].data === value) {
      return p.refer[0];
    }
    return null;
  }

  remove(value: T) {
    let _node;
    let p: SkipListNode<T> = this.head;
    const update = new Array(new SkipListNode());
    for(let i = this.levelCount - 1; i >= 0; i--) {
      while(p.refer[i] !== undefined && p.refer[i].data < value){
        p = p.refer[i];
      }
      update[i] = p;
    }

    if(p.refer[0] !== undefined && p.refer[0].data === value) {
      _node = p.refer[0];
      for(let i = 0; i <= this.levelCount - 1; i++) {
        if(update[i].refer[i] !== undefined && update[i].refer[i].data === value) {
          update[i].refer[i] = update[i].refer[i].refer[i];
        }
      }
      return _node;
    }
    return null;
  }
}
```