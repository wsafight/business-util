# 并查集

Union-Find 算法，也就是常说的并查集，主要是解决图论中「动态连通性」问题的。

判断这种「等价关系」非常实用，比如说编译器判断同一个变量的不同引用，比如社交网络中的朋友圈计算等等。同时，union 的结构思想十分巧妙。


Union-Find 算法主要需要实现这两个 API
```ts
interface UF {
  /* 将 p 和 q 连接 */
  union(p: number, q :number): void;
  /* 判断 p 和 q 是否连通 */
  connected( p: number,  q: number): boolean;
  /* 返回图中有多少个连通分量 */
  count(): number;
}
```

这里所说的「连通」是一种等价关系，也就是说具有如下三个性质：
- 自反性：节点p和p是连通的。
- 对称性：如果节点p和q连通，那么q和p也连通。
- 传递性：如果节点p和q连通，q和r连通，那么p和r也连通。

我们使用森林（若干棵树）来表示图的动态连通性，用数组来具体实现这个森林。

我们来构建一下并查集:
 - 首先节点指向自身
   注：自身连通保证了在寻找时候在连通最高节点时一致
 - 其次如果两个节点连通，让其中的（任意）一个节点的根节点接到另一个节点的根节点上。   
   注:这样两个节点是否连通，我们可以通过寻找祖先节点来判断
 - 不断加入节点，再进行第二步操作
 - 最终我们得到几棵大树，此时我们不再进行连通，后面进行查询
   

```ts
class UF {
  // 连通分量个数
  private num: number
  // 存储一棵树
  private readonly parent: number[]
  // 记录树的“重量”
  private  size: number[]

  constructor(n: number) {
    this.num = n
    const parent = new Array<number>(n)
    const size = new Array<number>(n)
    for (let i = 0; i < n; i++) {
      parent[i] = i;
      size[i] = 1;
    }
    this.parent = parent
    this.size = size
  }

  public  count() {
    return this.num;
  }

  private find( x: number): number {
    const parent = this.parent
    while (parent[x] != x) {
      // 进行路径压缩
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  public union(p: number, q: number) {
    const rootP = this.find(p)
    const rootQ = this.find(q)
    if (rootP === rootQ) {
      return
    }

    // 小树接到大树下面，较平衡
    if (this.size[rootP] > this.size[rootQ]) {
      this.parent[rootQ] = rootP;
      this.size[rootP] += this.size[rootQ];
    } else {
      this.parent[rootP] = rootQ;
      this.size[rootQ] += this.size[rootP];
    }
    this.num--;
  }
  
  public connected(p: number, q: number) {
    const rootP = this.find(p);
    const rootQ = this.find(q);
    return rootP == rootQ;
  }
}
```