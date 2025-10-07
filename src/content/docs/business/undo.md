---
title: 撤销/重做功能的优雅实现
description: 一个轻量级、灵活的撤销/重做栈实现，适用于各种需要历史操作回溯的应用场景
---

撤销(Undo)和重做(Redo)功能是现代应用程序中不可或缺的用户体验增强特性，它允许用户在执行操作后反悔并回到之前的状态，大大提高了操作的灵活性和用户满意度。无论是文本编辑器、图像设计软件还是表单填写界面，撤销/重做功能都能显著提升用户体验。

本文介绍的撤销栈实现是一个轻量级但功能强大的解决方案，它使用闭包和高阶函数的设计模式，提供了直观的API来管理操作历史和状态恢复。

## 核心实现原理

撤销栈的实现基于两个关键数据结构：
- **past数组**：存储已执行的操作，用于撤销功能
- **future数组**：存储已撤销的操作，用于重做功能

这种设计使得操作历史可以在"过去"和"未来"之间灵活切换，同时保持代码的简洁性和可扩展性。

## 完整实现代码

```js
/**
 * 创建一个撤销/重做栈实例
 * 提供管理操作历史和状态恢复的功能
 * 
 * @returns {Object} 包含撤销/重做操作的API对象
 */
function createUndoStack() {
  // 存储已执行的操作，用于撤销
  const past = [];
  // 存储已撤销的操作，用于重做
  const future = [];
  
  return {
    /**
     * 推送一个新的操作到撤销栈
     * 
     * @param {Function} doFn - 执行操作的函数
     * @param {Function} undoFn - 撤销操作的函数
     * @param {...*} withArgumentsToClone - 要传递给doFn和undoFn的参数，会被自动克隆
     */
    push(doFn, undoFn, ...withArgumentsToClone) {
      // 使用structuredClone深拷贝参数，避免引用共享导致的副作用
      const clonedArgs = structuredClone(withArgumentsToClone);
      
      // 创建操作对象，封装执行和撤销逻辑
      const action = {
        // 执行操作的方法
        doWithData() {
          doFn(...clonedArgs);
        },
        // 撤销操作的方法
        undoWithData() {
          undoFn(...clonedArgs);
        },
      };
      
      // 立即执行新操作
      action.doWithData();

      // 添加新操作后清空重做栈，这符合大多数应用的行为习惯
      past.push(action);
      future.length = 0;
    },
    
    /**
     * 撤销上一个操作
     */
    undo() {
      let action = past.pop();
      if (action) {
        // 执行撤销逻辑
        action.undoWithData();
        // 将撤销的操作放入重做栈
        future.unshift(action);
      }
    },
    
    /**
     * 重做上一个被撤销的操作
     */
    redo() {
      let action = future.shift();
      if (action) {
        // 重新执行操作
        action.doWithData();
        // 将重做的操作放回撤销栈
        past.push(action);
      }
    },
    
    /**
     * 获取是否有可撤销的操作
     * @returns {boolean} 如果有可撤销的操作则返回true
     */
    get undoAvailable() {
      return past.length > 0;
    },
    
    /**
     * 获取是否有可重做的操作
     * @returns {boolean} 如果有可重做的操作则返回true
     */
    get redoAvailable() {
      return future.length > 0;
    },
    
    /**
     * 清空撤销栈和重做栈
     * @returns {boolean} 操作是否成功
     */
    clear() {
      past.length = 0;
      future.length = 0;
      return true;
    }
  };
}

export {createUndoStack};
```
