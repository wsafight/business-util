---
title: 微小的撤销功能
description: 微小的撤销功能
---

```js
function createUndoStack() {
  const past = [];
  const future = [];
  return {
    push(doFn, undoFn, ...withArgumentsToClone) {
      const clonedArgs = structuredClone(withArgumentsToClone);
      const action = {
        doWithData() {
          doFn(...clonedArgs);
        },
        undoWithData() {
          undoFn(...clonedArgs);
        },
      };
      action.doWithData();

      // Adding a new action wipes the redoable steps
      past.push(action);
      future.length = 0;
    },
    undo() {
      let action = past.pop();
      if (action) {
        action.undoWithData();
        future.unshift(action);
      }
    },
    redo() {
      let action = future.shift();
      if (action) {
        action.doWithData();
        past.push(action);
      }
    },
    get undoAvailable() {
      return past.length > 0;
    },
    get redoAvailable() {
      return future.length > 0;
    },
    clear() {
      past.length = 0;
      future.length = 0;
      return true;
    }
  }
}

export {createUndoStack};
```