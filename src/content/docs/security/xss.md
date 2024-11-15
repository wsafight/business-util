---
title: 利用 XState(有限状态机) 编写易于变更的代码
description: 利用 XState(有限状态机) 编写易于变更的代码
---
# 使用白名单指定的配置清理不受信任的 HTML

[DOMPurify](https://github.com/cure53/DOMPurify) 用于清理 HTML (防止 XSS 攻击) 。您可以向 DOMPurify 提供充满任意 HTML 的字符串，它将返回一个干净 HTML 的字符串(除非另有配置)。DOMPurify 将去除包含危险的 HTML 内容，从而防止 XSS 攻击和其他污点。该库可以用于 HTML、 MathML 和 SVG。

但 [js-xss](https://github.com/leizongmin/js-xss) 则更加自由
