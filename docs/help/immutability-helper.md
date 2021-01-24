# 不变性数据修改辅助类

当前端开发谈到不可变性数据时候，第一个一定会想到 [Immer](https://github.com/immerjs/immer) 库，此库利用 ES6 的 proxy，几乎以最小的成本实现了 js 的不可变数据结构。

在开发复杂系统的情况下，不可变性会带来巨大的优势。它具有两个最大的优势：不可修改 (减少错误的发生) 以及结构共享 (节省空间)。

不可修改也意味着数据容易回溯，易于观察。

JavaScript 虽然给予了我们一些函数式语言的特性，但是很可惜，它还是没有具备不可变数据这一大优势。

我们修改数据时候，往往需要会这样改变数据

```ts
myData.x.y.z = 7;
// or...
myData.a.b.push(9);
```
由于两个对象共享同一个地址，您无法确定开发过程中对象中哪些数据发生了更改。

当然了，我们也可以使用深度拷贝来解决这种问题。

```ts
const newData = deepCopy(myData);
newData.x.y.z = 7;
newData.a.b.push(9);
```

不幸的是，深度拷贝是昂贵的，在有些情况下更是不可接受的。对于时间来说，深拷贝占用了大量的时间，而两者之间没有任何结构共享。

当然，您可以通过仅复制需要更改的对象和重用未更改的对象来减轻这种情况。如 Object.assign 或者 ... 来实现结构共享。

不幸的是，这很麻烦:

```ts
const newData = Object.assign({}, myData, {
  x: Object.assign({}, myData.x, {
    y: Object.assign({}, myData.x.y, {z: 7}),
  }),
  a: Object.assign({}, myData.a, {b: myData.a.b.concat(9)})
});
```

这对于大部分业务场景来说是相当高效的 (因为它只是浅拷贝，并重用了其余的部分) ，但是编写起来非常痛苦。但当 Object.assign 作用于大对象时，速度也会成为瓶颈，比如拥有 100,000 个属性的对象，这个操作耗费了 134ms。性能损失主要原因是 “结构共享” 操作需要遍历近 10 万个属性，而这些引用操作耗费了 100ms 以上的时间。

事实上 Object.assign 完全可以胜任 Immutable 的场景。因为性能不是瓶颈，唯一繁琐点在于深层次对象的赋值书写起来很麻烦。


但正如文章所述，当对象属性庞大时， Object.assign 的效率较低，因此在特殊场景，不适合使用 Object.assign 生成 immutable 数据。但是大部分场景还是完全可以使用 Object.assign 的，因为性能不是瓶颈，唯一繁琐点在于深层次对象的赋值书写起来很麻烦。

[immutability-helper](https://github.com/kolodny/immutability-helper) 这个库为 Object.assign 方案提供了简单的语法糖，使得编写代码更加容易:

```ts
import update from 'immutability-helper';

const newData = update(myData, {
  x: {y: {z: {$set: 7}}},
  a: {b: {$push: [9]}}
});
```

[immutability-helper](https://github.com/kolodny/immutability-helper) 代码简单，仅仅只有 400 行代码，我们可以学习一下。

先是工具函数(保留核心,环境判断，错误警告等逻辑去除):

```ts
// 提取函数，大量使用时有一定性能优势，且简明(更重要)
const hasOwnProperty = Object.prototype.hasOwnProperty;
const splice = Array.prototype.splice;
const toString = Object.prototype.toString;

// 检查类型
function type<T>(obj: T) {
  return (toString.call(obj) as string).slice(8, -1);
}

// 浅拷贝，使用 Object.assign 
const assign = Object.assign || /* istanbul ignore next */ (<T, S>(target: T & any, source: S & Record<string, any>) => {
  getAllKeys(source).forEach(key => {
    if (hasOwnProperty.call(source, key)) {
      target[key] = source[key] ;
    }
  });
  return target as T & S;
});

// 获取对象 key
const getAllKeys = typeof Object.getOwnPropertySymbols === 'function'
  ? (obj: Record<string, any>) => Object.keys(obj).concat(Object.getOwnPropertySymbols(obj) as any)
  /* istanbul ignore next */
  : (obj: Record<string, any>) => Object.keys(obj);

// 所有数据的浅拷贝
function copy<T, U, K, V, X>(
  object: T extends ReadonlyArray<U>
    ? ReadonlyArray<U>
    : T extends Map<K, V>
      ? Map<K, V>
      : T extends Set<X>
        ? Set<X>
        : T extends object
          ? T
          : any,
) {
  return Array.isArray(object)
    ? assign(object.constructor(object.length), object)
    : (type(object) === 'Map')
      ? new Map(object as Map<K, V>)
      : (type(object) === 'Set')
        ? new Set(object as Set<X>)
        : (object && typeof object === 'object')
          ? assign(Object.create(Object.getPrototypeOf(object)), object) as T
          /* istanbul ignore next */
          : object as T;
}

```

 然后是核心代码(同样保留核心) :

```ts
export class Context {
  // 导入所有指令
  private commands: Record<string, any> = assign({}, defaultCommands);

  // 添加扩展指令
  public extend<T>(directive: string, fn: (param: any, old: T) => T) {
    this.commands[directive] = fn;
  }
  
  // 功能核心
  public update<T, C extends CustomCommands<object> = never>(
    object: T,
    $spec: Spec<T, C>,
  ): T {
    // 增强健壮性，如果操作命令是函数,修改为 $apply
    const spec = (typeof $spec === 'function') ? { $apply: $spec } : $spec;

    // 数组(数组) 检查，报错
      
    // 返回对象(数组) 
    let nextObject = object;
    // 遍历指令
    getAllKeys(spec).forEach((key: string) => {
      // 如果指令在指令集中
      if (hasOwnProperty.call(this.commands, key)) {
        // 性能优化,遍历过程中，如果 object 还是当前之前数据
        const objectWasNextObject = object === nextObject;
        
        // 用指令修改对象
        nextObject = this.commands[key]((spec as any)[key], nextObject, spec, object);
        
        // 修改后，两者使用传入函数计算，还是相等的情况下，直接使用之前数据
        if (objectWasNextObject && this.isEquals(nextObject, object)) {
          nextObject = object;
        }
      } else {
        // 不在指令集中，做其他操作
        // 类似于 update(collection, {2: {a: {$splice: [[1, 1, 13, 14]]}}});
        // 解析对象规则后继续递归调用 update, 不断递归，不断返回
        // ...
      }
    });
    return nextObject;
  }
}
```

最后是通用指令:

```ts
const defaultCommands = {
  $push(value: any, nextObject: any, spec: any) {
    // 数组添加，返回 concat 新数组
    return value.length ? nextObject.concat(value) : nextObject;
  },
  $unshift(value: any, nextObject: any, spec: any) {
    return value.length ? value.concat(nextObject) : nextObject;
  },
  $splice(value: any, nextObject: any, spec: any, originalObject: any) {
    // 循环 splice 调用
    value.forEach((args: any) => {
      if (nextObject === originalObject && args.length) {
        nextObject = copy(originalObject);
      }
      splice.apply(nextObject, args);
    });
    return nextObject;
  },
  $set(value: any, _nextObject: any, spec: any) {
    // 直接替换当前数值
    return value;
  },
  $toggle(targets: any, nextObject: any) {
    const nextObjectCopy = targets.length ? copy(nextObject) : nextObject;
    // 当前对象或者数组切换
    targets.forEach((target: any) => {
      nextObjectCopy[target] = !nextObject[target];
    });

    return nextObjectCopy;
  },
  $unset(value: any, nextObject: any, _spec: any, originalObject: any) {
    // 拷贝后循环删除
    value.forEach((key: any) => {
      if (Object.hasOwnProperty.call(nextObject, key)) {
        if (nextObject === originalObject) {
          nextObject = copy(originalObject);
        }
        delete nextObject[key];
      }
    });
    return nextObject;
  },
  $add(values: any, nextObject: any, _spec: any, originalObject: any) {
    if (type(nextObject) === 'Map') {
      values.forEach(([key, value]) => {
        if (nextObject === originalObject && nextObject.get(key) !== value) {
          nextObject = copy(originalObject);
        }
        nextObject.set(key, value);
      });
    } else {
      values.forEach((value: any) => {
        if (nextObject === originalObject && !nextObject.has(value)) {
          nextObject = copy(originalObject);
        }
        nextObject.add(value);
      });
    }
    return nextObject;
  },
  $remove(value: any, nextObject: any, _spec: any, originalObject: any) {
    value.forEach((key: any) => {
      if (nextObject === originalObject && nextObject.has(key)) {
        nextObject = copy(originalObject);
      }
      nextObject.delete(key);
    });
    return nextObject;
  },
  $merge(value: any, nextObject: any, _spec: any, originalObject: any) {
    getAllKeys(value).forEach((key: any) => {
      if (value[key] !== nextObject[key]) {
        if (nextObject === originalObject) {
          nextObject = copy(originalObject);
        }
        nextObject[key] = value[key];
      }
    });
    return nextObject;
  },
  $apply(value: any, original: any) {
    // 传入函数，直接调用函数修改
    return value(original);
  },
};
```

就这样，作者写了一个简洁而强大的浅拷贝辅助库。

大家也可以看看个人总结 [聊聊不可变数据结构](https://github.com/wsafight/personBlog/issues/33)

<div style="float: right">更新时间: {docsify-updated}</div>