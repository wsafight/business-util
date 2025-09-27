---
title: 根据背景色自适应文本颜色
description: 根据背景色自适应文本颜色
---

在企业级应用中，我们经常需要处理动态生成的内容，尤其是用户自定义的标签系统。当允许用户自由选择标签背景色时，一个常见的问题是：如何确保文本在任何背景色上都具有良好的可读性？

想象一下：如果用户选择了深紫色作为背景色，但系统默认使用黑色文本，这将导致文本难以辨认；或者相反，用户选择了浅黄色背景，但文本颜色也是浅色系，同样会造成阅读困难。

本文将介绍一种智能解决方案，通过算法自动计算与背景色对比度最高的文本颜色，无需用户手动配置，从而提升整体用户体验。

## 问题解析：色彩对比度计算

解决这个问题的核心在于理解**颜色亮度**和**对比度**的概念。在计算机图形学中，有一个标准公式用于计算颜色的感知亮度（perceived luminance），这个公式基于人眼对不同颜色波长的敏感度：

```js
// 标准的 luminance 计算 - 基于人眼对 RGB 通道的敏感度加权
const luminance = r * 0.299 + g * 0.587 + b * 0.114
```

这个公式的原理是：人眼对绿色最敏感（占比58.7%），其次是红色（29.9%），对蓝色最不敏感（11.4%）。通过这个加权计算，我们可以将任何彩色转换为其对应的灰度值。

基于这个亮度值，我们可以决定使用哪种文本颜色能提供最佳对比度：

```typescript
const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#FFF'	
```

当亮度值大于186时，背景色被视为"亮色"，应使用黑色文本以获得更好的对比度；当亮度值小于等于186时，背景色被视为"暗色"，应使用白色文本。这个阈值可以根据具体需求进行调整。

## 完整实现方案

下面是一个功能完整的 `contrastTextColor` 函数实现，它支持多种颜色格式输入、错误处理和结果缓存：

```typescript
/**
 * 根据背景色自动计算最佳对比度的文本颜色
 * @param backgroundColor 支持多种格式的背景色字符串：
 * - HEX 格式：#FFF, #FFFFFF, FFF, FFFFFF
 * - RGB 格式：rgb(255, 255, 255)
 * @returns 与背景色对比度最高的文本颜色 ('#000000' 或 '#FFFFFF')
 * @throws 当输入的颜色格式无效时抛出错误
 */
export function contrastTextColor(backgroundHexColor: string) {
  let hex = backgroundHexColor
  
  // 如果当前传入的参数以 # 开头,去除当前的
  if (hex.startsWith('#')) {
    hex = hex.substring(1);
  }
  // 如果当前传入的是 3 位小数值，直接转换为 6 位进行处理
  if (hex.length === 3) {
    hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]].join('')
  }

  if (hex.length !== 6) {
    throw new Error('Invalid background color.' + backgroundHexColor);
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  
  if ([r,g,b].some(x => Number.isNaN(x))) {
     throw new Error('Invalid background color.' + backgroundHexColor);
  }

  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#FFF'
  return textColor
}


```

我们还可以在其中添加 rgb 颜色，以及转换逻辑。

```ts
/**
 * @param backgroundColor 字符串
 */
export function contrastTextColor(backgroundHexColor: string) {
  // 均转换为 hex 格式， 可以传入 rgb(222,33,44)。
  // 如果当前字符串参数长度大于 7 rgb(,,) 最少为 8 个字符，则认为当前传入的数值为 rgb，进行转换
  const backgroundHexColor = backgroundColor.length > 7 ? convertRGBToHex(backgroundColor) : backgroundColor
  
  // ... 后面代码
}

/** 获取背景色中的多个值,即 rgb(2,2,2) => [2,2,2] */
const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/

/** 转换 10 进制为 16 进制, 
  * 计算完成后时字符串前面加 0，同时取后两位数值。使得返回的数值一定是 两位数
  * 如 E => 0E  |  FF => 0FF => FF
  */
const hex = (x: string) => ("0" + parseInt(x).toString(16)).slice(-2);

function convertRGBToHex(rgb: string): string {
  const bg = rgb.match(rgbRegex);
  
  if (!bg) {
    // 返回空字符串，在后面判断长度为 6 时候会报错。不在此处进行操作
    return ''
  }
  
  return ("#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3])).toUpperCase();
}
```

当然了，我们也可以在其中添加缓存代码，以便于减少计算量。

```ts
// 使用 map 来缓存 
const colorByBgColor = new Map()
// 缓存错误字符串
const CACHE_ERROR = 'error'

export function contrastTextColor(backgroundColor: string) {
  // 获取缓存
  const cacheColor = colorByBgColor.get(backgroundColor)
  if (cacheColor) {
    // 当前缓存错误，直接报错
    if (cacheColor === CACHE_ERROR) {
      throw new Error('Invalid background color.' + backgroundColor);
    }
    return colorByBgColor.get(backgroundColor)
  }
  
  // ...
  if (hex.length !== 6) {
    // 直接缓存错误
    colorByBgColor.set(backgroundColor, CACHE_ERROR)
    throw new Error('Invalid background color.' + backgroundColor);
  }
  
  // ...
  
  if ([r,g,b].some(x => Number.isNaN(x))) {
    // 直接缓存错误
    colorByBgColor.set(backgroundColor, CACHE_ERROR)
    throw new Error('Invalid background color.' + backgroundColor);
  }

  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#FFF'
  // 缓存数据
  colorByBgColor.set(backgroundColor, textColor)
  return textColor
}
```

完整代码可以在代码库中 [转换问题颜色](https://github.com/wsafight/Daily-Algorithm/blob/master/src/fun/contrast-text-color.ts) 中看到。

当然了，如果你不需要严格遵循 W3C 准则，当前代码已经足够使用。但是如果你需要严格遵循你可以参考 http://stackoverflow.com/a/3943023/112731 以及 https://www.w3.org/TR/WCAG20/。


## css 解决方案

突然发现 css3 有一个 mix-blend-mode。即混合模式。混合模式是 PS 功能之一。目前 CSS 已经原生支持了大部分的混合模式。

```css
mix-blend-mode: normal;          //正常
mix-blend-mode: multiply;        //正片叠底
mix-blend-mode: screen;          //滤色
mix-blend-mode: overlay;         //叠加
mix-blend-mode: darken;          //变暗
mix-blend-mode: lighten;         //变亮
mix-blend-mode: color-dodge;     //颜色减淡
mix-blend-mode: color-burn;      //颜色加深
mix-blend-mode: hard-light;      //强光
mix-blend-mode: soft-light;      //柔光
mix-blend-mode: difference;      //差值
mix-blend-mode: exclusion;       //排除
mix-blend-mode: hue;             //色相
mix-blend-mode: saturation;      //饱和度
mix-blend-mode: color;           //颜色
mix-blend-mode: luminosity;      //亮度
```

而解决方案就是 difference，意为差值模式。该混合模式会查看每个通道中的颜色信息，比较底色和绘图色，用较亮的像素点的像素值减去较暗的像素点的像素值。

与白色混合将使底色反相；与黑色混合则不产生变化。

```css
.tag {
  background: #XXX;
}

.content {
  color: #fff;
  mix-blend-mode: difference;
}
```

