---
title: 使用 Credential API 优化用户登录体验
description: 了解如何使用浏览器的 Credential API 简化用户登录流程，提高用户体验
---

# Credential API 登录优化指南

## 什么是 Credential API

Credential API 是浏览器提供的一组 API，允许网站以安全的方式存储和获取用户凭证信息（如用户名和密码），从而简化用户的登录流程。与传统的 cookie 或本地存储相比，Credential API 提供了更安全、更便捷的用户体验。

## 为什么需要 Credential API

一直以来，登录网站总是一件麻烦的事情，尤其是在移动端：
- 用户需要频繁输入账号密码
- 基于安全考虑，JavaScript 不应该直接将密码存储在本地
- 当会话过期时，用户不得不重新登录
- 重复登录严重影响用户体验

Credential API 解决了这些问题，让浏览器安全地管理用户凭证，简化登录流程。

## 浏览器支持

Credential API 已被大多数现代浏览器支持：
- Chrome 51+ 
- Firefox 60+ 
- Safari 11+ 
- Edge 79+ (基于 Chromium 的版本)

## 基本使用方法

### 1. 存储密码凭证

当用户登录成功后，可以使用 `PasswordCredential` 接口存储用户凭证。

```js
// 登录成功后获取用户信息
const { name, password } = params;
const { userName, userIcon } = await login({ name, password });

// 检查浏览器是否支持 PasswordCredential
if (!window.PasswordCredential) {
    console.log('浏览器不支持 Credential API');
    return;
}

// 方式一：直接创建凭证对象
const cred = new PasswordCredential({
    // 用户名（必填）- 用于登录的标识
    id: name,
    // 密码（必填）- 用户输入的密码
    password: password,
    // 显示名称（选填）- 后续账号展示用
    name: userName,
    // 用户头像（选填）- 后续账号展示用
    iconURL: userIcon || '/default-avatar.png'
});

// 方式二：使用 navigator.credentials.create 异步创建
// const cred = await navigator.credentials.create({
//     password: {
//         id: name,
//         password: password,
//         name: userName,
//         iconURL: userIcon || '/default-avatar.png'
//     }
// });

// 存储凭证，返回 Promise
navigator.credentials.store(cred)
    .then(() => {
        console.log('凭证存储成功');
        // 可以在这里添加成功后的处理逻辑
    })
    .catch(error => {
        console.log('凭证存储失败:', error);
        // 处理存储失败的情况
    });
```

### 2. 凭证存储的注意事项

- 调用 `navigator.credentials.store(cred)` 时，浏览器会显示对话框询问用户是否保存密码
- 用户选择「保存」时，Promise 会 resolve；点击「取消」或「永远不」时，Promise 会 reject
- 如果用户选择了「永远不」，后续调用 `store` 会直接 resolve 但不会显示对话框
- **最佳实践**：只在用户明确完成登录且体验良好时请求存储凭证
- 务必处理凭证存储成功和失败的情况

### 3. 获取已存储的凭证

当用户再次访问网站时，可以使用 `navigator.credentials.get` 获取已存储的凭证，实现自动或半自动登录。

```js
// 检查用户是否已登录
function isLogin() {
    // 检查用户是否已有有效会话
    return !!sessionStorage.getItem('userToken');
}

// 检查浏览器支持
if (!window.PasswordCredential) {
    console.log('浏览器不支持 Credential API');
    return;
}

// 如果用户未登录，尝试获取已存储的凭证
if (!isLogin()) {
    try {
        // 获取凭证，返回 Promise
        const cred = await navigator.credentials.get({
            password: true,
            // 获取策略：'optional' | 'required' | 'silent'
            mediation: 'optional'
        });
        
        if (cred) {
            const { id, password } = cred;
            // 使用获取到的凭证自动登录
            const loginResult = await login({ name: id, password });
            
            if (loginResult.success) {
                console.log('使用存储的凭证自动登录成功');
                // 处理登录成功逻辑
            }
        }
    } catch (error) {
        console.log('获取凭证失败:', error);
        // 处理获取失败的情况
    }
}
```

### 4. mediation 参数详解

`mediation` 参数控制浏览器如何提示用户选择凭证：

- **required**：每次都会显示账号选择器，即使用户之前已经选择过
- **optional**：默认不显示账号选择器，直接返回上次选择的凭证，可通过 `preventSilentAccess()` 取消此行为
- **silent**：完全静默获取凭证，不适合多账号切换场景

**最佳实践**：通常使用 `optional` 结合 `preventSilentAccess()` 来平衡用户体验和灵活性。

