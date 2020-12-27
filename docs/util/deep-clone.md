# 专业的深拷贝库

[clone](https://github.com/jsmini/clone) 库实现了多种深拷贝的方式，可以直接借助该库实现自己想要的深拷贝功能。

包括

- 递归深拷贝 (clone)

```ts
// 原生兼容 IE6 的 JS 类型检测库
import { type } from '@jsmini/type';

// Object.create(null) 的对象，没有hasOwnProperty方法
function hasOwnProp(obj: Record<string, any>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isClone(x: any) {
  const t = type(x);

  return t === 'object' || t === 'array';
}

// 递归
export function clone(x: any) {
  // 仅对对象和数组进行深拷贝，其他类型，直接返回
  if (!isClone(x)) {
    return x;
  }

  const t = type(x);

  let res: any;

  if (t === 'array') {
    res = [];
    for (let i = 0; i < x.length; i++) {
      // 避免一层死循环 a.b = a
      res[i] = x[i] === x ? res: clone(x[i]);
    }
  } else if (t === 'object') {
    res = {};
    for(let key in x) {
      if (hasOwnProp(x, key)) {
        // 避免一层死循环 a.b = a
        res[key] = x[key] === x ? res : clone(x[key]);
      }
    }
  }

  return res;
}
```

- JSON 转换深拷贝 (cloneJSON)

```ts
// 通过JSON深拷贝
export function cloneJSON(x: any, errOrDef = true) {
  if (!isClone(x)) return x;

  try {
    return JSON.parse(JSON.stringify(x));
  } catch(e) {
    if (errOrDef === true) {
      throw e;
    } else {
      try {
        // ie8无console
        console.error('cloneJSON error: ' + e.message);
        // eslint-disable-next-line no-empty
      } catch(e) {}
      return errOrDef;
    }
  }
}
```

- 循环深拷贝 (cloneLoop)

```ts
import { type } from '@jsmini/type';

// Object.create(null) 的对象，没有hasOwnProperty方法
function hasOwnProp(obj: Record<string, any>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// 仅对对象和数组进行深拷贝，其他类型，直接返回
function isClone(x: any) {
  const t = type(x);

  return t === 'object' || t === 'array';
}

export function cloneLoop(x: any) {
  const t = type(x);

  let root = x;

  if (t === 'array') {
    root = [];
  } else if (t === 'object') {
    root = {};
  }

  // 循环数组
  const loopList: any[] = [
    {
      parent: root,
      key: undefined,
      data: x,
    }
  ];

  while(loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;
    const tt = type(data);

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = tt === 'array' ? [] : {};
    }

    if (tt === 'array') {
      for (let i = 0; i < data.length; i++) {
        // 避免一层死循环 a.b = a
        if (data[i] === data) {
          res[i] = res;
        } else if (isClone(data[i])) {
          // 下一次循环
          loopList.push({
            parent: res,
            key: i,
            data: data[i],
          });
        } else {
          res[i] = data[i];
        }
      }
    } else if (tt === 'object'){
      for(let k in data) {
        if (hasOwnProp(data, k)) {
          // 避免一层死循环 a.b = a
          if (data[k] === data) {
            res[k] = res;
          } else if (isClone(data[k])) {
            // 下一次循环
            loopList.push({
              parent: res,
              key: k,
              data: data[k],
            });
          } else {
            res[k] = data[k];
          }
        }
      }
    }
  }

  return root;
}
```

- 循环引用深拷贝 (cloneForce)

```ts
import { type } from '@jsmini/type';

// Object.create(null) 的对象，没有hasOwnProperty方法
function hasOwnProp(obj: Record<string, any>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// 仅对对象和数组进行深拷贝，其他类型，直接返回
function isClone(x: any) {
  const t = type(x);

  return t === 'object' || t === 'array';
}

const UNIQUE_KEY = 'com.yanhaijing.jsmini.clone' + (new Date).getTime();

// weakmap：处理对象关联引用

class SimpleWeakMap {
  cacheArray: any[] = []

  set(key: any, value: any) {
    this.cacheArray.push(key);
    key[UNIQUE_KEY] = value;
  }

  get(key: any) {
    return key[UNIQUE_KEY];
  }

  clear() {
    for (let i = 0; i < this.cacheArray.length; i++) {
      let key = this.cacheArray[i];
      delete key[UNIQUE_KEY];
    }
    this.cacheArray.length = 0;
  }
}


function getWeakMap() {
  let result;
  if (typeof WeakMap !== 'undefined' && type(WeakMap) == 'function') {
    result = new WeakMap();
    if (type(result) == 'weakmap') {
      return result;
    }
  }
  result = new SimpleWeakMap();

  return result;
}

export function cloneForce(x: any) {
  const uniqueData = getWeakMap();

  const t = type(x);

  let root = x;

  if (t === 'array') {
    root = [];
  } else if (t === 'object') {
    root = {};
  }

  // 循环数组
  const loopList: any[] = [
    {
      parent: root,
      key: undefined,
      data: x,
    }
  ];

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const source = node.data;
    const tt = type(source);

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let target = parent;
    if (typeof key !== 'undefined') {
      target = parent[key] = tt === 'array' ? [] : {};
    }

    // 复杂数据需要缓存操作
    if (isClone(source)) {
      // 命中缓存，直接返回缓存数据
      let uniqueTarget = uniqueData.get(source);
      if (uniqueTarget) {
        parent[key] = uniqueTarget;
        continue; // 中断本次循环
      }

      // 未命中缓存，保存到缓存
      uniqueData.set(source, target);
    }

    if (tt === 'array') {
      for (let i = 0; i < source.length; i++) {
        if (isClone(source[i])) {
          // 下一次循环
          loopList.push({
            parent: target,
            key: i,
            data: source[i],
          });
        } else {
          target[i] = source[i];
        }
      }
    } else if (tt === 'object') {
      for (let k in source) {
        if (hasOwnProp(source, k)) {
          if (k === UNIQUE_KEY) continue;
          if (isClone(source[k])) {
            // 下一次循环
            loopList.push({
              parent: target,
              key: k,
              data: source[k],
            });
          } else {
            target[k] = source[k];
          }
        }
      }
    }
  }


  (uniqueData as any).clear && (uniqueData as any).clear();

  return root;
}

```

大家可以直接参考学习 [深拷贝的终极探索](https://yanhaijing.com/javascript/2018/10/10/clone-deep/)

当然，我们可以借助 js 实现深拷贝，同时也可以利用浏览器 API 实现该功能。

如 [JavaScript 深拷贝性能分析](https://justjavac.com/javascript/2018/02/02/deep-copy.html) 中的结构化克隆算法:

- MessageChannel

```js
function structuralClone(obj) {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

const obj = /* ... */ {};
const clone = await structuralClone(obj);
```

- History

```js
function structuralClone(obj) {
  const oldState = history.state;
  history.replaceState(obj, document.title);
  const copy = history.state;
  history.replaceState(oldState, document.title);
  return copy;
}

const obj = /* ... */ {};
const clone = structuralClone(obj); 
```

- Notification

```js
function structuralClone(obj) {
  return new Notification('', {data: obj, silent: true}).data;
}

const obj = /* ... */ {};
const clone = structuralClone(obj);
```