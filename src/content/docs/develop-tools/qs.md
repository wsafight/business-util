---
title: 字符串化对象结构库 qs
description: 字符串化对象结构库 qs
---

[qs](https://github.com/ljharb/qs) 原作者为 TJ 大神，目前由 [ljharb](https://github.com/ljharb) 维护。该库的目的是为了在 URL 中构建清晰的字符串请求数据。

如果是简单的 get 请求我们完全可以这样编写:

```ts
export function buildGetQueryString (obj: Record<string, any>) {
  if (!obj) return ''
  const nameValuePairs: {name: string; value: string}[] = []
  Object.keys(obj).filter(x => obj.hasOwnProperty(x) && obj[x] !== void 0).forEach(name => {
    nameValuePairs.push({name: name, value: obj[name] === null ? '' : obj[name]})
  })
  return nameValuePairs.map(x => x.name + '=' + encodeURIComponent(x.value)).join('&')
}
```

// 我们也可以在此处做数据处理

```ts
var paramsString = "q=URLUtils.searchParams&topic=api"
var searchParams = new URLSearchParams(paramsString);

for (let p of searchParams) {
  console.log(p);
}
```

如果我们的代码中需要数组，上述代码就没办法解析了。此时我们可以利用正则来解析。

```ts
export interface ExtractQueryParamsResult {
  url: string,
  params: {[key: string]: string | string[]} | null
}


export default function extractQueryParams(url: string): ExtractQueryParamsResult {
  if (typeof url !== 'string' || !url) {
    return {url: '', params: null}
  }
  const questionIndex: number = url.indexOf('?')
  let queryString: string = url
  if (questionIndex >= 0) {
    queryString = url.substring(questionIndex + 1)
    url = url.substring(0, questionIndex)
  }

  const params: {[key: string]: string | string[]} = {}
  const re = /[?&]?([^=]+)=([^&]*)/g
  let tokens
  while ((tokens = re.exec(queryString))) {
    const name: string = decodeURIComponent(tokens[1])
    const value: string = decodeURIComponent(tokens[2])
    if (params[name] !== undefined) {
      if (!Array.isArray(params[name])) {
        params[name] = [params[name] as string]
      }
      (params[name] as string[]).push(value)
    } else {
      params[name] = value
    }
  }
  return {url, params}
}
```

如此，我们可以使用上述代码来解析 url 中的数组：

```ts
const { url, params } = extractQueryParams('abc?bb=1&bb=2&cc=3')

{
  url: 'abc',
  params: {
    bb: [1, 2],
    cc: 3
  }
}
```

但是当前的代码仍旧无法解析出对象格式代码，所以我们使用 qs 来进行处理

```ts
var resultStr = qs.stringify({a: [1,2,3], b: {c: 3}})
// a%5B0%5D=1&a%5B1%5D=2&a%5B2%5D=3&b%5Bc%5D=3

var resultObj = qs.parse('a%5B0%5D=1&a%5B1%5D=2&a%5B2%5D=3&b%5Bc%5D=3')
// {a: [1,2,3], b: {c: 3}}


// 重点!! qs.parse 可以结构嵌套对象
assert.deepEqual(qs.parse('foo[bar][baz]=foobarbaz'), {
    foo: {
        bar: {
            baz: 'foobarbaz'
        }
    }
});
```

通常来说我们如此请求

```ts
const queryStr = qs.stringify(options)

// 构建 url
const url = `${queryUrl}${queryUrl.includes('?') ? '&' : '?'}${queryStr}`
```

当然，我们还可以用 qs.stringify 来查看缓存函数中的的参数是否发生变化。



