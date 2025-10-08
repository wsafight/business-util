---
title: 通用微型状态管理器 Nano Stores
---

Nano Stores 是一个轻量级的状态管理库，专为 React、React Native、Preact、Vue、Svelte、Solid、Lit、Angular 和原生 JavaScript 设计。它通过原子存储和直接操作，提供了一种简洁而高效的状态管理方式。

## 1. 什么是 Nano Stores

Nano Stores 是一个超轻量级的跨框架状态管理解决方案，其核心理念是通过许多原子化的、可摇树的存储来管理状态，从而减少不必要的代码和性能开销。该库最小化后仅有 286 字节，且没有任何外部依赖，同时提供了完整的 TypeScript 支持。

### 1.1 主要特点

- **超轻量级**：压缩后仅 286 字节，几乎不增加应用体积
- **跨框架兼容**：支持 React、Vue、Svelte、Angular 等多种前端框架
- **原子化设计**：通过多个小型独立存储管理状态
- **类型安全**：完全使用 TypeScript 编写，提供良好的类型支持
- **可摇树优化**：未使用的存储会被打包工具自动移除
- **无外部依赖**：不依赖任何第三方库

### 1.2 解决问题

- 复杂应用中的状态管理混乱
- 框架特定状态管理库的局限性
- 大型状态管理库的性能和体积问题
- 多框架项目中的状态管理一致性

## 2. 安装与基本用法

### 2.1 安装

使用 npm 或 yarn 安装 Nano Stores：

```bash
npm install nanostores
# 或者
yarn add nanostores
```

### 2.2 基本使用示例

下面是一个简单的计数器示例，展示了 Nano Stores 的基本用法：

```javascript
import { atom } from 'nanostores';

// 创建一个原子存储，初始值为 0
const $counter = atom<number>(0);

// 读取当前值
console.log($counter.get()); // 输出: 0

// 更新值
$counter.set(1);
console.log($counter.get()); // 输出: 1

// 订阅状态变化
const unsub = $counter.subscribe(value => {
  console.log(`计数器值已更新为: ${value}`);
});

// 触发更新
$counter.set(2); // 会触发上面的订阅回调

// 取消订阅
unsub();
```

## 3. 核心概念

### 3.1 原子存储 (Atom)

原子存储是 Nano Stores 最基础的构建块，代表一个可以被订阅和修改的单一值：

```javascript
import { atom } from 'nanostores';

// 创建一个字符串类型的原子存储
const $username = atom<string>('Guest');

// 创建一个对象类型的原子存储
const $user = atom<{
  id: number;
  name: string;
  email: string;
}>({
  id: 0,
  name: 'Unknown',
  email: ''
});
```

### 3.2 计算存储 (Computed Store)

计算存储允许你基于其他存储的值创建派生状态：

```javascript
import { atom, computed } from 'nanostores';

const $firstName = atom<string>('John');
const $lastName = atom<string>('Doe');

// 创建一个计算存储，基于其他存储的值
const $fullName = computed([$firstName, $lastName], (first, last) => {
  return `${first} ${last}`;
});

// 当依赖的存储更新时，计算存储也会自动更新
$firstName.set('Jane');
console.log($fullName.get()); // 输出: Jane Doe
```

### 3.3 懒加载

Nano Stores 支持懒加载，只有在存储被实际使用时才会加载和初始化，这有助于优化应用性能：

```javascript
// 存储模块
let $userData;

export function getUserData() {
  if (!$userData) {
    $userData = atom({ name: '', age: 0 });
    // 模拟异步数据加载
    fetchUserData().then(data => {
      $userData.set(data);
    });
  }
  return $userData;
}

// 使用模块
import { getUserData } from './store';

// 只有在调用 get() 或 subscribe() 时才会初始化和加载数据
const userData = getUserData();
userData.subscribe(data => {
  console.log('用户数据已加载:', data);
});
```

## 4. 与不同框架集成

### 4.1 React 集成

对于 React 项目，你需要安装 `@nanostores/react` 包：

```bash
npm install @nanostores/react
# 或者
yarn add @nanostores/react
```

使用示例：

```jsx
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';

const $counter = atom<number>(0);

function Counter() {
  // 使用 useStore 钩子订阅状态变化
  const counter = useStore($counter);

  return (
    <div>
      <p>Count: {counter}</p>
      <button onClick={() => $counter.set(counter + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 4.2 Vue 集成

对于 Vue 项目，安装 `@nanostores/vue` 包：

```bash
npm install @nanostores/vue
# 或者
yarn add @nanostores/vue
```

使用示例：

```vue
<script setup>
import { useStore } from '@nanostores/vue';
import { atom } from 'nanostores';

const $counter = atom<number>(0);
// 在 Vue 中使用状态
const counter = useStore($counter);

function increment() {
  $counter.set(counter.value + 1);
}
</script>

