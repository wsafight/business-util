---
title: 自动注入关系的依赖注入容器
description: 学习如何使用和扩展一个自动注入依赖关系的轻量级IoC容器
---

## 1. 什么是依赖注入容器？

依赖注入（Dependency Injection, DI）是一种设计模式，它可以帮助我们实现控制反转（Inversion of Control, IoC），将对象的创建和依赖关系的管理从代码中分离出来。依赖注入容器是实现这一模式的工具，它负责创建、管理和注入对象之间的依赖关系。

本指南将介绍一个轻量级的依赖注入容器实现，它能够自动注入依赖关系，使代码更加模块化、可测试和易于维护。

## 2. 基础实现

以下是一个基础的依赖注入容器实现：

```ts
// 定义容器类型
export type Container = {
  [Key: string]: any;
};

// 创建容器实例
export const container = {} as Container;

/**
 * 设置控制器及其依赖关系
 * @param dependenciesFactories 包含依赖名称和工厂函数的映射
 */
export const setController = (dependenciesFactories: Record<string, any>) => {
  Object.entries(dependenciesFactories).forEach(([dependencyName, factory]) => {
    return Object.defineProperty(container, dependencyName, {
      // 使用getter确保依赖只在被访问时才创建（懒加载）
      get: () => factory(container),
    });
  });
}
```

## 3. 工作原理

这个依赖注入容器的核心工作原理基于以下几点：

### 3.1 懒加载机制

通过`Object.defineProperty`的`get`属性，我们实现了依赖的懒加载机制。这意味着依赖只有在被实际访问时才会被创建，而不是在注册时就创建，这有助于提高应用程序的性能。

### 3.2 自动注入

在工厂函数中，我们传入了`container`对象，这样工厂函数就可以访问容器中的其他依赖，从而实现依赖关系的自动注入。

### 3.3 单例模式

由于容器中的依赖是通过getter创建的，并且创建后会被缓存，因此每个依赖在容器中实际上是单例的。

## 4. 基本使用示例

### 4.1 注册和使用依赖

```ts
import { container, setController } from './ioc-controller';

// 定义服务接口
interface LoggerService {
  log(message: string): void;
}

// 实现服务
class ConsoleLogger implements LoggerService {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

// 注册服务
setController({
  logger: () => new ConsoleLogger(),
});

// 使用服务
container.logger.log('Hello, Dependency Injection!');
```

### 4.2 依赖关系注入

```ts
import { container, setController } from './ioc-controller';

// 定义服务接口
interface UserRepository {
  getUser(id: string): { id: string; name: string } | null;
}

interface UserService {
  getUserInfo(id: string): { id: string; name: string } | null;
}

// 实现仓库
class MockUserRepository implements UserRepository {
  private users = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];

  getUser(id: string): { id: string; name: string } | null {
    return this.users.find(user => user.id === id) || null;
  }
}

// 实现服务，依赖于仓库
class UserServiceImpl implements UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  getUserInfo(id: string) {
    const user = this.repository.getUser(id);
    container.logger.log(`Fetching user with id: ${id} - ${user ? 'Found' : 'Not found'}`);
    return user;
  }
}

// 注册服务和仓库
setController({
  userRepository: () => new MockUserRepository(),
  userService: (c) => new UserServiceImpl(c.userRepository), // 自动注入依赖
  logger: () => new ConsoleLogger(),
});

// 使用服务
const user = container.userService.getUserInfo('1');
console.log('User:', user);
```

## 5. 功能扩展

我们可以对基础实现进行扩展，添加更多有用的功能：

### 5.1 类型安全的容器

为了提供更好的TypeScript支持，我们可以创建一个类型安全的容器：

