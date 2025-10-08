---
title: Navigator.sendBeacon - 页面跳转时可靠的数据上报方案
description: 详解 Navigator.sendBeacon API 及其在页面卸载场景下的应用
---

## 1. 概念介绍与核心价值

在 Web 应用开发中，数据收集（如用户行为分析、性能监控、日志记录）是一项常见需求。然而，当用户离开当前页面（关闭标签页、导航到新页面或刷新）时，传统的异步 HTTP 请求（如 XMLHttpRequest 或 fetch）可能因页面进入"终止"状态而无法可靠完成，导致数据丢失。

**Navigator.sendBeacon** 是浏览器提供的一个专门解决这一问题的 API，它允许开发者在页面卸载时异步、非阻塞地向服务器发送少量数据，并且能够可靠地完成传输。

### 核心价值
- **可靠的数据传输**：即使在页面卸载场景下，也能保证数据尽可能被成功发送
- **非阻塞体验**：不影响页面卸载速度和下一页面的加载性能
- **异步处理**：数据发送在后台进行，无需等待服务器响应
- **简单易用**：API 设计简洁，易于集成到现有项目

## 2. 工作原理

Navigator.sendBeacon 的工作原理可以概括为以下几点：

1. **请求与页面分离**：当调用 sendBeacon() 方法时，浏览器会将请求从当前页面的上下文中分离出来
2. **后台队列处理**：浏览器将请求放入独立的后台任务队列，由浏览器进程负责处理
3. **低优先级执行**：这些请求会在浏览器空闲时以低优先级执行，不会阻塞关键用户体验
4. **不等待响应**：sendBeacon 不关心服务器的响应，它只确保请求被发送出去
5. **返回值判断**：方法返回一个布尔值，表示数据是否成功加入传输队列

这种设计使得 sendBeacon 在处理页面卸载、用户离开等场景下的数据收集时具有明显优势，不会像传统的同步请求那样阻塞页面卸载，也不会像普通异步请求那样可能被中断。

## 3. 基本使用方法

### 3.1 基础语法

```javascript
navigator.sendBeacon(url);
// 或
navigator.sendBeacon(url, data);
```

- `url`：接收数据的服务器地址（可以是相对路径或绝对路径）
- `data`：可选，要发送的数据，支持多种数据类型

### 3.2 数据类型支持

sendBeacon 支持以下数据类型作为 `data` 参数：
- DOMString（字符串）
- ArrayBuffer
- ArrayBufferView
- Blob
- FormData
- URLSearchParams

### 3.3 基本示例

#### 发送简单字符串数据

```javascript
// 在页面卸载时发送简单的统计数据
window.addEventListener('unload', function() {
  const data = 'userID=123&action=page_close&duration=3000';
  navigator.sendBeacon('/analytics', data);
});
```

#### 发送 JSON 数据

```javascript
// 将 JSON 对象转换为 Blob 发送
function sendAnalyticsData(data) {
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json; charset=UTF-8'
  });
  
  return navigator.sendBeacon('/api/analytics', blob);
}

// 使用示例
window.addEventListener('beforeunload', function() {
  const analyticsData = {
    userId: 'user123',
    page: window.location.href,
    timestamp: Date.now(),
    sessionDuration: getSessionDuration() // 自定义函数获取会话时长
  };
  
  sendAnalyticsData(analyticsData);
});
```

#### 发送表单数据

```javascript
// 使用 FormData 发送更复杂的数据
function sendUserAction(actionType, details) {
  const formData = new FormData();
  formData.append('actionType', actionType);
  formData.append('timestamp', Date.now());
  formData.append('details', JSON.stringify(details));
  
  return navigator.sendBeacon('/api/track', formData);
}

// 点击按钮时记录用户行为，即使随后跳转页面
document.getElementById('submitBtn').addEventListener('click', function() {
  sendUserAction('form_submit', {
    formId: 'contactForm',
    timestamp: Date.now()
  });
});
```

