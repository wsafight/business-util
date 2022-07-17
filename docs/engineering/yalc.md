# 依赖库本地调试 yalc

基于当前业务不断抽取公共组件是一项持续的工程任务。

最开始，我们可以直接在项目中添加 components 和 services 文件夹。

随着时间的推移， 公共组件以及公共服务不断变多的情况下。构建和打包(等待 esbuild 成熟)时间也不断变长，此时我们可以把公共的依赖分离出去形成多个库。

我们可以把其分成基础组件，业务组件以及业务块。打成三个库。但要注意前后依赖，前者不可以依赖后者。如此一来，我们可以直接在业务系统页面中依次引入脚本和样式。

库构建后使用 nginx 进行反向代理是一种解决方案。但 nginx 配置起来也较为繁琐。我一直希望有一种前端解决方案。直到我看到了 [yalc](https://github.com/wclr/yalc) 。

## yalc 使用

单个库 yalc 操作与使用

```bash
# 使用 npm 或 yarn 全局安装 yalc
npm i yalc -g

yarn global add yalc

# 直接使用 publish 发布组件库到本地
yalc publish

# 当有新修改的包需要发布时，使用推送命令可以快速的更新所有依赖
yalc push

# 进入项目添加包
yalc add [my-package]

# 锁定版本，避免因为本地新包推送产生影响
yalc add [my-package@version]

# 更新依赖
yalc update [my-package]

# 移除依赖
yalc remove [my-package]

# 移除所有依赖
yalc remove --all
```

yalc 包管理：

```bash
# 查看本地仓库里存在的包时
yalc installations show

# 清理不需要的包
yalc installations clean [my-package]
```

<div style="float: right">更新时间: {docsify-updated}</div>
