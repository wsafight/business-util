---
title: JavaScript 依赖注入库 awilix
description: JavaScript 依赖注入库 awilix awilix 详细介绍与使用指南
---

依赖注入是一种异常强大的设计模式！

## 依赖注入概述

依赖注入（Dependency Injection，简称 DI）是一种设计模式，它允许我们将对象的依赖关系从内部创建转移到外部注入，从而实现松耦合、可测试和可维护的代码。

### 依赖注入的核心优势

- **解耦性**：类不再直接依赖具体实现，而是依赖抽象接口
- **可测试性**：可以轻松替换真实依赖为测试替身（mock/stub）
- **可维护性**：修改一个依赖不会影响到所有使用它的类
- **可扩展性**：可以轻松替换或升级依赖项而无需修改使用它们的代码
- **解决循环依赖**：通过容器管理依赖关系，可以优雅地处理循环依赖问题

## 什么是 awilix？

[awilix](https://github.com/jeffijoe/awilix) 是一个轻量级、功能强大的依赖注入容器，专为 JavaScript 和 TypeScript 前端应用设计。它提供了直观的 API，让开发者能够轻松实现依赖注入模式，提升代码质量。

### 核心特性

- **多格式支持**：同时支持函数和类的依赖注入
- **智能依赖解析**：基于参数名称自动解析依赖关系
- **灵活的作用域管理**：支持单例（Singleton）、瞬态（Transient）和请求（Request）三种作用域
- **异步支持**：内置对异步工厂函数和异步依赖解析的支持
- **框架集成友好**：与 Express、Koa 等主流 Node.js 框架无缝集成
- **零依赖**：体积小，不引入额外依赖
- **TypeScript 支持**：提供完整的类型定义，支持类型安全的依赖注入

## 安装与基本配置

### 安装

使用 npm 或 yarn 安装 awilix：

```bash
# 使用 npm
npm install awilix

# 使用 yarn
yarn add awilix
```

如需与 Express 或 Koa 集成，还可以安装对应的集成包：

```bash
# Express 集成
yarn add awilix-express

# Koa 集成
yarn add awilix-koa
```

### 基本配置

创建容器并注册服务是使用 awilix 的第一步：

```ts
import { createContainer, asClass, asFunction, asValue } from 'awilix';

// 创建依赖注入容器
const container = createContainer({
  // 配置选项
  injectionMode: 'CLASSIC' // 可选项: 'CLASSIC' (默认) 或 'PROXY'
});

// 注册服务 - 三种主要注册方式
container.register({
  // 1. 类注册 - 用于构造函数实例化的服务
  userService: asClass(UserService),
  
  // 2. 函数注册 - 用于工厂函数创建的服务
  logger: asFunction(createLogger),
  
  // 3. 值注册 - 用于直接注入的值（配置、常量等）
  config: asValue({
    apiUrl: 'https://api.example.com',
    timeout: 5000
  })
});
```

## 基本用法详解

### 类注入

awilix 支持通过构造函数参数自动注入依赖：

```ts
// 定义服务类
class UserRepository {
  // 数据访问方法
  async findById(id: string) {
    // 实际的数据查询逻辑
    return { id, name: '示例用户' };
  }
}

class UserService {
  // 声明依赖
  private userRepository: UserRepository;

  // awilix 会自动根据参数名注入对应的依赖
  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  // 业务方法 - 使用注入的依赖
  async getUser(id: string) {
    return this.userRepository.findById(id);
  }
}

// 注册服务
container.register({
  userRepository: asClass(UserRepository),
  userService: asClass(UserService)
});

// 解析服务 - awilix 会自动处理依赖关系
const userService = container.resolve('userService');
const user = await userService.getUser('123');
console.log(user); // { id: '123', name: '示例用户' }
```

### 函数注入

对于函数组件或路由处理函数，awilix 提供了 `inject` 高阶函数：

```ts
import { inject } from 'awilix';

// 方式 1: 使用 inject 高阶函数包装处理函数
const getUserHandler = inject(
  // 定义需要注入的依赖
  { userService: 'userService' },
  // 注入的依赖会作为参数传递给这个函数
  ({ userService }) => {
    return async (req, res) => {
      try {
        const user = await userService.getUser(req.params.id);
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: '获取用户失败' });
      }
    };
  }
);

// 方式 2: 直接从容器中解析依赖（更灵活但耦合度略高）
app.get('/users/:id', async (req, res) => {
  const userService = container.resolve('userService');
  const user = await userService.getUser(req.params.id);
  res.json(user);
});
```

### 依赖命名约定与别名

awilix 默认使用参数名来解析依赖，但你也可以通过对象解构语法指定别名：

```ts
class UserService {
  // 使用别名映射依赖
  constructor({
    userRepository: repo, // 将 userRepository 映射为 repo
    logger
  }: {
    userRepository: UserRepository,
    logger: Logger
  }) {
    this.repo = repo;
    this.logger = logger;
  }
}
```

## 作用域管理详解

awilix 提供三种作用域管理方式，适应不同的应用场景：

### 单例作用域（Singleton - 默认）

单例作用域的服务在容器中只创建一次实例，后续所有解析请求都返回同一个实例：

```ts
container.register({
  // 显式声明为单例
  database: asClass(Database).singleton(),
  
  // 默认即为单例模式
  configService: asClass(ConfigService)
});

// 多次解析得到相同实例
const db1 = container.resolve('database');
const db2 = container.resolve('database');
console.log(db1 === db2); // true
```

### 瞬态作用域（Transient）

瞬态作用域的服务每次解析时都会创建新实例，适用于轻量级、无状态的服务：

```ts
container.register({
  // 声明为瞬态作用域
  logger: asClass(Logger).transient()
});

// 多次解析得到不同实例
const logger1 = container.resolve('logger');
const logger2 = container.resolve('logger');
console.log(logger1 === logger2); // false
```

### 请求作用域（Request）

请求作用域在 Web 应用中特别有用，它为每个 HTTP 请求创建一个新的服务实例：

```ts
// Express 应用示例
import { scopePerRequest } from 'awilix-express';

// 使用中间件为每个请求创建独立作用域
app.use(scopePerRequest(container));

// 在路由处理函数中使用请求作用域的服务
app.get('/users/:id', (req, res) => {
  // 从请求作用域中解析服务
  const requestScopedService = req.container.resolve('requestScopedService');
  // requestScopedService 对于每个请求都是唯一的
});
```

## 异步依赖处理

对于需要异步初始化的服务，awilix 提供了完善的异步支持：

### 异步工厂函数

```ts
// 定义异步工厂函数
async function createDatabaseConnection() {
  // 模拟异步连接数据库
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('数据库连接已建立');
      resolve({ /* 数据库连接对象 */ });
    }, 1000);
  });
}

// 注册异步服务
container.register({
  db: asFunction(createDatabaseConnection)
});

// 异步解析服务
async function startApp() {
  // 使用 resolveAsync 解析异步服务
  const db = await container.resolveAsync('db');
  console.log('应用已启动，数据库已连接');
}

startApp();
```

### 异步类构造函数

```ts
// 具有异步初始化逻辑的类
class Database {
  private connection: any;

  // 构造函数本身是同步的
  constructor() {
    this.connection = null;
  }

  // 定义异步初始化方法
  async initialize() {
    // 模拟异步初始化
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connection = { /* 连接对象 */ };
        resolve();
      }, 1000);
    });
  }
}

// 使用工厂函数包装异步初始化
container.register({
  db: asFunction(async () => {
    const database = new Database();
    await database.initialize();
    return database;
  })
});
```

## 与主流框架集成

### Express 集成

使用 `awilix-express` 包可以轻松将 awilix 集成到 Express 应用中：

```ts
import express from 'express';
import { createContainer, asClass } from 'awilix';
import { scopePerRequest, loadControllers } from 'awilix-express';

const app = express();
const container = createContainer();

// 1. 注册服务
container.register({
  userService: asClass(UserService),
  userRepository: asClass(UserRepository),
  logger: asFunction(createLogger)
});

// 2. 应用中间件 - 为每个请求创建作用域
app.use(scopePerRequest(container));

// 3. 加载控制器（支持自动依赖注入）
// 此方法会自动扫描指定目录下的控制器并注入依赖
app.use(loadControllers('controllers/*.js', {
  cwd: __dirname
}));

// 4. 也可以手动创建路由并使用注入的服务
app.get('/manual-route', (req, res) => {
  // 从请求作用域中解析服务
  const userService = req.container.resolve('userService');
  res.json(userService.getInfo());
});

app.listen(3000);
```

### Koa 集成

与 Express 类似，`awilix-koa` 包提供了 Koa 框架的集成支持：

```ts
import Koa from 'koa';
import { createContainer, asClass } from 'awilix';
import { scopePerRequest } from 'awilix-koa';

const app = new Koa();
const container = createContainer();

// 1. 注册服务
container.register({
  userService: asClass(UserService),
  userRepository: asClass(UserRepository)
});

// 2. 应用中间件 - 为每个请求创建作用域
app.use(scopePerRequest(container));

// 3. 在路由处理函数中使用注入的服务
app.use(async (ctx) => {
  // 从上下文的 state 中获取容器并解析服务
  const userService = ctx.state.container.resolve('userService');
  ctx.body = await userService.getUserList();
});

app.listen(3000);
```

## TypeScript 高级用法

awilix 提供了完整的 TypeScript 支持，让你能够享受类型安全的依赖注入体验：

### 类型化容器

```ts
import { createContainer, asClass, AwilixContainer } from 'awilix';

// 定义服务接口
interface Services {
  userService: UserService;
  userRepository: UserRepository;
  config: AppConfig;
}

// 创建类型化容器
const container: AwilixContainer<Services> = createContainer<Services>();

// 注册服务时会进行类型检查
container.register({
  userService: asClass(UserService),
  userRepository: asClass(UserRepository),
  config: asValue({ apiUrl: 'https://api.example.com' })
});

// 解析服务时会获得正确的类型
const userService = container.resolve('userService'); // 类型为 UserService
```

### 装饰器支持

在 TypeScript 中，你还可以使用装饰器来简化依赖注入：

```ts
import { injectable, inject } from 'awilix';

// 标记服务类可注入
@injectable()
class UserRepository {
  // 存储方法
}

// 标记服务类可注入并指定依赖
@injectable()
class UserService {
  private userRepository: UserRepository;

  constructor(@inject('userRepository') userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
}

// 注册服务
container.register({
  userRepository: asClass(UserRepository),
  userService: asClass(UserService)
});
```

## 高级特性与模式

### 生命周期钩子

awilix 支持 `onCreate` 生命周期钩子，用于在服务创建后执行初始化逻辑：

```ts
class UserService {
  private initialized = false;

  // 生命周期钩子 - 服务实例创建后自动调用
  onCreate() {
    this.initialized = true;
    console.log('UserService 实例已创建并初始化');
  }

  // 自定义初始化方法
  initialize() {
    // 执行更复杂的初始化逻辑
    console.log('UserService 执行自定义初始化');
  }
}

// 注册时添加额外的生命周期钩子
container.register({
  userService: asClass(UserService)
    .onCreate((service) => {
      // 注册时添加的额外初始化逻辑
      service.initialize();
    })
});
```

### 延迟加载与代码分割

对于大型应用，你可以使用延迟加载来优化启动性能和实现代码分割：

```ts
// 使用动态导入实现延迟加载
container.register({
  // 大型服务只在需要时才加载
  heavyService: asFunction(async () => {
    // 动态导入模块
    const { HeavyService } = await import('./services/HeavyService');
    return new HeavyService();
  })
});

// 按需解析服务（触发模块加载）
async function useHeavyService() {
  const heavyService = await container.resolveAsync('heavyService');
  return heavyService.doSomething();
}
```

### 模块拆分与容器组合

对于大型应用，将容器配置拆分为多个模块可以提高可维护性：

```ts
// services/index.ts - 用户相关服务模块
import { asClass, createContainer } from 'awilix';
import UserService from './UserService';
import UserRepository from './UserRepository';

// 创建子容器
const userContainer = createContainer();

// 注册用户相关服务
userContainer.register({
  userService: asClass(UserService),
  userRepository: asClass(UserRepository)
});

export default userContainer;

// services/auth.ts - 认证相关服务模块
import { asClass, createContainer } from 'awilix';
import AuthService from './AuthService';
import JwtService from './JwtService';

const authContainer = createContainer();

authContainer.register({
  authService: asClass(AuthService),
  jwtService: asClass(JwtService)
});

export default authContainer;

// main.ts - 主容器
import { createContainer } from 'awilix';
import userContainer from './services';
import authContainer from './services/auth';

// 创建主容器
const container = createContainer();

// 合并子容器到主容器
userContainer.registerTo(container);
authContainer.registerTo(container);

// 现在可以从主容器解析所有服务
const userService = container.resolve('userService');
const authService = container.resolve('authService');
```

## 企业级应用最佳实践

### 1. 接口分离原则

定义清晰的接口，只暴露必要的方法，隐藏实现细节：

```ts
// 定义接口
interface IUserService {
  getUser(id: string): Promise<User>;
  createUser(data: UserCreateData): Promise<User>;
  updateUser(id: string, data: UserUpdateData): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
}

// 实现接口
class UserService implements IUserService {
  private userRepository: UserRepository;
  private logger: Logger;

  constructor({ userRepository, logger }: { userRepository: UserRepository; logger: Logger }) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async getUser(id: string): Promise<User> {
    this.logger.info(`获取用户 ${id}`);
    return this.userRepository.findById(id);
  }

  // 实现其他接口方法...
}

// 注册时使用接口类型
container.register<IUserService>({
  userService: asClass(UserService)
});
```

### 2. 依赖注入的层级管理

保持依赖注入的层级浅，避免过长的依赖链，直接注入所需的服务：

```ts
// 好的做法：直接注入所需的服务
class UserController {
  constructor({ userService }: { userService: UserService }) {
    this.userService = userService;
  }

  // 控制器方法
}

// 不好的做法：注入整个容器或过多间接依赖
class BadController {
  constructor({ container }: { container: Container }) {
    this.container = container;
  }

  // 使用时才解析依赖，导致紧耦合
  async getUsers() {
    const userService = this.container.resolve('userService');
    return userService.getUsers();
  }
}
```

### 3. 服务模块化组织

将相关的服务组织在同一个模块中，便于管理和测试：

```ts
// 身份验证相关服务模块
const authModule = {
  // 核心服务
  authService: asClass(AuthService),
  
  // 基础设施服务
  jwtService: asClass(JwtService),
  passwordService: asClass(PasswordService),
  
  // 数据访问服务
  userRepository: asClass(UserRepository),
  roleRepository: asClass(RoleRepository)
};

// 注册整个模块
container.register(authModule);
```

### 4. 测试中的依赖替换

在测试中，使用 awilix 可以轻松替换真实依赖为测试替身：

```ts
// 测试文件
import { createContainer } from 'awilix';
import UserService from '../src/services/UserService';
import { mockUserRepository } from './mocks/userRepository';
import { mockLogger } from './mocks/logger';

// 创建测试专用容器
const testContainer = createContainer();

// 注册服务，使用模拟依赖替换真实依赖
testContainer.register({
  userRepository: asValue(mockUserRepository), // 使用模拟仓库
  logger: asValue(mockLogger), // 使用模拟日志
  userService: asClass(UserService) // 被测服务
});

// 获取带有模拟依赖的服务实例
const userService = testContainer.resolve('userService');

// 现在可以安全地测试 userService，它会使用模拟依赖
```

## 常见问题与解决方案

### 循环依赖处理

当两个或多个服务相互依赖时，可能会出现循环依赖问题。awilix 提供了几种优雅的解决方案：

#### 方案 1：利用 awilix 的自动循环依赖处理

```ts
// ServiceA 依赖 ServiceB
class ServiceA {
  private serviceB: ServiceB;

  constructor({ serviceB }: { serviceB: ServiceB }) {
    this.serviceB = serviceB;
  }
}

// ServiceB 依赖 ServiceA
class ServiceB {
  private serviceA: ServiceA;

  constructor({ serviceA }: { serviceA: ServiceA }) {
    this.serviceA = serviceA;
  }
}

// awilix 能够自动处理这种循环依赖
container.register({
  serviceA: asClass(ServiceA),
  serviceB: asClass(ServiceB)
});

// 可以正常解析服务
const serviceA = container.resolve('serviceA');
const serviceB = container.resolve('serviceB');
```

#### 方案 2：使用 setter 注入避免构造函数循环依赖

```ts
class ServiceA {
  private serviceB: ServiceB;

  // 通过 setter 方法注入依赖
  setServiceB(serviceB: ServiceB) {
    this.serviceB = serviceB;
  }
}

class ServiceB {
  private serviceA: ServiceA;

  constructor({ serviceA }: { serviceA: ServiceA }) {
    this.serviceA = serviceA;
    // 在构造函数中设置反向依赖
    serviceA.setServiceB(this);
  }
}

container.register({
  serviceA: asClass(ServiceA),
  serviceB: asClass(ServiceB)
});
```

### 性能优化策略

对于大型应用，可以考虑以下性能优化策略：

#### 1. 合理使用作用域

```ts
container.register({
  // 重量级、有状态服务使用单例作用域
  database: asClass(Database).singleton(),
  configService: asClass(ConfigService).singleton(),
  
  // 轻量级、无状态服务使用瞬态作用域
  requestValidator: asClass(RequestValidator).transient(),
  queryBuilder: asClass(QueryBuilder).transient()
});
```

#### 2. 使用延迟加载减少初始加载时间

```ts
container.register({
  // 仅在需要时加载大型模块
  adminPanel: asFunction(() => {
    // 动态导入实现延迟加载
    return import('./admin/AdminPanel').then(m => new m.AdminPanel());
  }),
  
  // 异步服务也可以延迟加载
  reportGenerator: asFunction(async () => {
    const { ReportGenerator } = await import('./reports/ReportGenerator');
    const generator = new ReportGenerator();
    await generator.initialize();
    return generator;
  })
});
```

#### 3. 容器缓存与预热

```ts
// 应用启动时预热常用服务
async function warmupContainer() {
  const criticalServices = ['database', 'authService', 'configService'];
  
  // 预解析关键服务以缓存实例
  for (const serviceName of criticalServices) {
    await container.resolveAsync(serviceName);
  }
  
  console.log('容器预热完成，关键服务已初始化');
}

// 应用启动流程
async function startApp() {
  await warmupContainer();
  // 启动其他应用组件...
}
```

## 总结

awilix 是一个功能强大、灵活且易用的依赖注入框架，它能帮助你构建更加模块化、可测试和可维护的前端应用。通过本文介绍的概念、技巧和最佳实践，你可以充分发挥依赖注入的优势，提升代码质量和开发效率。

无论是小型应用还是大型企业级项目，awilix 都能提供清晰的依赖管理解决方案，让你的代码更加健壮、灵活且易于扩展。