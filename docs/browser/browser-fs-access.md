# 浏览器文件操作

记得几年前，我需要读取用户的本地文件来进行业务处理。但是当时却没有合适的浏览器工具，只能去学习浏览器插件（最终需求使用的是 C# 开发桌面应用程序）。

浏览器操作本地文件是非常有价值的。文件系统访问 API 是一种 Web API，它允许对用户的本地文件进行读写访问。它解锁了构建强大 Web 应用程序的新功能，例如文本编辑器或IDE、图像编辑工具、改进的导入/导出，所有这些都可以在浏览器上直接进行。

我们先来看看如何使用。

## 文件读取

```js
// 文件句柄
let fileHandle;

async function getFile() {
  // 打开文件选择器并且选择文件
  [fileHandle] = await window.showOpenFilePicker();

  // 当前是文件
  if (fileHandle.kind === 'file') {
  } else if (fileHandle.kind === 'directory') {
  }

}
```

showOpenFilePicker 还有配置项参数：

```js
const pickerOpts = {
  // 是否选择多个文件
  multiple: false,
  // 是否需要其他参数，如果为假则 types 无法使用
  excludeAcceptAllOption: true,
  // 文件类型选择
  types: [
    {
      description: 'Images',
      accept: {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg']
      }
    },
  ],
  
};
```

我们还可以调用句柄的 remove 来删除文件。

## 保存文件

```js
async function saveFile() {
  // 展示保存文件的选择器
  const newHandle = await window.showSaveFilePicker();

  // 创建文件流
  const writableStream = await newHandle.createWritable();

  // 写入文件（有多项配置）
  await writableStream.write(imgBlob);

  // 关闭文件
  await writableStream.close();
}
```

当前也存在文件夹相关操作 API，这里就不做介绍了，具体 api 参数可以参考 [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)。

## 浏览器支持以及 ponyfills

浏览器支持较低，IE 和 Firefox 目前尚未支持文件系统访问 API。

需要尝试添加 [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) 库方便使用。

```
import {
  fileOpen,
  directoryOpen,
  fileSave,
} from 'https://unpkg.com/browser-fs-access';

(async () => {
  // 打开文件
  const blobs = await fileOpen({
    mimeTypes: ['image/*'],
    // 多个文件
    multiple: true,
  });

  // 获取文件夹
  const blobsInDirectory = await directoryOpen({
    recursive: true
  });

  // 保存文件
  await fileSave(blob, {
    fileName: 'Untitled.png',
  });
})();
```