<template>
  <div>
    <p>Count: {{ counter }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### 4.3 Svelte 集成

Nano Stores 对 Svelte 有原生支持，无需额外的适配器：

```svelte
<script>
  import { atom } from 'nanostores';

  const $counter = atom<number>(0);

  function increment() {
    $counter.set($counter.get() + 1);
  }
</script>

<div>
  <p>Count: {$counter}</p>
  <button on:click={increment}>Increment</button>
</div>
```

## 5. 持久化存储

Nano Stores 提供了 `@nanostores/persistent` 扩展，用于在 `localStorage` 中保存状态并同步不同浏览器标签页之间的更改：

### 5.1 安装

```bash
npm install @nanostores/persistent
# 或者
yarn add @nanostores/persistent
```

### 5.2 基本用法

```javascript
import { persistentAtom, persistentMap } from '@nanostores/persistent';

// 创建一个持久化的原子存储
const $theme = persistentAtom('theme', 'light');

// 创建一个持久化的映射存储
const $settings = persistentMap('settings', {
  notifications: true,
  language: 'en'
});

// 更新持久化存储
$theme.set('dark'); // 会自动保存到 localStorage
$settings.setKey('language', 'zh');
```

## 6. 高级用法

### 6.1 存储组合

可以将多个小型存储组合在一起，形成更复杂的状态管理系统：

```javascript
import { atom, computed } from 'nanostores';

// 基础存储
const $todos = atom<Array<{
  id: number;
  text: string;
  completed: boolean;
}>>([]);

// 过滤条件存储
const $filter = atom<'all' | 'active' | 'completed'>('all');

// 计算派生存储
const $filteredTodos = computed([$todos, $filter], (todos, filter) => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
});

// 计算统计信息
const $stats = computed($todos, todos => ({
  total: todos.length,
  active: todos.filter(todo => !todo.completed).length,
  completed: todos.filter(todo => todo.completed).length
}));
```

### 6.2 异步操作

处理异步数据加载和状态更新：

```javascript
import { atom } from 'nanostores';

// 定义加载状态
const $isLoading = atom<boolean>(false);
const $error = atom<string | null>(null);
const $userData = atom<any>(null);

// 异步加载函数
async function loadUserData(userId: number) {
  $isLoading.set(true);
  $error.set(null);
  
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    $userData.set(data);
  } catch (err) {
    $error.set('Failed to load user data');
    console.error(err);
  } finally {
    $isLoading.set(false);
  }
}
```

## 7. 最佳实践

### 7.1 状态组织

- 将相关状态组织在同一个模块中
- 保持存储原子化，每个存储只负责一个职责
- 对于复杂状态，使用计算存储派生

### 7.2 性能优化

- 使用懒加载避免不必要的初始化
- 合理使用计算存储减少重复计算
- 避免在订阅回调中执行重型计算

### 7.3 命名约定

- 为存储变量添加 `$` 前缀，方便识别
- 使用清晰、描述性的名称表示存储内容

## 8. 常见问题与解决方案

### 8.1 状态更新不触发组件重新渲染

**问题描述**：在使用 Nano Stores 时，可能会遇到状态更新后，依赖该状态的组件没有重新渲染的情况。

**解决步骤**：

1. 检查状态更新方式：确保使用了正确的更新方法（如 `set()` 方法）

```javascript
// 正确方式
$counter.set(1);

// 错误方式 - 直接修改对象属性不会触发更新
const user = $user.get();
user.name = 'New Name'; // 不会触发更新
```

2. 检查组件依赖：确保组件正确地订阅了状态变化

3. 调试状态变化：使用 `console.log` 或其他调试工具检查状态是否确实发生了变化

### 8.2 持久化状态不生效

**问题描述**：使用 `@nanostores/persistent` 时，状态没有正确保存或读取。

**解决步骤**：

1. 检查存储键名：确保每个持久化存储使用唯一的键名
2. 检查 localStorage 可用性：某些环境可能限制或禁用 localStorage
3. 检查数据序列化：复杂对象需要能够被 JSON.stringify 序列化

## 9. 应用场景

### 9.1 多语言应用

Nano Stores 的轻量级特性使其非常适合实现应用的多语言支持：

```javascript
import { atom, computed } from 'nanostores';

// 当前语言
const $language = atom<string>('en');

// 翻译数据
const translations = {
  en: {
    hello: 'Hello',
    welcome: 'Welcome'
  },
  zh: {
    hello: '你好',
    welcome: '欢迎'
  }
};

// 翻译函数
function t(key: string): string {
  const lang = $language.get();
  return translations[lang as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
}
```

### 9.2 主题切换

使用 Nano Stores 实现应用主题切换功能：

```javascript
import { persistentAtom } from '@nanostores/persistent';

// 创建持久化的主题存储
const $theme = persistentAtom<'light' | 'dark'>('app-theme', 'light');

// 应用主题到文档
function applyTheme(theme: string) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
}

// 初始化和监听主题变化
applyTheme($theme.get());
$theme.subscribe(applyTheme);
```

## 10. 总结

Nano Stores 以其轻量、高效和跨框架的特性，为前端开发者提供了一个全新的状态管理解决方案。它特别适合那些需要简单而高效状态管理的项目，尤其是对性能和打包体积有严格要求的应用。

无论你是 React 开发者，还是 Vue、Svelte 的爱好者，Nano Stores 都能为你带来前所未有的开发体验。立即尝试 Nano Stores，让你的应用状态管理更加轻松高效！

更多信息，请访问 [Nano Stores GitHub 仓库](https://github.com/nanostores/nanostores)。
