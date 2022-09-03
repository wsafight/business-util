# 字符串化对象结构库 qs

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

```ts
var paramsString = "q=URLUtils.searchParams&topic=api"
var searchParams = new URLSearchParams(paramsString);

for (let p of searchParams) {
  console.log(p);
}
```


```ts
export interface ExtractQueryParamsResult {
  url: string,
  params: {[key: string]: string | string[]} | null
}


export default function extractQueryParams(url: string): ExtractQueryParamsResult {
  if (!url) return {url: '', params: null}
  const questionIndex = url.indexOf('?')
  let queryString = url
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



```ts
// 解析出对象数据
var obj = qs.parse('a=c');
assert.deepEqual(obj, { a: 'c' });

// 字符串化对象
var str = qs.stringify(obj);
assert.equal(str, 'a=c');


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



