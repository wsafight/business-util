---
title: 使用 pnpm patch 修补依赖库
description: pnpm patch 是 pnpm 包管理器提供的一个强大工具，用于临时修补第三方依赖库中的问题，无需等待官方发布新版本。
--- 

## 1. 什么是 pnpm patch

pnpm patch 是 pnpm 包管理器内置的一个功能，用于在不修改原始依赖库代码的情况下，临时修补第三方依赖库中的问题。它通过生成补丁文件的方式，在项目构建和安装依赖时自动应用这些修改。

pnpm 在 v7.4.0 版本中正式添加了 `pnpm patch` 和 `pnpm patch-commit` 命令，为开发者提供了一种优雅、高效的依赖库修补方案。

## 2. 为什么需要 pnpm patch

在项目开发过程中，我们经常会遇到第三方依赖库存在 bug 的情况。传统的解决方案有以下几种：

- **等待官方修复**：提 issue 或 PR，等待库作者修复并发布新版本
- **Fork 源码自行修改**：将依赖库 fork 到自己的仓库，修复问题后从自己的仓库安装
- **替换其他库**：寻找功能类似且没有该问题的替代库

然而，这些方案都存在明显的缺点：

- 等待官方修复周期长，可能影响项目进度
- Fork 源码需要维护额外的仓库，增加管理成本
- 替换库可能需要大量的代码适配工作

pnpm patch 提供了一种更高效的解决方案，它允许开发者直接在当前项目中修补依赖库，无需等待官方更新，也无需维护额外的仓库。

## 3. pnpm patch 的工作原理

pnpm patch 的工作原理类似于 Git 的差异比较（diff）机制：

1. **生成临时副本**：执行 `pnpm patch` 命令时，pnpm 会将指定的依赖库解压到一个临时目录
2. **修改代码**：开发者在这个临时目录中修改存在问题的代码
3. **生成补丁**：执行 `pnpm patch-commit` 命令时，pnpm 会比较修改前后的代码差异，生成一个补丁文件
4. **自动应用**：pnpm 会在 `package.json` 中添加配置，指向生成的补丁文件，后续安装依赖时会自动应用这些补丁

## 4. pnpm patch 的基本使用流程

### 4.1 准备工作
确保你的 pnpm 版本不低于 v7.4.0，可以通过以下命令检查：
```bash
pnpm --version
```

如果版本过低，可以使用以下命令升级：
```bash
npm install -g pnpm
```

### 4.2 开始修补依赖库

#### 步骤 1：创建临时编辑环境
执行以下命令，为需要修补的依赖库创建一个临时编辑环境：
```bash
# 格式：pnpm patch <包名[@版本号]>
pnpm patch element-plus@2.4.4
```

执行成功后，命令行会输出类似以下信息：
```
You can now edit the following folder: /private/var/folders/.../temp-folder
Once you're done, run 'pnpm patch-commit /private/var/folders/.../temp-folder'
```

#### 步骤 2：修改源码
打开命令行提示的临时文件夹，找到并修改存在问题的代码。

对于有多个构建产物的库（如同时有 lib/ 和 es/ 目录），需要确保修改所有相关的文件，否则可能在某些构建工具下不生效。

#### 步骤 3：生成补丁文件
完成修改后，执行命令行提示的 `pnpm patch-commit` 命令，生成补丁文件：
```bash
pnpm patch-commit /private/var/folders/.../temp-folder
```

执行成功后，pnpm 会：
- 在项目根目录生成 `patches/` 文件夹，并在其中创建对应的补丁文件（如 `element-plus@2.4.4.patch`）
- 在 `package.json` 中自动添加 `pnpm.patchedDependencies` 配置，指向生成的补丁文件

#### 步骤 4：验证补丁是否生效
执行以下命令安装依赖，确保补丁被正确应用：
```bash
pnpm install
```

然后检查 `node_modules` 目录下的依赖库文件，确认修改是否已生效。

## 5. 实际应用示例

### 5.1 修复 Naive UI 日期选择器问题

**问题描述**：Naive UI 中的 date-picker 组件点击月份后无法自动关闭，需要额外点击空白处才可以关闭。

**修复步骤**：

1. 创建临时编辑环境：
```bash
pnpm patch naive-ui
```

2. 找到相关文件并修改逻辑，在月份点击事件处理函数中添加关闭面板的代码。

3. 生成补丁文件：
```bash
pnpm patch-commit /path/to/temp-folder
```

4. 清理构建缓存并验证修复效果：
```bash
# 清理 Vite 缓存
rm -rf node_modules/.vite
```

### 5.2 修复 Element Plus 组件问题

**问题描述**：Element Plus 2.4.4 版本中存在一个日期选择器相关的 bug，官方在 2.5.0 版本中修复了这个问题，但项目暂时无法升级到新版本。

**修复步骤**：

