# 浏览器中的取色器 API EyeDropper

代码如下所示:

```js
document.getElementById("start-button").addEventListener("click", () => {
  // 结果显示框
  const resultElement = document.getElementById("result");

  // 当前没有 API，说明该功能不可用
  if (!window.EyeDropper) {
    resultElement.textContent =
      "Your browser does not support the EyeDropper API";
    return;
  }

  const eyeDropper = new EyeDropper();
  const abortController = new AbortController();

  eyeDropper
    // 开启一个 Promise，可以传入中止信号
    .open({ signal: abortController.signal })
    .then(({ sRGBHex }) => {
      // 获取结果值，目前是 #ffffff 这种格式
      resultElement.textContent = sRGBHex;
    })
    .catch((e) => {
      resultElement.textContent = e;
    });

  // 5 秒后结束
  setTimeout(() => {
    abortController.abort();
  }, 5000);
});
```

目前该功能在 Chrome 95 版本以上。可以查看具体的 [浏览器可用](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper#browser_compatibility)。
