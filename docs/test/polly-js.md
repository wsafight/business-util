# 使用 Pollyjs 进行 HTTP 请求测试

前端开发者独立于后端进行开发，往往需要对请求数据进行 mock。但如果在业务代码中进行修改，后期再进行修改不免要小心翼翼。
所以现有工具都会帮我们拦截请求，但如果针对初创项目来说，修改返回数据是不可避免的（graphql 把大部分数据修改置于前端），维护 mock 数据和线上数据保持一致是相对困难的。

[Pollyjs](https://github.com/Netflix/pollyjs) 没有采用编写数据的方案，而是把线上接口返回的数据持久化，以便开发者使用。

## 获取线上接口

```js
import { Polly } from '@pollyjs/core'
import FetchAdapter from '@pollyjs/adapter-fetch'
import XHRAdapter from '@pollyjs/adapter-xhr'
import LocalStoragePersister from '@pollyjs/persister-local-storage'

// 注册 fetch 和 xhr 请求 劫持
Polly.register(FetchAdapter)
Polly.register(XHRAdapter)

// 注册持久化方法，使用 localStorage
Polly.register(LocalStoragePersister)

new Polly('<Recording Name>', {
  // 添加各种不同的适配器
  adapters: ['fetch', 'xhr'],
  // 当前持久化存储
  persister: 'local-storage',
  // 控制台打印  
  logging: true,
  // 不同的模式
  // record 强制记录服务器返回的数据，这将覆盖已有的持久化数据
  // replay 获取记录中的数据并响应
  // passthrough 不采用记录以及重放，直接使用后端数据  
  mode: 'record'
})


new Polly('<Recording Name>2')

// 也可以使用 configure 进行配置
polly.configure({
    recordIfMissing: false
});

// 获取数据
const response = await fetch(
  'https://jsonplaceholder.typicode.com/posts/1'
);
const post = await response.json()
// 断开连接
await polly.stop()
return post
```

一旦调用了 stop 方法，持久器将生成以下 HAR 文件，该文件将用于在重新运行时重播对该请求的响应，不会向后端请求。

```json
{
  "Simple-Example_823972681": {
    "log": {
      "_recordingName": "Simple Example",
      "browser": {
        "name": "Chrome",
        "version": "70.0"
      },
      "creator": {
        "comment": "persister:local-storage",
        "name": "Polly.JS",
        "version": "1.2.0"
      },
      "entries": [
        {
          "_id": "ffbc4836d419fc265c3b85cbe1b7f22e",
          "_order": 0,
          "cache": {},
          "request": {
            "bodySize": 0,
            "cookies": [],
            "headers": [],
            "headersSize": 63,
            "httpVersion": "HTTP/1.1",
            "method": "GET",
            "queryString": [],
            "url": "https://jsonplaceholder.typicode.com/posts/1"
          },
          "response": {
            "bodySize": 292,
            "content": {
              "mimeType": "application/json; charset=utf-8",
              "size": 292,
              "text": "{\n  \"userId\": 1,\n  \"id\": 1,\n  \"title\": \"sunt aut facere repellat provident occaecati excepturi optio reprehenderit\",\n  \"body\": \"quia et suscipit\\nsuscipit recusandae consequuntur expedita et cum\\nreprehenderit molestiae ut ut quas totam\\nnostrum rerum est autem sunt rem eveniet architecto\"\n}"
            },
            "cookies": [],
            "headers": [
              {
                "name": "cache-control",
                "value": "public, max-age=14400"
              },
              {
                "name": "content-type",
                "value": "application/json; charset=utf-8"
              },
              {
                "name": "expires",
                "value": "Tue, 30 Oct 2018 22:52:42 GMT"
              },
              {
                "name": "pragma",
                "value": "no-cache"
              }
            ],
            "headersSize": 145,
            "httpVersion": "HTTP/1.1",
            "redirectURL": "",
            "status": 200,
            "statusText": "OK"
          },
          "startedDateTime": "2018-10-30T18:52:42.566Z",
          "time": 18,
          "timings": {
            "blocked": -1,
            "connect": -1,
            "dns": -1,
            "receive": 0,
            "send": 0,
            "ssl": -1,
            "wait": 18
          }
        }
      ],
      "pages": [],
      "version": "1.2"
    }
  }
}
```

## 延迟数据返回

在进行项目开发的过程中，即使是有经验的开发者，也很有可能忽略网络问题带来的错误。

开发者往往拥有极快的网速。但是很多情况下，用户未必向我们所想的那样，他们对于网速的需求可能没有那么大，也不愿意为网络支付过高的费用。

比如在移动端的列表页面，用户会通过下拉界面来获取新的数据。但是如果开发者忽略网页重复数据的可能。
这时候，我们可能就需要添加底部加载图标和 loading 状态，在此状态下不进行请求，只有完结后再次进行请求。

当然，如果仅仅只是网络请求的快慢，我们只需要在浏览器上修改网络获取速度即可。但该修改是针对所有的网络请求，如果仅仅只考虑单一请求带来的影响，浏览器就没有办法了。

```js
// 在获取数据时拦截请求并且设置 500ms 延迟
server.get('/ping').intercept(async (req, res) => {
  await server.timeout(500);
  res.sendStatus(200);
});
```

<div style="float: right">更新时间: {docsify-updated}</div>
