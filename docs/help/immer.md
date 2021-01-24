# 优秀的不可变状态库 immer

[Immer](https://immerjs.github.io/immer/docs/introduction) 是一个非常优秀的不可变数据库，利用 proxy 来解决问题。不需要学习其他 api，开箱即用 ( gzipped 3kb )

```ts
import produce from "immer"

const baseState = [
  {
    todo: "Learn typescript",
    done: true
  },
  {
    todo: "Try immer",
    done: false
  }
]

// 直接修改，没有任何开发负担，心情美美哒
const nextState = produce(baseState, draftState => {
  draftState.push({todo: "Tweet about it"})
  draftState[1].done = true
})
```

关于 immer 性能优化请参考 [immer performance](https://immerjs.github.io/immer/docs/performance)。

### 核心代码分析

该库的核心还是在 proxy 的封装，所以不全部介绍，仅介绍代理功能。

```ts
export const objectTraps: ProxyHandler<ProxyState> = {
  get(state, prop) {
    // PROXY_STATE是一个symbol值，有两个作用，一是便于判断对象是不是已经代理过，二是帮助proxy拿到对应state的值
    // 如果对象没有代理过，直接返回
    if (prop === DRAFT_STATE) return state

    // 获取数据的备份？如果有，否则获取元数据
    const source = latest(state)

    // 如果当前数据不存在，获取原型上数据
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop)
    }
    const value = source[prop]

    // 当前代理对象已经改回了数值或者改数据是 null，直接返回
    if (state.finalized_ || !isDraftable(value)) {
      return value
    }
    // 创建代理数据
    if (value === peek(state.base_, prop)) {
      prepareCopy(state)
      return (state.copy_![prop as any] = createProxy(
        state.scope_.immer_,
        value,
        state
      ))
    }
    return value
  },
  // 当前数据是否有该属性
  has(state, prop) {
    return prop in latest(state)
  },
  set(
    state: ProxyObjectState,
    prop: string /* strictly not, but helps TS */,
    value
  ) {
    const desc = getDescriptorFromProto(latest(state), prop)

    // 如果当前有 set 属性，意味当前操作项是代理，直接设置即可
    if (desc?.set) {
      desc.set.call(state.draft_, value)
      return true
    }

    // 当前没有修改过，建立副本 copy，等待使用 get 时创建代理
    if (!state.modified_) {
      const current = peek(latest(state), prop)

      const currentState: ProxyObjectState = current?.[DRAFT_STATE]
      if (currentState && currentState.base_ === value) {
        state.copy_![prop] = value
        state.assigned_[prop] = false
        return true
      }
      if (is(value, current) && (value !== undefined || has(state.base_, prop)))
        return true
      prepareCopy(state)
      markChanged(state)
    }

    state.copy_![prop] = value
    state.assigned_[prop] = true
    return true
  },
  defineProperty() {
    die(11)
  },
  getPrototypeOf(state) {
    return Object.getPrototypeOf(state.base_)
  },
  setPrototypeOf() {
    die(12)
  }
}

// 数组的代理，把当前对象的代理拷贝过去，再修改 deleteProperty 和 set
const arrayTraps: ProxyHandler<[ProxyArrayState]> = {}
each(objectTraps, (key, fn) => {
  // @ts-ignore
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0]
    return fn.apply(this, arguments)
  }
})
arrayTraps.deleteProperty = function(state, prop) {
  if (__DEV__ && isNaN(parseInt(prop as any))) die(13)
  return objectTraps.deleteProperty!.call(this, state[0], prop)
}
arrayTraps.set = function(state, prop, value) {
  if (__DEV__ && prop !== "length" && isNaN(parseInt(prop as any))) die(14)
  return objectTraps.set!.call(this, state[0], prop, value, state[0])
}
```

### 其他

开发过程中，我们往往会在 React 函数中使用 useReducer 方法，但是 useReducer 实现较为复杂，我们可以用 [useMethods](https://github.com/pelotom/use-methods) 简化代码。useMethods 内部就是使用 immer (代码十分简单，我们直接拷贝 index.ts 即可)。

不使用 useMethods 情况下:

```ts
const initialState = {
  nextId: 0,
  counters: []
};

const reducer = (state, action) => {
  let { nextId, counters } = state;
  const replaceCount = (id, transform) => {
    const index = counters.findIndex(counter => counter.id === id);
    const counter = counters[index];
    return {
      ...state,
      counters: [
        ...counters.slice(0, index),
        { ...counter, count: transform(counter.count) },
        ...counters.slice(index + 1)
      ]
    };
  };

  switch (action.type) {
    case "ADD_COUNTER": {
      nextId = nextId + 1;
      return {
        nextId,
        counters: [...counters, { id: nextId, count: 0 }]
      };
    }
    case "INCREMENT_COUNTER": {
      return replaceCount(action.id, count => count + 1);
    }
    case "RESET_COUNTER": {
      return replaceCount(action.id, () => 0);
    }
  }
};
```

对比使用 useMethods :

```ts
import useMethods from 'use-methods';	

const initialState = {
  nextId: 0,
  counters: []
};

const methods = state => {
  const getCounter = id => state.counters.find(counter => counter.id === id);

  return {
    addCounter() {
      state.counters.push({ id: state.nextId++, count: 0 });
    },
    incrementCounter(id) {
      getCounter(id).count++;
    },
    resetCounter(id) {
      getCounter(id).count = 0;
    }
  };
};
```

大家也可以看看个人总结 [聊聊不可变数据结构](https://github.com/wsafight/personBlog/issues/33)


<div style="float: right">更新时间: {docsify-updated}</div>