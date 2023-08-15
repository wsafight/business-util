# esm 动态引入

在使用 nest 开发的过程中，node-fetch 不支持导入，即：无法使用 require 导入。esm 和 cjs 不能同时使用。

此时可以使用 new Function 的方式引入。

```ts
// eslint-disable-next-line no-new-func
const fetchModule = await new Function('return import("node-fetch")')();
const nodeFetch = fetchModule.default;
```

同样，我们也可以这样处理

```ts
import { RequestInfo, RequestInit, Response } from 'node-fetch'

const _importDynamic = new Function('modulePath', 'return import(modulePath)')

export const nodeFetch = async function(url: URL | RequestInfo, init?: RequestInit): Promise<Response> {
  const { default: fetch } = await _importDynamic('node-fetch')
  return fetch(url, init)
}
```

通过这种方式，可以自行使用。