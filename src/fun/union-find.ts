
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