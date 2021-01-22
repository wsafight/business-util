# 检测图像 (视频) 加载完成 egjs-imready

[egjs-imready](https://github.com/naver/egjs-imready) 库用于检查容器中的所有图像和视频是否加载完成。

## 使用方法

```ts
const im = new eg.ImReady();

// 获取所有的图片节点
const images = document.querySelectorAll("img")

// 检查所有的图像，然后进行操作
im.check(images).on("readyElement", e => {
  progressElement.innerHTML = `${Math.floor(e.readyCount / e.totalCount * 100)}%`;
}).on("ready", e => {
  titleElement.innerHTML = "I'm Ready!";
});
```

业务场景
- 使用 [puppeteer](https://github.com/puppeteer/puppeteer) 工具在服务端把网页生成 pdf，需要检查所有图片是否加载成功 
- todo

## 原理解析
HTMLImageElement 的只读属性 complete 是一个布尔值， 表示图片是否完全加载完成。

以下任意一条为 true 则认为图片完全加载完成：
- 没有 src 也没有 srcset 属性
- 没有 srcset 且 src 为空字符串
- 图像资源已经完全获取，并已经进入（呈现 / 合成）队列
- 图片元素先前已确定图像是完全可用的并且可以使用
- 由于错误或者禁用图像，图像未能显示

注意，由于图片可能是异步接收的，所以在脚本运行时 complete 的值可能会发生变化。

<div style="float: right">更新时间: {docsify-updated}</div>
