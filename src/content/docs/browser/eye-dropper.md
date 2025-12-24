---
title: 浏览器原生取色器 API (EyeDropper) 详解
description: 探索浏览器原生的 EyeDropper API，实现网页取色功能，适用于设计工具、图像编辑器和颜色主题选择器等场景
---

## EyeDropper API 概述

EyeDropper API 是一个浏览器原生接口，允许用户从屏幕上的任意位置选择颜色，而不仅仅局限于当前网页。该 API 为 Web 应用提供了类似桌面应用的取色体验，极大地增强了颜色相关功能的用户体验。

### 主要应用场景

- **设计工具**：图像编辑器、矢量绘图工具
- **主题定制**：颜色主题选择器、个性化设置
- **创意应用**：图形设计、色彩匹配工具
- **开发辅助**：网页开发辅助工具、颜色对比分析
- **教育应用**：色彩学习、颜色理论演示

## 基本用法

下面是 EyeDropper API 的基本使用示例：

```js
document.getElementById('pick-button').addEventListener('click', async () => {
  const resultElement = document.getElementById('result');
  const colorPreview = document.getElementById('color-preview');

  // 检测浏览器支持情况
  if (!window.EyeDropper) {
    resultElement.textContent = '您的浏览器不支持 EyeDropper API';
    return;
  }

  try {
    // 创建 EyeDropper 实例
    const eyeDropper = new EyeDropper();
    const abortController = new AbortController();

    // 设置超时自动中止（可选）
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 10000); // 10 秒超时

    // 开启取色器
    const result = await eyeDropper.open({
      signal: abortController.signal
    });

    // 清除定时器
    clearTimeout(timeoutId);

    // 获取颜色值（以 #rrggbb 十六进制格式返回）
    const colorValue = result.sRGBHex;
    resultElement.textContent = colorValue;

    // 显示颜色预览
    if (colorPreview) {
      colorPreview.style.backgroundColor = colorValue;
    }

    console.log('选中的颜色:', colorValue);

  } catch (error) {
    // 处理错误情况
    if (error.name === 'AbortError') {
      resultElement.textContent = '取色操作已取消';
    } else {
      resultElement.textContent = `错误: ${error.message}`;
    }
  }
});
```

### HTML 结构

```html
<div class="eyedropper-demo">
  <button id="pick-button">开始取色</button>
  <p id="result" style="margin-top: 1rem;">等待选择颜色...</p>
  <div id="color-preview"
       style="width: 60px; height: 60px; margin-top: 1rem;
              border: 2px solid #ccc; border-radius: 8px;">
  </div>
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
- `options` (可选): 配置对象
  - `signal`: AbortSignal 对象，用于中止取色操作

**返回值：**
- 返回一个 Promise，解析为包含所选颜色的对象：
  - `sRGBHex`: 字符串，表示所选颜色的 sRGB 十六进制值（如 `#ff0000`）

### 交互流程

1. 调用 `open()` 方法后，浏览器会请求用户授权
2. 授权后，鼠标指针变为取色器样式（通常是放大镜图标）
3. 用户点击屏幕上的任意位置选择颜色
4. 选择完成后，取色器自动关闭，Promise 解析为包含所选颜色的对象
5. 用户可按 `Esc` 键取消操作，此时 Promise 会被拒绝并抛出 `AbortError`

## 浏览器兼容性

EyeDropper API 的浏览器支持情况（截至 2025 年 12 月）：

| 浏览器 | 支持情况 | 最低版本 | 备注 |
|--------|----------|----------|------|
| Chrome | ✅ 完全支持 | 95+ | 默认启用 |
| Edge | ✅ 完全支持 | 95+ | 与 Chrome 一致 |
| Opera | ✅ 完全支持 | 81+ | 与 Chrome 一致 |
| Firefox | ⚠️ 实验中 | Nightly | 需手动启用配置 |
| Safari | ⚠️ 实验中 | 18.2+ | 需通过 flag 启用 |
| Android Chrome | ✅ 完全支持 | 95+ | 支持 |
| Android WebView | ✅ 完全支持 | 95+ | 支持 |
| iOS Safari | ❌ 不支持 | - | 尚未实现 |

建议在使用前进行特性检测：

