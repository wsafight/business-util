# URL 验证

URL 验证的存在是为了加强针对可能的漏洞利用的安全性，并消除运行代码时出现任何错误的机会。但是我们什么时候应该使用 URL 验证，在这个过程中我们要验证什么？我们应该在所有必须识别和验证页面、图像、gif 和视频等资源的软件中实施 URL 验证。 

一个典型的 URL 包含多个片段，例如协议、域名、主机名、资源名称、来源、端口等。这些告诉浏览器如何检索特定资源。我们可以使用它们以多种方式验证 URL：

```ts
const checkUrl = (url: string) => {
    let givenURL ;
    try {
        givenURL = new URL(string);
    } catch (error) {
       return false; 
    }
    return true;
}
```