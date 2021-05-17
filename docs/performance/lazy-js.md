https://codepen.io/jonneal/full/ZELvMvw

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