```js
function isEyeDropperSupported() {
  return 'EyeDropper' in window;
}

if (!isEyeDropperSupported()) {
  // 显示替代方案或提示
  showFallbackColorPicker();
}
```

## 实际应用场景

### 1. 图像编辑器中的颜色选择

```js
class ColorPicker {
  constructor(editor) {
    this.editor = editor;
    this.currentColor = '#000000';
    this.initUI();
  }

  initUI() {
    this.colorDisplay = document.getElementById('current-color');
    this.pickButton = document.getElementById('pick-color');

    this.pickButton.addEventListener('click', () => this.pickColor());
  }

  async pickColor() {
    if (!window.EyeDropper) {
      this.showFallbackPicker();
      return;
    }

    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      this.setColor(result.sRGBHex);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('取色失败:', error);
      }
    }
  }

  setColor(color) {
    this.currentColor = color;
    this.colorDisplay.style.backgroundColor = color;
    this.colorDisplay.textContent = color;

    // 更新编辑器当前颜色
    if (this.editor) {
      this.editor.setCurrentColor(color);
    }
  }

  showFallbackPicker() {
    // 显示传统的颜色选择器作为替代方案
    const input = document.createElement('input');
    input.type = 'color';
    input.value = this.currentColor;
    input.click();

    input.addEventListener('input', () => {
      this.setColor(input.value);
    });
  }
}
```

### 2. 主题颜色选择器

```js
class ThemeColorPicker {
  constructor() {
    this.colors = {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937'
    };
    this.loadFromStorage();
    this.applyTheme();
  }

  async pickColor(property) {
    if (!window.EyeDropper) {
      console.warn('EyeDropper API 不可用');
      return;
    }

    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      this.setColor(property, result.sRGBHex);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('取色失败:', error);
      }
    }
  }

  setColor(property, color) {
    this.colors[property] = color;
    this.applyTheme();
    this.saveToStorage();
  }

  applyTheme() {
    const root = document.documentElement;

    root.style.setProperty('--color-primary', this.colors.primary);
    root.style.setProperty('--color-secondary', this.colors.secondary);
    root.style.setProperty('--color-accent', this.colors.accent);
    root.style.setProperty('--color-background', this.colors.background);
    root.style.setProperty('--color-text', this.colors.text);
  }

  saveToStorage() {
    localStorage.setItem('theme-colors', JSON.stringify(this.colors));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('theme-colors');
    if (stored) {
      try {
        this.colors = { ...this.colors, ...JSON.parse(stored) };
      } catch (error) {
        console.error('加载主题失败:', error);
      }
    }
  }

  resetTheme() {
    this.colors = {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937'
    };
    this.applyTheme();
    this.saveToStorage();
  }
}

// 使用示例
const themePicker = new ThemeColorPicker();

// 绑定取色按钮
document.getElementById('pick-primary').onclick = () => themePicker.pickColor('primary');
document.getElementById('pick-accent').onclick = () => themePicker.pickColor('accent');
document.getElementById('reset-theme').onclick = () => themePicker.resetTheme();
```

### 3. 颜色对比度检查工具

```js
class ColorContrastChecker {
  constructor() {
    this.foregroundColor = '#000000';
    this.backgroundColor = '#ffffff';
    this.initUI();
  }

  initUI() {
    this.foregroundDisplay = document.getElementById('foreground-color');
    this.backgroundDisplay = document.getElementById('background-color');
    this.contrastDisplay = document.getElementById('contrast-ratio');
    this.previewBox = document.getElementById('preview');

    document.getElementById('pick-foreground').onclick = () => this.pickForegroundColor();
    document.getElementById('pick-background').onclick = () => this.pickBackgroundColor();
  }

  async pickForegroundColor() {
    if (!window.EyeDropper) return;

    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      this.setForegroundColor(result.sRGBHex);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('取色失败:', error);
      }
    }
  }

  async pickBackgroundColor() {
    if (!window.EyeDropper) return;

    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      this.setBackgroundColor(result.sRGBHex);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('取色失败:', error);
      }
    }
  }

  setForegroundColor(color) {
    this.foregroundColor = color;
    this.foregroundDisplay.textContent = color;
    this.foregroundDisplay.style.backgroundColor = color;
    this.updatePreview();
  }

  setBackgroundColor(color) {
    this.backgroundColor = color;
    this.backgroundDisplay.textContent = color;
    this.backgroundDisplay.style.backgroundColor = color;
    this.updatePreview();
  }

  updatePreview() {
    // 更新预览
    this.previewBox.style.color = this.foregroundColor;
    this.previewBox.style.backgroundColor = this.backgroundColor;

    // 计算对比度
    const contrast = this.calculateContrast(
      this.foregroundColor,
      this.backgroundColor
    );
    this.contrastDisplay.textContent = contrast.toFixed(2) + ':1';

    // 更新对比度评级
    const rating = this.getContrastRating(contrast);
    this.contrastDisplay.className = `rating-${rating}`;
  }

  calculateContrast(foreground, background) {
    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  getLuminance(hex) {
    const rgb = this.hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  getContrastRating(contrast) {
    if (contrast >= 7) return 'aaa';
    if (contrast >= 4.5) return 'aa';
    if (contrast >= 3) return 'a';
    return 'fail';
  }
}
```

