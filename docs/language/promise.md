```ts
function getDeferred () {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    // @ts-ignore
    promise.resolve = resolve;
    // @ts-ignore
    promise.reject = reject;
    // @ts-ignore
    return promise;
};
```