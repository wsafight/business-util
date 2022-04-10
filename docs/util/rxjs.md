# JavaScript 函数响应式开发库 RxJS

今天我们来看一看 [RxJS](https://rxjs.dev/)。大部分开发者都听说过函数式和响应式编程。那么 RxJS 究竟如何结合这两个概念？它究竟致力于解决什么问题呢？

> ReactiveX 将观察者模式与迭代器模式和函数式编程与集合相结合，以满足对管理事件序列的理想方式的需求。

上述就是官网对于该库的解释。我们看到几个关键词: 观察者模式、迭代器模式、函数式编程以及事件序列。

通过上述描述，我们清楚的知道了它是为了解决事件序列的问题而存在的。那也就是说，处理事件越多，越复杂 RxJS 越有用。同时一旦涉及到事件序列，我们就不能忽略两个概念：时间和调度。

我们先不进入复杂的概念。我们先对比几个例子看看它是如何帮助我们管理事件序列的。

## 例子

### 浏览器节流点击

浏览器最普遍的事件就是浏览器侦听事件。我们现在要实现一个节流点击加数的函数：

```js
// 常量 节流时间 1000 ms 
const RATE = 1000;

// 状态数据
let count = 0;

// 最后一次的点击的时间
let lastClick = Date.now() - RATE;

// 添加时间监听
document.addEventListener('click', event => {
  // 判断时间
  if (Date.now() - lastClick >= RATE) {
    count += event.clientX;
    console.log(count);
    // 更新点击时间
    lastClick = Date.now();
  }
});
```

可以看到这里创建状态数据 count 以及交互事件所需要的额外状态 lastClick。如果使用 RXJs 的话:

```js
import { fromEvent } from 'rxjs';
import { throttleTime, map, scan } from 'rxjs/operators';

// 常量 节流时间 1000 ms 
const RATE = 1000;

// 常量 初始化数据
const INITIAL_COUNT = 0;

// 添加监听
fromEvent(document, 'click')
  .pipe(
    // 添加节流
    throttleTime(RATE),
    // 转换数据
    map(event => event.clientX),
    // 隔离状态，保留上一次回调的值。类似 reduce
    scan((count, clientX) => count + clientX, INITIAL_COUNT)
  )
  // 订阅产生副作用
  .subscribe(count => console.log(count));
```

这里我稍微修改了一下官网的例子(提取了 RATE 和 INITIAL_COUNT 常量)，这里我们看到了 rxjs 的几个好处。

- 封装交互事件(减少额外状态)
- 隔离状态数据(减少出错)
- 易于修改(是否使用节流只需要删减一行代码)

###

进一步，我们可以使用 RXJs 来减少复杂事件产生的额外状态。

```js
let messagePool = []
ws.on('message', (message) => {
    messagePool.push(message)
})

setInterval(() => {
    render(messagePool)
    messagePool = []
}, 1000)
```

```js
import { fromEvent } from 'rxjs';
import { throttleTime, map, scan } from 'rxjs/operators';
fromEvent(ws, 'message')
    .bufferTime(1000)
    .subscribe(messages => render(messages))
```

```js
const code = [
   "ArrowUp",
   "ArrowUp",
   "ArrowDown",
   "ArrowDown",
   "ArrowLeft",
   "ArrowRight",
   "ArrowLeft",
   "ArrowRight",
   "KeyB",
   "KeyA",
   "KeyB",
   "KeyA"
]

Rx.Observable.fromEvent(document, 'keyup')
    .map(e => e.code)
    .bufferCount(12, 1)
    .subscribe(last12key => {
        if (_.isEqual(last12key, code)) {
            console.log('隐藏的彩蛋 \(^o^)/~')
        }
    }
```


## 概念



```ts
import { Observable, Observer } from 'rxjs'

export class HttpService {
  get<T>(url: string): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      const controller = new AbortController()
      fetch(`${url}`, {
        method: 'GET',
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((res) => {
          observer.next(res)
          observer.complete()
        })
        .catch((e) => {
          observer.error(e)
        })

      return () => controller.abort()
    })
  }
}
```