# url 构造

项目开发中，如果有需求中可以让用户自行配置路由。那么我们往往需要一个可以构建 url 的库。

在不需要用户配置路由的情况下，我们可以直接拼接字符串

```js
const API_URL = 'https://api.example.com';

function getUserPosts(id, blogId, limit, offset) {
  // 为了防御式编程，最好加上 encodeURIComponent 进行转义
  const url = `${API_URL}/users/${id}/blogs/${blogId}/posts?limit=${limit}&offset=${offset}`;
}
```
如您所见，这个最小的示例已经很难阅读。同时也不可能处理上述业务需求。

由于用户配置输入的路由只能是字符串('/users/:id/posts')，我们只能通过字符串去匹配与跳转路由:

当前 urlcat 库可以直接让你这样使用

```js
const API_URL = 'https://api.example.com/';

function getUserPosts(id, limit, offset) {
  // 字符串中没有匹配的对象数据，就会被添加到 query 中
  const requestUrl = urlcat(API_URL, '/users/:id/posts', { id, limit, offset });
}
```
同时，我们可以看到，使用该库后，写出的代码更具有维护性。更加易于修改。

该库处理：

- 转义所有参数
- 连接所有部件（总是会有一个准确/和?它们之间的字符）

进入 [url cat文档](https://urlcat.dev/#/)

当然，在各种路由库中使用的 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 库也有此功能。但此库更适合复杂场景。

<div style="float: right">更新时间: {docsify-updated}</div>



