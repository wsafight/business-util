# 根据页面可见性延迟加载资源

针对于项目来说，往往一些代码不需要在首屏加载。

```js
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

<div style="float: right">更新时间: {docsify-updated}</div>