```ts
// 定义服务标识符类型
export type ServiceIdentifier<T> = string | symbol | (new (...args: any[]) => T);

// 定义服务工厂类型
export type ServiceFactory<T> = (container: Container) => T;

// 定义容器接口
export interface Container {
  get<T>(id: ServiceIdentifier<T>): T;
  register<T>(id: ServiceIdentifier<T>, factory: ServiceFactory<T>): void;
  has(id: ServiceIdentifier<any>): boolean;
}

// 实现类型安全的容器
class TypeSafeContainer implements Container {
  private services = new Map<ServiceIdentifier<any>, ServiceFactory<any>>();
  private instances = new Map<ServiceIdentifier<any>, any>();

  /**
   * 获取服务实例
   * @param id 服务标识符
   * @returns 服务实例
   */
  get<T>(id: ServiceIdentifier<T>): T {
    if (!this.services.has(id)) {
      throw new Error(`Service not found: ${String(id)}`);
    }

    // 检查是否已经有实例（单例模式）
    if (!this.instances.has(id)) {
      const factory = this.services.get(id)!;
      this.instances.set(id, factory(this));
    }

    return this.instances.get(id) as T;
  }

  /**
   * 注册服务
   * @param id 服务标识符
   * @param factory 服务工厂函数
   */
  register<T>(id: ServiceIdentifier<T>, factory: ServiceFactory<T>): void {
    this.services.set(id, factory);
  }

  /**
   * 检查服务是否已注册
   * @param id 服务标识符
   * @returns 是否已注册
   */
  has(id: ServiceIdentifier<any>): boolean {
    return this.services.has(id);
  }
}

// 创建全局容器实例
export const container = new TypeSafeContainer();

/**
 * 批量注册依赖
 * @param dependencies 依赖映射
 */
export const setController = (dependencies: Record<string, ServiceFactory<any>>) => {
  Object.entries(dependencies).forEach(([key, factory]) => {
    container.register(key, factory);
  });
};
```

### 5.2 生命周期管理

我们可以扩展容器以支持不同的生命周期管理策略：

```ts
// 定义生命周期类型
export enum Lifecycle {
  // 单例模式 - 全局唯一实例
  SINGLETON,
  // 瞬态模式 - 每次请求创建新实例
  TRANSIENT,
}

// 扩展服务注册选项
interface ServiceOptions {
  lifecycle?: Lifecycle;
}

// 扩展容器接口
interface Container {
  get<T>(id: ServiceIdentifier<T>): T;
  register<T>(id: ServiceIdentifier<T>, factory: ServiceFactory<T>, options?: ServiceOptions): void;
  has(id: ServiceIdentifier<any>): boolean;
}

// 实现支持生命周期的容器
class LifecycleContainer implements Container {
  private services = new Map<ServiceIdentifier<any>, {
    factory: ServiceFactory<any>;
    options: ServiceOptions;
  }>();
  private singletonInstances = new Map<ServiceIdentifier<any>, any>();

  /**
   * 获取服务实例
   * @param id 服务标识符
   * @returns 服务实例
   */
  get<T>(id: ServiceIdentifier<T>): T {
    if (!this.services.has(id)) {
      throw new Error(`Service not found: ${String(id)}`);
    }

    const { factory, options } = this.services.get(id)!;
    const lifecycle = options.lifecycle || Lifecycle.SINGLETON;

    // 根据生命周期策略创建实例
    if (lifecycle === Lifecycle.SINGLETON) {
      if (!this.singletonInstances.has(id)) {
        this.singletonInstances.set(id, factory(this));
      }
      return this.singletonInstances.get(id) as T;
    } else {
      // 瞬态模式：每次请求创建新实例
      return factory(this) as T;
    }
  }

  /**
   * 注册服务
   * @param id 服务标识符
   * @param factory 服务工厂函数
   * @param options 服务选项
   */
  register<T>(id: ServiceIdentifier<T>, factory: ServiceFactory<T>, options: ServiceOptions = {}): void {
    this.services.set(id, { factory, options });
  }

  /**
   * 检查服务是否已注册
   * @param id 服务标识符
   * @returns 是否已注册
   */
  has(id: ServiceIdentifier<any>): boolean {
    return this.services.has(id);
  }
}

// 创建全局容器实例
export const container = new LifecycleContainer();
```

## 6. 装饰器支持

对于TypeScript项目，我们可以添加装饰器支持，使依赖注入更加便捷：

