# 强大的异步库 async

[async](https://github.com/caolan/async) 库提供大约 70 函数，包括通常的“功能性”嫌疑人（map，reduce，filter，each...）以及为异步控制流一些常见的模式（parallel，series，waterfall...）。所有这些函数都假定您遵循Node.js约定，即提供单个回调作为异步函数的最后一个参数（一个将Error作为其第一个参数的回调），并调用一次该回调。