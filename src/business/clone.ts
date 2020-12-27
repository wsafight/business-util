// import { type } from '@jsmini/type';

const type = () => '';

// Object.create(null) 的对象，没有hasOwnProperty方法
function hasOwnProp(obj: Record<string, any>, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// 仅对对象和数组进行深拷贝，其他类型，直接返回
function isClone(x: any) {
  const t = type(x);

  return t === 'object' || t === 'array';
}

// 递归
export function clone(x: Record<string, any>) {
  if (!isClone(x)) return x;

  const t = type(x);

  let res: any;

  if (t === 'array') {
    res = [];
    for (let i = 0; i < x.length; i++) {
      // 避免一层死循环 a.b = a
      res[i] = x[i] === x ? res : clone(x[i]);
    }
  } else if (t === 'object') {
    res = {};
    for (let key in x) {
      if (hasOwnProp(x, key)) {
        // 避免一层死循环 a.b = a
        res[key] = x[key] === x ? res : clone(x[key]);
      }
    }
  }

  return res;
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

  while (loopList.length) {
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
    } else if (tt === 'object') {
      for (let k in data) {
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