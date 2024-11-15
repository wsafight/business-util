---
title: 根据对象路径安全获取对象值
description: 根据对象路径安全获取对象值
---

某些情况下，我们需要传递路径来获取数据，如 'staff.address[0].zip'，这里手写了一个处理代码。传入对象和路径，得到对象，对象 key 以及 value。

```ts
/**
 * 根据路径来获取 对象内部属性
 * @param obj 对象
 * @param path 路径 a.b[1].c
 */
function getObjPropByPath(obj: Record<string, any>, path: string) {
  let tempObj = obj
  const keyArr = path.split('.').map(x => x.trim())
  let i: number = 0
  for (let len = keyArr.length; i <len - 1; ++i) {
    let key = keyArr[i]
    // 简单判断是否是数组数据，如果 以 ] 结尾的话
    const isFormArray = key.endsWith(']')
    let index: number = 0
    if (isFormArray) {
      const data = key.split('[') ?? []
      key = data[0] ?? ''
      // 对于 parseInt('12]') => 12
      index = parseInt(data[1], 10)
    }
    
    if (key in tempObj) {
      tempObj = tempObj[key]
      if (isFormArray && Array.isArray(tempObj)) {
        tempObj = tempObj[index]
        if (!tempObj) {
          return {}
        }
      }
    } else {
      return {}
    }
  }

  if (!tempObj) {
    return {}
  }
  
  return  {
    o: tempObj,
    k: keyArr[i],
    v: tempObj[keyArr[i]]
  }
}
```

不过笔者写的方案较为粗糙，但 lodash 对象模块中也有该功能，感兴趣的可以参考其实现方式。[lodash get](https://www.lodashjs.com/docs/lodash.get)

```ts
// 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
// _.get(object, path, [defaultValue])

var object = { 'a': [{ 'b': { 'c': 3 } }] };

_.get(object, 'a[0].b.c');
// => 3

_.get(object, ['a', '0', 'b', 'c']);
// => 3

_.get(object, 'a.b.c', 'default');
// => 'default'
```

如果开发上更加复杂的需求，可以查看 [wild-wild-utils](https://github.com/ehmicky/wild-wild-utils) 符不符合。并且可以看一看我这边的介绍与详细解读 [根据复杂对象路径操作对象](../wild-wild-utils)。
