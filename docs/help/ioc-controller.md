# 自动注入关系的初始化

```ts
export type Container = {
  [Key: string]: any;
};

export const container = {} as Container;

export const setController = (dependenciesFactories: Record<string, any>) => {
  Object.entries(dependenciesFactories).forEach(([dependencyName, factory]) => {
    return Object.defineProperty(container, dependencyName, {
      get: () => factory(container),
    });
  });
}
```