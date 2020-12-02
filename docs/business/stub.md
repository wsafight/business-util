# stub 函数

stub code是占坑的代码，桩代码给出的实现是临时性的/待编辑的。它使得程序在结构上能够符合标准，又能够使程序员可以暂时不编辑这段代码。适用于自顶向下开发或者测试时候使用。

大部分情况下，我们直接手写代码即可，但是针对不同参数还需要适配。

git 开源库 [sbuts](https://github.com/lorenzofox3/sbuts/blob/master/index.ts) 完整的表示了该功能。

## 使用方式:

### stub 函数生产一个值

```ts
import stub from 'sbuts';

// 调用函数时，返回固定值
let fn = stub(function *(){
    yield 42;
});

// 或者

fn = stub(42);

// 或者

fn = stub().return(42);

// 无论传入什么参数，都返回 42
fn('whatever') === 42;
```

### stub 函数生成值列表

```ts
// 也可以返回多个数值
fn = stub(function *(){
    yield 42;
    yield 'woot';
});

// 或者

fn = stub(42,'woot');

// 或者

fn = stub()
    .return(42)
    .return('woot'); // can be called later

// 奇数次调用返回 42，偶数次调用返回 woot 字符串
fn('foo') === 42; // > true
fn(66) === 'woot'; // > true
```

### stub 函数异步产生数值

```ts
fn = stub(async function *(){
    yield 42;
});

// or

fn = stub(function * (){
  yield Promise.resolve(42);
});

// or 

fn = stub(Promise.resolve(42));

// or 

fn = stub().resolve(42);
```

### stub 函数产生错误

```ts
// 同步抛出错误
fn = stub(function *(){
  throw new Error('some error');  
});

// 或者

fn = stub().throw(new Error('some error'));

// 异步抛出错误
fn = stub(async function *(){
    throw new Error('some error');
});

fn = stub(function * (){
  yield Promise.reject(new Error('some error'));
}); 

fn = stub(Promise.reject(new Error('some message')));

fn = stub().reject(new Error('some message'));
```

## 源码解析

```ts
const STUB_EXHAUSTED_ERROR = `stub exhausted, call not expected`;

interface CallList<T> {
    calls: T[],
    callCount: number;
    called: boolean;
}

type StubbedFn = (...args: unknown[]) => unknown;
type Stub<T extends StubbedFn> = T & CallList<Parameters<T>>
type LazyExtension<T extends StubbedFn> = {
    return<K = ReturnType<T>>(value: K): LazyStub<T>;
    resolve<K>(value: K): LazyStub<T>;
    reject<K extends any = Error>(reason: K): LazyStub<T>;
    throw<K extends any = Error>(val: K): LazyStub<T>;
};
type LazyStub<T extends StubbedFn> = Stub<T> & LazyExtension<T>

const descriptor = (calls: unknown[]) => ({
    calls: {
        value: calls
    },
    callCount: {
        get() {
            return calls.length;
        }
    },
    called: {
        get() {
            return calls.length > 0;
        }
    }
});

const fromAsyncGenerator = <T extends (...args: unknown[]) => Promise<unknown>>(generator: AsyncGenerator): Stub<T> => {
    const calls: Parameters<T>[] = [];
    return Object.defineProperties(fn, descriptor(calls));

    async function fn(...args: Parameters<T>) {
        calls.push(args);
        const {value, done} = await generator.next();
        if (done) {
            throw new Error(STUB_EXHAUSTED_ERROR);
        }
        return value;
    }
};

const fromGenerator = <T extends StubbedFn>(generator: Generator): Stub<T> => {
    const calls: Parameters<T>[] = [];
    return Object.defineProperties(fn, descriptor(calls));

    function fn(...args: Parameters<T>): ReturnType<T> {
        calls.push(args);
        const {value, done} = generator.next();
        if (done) {
            throw new Error(STUB_EXHAUSTED_ERROR);
        }
        return value;
    }
};

enum CallType {
    ERROR = 'error',
    VALUE = 'value'
}

interface CallDefinition<T> {
    type: CallType,
    value: T
}

const fromVoid = <T extends StubbedFn>(): LazyStub<T> => {
    const queue: CallDefinition<any>[] = [];
    const generator = (function* () {
        while (true) {
            const next = queue.shift();
            if (!next) {
                break;
            }
            const {type, value} = next;
            if (type === CallType.ERROR) {
                throw value;
            }
            yield value;
        }
    })();

    const fn = fromGenerator<T>(generator);
    const queueCall = <K>(value: K | Error, type = CallType.VALUE) => {
        queue.push({value, type});
        return fn as LazyStub<T>;
    };

    const extension: LazyExtension<T> = {
        return: queueCall,
        resolve: <K>(val: K) => queueCall<Promise<K>>(Promise.resolve(val)),
        reject: <K extends any = Error>(val: K) => queueCall<Promise<K>>(Promise.reject(val)),
        throw: <K extends any = Error>(val: K) => queueCall<K>(val, CallType.ERROR)
    };

    return Object.assign(fn, extension);
};

function stub<T extends StubbedFn>(generator: Generator): Stub<T>;
function stub<T extends StubbedFn>(generator: AsyncGenerator): Stub<T>;
function stub<T extends StubbedFn>(): LazyStub<T>;
function stub<T extends StubbedFn>(...args:unknown[]): Stub<T>;
function stub<T extends (...arg: unknown[]) => unknown>(...args: unknown[]) {
    const [input] = args;

    if (typeof input === 'function') {
        const generatorObject = input();
        return generatorObject[Symbol.asyncIterator] ?
            fromAsyncGenerator(generatorObject) :
            fromGenerator(generatorObject);
    }

    return args.length === 0 ?
        fromVoid() :
        fromGenerator(function* () {
            yield* args;
        }());
}

export default stub
```