## 4. API 详解

### 4.1 方法签名

```javascript
navigator.sendBeacon(url, data)
```

### 4.2 参数说明

- **url** (String): 目标服务器的 URL 地址。必须提供此参数。
- **data** (可选): 要发送的数据，可以是以下类型之一：DOMString、ArrayBuffer、ArrayBufferView、Blob、FormData 或 URLSearchParams。

### 4.3 返回值

- **Boolean**: 当数据成功加入浏览器的发送队列时返回 `true`，否则返回 `false`。

**注意**：返回 `true` 仅表示数据已被加入队列，不保证服务器已成功接收或处理数据。浏览器无法监控请求的最终成功状态。

### 4.4 与其他请求方式的区别

| 特性 | Navigator.sendBeacon | fetch + keepalive | 同步 XMLHttpRequest | ping 属性 |
|------|---------------------|-------------------|---------------------|-----------|-------------------|
| 数据可靠性 | 高 | 高 | 高 | 中 |
| 异步性 | 是 | 是 | 否 | 是 |
| 阻塞性 | 无 | 无 | 有 | 无 |
| 数据大小限制 | 通常较小(约64KB) | 通常较小(约64KB) | 无特定限制 | 无数据体 |
| 适用场景 | 页面卸载时的数据收集 | 页面卸载时的数据收集 | 不推荐使用 | 简单的链接点击追踪 |
| 浏览器兼容性 | 良好 | 良好 | 普遍 | 有限(Firefox默认禁用) |
| 自定义数据 | 支持多种格式 | 支持多种格式 | 支持多种格式 | 仅支持有限的头部信息 |

## 5. 实际应用场景

### 5.1 用户行为分析

记录用户在页面上的行为数据，如停留时间、点击事件、滚动深度等，即使在用户离开页面时也能可靠上报。

```javascript
// 记录页面停留时间
let startTime = Date.now();

window.addEventListener('unload', function() {
  const duration = Date.now() - startTime;
  navigator.sendBeacon('/api/user-activity', JSON.stringify({
    action: 'page_view',
    url: window.location.href,
    duration: duration,
    timestamp: Date.now()
  }));
});
```

### 5.2 性能监控

在页面卸载时收集性能数据，用于分析和优化网站性能。

```javascript
window.addEventListener('unload', function() {
  // 收集性能数据
  const performanceData = {
    pageLoadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
    domInteractive: window.performance.timing.domInteractive - window.performance.timing.navigationStart,
    firstPaint: window.performance.getEntriesByType('paint')[0]?.startTime || 0
  };
  
  const blob = new Blob([JSON.stringify(performanceData)], { type: 'application/json' });
  navigator.sendBeacon('/api/performance', blob);
});
```

### 5.3 错误日志收集

当页面发生错误且用户即将离开时，收集错误信息并上报。

```javascript
let errors = [];

// 收集运行时错误
window.addEventListener('error', function(e) {
  errors.push({
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    timestamp: Date.now()
  });
});

// 在页面卸载时发送错误日志
window.addEventListener('unload', function() {
  if (errors.length > 0) {
    navigator.sendBeacon('/api/error-logs', JSON.stringify({
      url: window.location.href,
      errors: errors
    }));
  }
});
```

### 5.4 表单放弃追踪

追踪用户开始填写表单但最终未提交的情况，用于优化表单设计。

```javascript
let formStarted = false;
const formFields = [];

// 监听表单输入
const form = document.getElementById('contact-form');
form.addEventListener('input', function(e) {
  formStarted = true;
  if (!formFields.includes(e.target.name)) {
    formFields.push(e.target.name);
  }
});

// 监听表单提交，标记为已提交
form.addEventListener('submit', function() {
  formStarted = false;
});

// 在页面卸载时检查是否有未提交的表单
window.addEventListener('unload', function() {
  if (formStarted) {
    navigator.sendBeacon('/api/form-abandonment', JSON.stringify({
      formId: 'contact-form',
      fieldsTouched: formFields,
      timestamp: Date.now()
    }));
  }
});
```

