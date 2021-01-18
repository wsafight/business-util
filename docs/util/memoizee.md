# 强大的业务缓存库 memoizee

在开发 web 应用程序时，性能都是必不可少的话题。

事实上，缓存一定是提升web应用程序有效方法之一，尤其是用户受限于网速的情况下。提升系统的响应能力，降低网络的消耗。当然，内容越接近于用户，则缓存的速度就会越快，缓存的有效性则会越高。
当然，缓存一定建立在对数据的时效性要求低的情况下，往往在 ToB 场景下更加有效(系统数据，个人信息和通用数据与配置)。

两年前，我写过一篇关于缓存的文章[前端 api 请求缓存方案](https://github.com/wsafight/personBlog/issues/2) 中详细介绍了如何使用 promise 进行缓存，参数化存储以及缓存超时的一些机制。


不过，相对于完整的 [memoizee](https://github.com/medikoo/memoizee) 缓存库我的代码就捉襟见肘了。

下面我们来学习一下该库:

<div style="float: right">更新时间: {docsify-updated}</div>
