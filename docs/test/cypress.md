# 新的端到端测试框架 Cypress

时至今日，测试活动从最开始的人工操作“点点点”逐渐演化为单元测试(Unit Test)，API 测试/继承测试，UI 测试组成的多层次测试活动。

单元测试（一般指方法，类）作为测试金字塔的最底层，投资小收益高，可以较早发现代码缺陷。

单元测试会帮助开发者重新思考每一个类以及每一个函数应该具有的功能与参数校验。之前的代码我总是在项目的主入口进行校验，对于每个类或者函数的参数没有深入思考。事实上，这个健壮性是不够的。因为你不能决定用户怎么使用你的库。

但是对于组件以及页面来说，单元测试还是不够的，我们需要 UI 测试框架。UI 测试的目的是：**以软件使用者的角度来检查软件**。

于是我开始学习 [Cypress](https://www.cypress.io/) 。

当然，新技术的学习总是需要一些理由的，在我看来，学习 Cypress 的理由如下：

- 功能完备

  对比之前的框架 Selenium / WebDriver，Cypress 是一站式的，具备断言库（Mocha），Mock，单元测试，端到端测试。无需选择多个框架。

- 性能高
  
  对比之前的端到端框架，Cypress 架构不使用 Selenium 或 WebDriver，采用新的架构，性能更高，处理更快。
 
- 易上手

  Cypress 热更新，当测试代码修改后，框架会重新加载代码并运行测试。

  Cypress 具备时间穿梭功能，在运行时会自动拍摄快照，测试运行结束后，只需将鼠标悬停在“命令日志”中的命令上，即可准确查看当时的界面状态。
  
  Cypress 具有自动等待的功能(亮点)，不需要在代码中编写 sleep 或者 wait 等代码，Cypress 会自动等待元素可操作后才会继续执行命令。

  Cypress 运行时可截屏或者录屏。开发者可以回放执行视频。


## 其他的框架

Karma

Nightwatch

Protractor

Puppeteer




学习中，敬请期待。。。


<div style="display: none">
赛普拉斯执行速度有待商榷

https://blog.checklyhq.com/cypress-vs-selenium-vs-playwright-vs-puppeteer-speed-comparison/
</div>
<div style="float: right">更新时间: {docsify-updated}</div>