```js
// 取消静默访问，下次调用 get() 时将显示账号选择器
navigator.credentials.preventSilentAccess();
```

## 第三方账号登录凭证

除了密码凭证外，Credential API 还支持第三方登录凭证（`FederatedCredential`），用于管理 OAuth、OpenID Connect 等第三方登录。

```js
// 检查浏览器是否支持 FederatedCredential
if (!window.FederatedCredential) {
    console.log('浏览器不支持 FederatedCredential');
    return;
}

// 方式一：直接创建第三方凭证
const cred = new FederatedCredential({
    // 用户唯一标识（必填）- email、username 等
    id: 'user@example.com',
    // 第三方账号提供方（必填）- 符合 URL 格式的提供方网址
    provider: 'https://accounts.example.com',
    // 显示名称（选填）
    name: 'Example User'
});

// 方式二：使用 navigator.credentials.create 异步创建
// const cred = await navigator.credentials.create({
//     federated: {
//         id: 'user@example.com',
//         provider: 'https://accounts.example.com',
//         name: 'Example User'
//     }
// });

// 存储第三方凭证
navigator.credentials.store(cred)
    .then(() => {
        console.log('第三方凭证存储成功');
    })
    .catch(error => {
        console.log('第三方凭证存储失败:', error);
    });
```

### 第三方登录的注意事项

- 不要直接使用 access_token 等短期令牌作为 `id`
- 需要建立稳定的用户标识符与短期令牌之间的映射关系
- 通常与 OAuth 2.0、OpenID Connect 等授权协议结合使用
- 了解更多 OAuth 2.0 知识，可以参考阮一峰的 [理解OAuth 2.0](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)

## 完整的登录流程示例

下面是一个完整的使用 Credential API 的登录流程示例：

```js
// 检查是否支持 Credential API
const supportsCredentials = 'credentials' in navigator;

// 登录按钮点击处理
async function handleLogin(credentials) {
    try {
        // 调用后端登录接口
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        const result = await response.json();
        
        if (result.success && supportsCredentials) {
            // 尝试存储凭证
            try {
                const cred = new PasswordCredential({
                    id: credentials.username,
                    password: credentials.password,
                    name: result.userName,
                    iconURL: result.avatar || '/default-avatar.png'
                });
                
                await navigator.credentials.store(cred);
                console.log('凭证已存储');
            } catch (e) {
                // 用户可能拒绝了存储请求，不影响主流程
                console.log('凭证存储被拒绝');
            }
        }
        
        return result;
    } catch (error) {
        console.error('登录过程出错:', error);
        throw error;
    }
}

// 页面加载时尝试自动登录
async function tryAutoLogin() {
    if (!supportsCredentials || isLogin()) {
        return false;
    }
    
    try {
        const cred = await navigator.credentials.get({
            password: true,
            mediation: 'optional'
        });
        
        if (cred) {
            const { id, password } = cred;
            const result = await handleLogin({ username: id, password });
            return result.success;
        }
        
        return false;
    } catch (error) {
        console.error('自动登录失败:', error);
        return false;
    }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', () => {
    tryAutoLogin().then(success => {
        if (!success) {
            // 自动登录失败，显示登录表单
            document.getElementById('login-form').style.display = 'block';
        }
    });
});
```

## 安全考虑

- Credential API 由浏览器管理，比手动存储密码更安全
- 凭证存储在用户设备的安全区域，受到操作系统保护
- 网站无法直接读取已存储的凭证，只能通过 `navigator.credentials.get()` 请求浏览器提供
- 始终使用 HTTPS 协议，因为 Credential API 在 HTTP 环境下可能被禁用
- 实现适当的服务器端验证，不要仅依赖客户端凭证

## 最佳实践

1. **渐进增强**：先检查浏览器支持，不支持时提供传统登录方式
2. **合理时机**：只在用户明确完成登录后请求存储凭证
3. **错误处理**：妥善处理凭证存储和获取失败的情况
4. **用户体验**：提供清晰的提示，让用户了解自动登录的工作原理
5. **安全第一**：结合其他安全措施，如双因素认证
6. **会话管理**：实现合理的会话过期策略

## 总结

Credential API 为网站提供了一种安全、便捷的方式来管理用户凭证，显著改善了用户的登录体验。通过合理使用 PasswordCredential 和 FederatedCredential，网站可以减少用户重复输入密码的次数，同时保持良好的安全性。

在现代 Web 应用中，Credential API 已成为提升用户体验的重要工具，值得开发者在登录流程设计中考虑采用。