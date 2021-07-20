# 前端状态服务工具 sigi-framework

相比于 Vue, Svelte 此类官方提供的状态管理库 Vuex, svelte/store 来说，React 框架可以说是百花齐放。
- 单向数据流 redux
- 减少了 redux 样板代码 rematch   
- 函数响应式编程库 Mobx
- 分散管理原子状态库 Recoil
- 简洁的 zustand
```js
import create from "zustand"

const useStore = create((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))

function Counter() {
    const { count, inc } = useStore()
    return (
        <div class="counter">
            <span>{count}</span>
            <button onClick={inc}>one up</button>
        </div>
    )
}

```
- 类似 vue 风格的 concent

redux, mobx, recoil, zustand, rematch, concent 。

目前前端主流的状态管理工具仍旧是函数式，函数式的重点是数据的流动。面向对象则是利用封装，继承，多态来解决关注点分离的问题。

但面向对象与函数式并不是冲突的。我们可以借助面向对象包裹数据与操作。