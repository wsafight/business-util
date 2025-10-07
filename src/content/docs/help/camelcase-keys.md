---
title: 驼峰命名转换工具 camelcase-keys
description: JavaScript/TypeScript 对象键名格式转换工具，从 snake_case 到 camelCase
---

## 什么是 camelcase-keys？

[camelcase-keys](https://github.com/sindresorhus/camelcase-keys) 是一个轻量级且实用的 JavaScript/TypeScript 工具库，专门用于将对象的键名从下划线命名格式（snake_case）转换为驼峰命名格式（camelCase）。这个工具在处理 API 返回数据、数据库记录或配置文件时特别有用，因为这些数据源常常使用下划线命名，而 JavaScript/TypeScript 开发中更倾向于使用驼峰命名。

### 核心特性

- **递归转换**：智能处理嵌套对象和数组，确保所有层级的键名都被正确转换
- **类型安全**：保持原始值不变，仅修改键名格式
- **自定义选项**：支持自定义转换规则，如保留特定键、转换数字键等
- **零依赖**：纯 JavaScript 实现，不引入额外依赖
- **TypeScript 支持**：提供完整的类型定义
- **性能优化**：高效处理大型数据集

## 安装

使用 npm 或 yarn 安装 camelcase-keys：

```bash
# 使用 npm
npm install camelcase-keys

# 使用 yarn
yarn add camelcase-keys

# 使用 pnpm
pnpm add camelcase-keys
```

如果需要 TypeScript 类型支持，可以选择安装 type-fest 库：

```bash
# 安装 type-fest 以获取高级类型支持
yarn add -D type-fest
```

## 基本用法

### 1. 基础转换

```ts
import camelcaseKeys from 'camelcase-keys';

// 简单对象转换
const snakeCaseObj = {
  user_id: 1,
  user_name: 'John Doe',
  is_admin: true
};

const camelCaseObj = camelcaseKeys(snakeCaseObj);

console.log(camelCaseObj);
// 输出:
// {
//   userId: 1,
//   userName: 'John Doe',
//   isAdmin: true
// }
```

### 2. 递归转换嵌套对象

要处理嵌套对象和数组，需要启用 `deep` 选项：

```ts
import camelcaseKeys from 'camelcase-keys';

const complexData = {
  user_id: 1,
  user_profile: {
    full_name: 'John Doe',
    contact_info: {
      email_address: 'john@example.com',
      phone_number: '123-456-7890'
    }
  },
  user_roles: [
    {
      role_id: 1,
      role_name: 'admin'
    },
    {
      role_id: 2,
      role_name: 'user'
    }
  ]
};

// 启用 deep 选项进行递归转换
const result = camelcaseKeys(complexData, {
  deep: true
});

console.log(result);
// 输出:
// {
//   userId: 1,
//   userProfile: {
//     fullName: 'John Doe',
//     contactInfo: {
//       emailAddress: 'john@example.com',
//       phoneNumber: '123-456-7890'
//     }
//   },
//   userRoles: [
//     {
//       roleId: 1,
//       roleName: 'admin'
//     },
//     {
//       roleId: 2,
//       roleName: 'user'
//     }
//   ]
// }
```

### 3. 自定义转换选项

camelcase-keys 提供了多种选项来自定义转换行为：

```ts
import camelcaseKeys from 'camelcase-keys';

const options = {
  // 递归转换嵌套对象和数组
  deep: true,
  
  // 保留特定键不进行转换
  exclude: ['special_key', 'another_key'],
  
  // 只转换指定的键
  include: ['user_id', 'product_name'],
  
  // 是否转换数字键（默认不转换）
  stopPaths: ['items.0.id'], // 在特定路径停止转换
  
  // 自定义转换函数
  transformer: (key) => {
    // 保留某些特定前缀的键不转换
    if (key.startsWith('__')) return key;
    // 对其他键使用标准驼峰转换
    return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
};

const result = camelcaseKeys(data, options);
```

### 4. 与 TypeScript 类型系统结合

结合 [type-fest](https://github.com/sindresorhus/type-fest) 库，可以在类型层面上实现对象键名的转换：

```ts
import camelcaseKeys from 'camelcase-keys';
import type { CamelCasedPropertiesDeep } from 'type-fest';

// 定义原始类型
type SnakeCaseUser = {
  user_id: number;
  user_name: string;
  is_admin: boolean;
  contact_info: {
    email_address: string;
    phone_number: string;
  };
};

// 创建类型转换函数
export function convertToCamelCase<T extends object>(snakeCaseData: T): CamelCasedPropertiesDeep<T> {
  return camelcaseKeys(snakeCaseData, { deep: true }) as CamelCasedPropertiesDeep<T>;
}

// 使用示例
const snakeCaseUser: SnakeCaseUser = {
  user_id: 1,
  user_name: 'John Doe',
  is_admin: true,
  contact_info: {
    email_address: 'john@example.com',
    phone_number: '123-456-7890'
  }
};

// 转换对象并获得正确的类型
const camelCaseUser = convertToCamelCase(snakeCaseUser);
// 现在 camelCaseUser 类型为 CamelCasedPropertiesDeep<SnakeCaseUser>
console.log(camelCaseUser.userId); // 正确，类型检查通过
console.log(camelCaseUser.userName); // 正确，类型检查通过
console.log(camelCaseUser.contactInfo.emailAddress); // 正确，类型检查通过
// console.log(camelCaseUser.user_id); // 错误，类型检查失败
```

## 实际应用场景

### 1. 处理 API 响应数据

在前端开发中，经常需要处理后端 API 返回的下划线命名格式数据：

```ts
import camelcaseKeys from 'camelcase-keys';
import axios from 'axios';

// 封装 API 调用，自动转换键名格式
async function fetchUserProfile(userId: number) {
  try {
    const response = await axios.get(`/api/users/${userId}`);
    // 将 API 返回的 snake_case 数据转换为 camelCase
    return camelcaseKeys(response.data, { deep: true });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}

// 使用示例
async function displayUserProfile() {
  const userProfile = await fetchUserProfile(1);
  // 直接使用驼峰命名的属性
  console.log(userProfile.userName);
  console.log(userProfile.contactInfo.emailAddress);
}
```

### 2. 数据库查询结果处理

在全栈或 Node.js 开发中，处理数据库查询结果：

```ts
import camelcaseKeys from 'camelcase-keys';
import { db } from './database';

// 查询数据库并转换结果格式
async function getUserOrders(userId: number) {
  const query = `
    SELECT order_id, order_date, total_amount,
           shipping_address, billing_address
    FROM orders
    WHERE user_id = $1
    ORDER BY order_date DESC
  `;
  
  const result = await db.query(query, [userId]);
  
  // 转换结果数组中的每个对象
  return result.rows.map(row => camelcaseKeys(row, { deep: true }));
}
```

### 3. 配置文件解析

处理包含下划线命名的配置文件：

```ts
import camelcaseKeys from 'camelcase-keys';
import fs from 'fs';
import path from 'path';

// 读取并解析配置文件
function loadConfig(configPath: string) {
  const rawConfig = fs.readFileSync(path.resolve(configPath), 'utf-8');
  const parsedConfig = JSON.parse(rawConfig);
  
  // 转换配置对象的键名为驼峰格式
  return camelcaseKeys(parsedConfig, { deep: true });
}

// 使用示例
const config = loadConfig('./config.json');
// 现在可以使用驼峰命名访问配置项
console.log(config.apiEndpoint);
console.log(config.databaseSettings.connectionString);
```

## 高级用法与技巧

### 1. 自定义转换规则

针对特定需求，实现自定义的转换逻辑：

```ts
import camelcaseKeys from 'camelcase-keys';

// 自定义转换函数示例 - 保留首字母大写的缩写词
function customCamelcase(key: string): string {
  // 定义需要保留的缩写词列表
  const acronyms = ['API', 'ID', 'URL', 'HTTP', 'HTTPS'];
  
  let result = key;
  
  // 处理每个缩写词
  acronyms.forEach(acronym => {
    const regex = new RegExp(`_${acronym.toLowerCase()}`, 'g');
    result = result.replace(regex, acronym);
  });
  
  // 对剩余部分应用标准驼峰转换
  return result.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// 使用自定义转换函数
const transformed = camelcaseKeys(data, {
  deep: true,
  transformer: customCamelcase
});

// 示例：
// { api_url: '...' } => { apiURL: '...' }
// { user_id: 1 } => { userID: 1 }
```

### 2. 与其他工具库结合使用

camelcase-keys 可以与其他实用工具库结合使用，提升开发效率：

```ts
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys'; // 另一个将驼峰转换为下划线的工具
import type { CamelCasedPropertiesDeep, SnakeCasedPropertiesDeep } from 'type-fest';

// 创建双向转换工具集
export const caseConverter = {
  // 下划线转驼峰
  toCamelCase: <T extends object>(data: T): CamelCasedPropertiesDeep<T> => 
    camelcaseKeys(data, { deep: true }) as CamelCasedPropertiesDeep<T>,
  
  // 驼峰转下划线
  toSnakeCase: <T extends object>(data: T): SnakeCasedPropertiesDeep<T> =>
    snakecaseKeys(data, { deep: true }) as SnakeCasedPropertiesDeep<T>
};

// 使用示例
const apiResponse = await fetchData();
const camelCaseData = caseConverter.toCamelCase(apiResponse);

// 处理数据...

// 准备发送回服务器的数据
const snakeCaseData = caseConverter.toSnakeCase(processedData);
await saveData(snakeCaseData);
```

## 性能考虑

对于大型数据集或频繁的转换操作，以下是一些性能优化建议：

1. **选择性转换**：只转换必要的字段，使用 `include` 选项限制转换范围

```ts
// 只转换特定的字段
const result = camelcaseKeys(data, {
  include: ['user_id', 'product_name', 'order_details']
});
```

2. **避免重复转换**：缓存已转换的结果，避免重复处理相同的数据

```ts
// 创建简单的缓存机制
const conversionCache = new Map<string, any>();

function cachedCamelcaseKeys(data: object) {
  const dataKey = JSON.stringify(data);
  
  if (conversionCache.has(dataKey)) {
    return conversionCache.get(dataKey);
  }
  
  const result = camelcaseKeys(data, { deep: true });
  conversionCache.set(dataKey, result);
  
  return result;
}
```

3. **分批处理大型数据集**：对于非常大的数组，考虑分批处理

```ts
// 分批处理大型数组
function batchProcessLargeArray<T extends object>(array: T[], batchSize = 1000) {
  const result: T[] = [];
  
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    const convertedBatch = batch.map(item => 
      camelcaseKeys(item, { deep: true })
    );
    result.push(...convertedBatch);
  }
  
  return result;
}
```

## 常见问题与解决方案

### 1. 转换后丢失类型信息

**问题**：使用 camelcaseKeys 后，TypeScript 无法正确推断转换后的对象类型。

**解决方案**：使用 type-fest 的类型和类型断言：

```ts
import camelcaseKeys from 'camelcase-keys';
import type { CamelCasedPropertiesDeep } from 'type-fest';

function safeCamelcaseKeys<T extends object>(data: T): CamelCasedPropertiesDeep<T> {
  return camelcaseKeys(data, { deep: true }) as CamelCasedPropertiesDeep<T>;
}
```

### 2. 转换特殊字符或非常规键名

**问题**：对象中包含特殊字符或非常规的键名，标准转换无法正确处理。

**解决方案**：使用自定义的转换器函数：

```ts
const result = camelcaseKeys(data, {
  transformer: (key) => {
    // 处理特殊情况
    if (key.includes('-')) {
      return key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }
    // 默认驼峰转换
    return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
});
```

### 3. 处理循环引用对象

**问题**：尝试转换包含循环引用的对象时可能导致堆栈溢出。

**解决方案**：在转换前检测并处理循环引用，或使用专门的库来处理复杂对象结构：

```ts
// 简单的循环引用检测和处理
function convertWithCircularReferenceHandling(obj: object) {
  const seen = new WeakSet();
  
  function replacer(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        // 处理循环引用，返回引用标识符或简化表示
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  }
  
  // 先序列化再反序列化以处理循环引用
  const safeObj = JSON.parse(JSON.stringify(obj, replacer));
  
  // 然后应用驼峰转换
  return camelcaseKeys(safeObj, { deep: true });
}
```

## 总结

camelcase-keys 是一个简单但强大的工具，能够有效地解决 JavaScript/TypeScript 开发中对象键名格式不一致的问题。通过将 snake_case 转换为 camelCase，它帮助我们保持代码风格的一致性，提高代码可读性和可维护性。

无论是处理 API 响应、数据库查询结果还是配置文件，camelcase-keys 都能提供简洁、灵活的解决方案。结合 TypeScript 的类型系统，它还能在编译时提供类型安全保障，进一步提升开发体验。

通过本文介绍的基本用法、实际应用场景和高级技巧，你应该能够在自己的项目中充分利用这个工具，优化数据处理流程，提升代码质量。
