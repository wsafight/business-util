# 组合键提升用户体验

在开发一些企业 Sass 项目或者浏览器辅助工具类中，为了简化 pc 端操作，我们甚至可以提供用户组合键位，如此以来，用户可以更快完成需求的操作。

如 [vimium](https://github.com/philc/vimium) 提供了用 vim 的方式操作浏览器，让鼠标彻底失去效果。

这里推荐使用 [Keymage](https://github.com/piranha/keymage) 。

```ts
// bind on 'a'
keymage('a', function() { alert("You pressed 'a'"); });

// returning false prevents default browser reaction (you can always use
// e.preventDefault(), of course)
keymage('ctrl-e', function() { return false; });

// binding on 'defmod' binds on Command key on OS X and on Control key in other
// systems
keymage('defmod-j', function() { alert("I am fired"); });
```

不过如何设计出让用户用的爽的快捷键则是更加复杂的问题。