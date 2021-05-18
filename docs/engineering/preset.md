# 玩转样板增量构建工具 Preset

你是如何开始一个项目呢？是基于当前技术栈提供的脚手架还是从 **npm init** 开始呢？

当然，根据个人拥有的知识以及时间的不同，我们会有不同的选择，如果是 3年前，我们会面向搜索引擎基于 webpack 或者 rollup 来一步步构建当前项目，但今天，我们可能会使用 vue-cli 或者 crf ,甚至是 Umi。如果是组件库或者业务工具，我会使用 microbundle-crl 或者 tsdx 。因为使用这些我们可以快速开发而不选哟。

当然了，如果需求特殊，我们也可以使用 这种工具。可以基于当前需求使用不同的样式模板。

但无论是哪一个样板库，都不能完全符合自己的需求，我们需要基于当前的样板进行修改。比如说我们要添加开源协议，修改项目名称，添加基础性组件。

两个问题：

- 大量重复性操作，如果我们开发多个业务工具，我们需要每次都添加，如果频率高
- 依赖无法升级，我们在当前版本下使用了脚手架，我们就再也无法升级脚手架。随着时间的偏移，我们汉南知道当前升级带来了什么变化

那么，我们该如何解决的两个问题：复用和依赖可升级

我们来一个一个解决：

## 复用性

如果当前模板需要多次使用，我们第一个想法肯定是基于当前目标那修改：

以 tsdx 为例子

```bash
npx tsdx create mylib
```

我们很快搭建出一个 ts 库项目，内部会包含 测试等功能。无需。但是这里缺少一些东西，例如开源协议，例如基层依赖，版本号，还有我们可能需要为当前库添加自行化工。

但是没有办法修改项目名称，描述等信息，我们无法在此就直接。

我们把当前的修改完成的代码提交上去，虽然。但是下次我们有一部分就无需修改了当前代码，但是下次升级呢？

## 依赖可升级

必须对样板的功能进行充分的文档记录，但是即使那样，用户也不会确切知道要编辑或删除哪些文件才能使样板正常工作，除非也对其进行了记录-这将是很多工作。

作为维护者，也很难跟踪对原始代码库所做的更改。在更新中忘记某些内容很容易，并且可以通过这种方式引入无效代码。



复用问题其实还比较简单，我们根据当前的需求来提取大量文件，形成属于自己的模板库，那么依赖可升级应该怎么处理呢？

### 增量思想

我们应该进一步学习增量思想，在这里「增量」这个概念的对立面是「全量」。增量会根据比对当前与过去之间的差异，只关注差异性。

增量体现在开发的各个层面： 如前后端交互时候前端只提交变化的数据。

在工程中提升代码检查和打包构建的效率。网盘增量上传。数据库增量备份。rsync 增量修改文件。

那么我们能不能用增量的思想来修改样板？答案是可以的，我们来看一看强大的 Preset。

## 一步步使用 Preset

我们可以先看结果，在依次来解读当前代。



在基础模板 mylib 的情况下

我们可以看改工具 Preset。

首先建立一个 package.json:

```json
{
  "name": "vite-preset",
  "version": "0.0.1",
  "author": "jump-jump",
  "license": "MIT",
  "preset": "preset.ts",
  "prettier": {
    "printWidth": 80,
    "tabWidth": 2,
    "trailingComma": "all",
    "singleQuote": true,
    "arrowParens": "always",
    "useTabs": false,
    "semi": true
  },
  "devDependencies": {
    "apply": "^0.2.15"
  }
}
```

然后我们新增：

### 设置工程名

设置预设的名称。当用户使用预设时，它将显示在控制台中

```ts
Preset.setName('jump-jump preset')
```



### 文件提取 extract

此操作允许将文件从预设的模板目录提取到目标目录。在大多数情况下，这是预设将使用的仅有动作之一。

我们可以设置当前提取文件夹：

如果不设置则默认为 templates，我们可以通过默认文件夹

