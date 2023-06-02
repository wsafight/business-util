目录
* 有趣的算法
    * [根据背景色生成适合当前背景色的文本颜色](https://github.com/wsafight/Daily-Algorithm/blob/master/src/fun/contrast-text-color.ts)
    * [lisp 命令风格](https://github.com/wsafight/Daily-Algorithm/blob/master/src/fun/eval-lisp.ts)
    
* 业务型
    * [格式化文件大小——基础](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/formatFileSize.ts)
    * [格式化文件大小——复杂(直接使用 filesize 库)](https://github.com/avoidwork/filesize.js)
    * [文件魔数(使用 file-type 库)](https://github.com/sindresorhus/file-type)
    * [小数四舍五入](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/round.ts)
    * [根据对象路径处理对象属性](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/handleObjPropByPath.ts)
    * [项目版本排序](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/compare-version.ts)
    * [快照历史 redo-undo](https://github.com/wsafight/snapshot-history/blob/master/src/index.ts)
    * [获取范围内合适的数据](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/clamp.ts)
    * [数字范围内增减](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/round-index.ts)
    * [url 正则功能 (使用 path-to-regexp, 功能强大)](https://github.com/pillarjs/path-to-regexp)
    * [事件 bus mitt](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/mitt.ts)
    * [获得扁平的数据键](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/getFlatterObjKeys.ts)
    * [下载文件](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/download-file.ts)
    * [字符串 JSON 增强,可以使用函数等结构 (使用 serialize-javascript)](https://github.com/yahoo/serialize-javascript)
    * [ip 地址 (直接使用 ip-address)](https://github.com/beaugunderson/ip-address)
    * [函数柯里化](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/self-curry.ts)
    * [偏函数](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/partial.ts)
    * [存根](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/stub.ts)
    * [数组树过滤](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/array-tree-filter.ts)
    * [阅读时间](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/reading-time.ts)
    * [生成唯一id](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/generate-UUID.ts)
    * 缓存
        * LRU (最近最少使用) 
        * LFU (最不经常使用)
        * 超时过期
    * 前端深拷贝
    * 树 [TODO]
    * 树 
        * [O(n) 构建树](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/build-tree.ts) 
        * [前缀树](https://github.com/wsafight/Daily-Algorithm/blob/master/src/business/trie-tree.ts)
    * promise [TODO]
* data structure
    * [HashTable](https://github.com/wsafight/Daily-Algorithm/blob/master/src/data-structure/HashTable.ts)
    
* 二进制 [https://leetcode-cn.com/tag/bit-manipulation/]
    * [交换两个数](https://github.com/wsafight/Daily-Algorithm/blob/master/src/bit-manipulation/number-of-exchange.ts)
    * [求二进制数中 1 的个数](https://github.com/wsafight/Daily-Algorithm/blob/master/src/bit-manipulation/number-of-one.ts)
    * [比较两个二进制数中 1 的个数](https://github.com/wsafight/Daily-Algorithm/blob/master/src/bit-manipulation/diff-number-of-one.ts)
    * [将数字变成 0 的操作次数]()
    * [一个数字是否是 2 的幂](https://github.com/wsafight/Daily-Algorithm/blob/master/src/bit-manipulation/is-power-of-two.ts)
    * [缺失数字](https://github.com/wsafight/Daily-Algorithm/blob/master/src/bit-manipulation/missing-number.ts)
    * [数字转 16 进制](https://github.com/wsafight/Daily-Algorithm/blob/master/src/bit-manipulation/missing-number.ts)
    
    
* 排序
    * 冒泡
    
* 查找    

* leetcode
    * 9.[回文数](https://github.com/wsafight/Daily-Algorithm/blob/master/src/leetcode/9.palindrome-number)
    * 38.[外观数列](https://github.com/wsafight/Daily-Algorithm/blob/master/src/leetcode/38.count-and-say.ts)

* 小程序 (后期可能建立单独项目)
    * 机器人寻路 (未完成)
    * 编程语言 (TODO)
    * 像素绘图 (TODO)


- 防火墙代理：控制网络资源的访问，保护主题不让“坏人”接近。
- 远程代理：为一个对象在不同的地址空间提供局部代表，在 Java 中，远程代理可以是一个虚拟机中的对象。
- 保护代理：用于对象应该有不同访问权限的情况。
- 智能引用代理：取代了简单的指针，它在访问对象时执行一些附加操作，比如计算一个对象被引用的次数。
- 写时复制代理：通常用于复制一个庞大对象的情况。写时复制代理延迟了复制的过程，当对象被真正修改时，才对它进行复制操作。写时复制代理是虚拟代理的一种变体，DLL （操作系统中的动态链接库）是其典型运用场景。


https://slowfil.es/

https://jorgechavez.dev/2020/11/12/string-hashing/

```js
function hash(word) {
    var p = 31;
    var m = 1e9 + 9;
    var hash_value = 0;
    for(var i = 0; i < word.length; i++) {
        var letter = word[i];
        var charCode = letter.charCodeAt();
        hash_value = hash_value + (charCode * Math.pow(p, i))
    }
    return hash_value % m;
}

console.log(hash("apple"));
```


http://jvns.ca/blog/2021/06/08/reasons-why-bugs-might-feel-impossible/

很难复现
你不太了解整个系统
很难获得有关该错误的数据
你的假设之一是错误的
这个bug真的很复杂


https://comby.dev/


https://github.com/Stuk/jszip 压缩文件


export default async function limit(tasks, concurrency) {
  const results = [];

  async function runTasks(tasksIterator) {
    for (const [index, task] of tasksIterator) {
      try {
        results[index] = await task();
      } catch (error) {
        results[index] = new Error(`Failed with: ${error.message}`);
      }
    }
  }

  const workers = new Array(concurrency)
    .fill(tasks.entries())
    .map(runTasks);

  await Promise.allSettled(workers);

  return results;
}

时序数据库 https://blog.timescale.com/blog/what-the-heck-is-time-series-data-and-why-do-i-need-a-time-series-database-dcf3b1b18563/?utm_source=status-code-weekly-sponsor&utm_medium=email&utm_campaign=status-code-weekly-sponsor-may-2021&utm_content=wth-blog

基础设施即代码？ https://github.com/run-x/opta

https://zhuanlan.zhihu.com/p/58622271

https://bart.degoe.de/building-a-full-text-search-engine-150-lines-of-code/

```ts
filename = filename.replace(/[\\/|:*?"><]/g, '_')
```

https://zhuanlan.zhihu.com/p/28907384

Leaflet

https://github.com/rubickCenter/rubick

https://github.com/bitwiseshiftleft/sjcl

https://github.com/Zizzamia/perfume.js

qier-progress

https://github.com/alibaba/formily

https://github.com/zerosoul/rc-bullets

https://github.com/svrxjs/svrx

https://github.com/yinxin630/fiora

https://github.com/liriliri/licia

https://github.com/GoogleChromeLabs/squoosh

https://github.com/zhuyingda/veneno

https://github.com/os-js/OS.js

安全性
https://github.com/jpillora/xdomain

[本周的代码]

https://github.com/bradtraversy/50projects50days


https://github.com/chinanf-boy/didact-explain

https://github.com/yjhjstz/deep-into-node

https://github.com/xitu/js-stack-from-scratch



************** 8 月份必读
http://www.craftinginterpreters.com/contents.html

************** 9 月份必读
https://icyfenix.cn/distribution/secure/service-security.html