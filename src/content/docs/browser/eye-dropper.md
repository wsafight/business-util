---
title: 浏览器取色器 API (EyeDropper) 详解
description: 探索浏览器原生的 EyeDropper API，实现网页取色功能，适用于设计工具、图像编辑器和颜色主题选择器等场景
---

## EyeDropper API 简介

EyeDropper API 是一个浏览器原生接口，允许用户从屏幕上的任意位置选择颜色，而不仅仅局限于当前网页。该 API 为网页应用提供了类似桌面应用的取色体验，极大地增强了颜色相关功能的用户体验。

**主要应用场景：**
- 网页设计工具和图像编辑器
- 颜色主题选择器和个性化设置
- 图形设计和创意应用
- 颜色匹配和对比工具
- 网页开发辅助工具

## 基本用法

下面是 EyeDropper API 的基本使用示例：

```js
document.getElementById("start-button").addEventListener("click", async () => {
  // 结果显示框
  const resultElement = document.getElementById("result");
  const colorPreview = document.getElementById("color-preview");

  // 检测浏览器支持情况
  if (!window.EyeDropper) {
    resultElement.textContent = "您的浏览器不支持 EyeDropper API";
    return;
  }

  try {
    // 创建 EyeDropper 实例
    const eyeDropper = new EyeDropper();
    const abortController = new AbortController();

    // 5 秒后自动中止取色操作
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 5000);

    // 开启取色器，传入中止信号
    const result = await eyeDropper.open({
      signal: abortController.signal
    });

    // 清除超时定时器
    clearTimeout(timeoutId);

    // 获取颜色值（以 #rrggbb 十六进制格式返回）
    const colorValue = result.sRGBHex;
    resultElement.textContent = colorValue;
    
    // 实时预览选中的颜色
    if (colorPreview) {
      colorPreview.style.backgroundColor = colorValue;
    }
    
    console.log("选中的颜色:", colorValue);
    
  } catch (error) {
    // 处理错误情况（如用户取消操作或超时）
    if (error.name === 'AbortError') {
      resultElement.textContent = "取色操作已超时";
    } else {
      resultElement.textContent = `错误: ${error.message}`;
    }
  }
});
```

## HTML 示例结构

搭配上面的 JavaScript 代码，您可以使用以下 HTML 结构：

```html
<div>
  <button id="start-button">开始取色</button>
  <div id="result" style="margin-top: 10px;">等待选择颜色...</div>
  <div id="color-preview" style="width: 50px; height: 50px; margin-top: 10px; border: 1px solid #ccc;"></div>
</div>
```

## API 详解

### 构造函数

```js
const eyeDropper = new EyeDropper();
```

创建一个新的 EyeDropper 实例。构造函数不接受任何参数。

### open() 方法

```js
const result = await eyeDropper.open(options);
```

**参数：**
- `options` (可选): 配置对象，包含以下属性：
  - `signal`: AbortSignal 对象，用于中止取色操作

**返回值：**
- 返回一个 Promise，解析为包含所选颜色的对象：
  - `sRGBHex`: 字符串，表示所选颜色的十六进制值（如 `#ff0000`）

### 事件与交互流程

1. 调用 `open()` 方法后，浏览器会请求用户授权
2. 授权后，鼠标指针变为取色器样式
3. 用户点击屏幕上的任意位置选择颜色
4. 选择完成后，取色器自动关闭，Promise 解析为包含所选颜色的对象
5. 用户可以按 Esc 键取消操作，此时 Promise 会被拒绝

## 浏览器兼容性

EyeDropper API 目前的支持情况如下：

| 浏览器 | 支持版本 | 备注 |
|--------|---------|------|
| Chrome | 95+ | 完全支持 |
| Edge | 95+ | 与 Chrome 相同 |
| Opera | 81+ | 与 Chrome 相同 |
| Firefox | 不支持 | 尚未实现 |
| Safari | 不支持 | 尚未实现 |
| iOS Safari | 不支持 | 尚未实现 |
| Android Chrome | 95+ | 支持 |
| Android WebView | 95+ | 支持 |

## 实际应用场景示例

### 1. 图像编辑器中的颜色选择

```js
// 在图像编辑器中使用 EyeDropper API 提取颜色
async function pickColorForEditor() {
  if (!window.EyeDropper) {
    alert("您的浏览器不支持取色功能");
    return null;
  }
  
  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    
    // 设置编辑器当前颜色
    editor.setCurrentColor(result.sRGBHex);
    return result.sRGBHex;
  } catch (e) {
    console.log("用户取消了取色操作");
    return null;
  }
}
```

### 2. 主题颜色选择器

```js
// 在主题设置中使用 EyeDropper 让用户自定义颜色
const themeSettings = {
  async setAccentColorFromScreen() {
    if (!window.EyeDropper) {
      return;
    }
    
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      
      // 应用选中的颜色作为主题强调色
      document.documentElement.style.setProperty('--accent-color', result.sRGBHex);
      this.saveThemeSetting('accentColor', result.sRGBHex);
    } catch (e) {
      // 用户取消操作
    }
  },
  
  saveThemeSetting(key, value) {
    localStorage.setItem(`theme-${key}`, value);
  }
};
```

## 最佳实践

1. **总是检查浏览器支持**：在使用前检查 `window.EyeDropper` 是否存在
2. **提供替代方案**：对于不支持的浏览器，提供手动输入颜色值的选项
3. **处理错误和取消操作**：使用 try/catch 捕获可能的错误和用户取消操作
4. **设置合理的超时**：长时间打开取色器可能会影响用户体验
5. **明确的用户指引**：在启动取色前，告知用户如何操作和取消
6. **安全考虑**：注意该 API 可能会访问屏幕上的敏感信息，确保您的应用有合法的使用场景
7. **隐私保护**：向用户说明为什么需要取色功能，以及如何保护他们的隐私

## 相关资源

- [MDN 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper)：获取最新的 API 规格和更新
- [浏览器兼容性表](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper#browser_compatibility)：查看各浏览器支持情况的详细数据
- [Web.dev 教程](https://web.dev/eyedropper-api/)：学习如何在实际项目中有效使用 EyeDropper API