## 6. 浏览器兼容性

Navigator.sendBeacon 具有良好的浏览器兼容性，支持所有现代浏览器：

- Chrome 39+✅
- Firefox 31+✅
- Safari 11.1+✅
- Edge 14+✅
- iOS Safari 11.3+✅
- Android Browser 4.4.4+✅

**注意**：对于不支持 sendBeacon 的旧浏览器，建议使用 fetch + keepalive 作为降级方案，或者在极端情况下考虑使用同步 XMLHttpRequest（但会阻塞页面卸载）。

## 7. 高级用法与最佳实践

### 7.1 处理发送失败的情况

虽然 sendBeacon 能够提高数据发送的可靠性，但仍有可能失败。返回 `false` 表示数据太大或队列已满，此时可以考虑降级方案。

```javascript
function sendReliableAnalytics(url, data) {
  // 优先尝试 sendBeacon
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    if (navigator.sendBeacon(url, blob)) {
      return true;
    }
  }
  
  // 降级方案：使用 fetch + keepalive
  if (window.fetch) {
    try {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        credentials: 'include'
      });
      return true;
    } catch (e) {
      console.error('Fetch with keepalive failed:', e);
    }
  }
  
  // 极端降级：使用同步 XHR（会阻塞页面卸载）
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, false); // 同步请求
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr.status >= 200 && xhr.status < 300;
  } catch (e) {
    console.error('Sync XHR failed:', e);
    return false;
  }
}
```

### 7.2 数据批量处理

为避免频繁调用 sendBeacon 导致性能问题，可以考虑批量处理数据，在适当时机一次性发送。

```javascript
class AnalyticsBatcher {
  constructor(batchSize = 10, flushInterval = 5000) {
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.queue = [];
    this.timer = null;
    this.isUnloading = false;
    
    // 监听页面卸载事件
    window.addEventListener('beforeunload', () => {
      this.isUnloading = true;
      this.flush();
    });
  }
  
  // 添加数据到队列
  push(data) {
    this.queue.push(data);
    
    // 如果达到批次大小或页面即将卸载，立即发送
    if (this.queue.length >= this.batchSize || this.isUnloading) {
      this.flush();
    } else if (!this.timer) {
      // 否则设置定时器延迟发送
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }
  
  // 发送队列中的数据
  flush() {
    if (this.queue.length === 0) return;
    
    const dataToSend = JSON.stringify(this.queue);
    this.queue = [];
    
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    // 尝试发送数据
    if (navigator.sendBeacon) {
      const blob = new Blob([dataToSend], { type: 'application/json' });
      if (!navigator.sendBeacon('/api/analytics/batch', blob)) {
        console.warn('Beacon queue is full, falling back to fetch');
        this.fallbackSend('/api/analytics/batch', dataToSend);
      }
    } else {
      this.fallbackSend('/api/analytics/batch', dataToSend);
    }
  }
  
  // 降级发送方式
  fallbackSend(url, data) {
    try {
      fetch(url, {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      });
    } catch (e) {
      console.error('Fallback send failed:', e);
    }
  }
}

// 使用示例
const analyticsBatcher = new AnalyticsBatcher();

// 在用户点击时添加数据
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.href) {
    analyticsBatcher.push({
      type: 'link_click',
      url: e.target.href,
      text: e.target.textContent.trim(),
      timestamp: Date.now()
    });
  }
});
```

### 7.3 结合 Service Worker 实现更可靠的传输

对于需要极高可靠性的数据收集场景，可以结合 Service Worker 来进一步确保数据的可靠传输。

