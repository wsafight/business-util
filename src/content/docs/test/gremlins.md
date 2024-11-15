---
title: 猴子测试工具 gremlins
description: 猴子测试工具 gremlins
---

在开发 HTML5 应用程序时，您是否预料到了不常见的用户交互？您是否设法检测并修补所有内存泄漏？如果没有，应用程序可能迟早会崩溃。如果 n 个随机操作可以使应用程序失败，最好在测试期间确认它，而不是让用户发现它。

Gremlins.js 模拟随机用户操作：gremlins 单击窗口中的任意位置，在表单中输入随机数据，或将鼠标移动到不期望的元素上。他们的目标：触发 JavaScript 错误，或使应用程序失败。如果小鬼不能破坏应用程序，恭喜！该应用程序足够健壮，可以发布给真实用户。

这种做法，也称为Monkey 测试或Fuzz 测试，在移动应用程序开发中非常常见（参见Android Monkey 程序）。现在前端（MV*、d3.js、Backbone.js、Angular.js 等）和后端 (Node.js) 开发使用持久性 JavaScript 应用程序，这种技术对 Web 应用程序很有价值。