```ts
Preset.setTemplateDirectory('stubs');
```





```ts
// 当前会提取整个模板 即 templates 或者 stubs
Preset.extract();
// 当前会提取 templates/vite 文件夹
Preset.extract('vite'); 
// 目标文件已存在时动作应具有的行为
// ask 询问，如果选择 N 则会中止当前操作
// override 默认覆盖
Preset.extract().whenConflict('ask');
// 在业务中，我们往往这样使用,是否当前式交互模式？是则询问，否则覆盖
Preset.extract().whenConflict(Preset.isInteractive() ? 'ask' : 'override')

// 如果没有此选项，则类似.gitignore或的文件.vscode将被忽略。
// 不过建议在模板中使用 gitignore.dotfile => .gitignore
Preset.extract().withDots();
```



大部分情况下，如果仅仅只是覆盖和

## 使用配置

我们应该使用配置来决定使用哪一个模板。

可以参考一下：

```TS
Preset.extract((preset) => {
  if (preset.options.auth) {
    return 'auth';
  }

  return 'default';
});
```



| 标志          | 价值观             |
| ------------- | ------------------ |
| `--auth`      | `{ auth: true }`   |
| `--no-auth`   | `{ auth: false }`  |
| `--mode auth` | `{ mode: 'auth' }` |

### 编辑 json

`editJson`在`Preset`单例上调用该方法。第一个参数指定将要更新的JSON文件的路径。

```TS
Preset.editJson('package.json')
  .merge({
    devDependencies: {
      tailwindcss: '^2.0'
    }
  });

Preset.editJson('package.json')
  .delete([
    'devDependencies.bootstrap',
    'devDependencies.sass-loader'
  ]);
```



此外，您可以调用`editNodePackages`或`editPhpPackages`不使用参数来更新目标目录中的依赖项。

```ts
Preset.editNodePackages()
	// 会删除 bootstrap
	.remove('bootstrap')
	.add()
	.addDev('tailwindcss', '^2.0')
	.addPeer()
	.set('license', 'MIT')
	.set('author.name', 'Komi Shouko')
```

当然是更加复杂的情况呢，我们这样解决

```ts
Preset.input('projectName', 'What is your username?');// 编辑脚本Preset.editNodePackages()	.set('name', Preset.prompt.projectName)	.set('license', 'MIT')	.set('author.name', 'Komi Shouko')
```

## 删除无用文件

```
Preset.delete('resources/sass');
```

### 编辑文件

```TS
Preset.edit('config/app.php').update((content) => {	return content.replace('en_US', 'fr_FR');});
```





```ts
// Will replace "{{ projectName }}" with "Preset"Preset.edit('README.md').replaceVariables(({ prompts }) => ({	projectName: prompts.name ?? 'Preset',}));
```

### 安装依赖

```ts
Preset.installDependencies();// 询问用户Preset.installDependencies('php')  .ifUserApproves();
```



### 指导

```ts
import { Preset, color } from `apply`;Preset.instruct([  `Run ${color.magenta('yarn dev')} to start development.`,]).withHeading("What's next?");
```

事实上，到了这里，我的需求基本上已经差不太多了。对于特定的需求，我们也要执行 Shell 命令。

## 获取上下文参数

```TS
Preset.hook(({ context, args, options }) => {
	const allowedOptions = ['auth', 'extra'];

	context.presetName = args[2];
	context.options = Object.keys(options)
		.filter((option) => allowedOptions.includes(option))
		.map((option) => `--${option}`);
});

Preset.execute('php')
	.withArguments(({ context }) => [
		'artisan', 
		'ui', 
		context.presetName, 
		...context.options
	])
	.withTitle(({ context }) => `Applying ${context.presetName}`);
```

### 修改默认

````TS
Preset.extract('vite')
  .withDots()
  .whenConflict(Preset.isInteractive() ? 'ask' : 'override')
  .withTitle('Extract templates')
````

<div style="float: right">更新时间: {docsify-updated}</div>

