# 使用宏扩展 JavaScript 语言

宏可以让你使用自己想要的方式来扩展语言。

虽然在 ES 语法糖如此丰富的情况下，宏的作用大打折扣(可能会对未来造成影响)。不过在特定情况下，宏的作用还是非常大的。

早期的时候可以采用 Mozilla 开发的 Sweet.js 来对当前 js 进行宏扩展。目前会使用 babel 的 macro 插件(babel-plugin-macros) 来实现。

下面是 React 模拟 Svelte 写法的宏 [reactive.macro](https://github.com/yesmeck/reactive.macro) 。

```jsx
import React from 'react';
import { state, bind } from 'reactive.macro';

export default () => {
  let a = state(1);
  let b = state(2);

  return (
    <>
      // 为了演示 state()，我们把上面例子中 input 替换成了 button
      <button onClick={a => a += 1} >a+</button>
      <input type="number" value={bind(b)} />

      <p>{a} + {b} = {a + b}</p>
    </>
  );
};
```

等同于

```jsx
import React, { useState, useCallback } from 'react';

export default () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);

  return (
    <div>
      <input type="number" value={a} onChange={useCallback(e => setA(e.target.value), [])} />
      <button onClick={b => setB(b + 1)} >b+</button>

      <p>{a} + {b} = {a + b}</p>
    </div>
  );
};
```

<div style="float: right">更新时间: {docsify-updated}</div>

