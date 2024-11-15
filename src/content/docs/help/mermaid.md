---
title: 开发助力 mermaid 绘制图表
description: 开发助力 mermaid 绘制图表
---

从事软件开发时候，设计业务一旦稍微复杂些，都会被要求画流程图整理逻辑。

但当本人绘制时，往往会遗漏一些不关键信息，导致后期修改，但图形的修改比较麻烦，又需要一定时间，所以，找到一款不错的 DSL 语言用来绘制开发图是一件相对必要的事情，对于逻辑和构图都很有利。

这里我将要使用 [mermaid](https://mermaid-js.github.io/mermaid/#/) 绘制各种图形。

大家可以直接使用 [mermaid-live-editor](https://mermaid-js.github.io/mermaid-live-editor/) 在网页中进行开发转换 (本来想自己写一个)。

## 流程图

流程图自不必说，下图是一个通用的表单填写流程 (不包含一些特殊处理):

[![](https://mermaid.ink/img/pako:eNp9kttOwkAQhl-l2Wt4gZJ4A2-AV1IuNu1CiT1gaU1IaYImiF4QNcpBAyF4QKOhGE1MCMa-DLuUt3B7AkHiXs3ufP_MP5sxAa8KCLAgr8GiyOymEpzC0MNrCOoo4w6ecaM5_2q535dZJh7fYZBQ0DN48IpPboJkNlR4CZ8QoSJIKA0PUWZ-PMH16czp4VEn4lZpny7RICkift_ETs0dHpHqE7mvkv6jFfJLwMMri-qt69QrgqrQ6tMr0utnE8w2kHRfQtYzFjEbJpNQ4ZEU2sTnLfJ5um4zAHwF74eB1XWHvzJB6_cB6Z7NHJtcT0jzjTTsrX7_yDY0BwbSyklJLSHTHd8t2jbpjPHFENc-Fu2RFVVZUX6RYJT5wHbtB79r4h8smDj4IBADMtJkWBDoMpieiAO6iGTEAZaGAspBQ9I5wCkWRaGhq-mywgNW1wwUA5pq5EXA5qBUojejKNDlSRUgXSp5-VqEyp6qRnfrBzgxEmc?type=png)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNp9kttOwkAQhl-l2Wt4gZJ4A2-AV1IuNu1CiT1gaU1IaYImiF4QNcpBAyF4QKOhGE1MCMa-DLuUt3B7AkHiXs3ufP_MP5sxAa8KCLAgr8GiyOymEpzC0MNrCOoo4w6ecaM5_2q535dZJh7fYZBQ0DN48IpPboJkNlR4CZ8QoSJIKA0PUWZ-PMH16czp4VEn4lZpny7RICkift_ETs0dHpHqE7mvkv6jFfJLwMMri-qt69QrgqrQ6tMr0utnE8w2kHRfQtYzFjEbJpNQ4ZEU2sTnLfJ5um4zAHwF74eB1XWHvzJB6_cB6Z7NHJtcT0jzjTTsrX7_yDY0BwbSyklJLSHTHd8t2jbpjPHFENc-Fu2RFVVZUX6RYJT5wHbtB79r4h8smDj4IBADMtJkWBDoMpieiAO6iGTEAZaGAspBQ9I5wCkWRaGhq-mywgNW1wwUA5pq5EXA5qBUojejKNDlSRUgXSp5-VqEyp6qRnfrBzgxEmc)

该图的 DSL 语句异常的简单

```
graph TD;
    create[表单编辑] --> edit[填写表单];
    edit --> handleSave[点击保存];
    handleSave --> saveCheck{必要性检查};
    saveCheck -->|通过|done[结束]; 
    saveCheck -->|未通过|edit; 
    edit --> handleCancel[点击取消];
    handleCancel --> cancelCheck{检查};
    cancelCheck -->|没有修改数据|done[结束]; 
    cancelCheck -->|有修改数据|queryClose{询问是否关闭}; 
    queryClose -->|点击确认|done;
    queryClose -->|点击取消|edit;
```

## 时序图

> 时序图显示进程如何相互操作以及以什么顺序进行操作

下图描述了微信登陆机制:

[![](https://mermaid.ink/img/pako:eNqdk9tKw0AQhl9l2SvF6gPkwivfwDsJyJKsNdhmY7JBRYRUqMVTo6Jiq6hVKiL0ICKtB-zLdLfbt3BjbK0mFjQ3md2Z-ebfGWYVakTHUIEOXnSxqeEpAyVtlFZNID8L2dTQDAuZFLC637ndZs9-jOvVY_6-8LL8bJdtlVjhNibmrdpulcIAni8z_zqM6WPHJyf7tgKWlidSJGmYI6NA5BvMPwaBzpiUSOmPXDt4jUNltvR2vcxgdiQjwETUKaBTeOkWNliuImoZflnq3u2EHoAsy9DBWPB3sGZjKu0BfgT1i0wHO45BzNkFvCIBxMKmpHYqm8MwMTJF7o5Vi-2nzVAv9zLtZv4Tl_hWhGUfROZwWBe--i9ah-z0PMoeOrQf4cyvs8oJy5aBQ4mNkv8cn3hstJtF6RW1Br9f53vPrHnzq7LYd8VU6XpF0cpFMfyiLGpXvXGwg53BFv6ld6FmflTnu1WYgGlsp5Ghy01bDSgqpPM4jVWoSFPHc8hNURWq5poMRS4l0yumBhVquzgBbeIm56Eyh1KOPLmWjmhvTfu3csdmCOmd194BrOEG4Q?type=png)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqdk9tKw0AQhl9l2SvF6gPkwivfwDsJyJKsNdhmY7JBRYRUqMVTo6Jiq6hVKiL0ICKtB-zLdLfbt3BjbK0mFjQ3md2Z-ebfGWYVakTHUIEOXnSxqeEpAyVtlFZNID8L2dTQDAuZFLC637ndZs9-jOvVY_6-8LL8bJdtlVjhNibmrdpulcIAni8z_zqM6WPHJyf7tgKWlidSJGmYI6NA5BvMPwaBzpiUSOmPXDt4jUNltvR2vcxgdiQjwETUKaBTeOkWNliuImoZflnq3u2EHoAsy9DBWPB3sGZjKu0BfgT1i0wHO45BzNkFvCIBxMKmpHYqm8MwMTJF7o5Vi-2nzVAv9zLtZv4Tl_hWhGUfROZwWBe--i9ah-z0PMoeOrQf4cyvs8oJy5aBQ4mNkv8cn3hstJtF6RW1Br9f53vPrHnzq7LYd8VU6XpF0cpFMfyiLGpXvXGwg53BFv6ld6FmflTnu1WYgGlsp5Ghy01bDSgqpPM4jVWoSFPHc8hNURWq5poMRS4l0yumBhVquzgBbeIm56Eyh1KOPLmWjmhvTfu3csdmCOmd194BrOEG4Q)

代码如下所示:
```
sequenceDiagram
    participant 小程序
    participant 开发者服务器
    participant 微信服务接口
    小程序->>小程序: wx.login() 获取 code
    小程序->>开发者服务器: wx.request() 发送 code
    开发者服务器->>微信服务接口: 登陆凭证校验接口 appid + appsecret + code
    微信服务接口->>开发者服务器: session_key + openid 等
    微信服务接口->>微信服务接口: 自定义登陆态与 openid, session_key 关联
    开发者服务器->>小程序: 返回自定义登陆态
    小程序->>小程序: 自定义登陆台存入 storage
    小程序->>开发者服务器: wx.request() 发起业务请求携带自定义登陆态
    开发者服务器->>开发者服务器: 通过自定义登陆态查询 openid 和 session_key
    开发者服务器->>小程序: 返回业务数据
```

不仅如此，我们还可以开发其他类型的图表： 类图、状态图、实体关系图、gantt 图以及其他。大家可以自行学习开发。



