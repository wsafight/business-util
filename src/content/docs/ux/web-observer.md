---
title: 提升交互体验的 web Observer
description: 提升交互体验的 web Observer
---

web 领域有很多的 Observer，这些 Observer 可以实时反馈网页的某些交互变化。

- Intersection Observer 是观察元素是否进入视口的状态
- Mutation Observer，可以观察 DOM 元素的增删以及属性变化
- Resize Observer，可以观察元素的尺寸变化

下面介绍一下使用它们各自可能使用的场景。

## Intersection

由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。

IntersectionObserver 适用于惰性加载功能。惰性加载就是只有在元素进入视口时才加载资源，这样可以节省带宽，提高网页性能。

惰性加载用于最多的功能就是： 图片懒加载。特别针对于电商或其他展示类网站来说，图片资源是很重的。

当然，随着时间的推移，浏览器已经提供了原生的懒加载。

```HTML
<img src="image.jpg" alt="..." loading="lazy">
```

虽然目前网络已经不再是负担（对于个别用户来说，未必不是），但是可以减少加载与解析时间对性能的提升也是巨大的。

```HTML
<div data-astro-id="3459833264469372"></div>

<script type="module">

/* scaffolding put before the code */
((o=new IntersectionObserver((([{isIntersecting,target}])=>{isIntersecting&&(o.disconnect(),

/* code run when the section is visible */
Promise.all([
	import('https://cdn.skypack.dev/react'),
	import('https://cdn.skypack.dev/react-dom'),
]).then( ([
	{ default: React },
	{ default: ReactDOM },
]) => ReactDOM.render(
	React.createElement('strong', {},
		'This was rendered with React!',
	),
	target,
) )

/* scaffolding put after the code */
)})))=>{o.observe(document.querySelector('[data-astro-id="3459833264469372"]'))})()
</script>
```

## Mutation

## Ressize



