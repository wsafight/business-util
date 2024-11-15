---
title: 通过重用减少垃圾回收
description: 通过重用减少垃圾回收
---

最近看到一个库 [reusify](https://github.com/mcollina/reusify) 可以提升函数性能，于是就去研究了一下。具体原理为使用该库后可以减少 V8 的垃圾回收次数。让我们来看看这个技巧：

代码十分简单，如下所示：

```ts
'use strict'

function reusify (Constructor) {
  var head = new Constructor()
  var tail = head

  function get () {
    var current = head

    if (current.next) {
      head = current.next
    } else {
      head = new Constructor()
      tail = head
    }

    current.next = null

    return current
  }

  function release (obj) {
    tail.next = obj
    tail = obj
  }

  return {
    get: get,
    release: release
  }
}

module.exports = reusify
```