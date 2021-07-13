# 自动切换故障 CDN 工具

对于企业服务来说，我们当然应该花钱购买 CDN 服务来提升页面加载速度。但是针对个人来说，免费的公共库 CDN 服务更为划算。

免费服务的 CDN 不够稳定和安全
- 遭受恶意攻击
- 本身服务由于各种原因不在提供支持

服务崩溃了，那网站引用的相应资源文件也会失效。然后整个网站无法使用。之前 [BootCDN](https://www.bootcdn.cn/) 在 2018 年停止过服务，虽然网站早有提醒，但是我还是中招了。事后也添加了失效引入代码。

```html
<script src="http://lib.sinaapp.com/js/jquery11/1.8/jquery.min.js"></script>
<script>window.jQuery || document.write(unescape("%3Cscript src='/skin/mobile/js/jquery.min.js'%3E%3C/script%3E"))</script>
```

在学习的过程中，我发现了一个较为不错的解决方案 [freeCDN](https://github.com/EtherDream/freecdn) 。

freecdn 的原理并不复杂，其核心使用了 Service Worker。它是一种浏览器后台服务，能拦截当前站点产生的 HTTP 请求，并能控制返回结果，相当于给网站加了一层反向代理。有了这个黑科技，我们可以把传统 CDN 的功能搬到前端，例如负载均衡、故障切换等，通过 JS 灵活处理各种请求。

事实上，Service Worker 本身的生命周期也是较为复杂的。