1. 创建临时编辑环境：
```bash
pnpm patch element-plus@2.4.4
```

2. 根据官方 PR 的改动，修改以下文件：
   - `components/date-picker/src/date-picker-com/panel-date-pick.js`（lib 目录）
   - `components/date-picker/src/date-picker-com/panel-date-pick.mjs`（es 目录）

3. 生成补丁文件并应用：
```bash
pnpm patch-commit /path/to/temp-folder
pnpm install
```

## 6. 常见问题与解决方案

### 6.1 补丁文件没有生效

**可能原因**：
- 没有修改所有相关的构建产物文件（如同时需要修改 lib/ 和 es/ 目录下的文件）
- 构建工具缓存导致修改未被应用
- `package.json` 中的 `pnpm.patchedDependencies` 配置不正确

**解决方案**：
- 检查并修改所有相关的构建产物文件
- 清理构建工具缓存（如 `rm -rf node_modules/.vite`）
- 验证 `package.json` 中的 `pnpm.patchedDependencies` 配置是否正确指向了补丁文件

### 6.2 执行 pnpm patch-commit 时出现文件锁定错误

**错误信息**：`pnpm patch-commit: EBUSY: resource busy or locked, rmdir`

**解决方案**：关闭所有可能正在访问该文件的应用程序（如 VS Code），然后重新执行命令。

### 6.3 如何查看已应用的补丁

**解决方案**：查看项目根目录下的 `patches/` 文件夹中的文件，以及 `package.json` 中的 `pnpm.patchedDependencies` 配置。

### 6.4 如何删除已应用的补丁

**解决方案**：
1. 删除 `patches/` 文件夹中对应的补丁文件
2. 从 `package.json` 的 `pnpm.patchedDependencies` 配置中删除对应的条目
3. 重新安装依赖：`pnpm install`

## 7. pnpm patch 的高级用法

### 7.1 使用 pnpm-patch-i 简化操作

[pnpm-patch-i](https://github.com/antfu/pnpm-patch-i) 是由 antfu 开发的一个工具，它进一步封装了 pnpm 的 patch 功能，省去了手动打开临时目录的步骤：

```bash
# 安装 pnpm-patch-i
pnpm add -g pnpm-patch-i

# 使用 pnpm-patch-i 打补丁
pnpm patch-i <包名>
```

### 7.2 手动创建和修改补丁文件

对于简单的修改，也可以直接创建或编辑 `patches/` 目录下的补丁文件，然后在 `package.json` 中添加对应的配置。补丁文件使用标准的 diff 格式。

### 7.3 多个补丁的管理

对于一个依赖库，如果需要应用多个补丁，可以通过以下方式管理：
1. 每次修改后生成新的补丁文件
2. 保持 `package.json` 中的 `pnpm.patchedDependencies` 配置更新
3. 在团队协作中，确保所有成员都使用相同版本的补丁

## 8. 与其他包管理器的对比

除了 pnpm，其他主流包管理器也提供了类似的补丁功能：

| 包管理器 | 补丁功能 | 实现方式 |
|---------|---------|---------|
| pnpm | pnpm patch/patch-commit | 内置功能，生成 .patch 文件 |
| npm | patch-package | 需要安装第三方包，生成 .patch 文件 |
| yarn | yarn patch/patch-commit | 内置功能，生成 .patch 文件 |
| bun | bun patch | 内置功能，生成 .patch 文件 |

## 9. 最佳实践

### 9.1 记录补丁的目的和内容
在生成补丁时，使用清晰的描述信息，说明补丁的目的和主要修改内容，便于后续维护和升级。

### 9.2 定期检查官方更新
使用 pnpm patch 修补依赖库后，应定期检查官方是否发布了包含该修复的新版本，及时升级依赖库并移除临时补丁。

### 9.3 确保修改所有相关文件
对于有多个构建产物的库，确保修改所有相关的文件，以避免在不同的构建工具或环境下出现不一致的行为。

### 9.4 清理构建缓存
在应用补丁后，记得清理构建工具的缓存，确保修改能够正确生效。

### 9.5 团队协作中的注意事项
- 将补丁文件添加到版本控制系统中
- 确保团队成员都使用相同的包管理器版本
- 在 README 或项目文档中说明已应用的补丁及其目的

## 10. 总结

pnpm patch 是一个强大而实用的工具，为开发者提供了一种高效、便捷的方式来修补第三方依赖库中的问题。它通过生成补丁文件的方式，避免了等待官方更新或维护额外仓库的麻烦，同时保持了项目的稳定性和可维护性。

在使用 pnpm patch 时，需要注意记录补丁信息、定期检查官方更新、清理构建缓存等最佳实践，以确保补丁的正确应用和管理。

无论是在紧急修复线上问题，还是在开发过程中遇到依赖库的小问题，pnpm patch 都是一个值得掌握的工具，可以帮助你更高效地解决问题，不被依赖库的问题所阻碍。