```javascript
// 主线程代码
function sendCriticalData(data) {
  // 首先尝试使用 sendBeacon
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    if (navigator.sendBeacon('/api/critical-data', blob)) {
      return Promise.resolve(true);
    }
  }
  
  // 如果 sendBeacon 失败或不可用，尝试通过 Service Worker 发送
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      navigator.serviceWorker.controller.postMessage({
        type: 'SEND_CRITICAL_DATA',
        data: data,
        url: '/api/critical-data'
      });
      resolve(true);
    });
  }
  
  // 最后的降级方案
  return Promise.resolve(false);
}

// Service Worker 代码 (service-worker.js)
self.addEventListener('message', function(event) {
  if (event.data.type === 'SEND_CRITICAL_DATA') {
    // 在 Service Worker 中尝试发送数据
    fetch(event.data.url, {
      method: 'POST',
      body: JSON.stringify(event.data.data),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      keepalive: true
    }).catch(err => {
      // 如果发送失败，可以将数据存储在 IndexedDB 中，等待网络恢复
      storeInIndexedDB('pendingCriticalData', event.data.data);
    });
  }
});
```

## 8. 常见问题与解决方案

### 8.1 数据大小限制

问题：sendBeacon 对发送的数据大小有一定限制，超过限制会导致发送失败。

解决方法：
- 精简数据，只发送必要的信息
- 对大数据进行压缩处理
- 实现数据分片发送策略
- 如果数据量确实很大，考虑其他传输方式

```javascript
function sendLargeData(url, largeData) {
  // 检查数据大小
  const dataStr = JSON.stringify(largeData);
  const dataSize = new Blob([dataStr]).size;
  const MAX_SIZE = 60 * 1024; // 60KB 作为安全阈值
  
  if (dataSize <= MAX_SIZE) {
    // 数据大小在限制内，直接发送
    const blob = new Blob([dataStr], { type: 'application/json' });
    return navigator.sendBeacon(url, blob);
  } else {
    // 数据过大，尝试分片发送或降级处理
    console.warn(`Data too large (${dataSize} bytes), trying alternative methods`);
    // 实现分片逻辑或降级到其他传输方式
    return false;
  }
}
```

### 8.2 跨域请求问题

问题：sendBeacon 发送跨域请求时可能会遇到 CORS 限制。

解决方法：
- 确保服务器配置了正确的 CORS 响应头
- 使用 `credentials: 'include'` 选项（但 sendBeacon 不直接支持此选项）
- 考虑使用代理服务器

```javascript
// 服务器端需要设置的 CORS 响应头
// Access-Control-Allow-Origin: https://your-origin.com
// Access-Control-Allow-Methods: POST
// Access-Control-Allow-Headers: Content-Type
// Access-Control-Allow-Credentials: true
```

### 8.3 无法获取服务器响应

问题：sendBeacon 只保证请求被发送，但无法获取服务器的响应状态或数据。

解决方法：
- 对于关键业务数据，考虑在页面正常运行期间使用传统的 fetch 或 XHR 请求
- 实现服务器端的数据确认机制，如通过其他渠道通知客户端
- 结合本地存储，在数据成功发送并确认后再删除本地副本

## 9. 总结

Navigator.sendBeacon 是一个专门为解决页面卸载时数据可靠传输问题而设计的 API，它通过将请求与页面上下文分离并在后台异步处理的方式，确保了数据能够尽可能被成功发送，同时不会影响用户体验。

在实际应用中，sendBeacon 特别适合用于：
- 用户行为分析与统计
- 网站性能监控数据收集
- 错误日志上报
- 表单放弃追踪等场景

虽然 sendBeacon 有一些局限性（如数据大小限制、无法获取响应等），但通过合理的设计和降级策略（如结合 fetch + keepalive、Service Worker 等），我们可以充分发挥其优势，构建更加可靠的数据收集系统。

在 Web 应用开发中，了解并正确使用 Navigator.sendBeacon 是提升数据收集可靠性、优化用户体验的重要手段之一。



