


const memoize = (fn: (...args: any[]) => any) =>
  new Proxy<any>(fn, {
    // @ts-ignore
    cache: new Map<string, any>(),
    apply(target, thisArg, argsList) {
      const cache: Map<string, any> = (this as any).cache
      const cacheKey = argsList.toString();
      if (!cache.has(cacheKey))
        cache.set(cacheKey, target.apply(thisArg, argsList));
      return cache.get(cacheKey);
    }
  });

const fibonacci = (n: number): number => (n <= 1 ? 1 : fibonacci(n - 1) + fibonacci(n - 2));

const memoizedFibonacci = memoize(fibonacci);

for (let i = 0; i < 100; i++) fibonacci(30); // ~5000ms
for (let i = 0; i < 100; i++) memoizedFibonacci(30); // ~50ms