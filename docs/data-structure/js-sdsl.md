# 参考 C++ STL 实现的的数据结构库 js-sdsl

[js-sdsl](https://github.com/js-sdsl/js-sdsl) 提供了以下的数据结构。

- Stack - 先进后出的堆栈
- Queue - 先进先出的队列
- PriorityQueue - 堆实现的优先级队列
- Vector - 受保护的数组，不能直接操作像 length 这样的属性
- LinkList - 非连续内存地址的链表
- Deque - 双端队列，向前和向后插入元素或按索引获取元素的时间复杂度为 O(1)
- OrderedSet - 由红黑树实现的排序集合
- OrderedMap - 由红黑树实现的排序字典
- HashSet - 参考 ES6 Set polyfill 实现的哈希集合
- HashMap - 参考 ES6 Set polyfill 实现的哈希字典