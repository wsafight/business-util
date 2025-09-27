---
title: React 极简状态管理库 unstated-next
description: 200 字节的轻量级 React 状态管理解决方案
---

[unstated-next](https://github.com/jamiebuilds/unstated-next) 是一个极简的 React 状态管理库，仅约 200 字节（压缩后），它基于 React 的 Context API 实现状态共享。与其他状态管理库不同，unstated-next 没有复杂的概念，只有简单的状态和订阅机制。它的设计目标是提供一种简单、直观的方式来管理 React 组件之间的状态共享，让开发者可以专注于 React 原生的开发体验。

## 核心理念和设计哲学

unstated-next 的核心在于“容器”（Container）概念。一个容器本质上是一个自定义的 React Hook，直接封装了开发者想要共享的状态和更新逻辑，通过 `createContainer` 函数，这个 Hook 被转换为一个包含 Provider 和 useContainer 的组合。

- **Provider**：一个 React 组件，负责在组件树内部提供状态。通过 React Context 实现，将自定义 Hook 的返回值注入到一个对子组件可见的存储中。
- **useContainer**：用于在组件中订阅和使用容器提供的状态值和更新函数。

这种设计的哲学是：

- **简单**：容器直接封装状态和更新逻辑，开发者无需关注复杂的状态管理机制。
- **直观**：通过 Provider 和 useContainer 两个组件，开发者可以直观地理解状态的提供和订阅过程。
- **可组合**：多个容器可以组合使用，形成复杂的状态管理逻辑。
- **性能优化**：由于基于 React Context 实现，状态的订阅和更新都是基于 React 的机制，确保了性能的优化。
- **与 React 原生集成**：完全基于 React Hooks 和 Context API，不需要学习新的概念。

## 安装

使用 npm 或 yarn 安装 unstated-next：

```bash
npm install --save unstated-next
# 或
yarn add unstated-next
```

## 基本示例

下面是一个简单的计数器示例，展示如何使用 unstated-next：

```jsx
import React, { useState } from "react"
import { createContainer } from "unstated-next"
import { render } from "react-dom"

// 1. 创建一个自定义 Hook，封装状态和逻辑
function useCounter(initialState = 0) {
  const [count, setCount] = useState(initialState)
  const decrement = () => setCount(count - 1)
  const increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

// 2. 使用 createContainer 包装这个 Hook，创建一个容器
const Counter = createContainer(useCounter)

// 3. 在组件中使用 useContainer 来访问状态和方法
function CounterDisplay() {
  const counter = Counter.useContainer()
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}

// 4. 使用 Provider 来提供状态
function App() {
  return (
    <Counter.Provider>
      <CounterDisplay />
      <Counter.Provider initialState={2}>
        <div>
          <div>
            <CounterDisplay />
          </div>
        </div>
      </Counter.Provider>
    </Counter.Provider>
  )
}

render(<App />, document.getElementById("root"))
```

## API 说明

### createContainer(useHook)

创建一个状态容器，接收一个自定义 Hook 作为参数。

```jsx
import { createContainer } from "unstated-next"

function useCustomHook() {
  const [value, setValue] = useState()
  const onChange = e => setValue(e.currentTarget.value)
  return { value, onChange }
}

const Container = createContainer(useCustomHook)
// Container === { Provider, useContainer }
```

### \<Container.Provider\>

提供状态的 React 组件，将在其子组件树中提供状态。

```jsx
function ParentComponent() {
  return (
    <Container.Provider>
      <ChildComponent />
    </Container.Provider>
  )
}
```

### \<Container.Provider initialState\>

可以通过 `initialState` 属性为容器提供初始状态。

```jsx
function useCustomHook(initialState = "") {
  const [value, setValue] = useState(initialState)
  // ...
}

function ParentComponent() {
  return (
    <Container.Provider initialState={"value"}>
      <ChildComponent />
    </Container.Provider>
  )
}
```

### Container.useContainer()

在组件中订阅和使用容器提供的状态值和更新函数。

```jsx
function ChildComponent() {
  const input = Container.useContainer()
  return <input value={input.value} onChange={input.onChange} />
}
```

### useContainer(Container)

也可以使用独立的 `useContainer` 函数来访问容器的状态。

```jsx
import { useContainer } from "unstated-next"

function ChildComponent() {
  const input = useContainer(Container)
  return <input value={input.value} onChange={input.onChange} />
}
```

## 使用指南

### 1. 如何组织多个容器

当应用变得复杂时，你可以创建多个容器来管理不同部分的状态，并在应用的不同层级提供这些容器。

```jsx
function App() {
  return (
    <UserProvider>
      <CartProvider>
        <CheckoutProvider>
          <AppContent />
        </CheckoutProvider>
      </CartProvider>
    </UserProvider>
  )
}
```

### 2. 如何处理异步逻辑

你可以在自定义 Hook 中使用 `useEffect` 和 `async/await` 来处理异步逻辑：

```jsx
function useUserData(userId) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, loading, error }
}

const UserContainer = createContainer(useUserData)
```

### 3. 性能优化技巧

由于 unstated-next 基于 React Context，你可以使用一些 React Context 的性能优化技巧：

- 将不常变化的值与频繁变化的值分开到不同的容器中
- 使用 `React.memo` 来避免不必要的重渲染
- 在自定义 Hook 中使用 `useCallback` 和 `useMemo` 来优化函数和计算值

### 4. 与其他库的集成

unstated-next 可以很容易地与其他 React 库集成，例如 React Router、Formik 等。由于它只是对 React Context 和 Hooks 的轻量级封装，所以它不会与其他库产生冲突。

## 为什么选择 unstated-next

相比其他状态管理库（如 Redux），unstated-next 有以下优势：

- **体积小**：仅约 200 字节，比 Redux 小 40 倍
- **性能好**：可以更细粒度地组件化性能问题
- **易于学习**：只需要了解 React Hooks 和 Context，不需要学习新的概念
- **易于集成**：可以逐个组件地集成，并且容易与其他 React 库集成
- **易于测试**：不需要测试 reducer，只需要测试 React 组件
- **类型友好**：设计为使大多数类型可以被推断出来
- **极简**：它就是 React，没有额外的抽象

unstated-next 特别适合中小型应用，以及那些希望保持 React 原生开发体验的项目。对于大型复杂应用，如果你需要更强大的功能（如时间旅行、中间件等），可能仍然需要考虑使用 Redux 或其他更全面的状态管理库。