# 高性能 Web 渲染引擎 kraken

对比其他渲染引擎，kraken 具备很大的优势。一边可以使用 W3C 标准和常用 web 框架（Vue、React 和 Rax），另一方面底层使用 [Flutter](https://flutter.dev/) 来构建。具备强大渲染性能。

我们也可以查看多个跨平台工具操作系统支持：

|  |  | [Electron](https://github.com/electron/electron) | [NW.JS](https://github.com/nwjs/nw.js) | [Tauri](https://github.com/tauri-apps/tauri) | [NodeGui](https://github.com/nodegui/nodegui) |  [Neutralino](https://github.com/neutralinojs/neutralinojs) | [Flutter](https://github.com/flutter/flutter) | [.Net MAUI](https://github.com/dotnet/maui) |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Developement Environment** | ***Windows*** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| | ***MacOS*** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| | ***Linux*** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **Target Environment** | ***Windows*** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| | ***MacOS*** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| | ***Linux*** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | Soon |
| | ***Android*** | ❌ | [Requested](https://github.com/nwjs/nw.js/issues/94) | Soon<sup>1</sup> | ❌ | ❌ | ✔️ | ✔️ |
| | ***iOS*** | ❌ | ❌ | In progress<sup>1</sup> | ❌ | ❌ | ✔️ | ✔️ |
| | ***tvOS*** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✔️ |
| | ***Web*** | ❌ | ❌ | ❌ | ❌ | ✔️<sup>2</sup> | ✔️ | ❌ |

需要 mac 电脑调试，后续更新。