# 使用凭证优化登录流程

一直以来，登录网站总是一件非常麻烦的事情，尤其是在移动端。用户输入账号密码并提交给服务器进行校验，服务器校验通过之后将创建 session 保持会话。基于安全角度的考虑，用户的账号密码是不允许通过 JavaScript 写入本地存储之中的。当 session 会话过期时，用户将不得不再次输入账号密码信息进行登录，体验很差。我们可以用 Credential API。

以下为登陆成功的参数

```js
const { name, password } = params

const { userName, userIcon } = await login({name, password})

// 不支持 api，直接返回
if (!window.PasswordCredential) {
    return
}

const cred = new PasswordCredential({
    // 用户名 必填
    id: name,
    // 密码 必填
    password: password,
    // 后续账号展示 选填
    name: userName,
    // 后续账号展示 选填
    iconURL: userIcon || defaultIcon,
})

// 也可以通过 navigator.credentials.create 异步创建凭证
const cred = await navigator.credentials.create({
    password: {
        // 用户名 必填
        id: name,
        // 密码 必填
        password: password,
        // 后续账号展示 选填
        name: userName,
        // 后续账号展示 选填
        iconURL: userIcon || defaultIcon,
    }
})

// 存储凭证，返回一个 Promise, 用户可以选择允许或者拒绝
navigator.credentials.store(cred)
```

在执行 navigator.credentials.store(cred) 进行保存时，方法会返回一个 promise 对象，同时在页面上弹出对话框提示用户是否进行密码存储，只有当用户选择“保存”时，promise 对象才会 resolve，点击“x”关闭对话框或者点击“一律不”时，promise 将 reject。

需要注意的是，如果用户选择了“一律不”，那么在后续调用 navigator.credentials.store(cred) 时，返回的 promise 对象将直接 resolve 而不会弹出任何对话框。因此在设计凭证存储流程时，一定要记住只在最合适的时候发起凭证存储。同时，存储流程需要考虑到凭证存储成功和失败之后的应对措施。

```js
if (!window.PasswordCredential) {
    return;
}

if (!isLogin()) {
    // 返回一个 Promise, 根据策略用户需要选择账号
    const cred = await navigator.credentials.get({
      password: true,
      // 获取策略 optional required silent(不适合多账号切换的场景)
      // 
      mediation: 'optional'
    })

    const { id, password } = cred;
}
```

mediation 设置情况如下所示：
- required 当用户进入界面时，账户选择器每次都会展现
- optional 当用户接入界面时，将不会弹出账号选择器而直接返回上次选择好的身份凭证信息，从而起到简化用户登录流程的作用。需要调用 navigator.credentials.preventSilentAccess 来取消这个过程
- silent 不适合多账号切换的场景，这里就不再介绍，结合 optional 和 preventSilentAccess 即可

事实上，Credential API 还提供了第三方登录的凭证。


```js
// 不支持 api，直接返回
if (!window.FederatedCredential) {
    return
}

const cred = new FederatedCredential({
    // 用户的 email、username 等能够唯一标识用户的属性值
    id: 'xxxx',
    // 第三方账号提供方，需要填入符合 URL 校验规则的账号提供方网址
    provider: 'https://www.baidu.com',
    // 选填名称
    name: 'xxxx'
})

// 也可以通过 navigator.credentials.create 异步创建凭证
const cred = await navigator.credentials.create({
    federated: {
        // 用户的 email、username 等能够唯一标识用户的属性值
        id: 'xxxx',
        // 第三方账号提供方，需要填入符合 URL 校验规则的账号提供方网址
        provider: 'https://www.baidu.com',
        // 选填名称
        name: 'xxxx'
    }
})

navigator.credentials.store(cred)
```

通常第三方账户登录使用 OAuth2.0 等方式授权，不能直接用 assess_token 等具有时效性的值作为 id，需要做好 id 与 assess_token 的映射关系。不理解的同学可以学习 [理解OAuth 2.0](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)。