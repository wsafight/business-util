# 使用 gsap 操纵动画序列

补间动画指的是：在制作动画的过程中,只需要把当前动画的第一帧和最后一帧的画面做好,电脑就能帮你做出中间的部分，非常的简单有趣，而补间动画有动作补间动画与形状补间动画两种。

GSAP 是一套脚本动画工具集合。内核可以利用补间控制动画序列。同时该库还提供了省时插件、缓动工具、实用方法等附加功能。

同时，它具有非常优秀的性能。在许多情况下，它甚至比 CSS3 动画和过渡更快。获得流畅的 60fps requestAnimationFrame 驱动的动画。

GSAP 完全可以命名为“GreenSock 属性操纵器”（GSPM）。

```ts
import gsap from "gsap";

// 获取其他插件
import ScrollTrigger from "gsap/ScrollTrigger";
import Draggable from "gsap/Draggable";

// 或者从 all 中导入插件
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";

// 注册插件
gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin); 
```

## 用法

### 基本补间

```ts
gsap.to("#logo", {
  duration: 1, 
  x: 100, 
  onComplete: tweenComplete, 
  onCompleteParams: ["done!"]
})

function tweenComplete(message) {
  console.log(message)
}

const tween = gsap.from("#logo", {
  duration: 1, 
  x: 100,
  onComplete: tween.restart(),
})

gsap.set("#logo", {
  fontSize: 20,
  x: 10,
  ease: 'bounce',
})
```

## 时间序列 timeLine

```ts
const tl = gsap.timeline({
  // 默认参数
  defaults: {
    duration: 1
  }
})

tl.add( gsap.to("#id", {duration: 2, x: 100}) )
tl.to("#id", {duration: 2, x: 100}) //shorter syntax!

//chain all to() methods together on one line
tl.to(".green", {duration: 1, x: 200}).to(".orange", {duration: 1, x: 200, scale: 0.2}).to(".grey", {duration: 1, x: 200, scale: 2, y: 20})

//we recommend breaking each to() onto its own line for legibility
tl.to(".green", {duration: 1, x: 200})
  .to(".orange", {duration: 1, x: 200, scale: 0.2})
  .to(".grey", {duration: 1, x: 200, scale: 2, y: 20})
```

<div style="display: none">
https://css-tricks.com/going-meta-gsap-the-quest-for-perfect-infinite-scrolling/
</div>

<div style="float: right">更新时间: {docsify-updated}</div>