### 4. 调色板生成工具

```js
class PaletteGenerator {
  constructor() {
    this.baseColor = '#3b82f6';
    this.harmonies = {};
  }

  async pickBaseColor() {
    if (!window.EyeDropper) {
      console.warn('EyeDropper API 不可用');
      return;
    }

    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      this.baseColor = result.sRGBHex;
      this.generateHarmonies();
      this.displayPalette();
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('取色失败:', error);
      }
    }
  }

  generateHarmonies() {
    const hsl = this.hexToHsl(this.baseColor);

    this.harmonies = {
      // 单色配色
      monochromatic: this.generateMonochromatic(hsl),
      // 互补色
      complementary: this.generateComplementary(hsl),
      // 三分色
      triadic: this.generateTriadic(hsl),
      // 四分色
      tetradic: this.generateTetradic(hsl),
      // 类似色
      analogous: this.generateAnalogous(hsl)
    };
  }

  generateMonochromatic(hsl) {
    return [
      this.hslToHex({ ...hsl, l: Math.max(0, hsl.l - 30) }),
      this.hslToHex({ ...hsl, l: Math.max(0, hsl.l - 15) }),
      this.baseColor,
      this.hslToHex({ ...hsl, l: Math.min(100, hsl.l + 15) }),
      this.hslToHex({ ...hsl, l: Math.min(100, hsl.l + 30) })
    ];
  }

  generateComplementary(hsl) {
    const compH = (hsl.h + 180) % 360;
    return [
      this.baseColor,
      this.hslToHex({ h: compH, s: hsl.s, l: hsl.l }),
      this.hslToHex({ h: compH, s: hsl.s, l: Math.min(100, hsl.l + 20) }),
      this.hslToHex({ h: hsl.h, s: hsl.s, l: Math.min(100, hsl.l + 20) }),
      this.hslToHex({ h: compH, s: Math.max(0, hsl.s - 20), l: hsl.l })
    ];
  }

  generateTriadic(hsl) {
    return [
      this.baseColor,
      this.hslToHex({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }),
      this.hslToHex({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }),
      this.hslToHex({ h: hsl.h, s: Math.max(0, hsl.s - 20), l: Math.min(100, hsl.l + 20) }),
      this.hslToHex({ h: (hsl.h + 120) % 360, s: Math.max(0, hsl.s - 20), l: Math.min(100, hsl.l + 20) })
    ];
  }

  generateTetradic(hsl) {
    return [
      this.baseColor,
      this.hslToHex({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }),
      this.hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
      this.hslToHex({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
  }

  generateAnalogous(hsl) {
    return [
      this.hslToHex({ h: (hsl.h - 30 + 360) % 360, s: hsl.s, l: hsl.l }),
      this.hslToHex({ h: (hsl.h - 15 + 360) % 360, s: hsl.s, l: hsl.l }),
      this.baseColor,
      this.hslToHex({ h: (hsl.h + 15) % 360, s: hsl.s, l: hsl.l }),
      this.hslToHex({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l })
    ];
  }

  hexToHsl(hex) {
    let { r, g, b } = this.hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  hslToHex(hsl) {
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = hue2rgb(p, q, (hsl.h / 360 + 1/3) % 1);
    const g = hue2rgb(p, q, hsl.h / 360);
    const b = hue2rgb(p, q, (hsl.h / 360 - 1/3 + 1) % 1);

    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  displayPalette() {
    const container = document.getElementById('palette-container');
    if (!container) return;

    container.innerHTML = '';

    for (const [name, colors] of Object.entries(this.harmonies)) {
      const section = document.createElement('div');
      section.className = 'palette-section';

      const title = document.createElement('h3');
      title.textContent = this.getHarmonyName(name);
      section.appendChild(title);

      const colorRow = document.createElement('div');
      colorRow.className = 'color-row';

      colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.title = color;
        colorBox.textContent = color;
        colorRow.appendChild(colorBox);
      });

      section.appendChild(colorRow);
      container.appendChild(section);
    }
  }

  getHarmonyName(name) {
    const names = {
      monochromatic: '单色配色',
      complementary: '互补色',
      triadic: '三分色',
      tetradic: '四分色',
      analogous: '类似色'
    };
    return names[name] || name;
  }
}

// 使用示例
const paletteGenerator = new PaletteGenerator();
document.getElementById('pick-color').onclick = () => paletteGenerator.pickBaseColor();
```

