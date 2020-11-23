// https://github.com/lorenzofox3/sbuts/blob/master/index.ts
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