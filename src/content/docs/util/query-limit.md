---
title: 请求限流
description: 请求限流
---

```js
export default async function limit(tasks, concurrency) {
  const results = [];

  async function runTasks(tasksIterator) {
    for (const [index, task] of tasksIterator) {
      try {
        results[index] = await task();
      } catch (error) {
        results[index] = new Error(`Failed with: ${error.message}`);
      }
    }
  }

  const workers = new Array(concurrency)
    .fill(tasks.entries())
    .map(runTasks);

  await Promise.allSettled(workers);

  return results;
}
```