```ts
// 定义装饰器类型
interface InjectDecorator {
  (): PropertyDecorator;
  <T>(id: ServiceIdentifier<T>): PropertyDecorator;
}

/**
 * 依赖注入装饰器
 * 可以不传参数（使用属性名作为服务标识符）
 * 也可以传入服务标识符
 */
export const inject: InjectDecorator = (id?: any) => {
  return (target: Object, propertyKey: string | symbol) => {
    const identifier = id || propertyKey;
    
    // 定义属性描述符
    Object.defineProperty(target, propertyKey, {
      get: function() {
        return container.get(identifier);
      },
      enumerable: true,
      configurable: true
    });
  };
};

// 使用示例
class UserController {
  @inject() // 使用属性名作为服务标识符
  private userService!: UserService;
  
  @inject('logger') // 明确指定服务标识符
  private loggerService!: LoggerService;
  
  getUser(id: string) {
    this.loggerService.log(`Getting user ${id}`);
    return this.userService.getUserInfo(id);
  }
}
```

## 7. 最佳实践

### 7.1 依赖抽象而非实现

遵循依赖倒置原则，依赖于抽象接口而非具体实现：

```ts
// 好的做法：依赖接口
setController({
  userService: (c) => new UserServiceImpl(c.userRepository),
  userRepository: () => new MockUserRepository(),
});

// 不好的做法：直接依赖具体实现
setController({
  userServiceImpl: () => new UserServiceImpl(new MockUserRepository()),
});
```

### 7.2 保持容器配置集中

将所有的依赖注册集中在一个地方管理：

```ts
// app.container.ts
import { setController } from './ioc-controller';
import { UserService, UserServiceImpl } from './services/user-service';
import { UserRepository, MockUserRepository } from './repositories/user-repository';
import { LoggerService, ConsoleLogger } from './services/logger-service';

// 集中注册所有依赖
export const configureContainer = () => {
  setController({
    userService: (c) => new UserServiceImpl(c.userRepository),
    userRepository: () => new MockUserRepository(),
    loggerService: () => new ConsoleLogger(),
  });
};

// 在应用入口调用
configureContainer();
```

### 7.3 使用工厂函数创建复杂依赖

对于需要额外配置的复杂依赖，使用工厂函数来创建：

```ts
setController({
  database: () => {
    const db = new Database();
    db.connect({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return db;
  },
});
```

### 7.4 单元测试中的依赖注入

在单元测试中，我们可以轻松替换真实依赖为模拟对象：

```ts
// user-service.test.ts
import { container, setController } from './ioc-controller';
import { UserService } from './services/user-service';

// Mock repository
const mockRepository = {
  getUser: jest.fn().mockReturnValue({ id: '1', name: 'Test User' }),
};

// 替换真实依赖为mock
setController({
  userRepository: () => mockRepository,
  userService: (c) => new UserServiceImpl(c.userRepository),
  loggerService: () => ({ log: jest.fn() }),
});

describe('UserService', () => {
  let userService: UserService;
  
  beforeEach(() => {
    userService = container.userService;
    jest.clearAllMocks();
  });
  
  test('should get user information', () => {
    const user = userService.getUserInfo('1');
    expect(mockRepository.getUser).toHaveBeenCalledWith('1');
    expect(user).toEqual({ id: '1', name: 'Test User' });
  });
});
```

## 8. 适用场景

这种轻量级的依赖注入容器特别适合以下场景：

- **小型到中型应用**：不需要完整框架的全部功能
- **模块化开发**：需要解耦各个模块之间的依赖关系
- **可测试性要求高**：需要轻松替换依赖进行单元测试
- **前端应用**：可以在React、Vue、Angular等前端框架中使用
- **Node.js应用**：也适用于后端服务的依赖管理

## 9. 限制与注意事项

使用这种轻量级依赖注入容器时，需要注意以下限制和事项：

- **类型安全**：基本实现的类型安全性有限，推荐使用扩展的类型安全版本
- **循环依赖**：没有内置的循环依赖检测机制，需要避免循环依赖
- **复杂场景**：对于非常复杂的依赖关系和高级特性，可能需要考虑使用更成熟的IoC容器
- **性能考量**：虽然使用了懒加载，但对于性能极为敏感的应用，需要评估getter的性能开销

## 10. 总结

这个自动注入关系的依赖注入容器提供了一个轻量级但功能强大的解决方案，可以帮助我们实现代码的解耦和模块化。通过懒加载机制和自动依赖注入，它使我们的代码更加清晰、可维护和可测试。

我们可以根据项目需求选择基础实现或扩展版本，甚至可以进一步定制和增强它的功能。无论是小型项目还是中型应用，这种依赖注入容器都能帮助我们更好地组织和管理代码的依赖关系。