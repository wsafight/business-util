# 利用增量构建工具 Preset 打造自己的样板库

你是如何开始一个项目呢？是基于当前技术栈提供的脚手架还是从 **npm init** 开始呢？

以前我没得选，必须面向搜索引擎，然后基于 webpack 或 rollup 来一步步构建项目，中间还有很多错误。但现在我只想专注于当前业务，挑选合适的脚手架构建自己的项目模板，之后把大量维护性的工作交给开源作者。

当然，知名的脚手架工具（Vue CLI,Umi，Vite 等）自不必说，这里我推荐几个顺手的工具。

-  [microbundle-crl](https://www.npmjs.com/package/microbundle-crl)  专注于 React 组件的构建
- [tsdx](https://github.com/formium/tsdx) 专注于 TypeScript  库的构建
- [crateApp](https://createapp.dev/webpack) 根据当前选项配置生成项目包 (多个基础构建工具 Webpack,Parcel,Snowpack)

但无论是哪一个样板库和工具，都不能完全符合业务的需求，我们需要基于当前的样板进行修改。比如说在项目中要添加开源协议，修改项目名称，添加不同的依赖。

目前有两个问题：

- 大量重复性操作

如果生成项目的工作频率很高的话，例如一周写一个业务性组件。虽然每次在项目中要添加开源协议，修改项目名称，添加特定依赖都是一些小活，但多的时候也是一件麻烦的事情。

- 底层依赖无法直接升级

如果我们修改了当前模板，那么脚手架出现破坏性更新时候就无法直接升级（这种问题当然也比较少）。开发过程中当然会记录一些修改。但随着时间的偏移，开发者不会确切知道需要编辑或删除哪些文件才能使升级后的项目正常工作。

话不多说，我们来看一看工具 [Preset](https://preset.dev/)  是如何解决这一系列的问题的。

## 使用 Preset 

首先我们建立一个项目 vite-preset，package.json 如下所示

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

然后我们先把使用 vite 构建一个项目，此处作为模板：

```bash
# npm 6.x
npm init @vitejs/app my-vue-app --template vue
```

然后我把当前命令生成的结果拷贝到根目录下的 templates(即 templates/vite ) 文件夹下。

然后我们开始编写命令, preset.ts，此文件对应 package.json 中的 preset": "preset.ts" 

```ts
import {Preset, color} from 'apply'

// 当前 Preset 命令的名称，可以自定义
Preset.setName('jump-jump vite preset')

// 从 templates/vite 中提取所有文件，并携带以 . 开头的文件 如 .gitignore 等	
Preset.extract('vite')
  .withDots()


// 更新当前 package.json 文件，添加依赖 tailwindcss,移除依赖 sass
Preset.editNodePackages()
  .add('tailwindcss', '^2.0')
  .remove('sass')

// 安装所有依赖
Preset.installDependencies()

// 运行提示
Preset.instruct([
  `Run ${color.magenta('yarn dev')} to start development.`,
]).withHeading("What's next?");
```

完成了！

我们可以来试试效果，我寻找一个合适的文件夹，然后运行指令:

```bash
npx apply C:\re-search\vite-preset
```

![image-20210520003237093](C:\Users\wsa\AppData\Roaming\Typora\typora-user-images\image-20210520003237093.png)

vite 模板被解压到当前文件夹下，此时依赖也被替换掉了，当然，我们也可以指定文件夹下安装，如

```bash
npx apply C:\re-search\vite-preset vite-demo
```

vite 模板被解压到当前文件夹下的 vite-demo 中去了。

我们不但可以使用本地路径，当然，我们也可以使用 github 路径。如：

```bash
npx apply git@github.com:useName/projectName.git

// 等同于
npx apply username/projectName
```



我们看到了实际的效果，实际上我们能够操作的远不止当前展示的，那么我开始逐个解读一下 api。

## 玩转 Preset 

### setName 工程名设置

正如上面展示的图片。 成功后会显示在控制台中。

```ts
Preset.setName('jump-jump preset')
```

### setTemplateDirectory 模板目录设置

上面的命令中我们没有使用该 api，则默认选项为 templates

```ts
// 文件提取根路径被改为了 stubs 而不是 templates
Preset.setTemplateDirectory('stubs');
```



###  extract 文件夹提取 

此操作允许将文件从预设的模板目录提取到目标目录。在大多数情况下，这个命令已经可以解决绝大部分问题。

```ts
// 当前会提取整个根模板 即 templates 或者 stubs
Preset.extract();

// 当前会提取 templates/vite 文件夹到根目录
Preset.extract('vite'); 

// 先提取 templates/presonal，然后提取  templates/presonal 文件夹
Preset.extract('vite'); 
Preset.extract('presonal'); 

// 等同于 Preset.extract('vite')
Preset.extract().from('vite'); 

// 提取到根路径下的 config 文件夹
Preset.extract().to('config');

// 遇到文件已存在的场景 [ask 询问， override 覆盖， skip 跳过]
// 注意：如果询问后拒绝，将会中止当前进度
Preset.extract().whenConflict('ask');

// 在业务中，我们往往这样使用,是否当前式交互模式？
// 是则询问，否则覆盖
Preset.extract().whenConflict(Preset.isInteractive() ? 'ask' : 'override')


// 如果没有此选项，以 .开头的文件(如 .gitignore .vscode) 文件将被忽略。
// 注意：建议在模板中使用 .dotfile 结尾。 
// 如： gitignore.dotfile => .gitignore
Preset.extract().withDots();
```

## editJson 编辑 JSON 文件

使用 editJson  可以覆盖和删除 JSON 文件。

```TS
// 编辑 package.json 深度拷贝数据
Preset.editJson('package.json')
  .merge({
    devDependencies: {
      tailwindcss: '^2.0'
    }
  });

// 编辑 package.json 删除 开发依赖中的 bootstrap 和 sass-loader
Preset.editJson('package.json')
  .delete([
    'devDependencies.bootstrap',
    'devDependencies.sass-loader'
  ]);
```

当然，项目提供了简单的控制项 editNodePackages 

```TS
Preset.editNodePackages()
  // 会删除 bootstrap 
  // 无论是 dependencies, devDependencies and peerDependencies
  .remove('bootstrap')
  // 添加 dependencies  
  .add('xxx', '^2.3.0')
  .addDev('xxx', '^2.3.0')
  .addPeer('xxx', '^2.3.0')
  // 设置键值对         
  .set('license', 'MIT')
  .set('author.name', 'jump-jump')
```



### installDependencies 安装依赖

在搭建项目的同时我们需要安装依赖，通过 installDependencies 完成。

```ts
// 安装依赖，默认为 node，也支持 PHP
Preset.installDependencies();

// 询问用户是否安装
Preset.installDependencies('php')
  .ifUserApproves();
```

### instruct 引导

这个我们通过配置不同的颜色与标语来一步步引导用户进行下一步操作：

```ts
import { Preset, color } from `apply`;

Preset.instruct([
  `Run ${color.magenta('yarn dev')} to start development.`,
]).withHeading("What's next?");
```



### options 设置配置

如果没有配置变化，那么 Preset 也不会那么好用。

```TS
// 默认设置 auth 为 true
Preset.option('useEsbuild', true);
Preset.option('use', 'esbuild');

// 如果配置项 useEsbuild 为 ture 解压 templates/esbuild
// 也有 ifNotOption 取反
Preset.extract('esbuld').ifOption('useEsbuild');

// use 严格相等于 esbuild 解压 templates/esbuild
Preset.extract('esbuld').ifOptionEquals('use','esbuild');

Preset.extract((preset) => {
  // 如果配置项 useEsbuild 为 ture 解压 templates/esbuild
  if (preset.options.useEsbuild) {
    return 'esbuild';
  }

  return 'vite';
});
```

我们可以在执行 npx 是添加配置项，如下所示

| 标志          | 价值观             |
| ------------- | ------------------ |
| `--auth`      | `{ auth: true }`   |
| `--no-auth`   | `{ auth: false }`  |
| `--mode auth` | `{ mode: 'auth' }` |

### input confirm 交互设置

Preset 设置配置项很棒了。但就用户体验来说，通过交互设置则更好。

我们通过输入将数据添加到 Preset.prompt 中。

```TS
// 第一个参数将传入 Preset.prompt
Preset.input('projectName', 'What is your project name?');

// 第三个是可选的上下文字符串，用于定义提示的默认值。
// 如果预设是在非交互模式下启动的，它将被使用。
Preset.input('projectName', 'What is your project name?', 'jump project');

// 编辑脚本
Preset.editNodePackages()
	.set('name', Preset.prompt.projectName)
	.set('license', 'MIT')
	.set('author.name', 'jump-jump')

// 第一个参数将传入 Preset.prompt
// 第三个是可选的上下文布尔值，用于定义提示的默认值。
// 如果预设是在非交互模式下启动的，它将被使用。
Preset.confirm('useEsLint', 'Install ESLint?', true);
```



### delete edit 修改文件

删除生成文件夹中的文件直接使用 delete

```TS
Preset.delete('resources/sass');
```

编辑文件

```TS
// 替换文本字符串
Preset.edit('config/app.php').update((content) => {
	return content.replace('en_US', 'fr_FR');
});

// 替换 README.md 文件中的 {{projectName}}
Preset.edit('README.md').replaceVariables(({ prompts }) => ({
	projectName: prompts.name ?? 'Preset',
}));
```

### execute 执行 bash 命令

如果之前的工具都不能满足你，那么 bash 命令一定可以满足你的需求！！

```TS
// 利用钩子将数据存储到 context 中
Preset.hook(({ context, args, options }) => {
	const allowedOptions = ['auth', 'extra'];

	context.presetName = args[2];
	context.options = Object.keys(options)
		.filter((option) => allowedOptions.includes(option))
		.map((option) => `--${option}`);
});

// 第一个参数是程序或者命令名称，后面是参数，从 context 中读取
Preset.execute('php')
	.withArguments(({ context }) => [
		'artisan', 
		'ui', 
		context.presetName, 
		...context.options
	])
    // 修改当前标题，当前执行时会在控制台打印如下字符串，而不是默认字符串
	.withTitle(({ context }) => `Applying ${context.presetName}`);
```

## 思考

### 增量思想

我们应该进一步学习增量思想，在这里「增量」这个概念的对立面是「全量」。增量会根据比对当前与过去之间的差异，只关注差异性。

增量体现在开发的各个层面： 如前后端交互时候前端只提交变化的数据。

在工程中提升代码检查和打包构建的效率。网盘增量上传。数据库增量备份。rsync 增量修改文件。

### 链式调用

链式调用是好东西，特别是构建 dsl 时。可能有好东西 

时序问题  

灵活保存配置

复杂且符合逻辑