## 最佳实践

### 1. 特性检测

```js
function isEyeDropperSupported() {
  return 'EyeDropper' in window;
}

// 使用
if (isEyeDropperSupported()) {
  // 使用 EyeDropper API
} else {
  // 提供替代方案
  showFallbackColorPicker();
}
```

### 2. 提供替代方案

对于不支持的浏览器，提供传统的颜色选择器：

```js
class SafeColorPicker {
  async pickColor(defaultColor = '#000000') {
    // 优先使用 EyeDropper API
    if (window.EyeDropper) {
      try {
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        return result.sRGBHex;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('EyeDropper 失败:', error);
        }
        return null;
      }
    }

    // 降级到传统颜色选择器
    return this.showFallbackPicker(defaultColor);
  }

  showFallbackPicker(defaultColor) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = defaultColor;

      input.addEventListener('input', () => {
        resolve(input.value);
        input.remove();
      });

      input.addEventListener('cancel', () => {
        resolve(null);
        input.remove();
      });

      input.click();
    });
  }
}
```

### 3. 设置合理的超时

长时间打开取色器可能影响用户体验：

```js
async function pickColorWithTimeout(timeoutMs = 10000) {
  const eyeDropper = new EyeDropper();
  const abortController = new AbortController();

  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, timeoutMs);

  try {
    const result = await eyeDropper.open({
      signal: abortController.signal
    });
    clearTimeout(timeoutId);
    return result.sRGBHex;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('取色操作超时或被取消');
    }
    return null;
  }
}
```

### 4. 明确的用户指引

```js
async function pickColorWithGuidance() {
  const guidanceElement = document.getElementById('guidance');

  guidanceElement.textContent = '点击屏幕上的任意位置选择颜色，按 Esc 键取消';

  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    guidanceElement.textContent = `已选择颜色: ${result.sRGBHex}`;
    return result.sRGBHex;
  } catch (error) {
    if (error.name === 'AbortError') {
      guidanceElement.textContent = '已取消取色';
    } else {
      guidanceElement.textContent = '取色失败，请重试';
    }
    return null;
  }
}
```

### 5. 安全与隐私

```js
// EyeDropper API 会在用户首次使用时请求授权
// 浏览器会显示权限提示，确保用户知情同意

// 敏感信息考虑：
// 1. 取色器可以读取屏幕上的任何颜色，包括其他应用的内容
// 2. 确保仅在用户主动触发时才调用
// 3. 不要在页面加载时自动调用取色器

// 正确的使用方式：
document.getElementById('pick-color-button').addEventListener('click', async () => {
  // 仅在用户点击按钮后调用
  const eyeDropper = new EyeDropper();
  const result = await eyeDropper.open();
});

// 错误的使用方式（避免）：
// window.addEventListener('load', () => {
//   eyeDropper.open(); // 不要自动调用
// });
```

## 相关资源

- [MDN 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper)
- [浏览器兼容性详情](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper#browser_compatibility)
- [Web.dev 教程](https://web.dev/eyedropper-api/)

## 总结

EyeDropper API 为 Web 应用提供了原生且强大的屏幕取色功能，适用于各种颜色相关的应用场景。通过合理使用该 API 并提供适当的降级方案，可以为所有用户提供优秀的取色体验。
