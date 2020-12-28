# JSON 的超集 serialize-javascript

JSON是一种轻量级、基于文本、独立于语言的语法，用于定义数据交换格式。它源于 ECMAScript 编程语言，但与编程语言无关。JSON为结构化数据的可移植表示定义了一小组结构化规则。

在 ES11 版本的今天，数据结构远比之前更加丰富。如果我们需要更为丰富的数据时候，我们需要对数据结构进行修改与转化以便进行项目开发，如：


```json
{
  "data": [{
    "type": "set",
  	"value": ["a", "b", "c"]
	}],
  "fun": {
    "parameter": "a, b, c",
    "body": "return a + b + c"
  }
}
```

当遇到类型为 set 时候，我们可以使用  `new Set(value)`  来转换，当遇到函数时候我们可以通过 `new Function(parameter, body)` 来进行转换。

当然，如果特定项目需要很多数据结构，我们就需要定义 JSON 结构以及添加转换逻辑。此时我们可以使用 yahoo 的 JSON 转换库(注意安全)。

[serialize-javascript](https://github.com/yahoo/serialize-javascript) 将 JavaScript 序列化为 JSON 的超集，其中包括正则表达式、日期和函数。

当我们直接转换 JSON.stringify 转换的时候:

```js
JSON.stringify({
    str  : 'string',
    num  : 0,
    obj  : {foo: 'foo'},
    arr  : [1, 2, 3],
    bool : true,
    nil  : null,
    undef: undefined,
    inf  : Infinity,
    date : new Date("Thu, 28 Apr 2016 22:02:17 GMT"),
    map  : new Map([['hello', 'world']]),
    set  : new Set([123, 456]),
    fn   : function echo(arg) { return arg; },
    re   : /([^\s]+)/g,
    big  : BigInt(10),
});
// Uncaught TypeError: Do not know how to serialize a BigInt

JSON.stringify({
    str  : 'string',
    num  : 0,
    obj  : {foo: 'foo'},
    arr  : [1, 2, 3],
    bool : true,
    nil  : null,
    undef: undefined,
    inf  : Infinity,
    date : new Date("Thu, 28 Apr 2016 22:02:17 GMT"),
    map  : new Map([['hello', 'world']]),
    set  : new Set([123, 456]),
    fn   : function echo(arg) { return arg; },
    re   : /([^\s]+)/g,
});
// "{"str":"string","num":0,"obj":{"foo":"foo"},"arr":[1,2,3],"bool":true,"nil":null,"inf":null,"date":"2016-04-28T22:02:17.000Z","map":{},"set":{},"re":{}}"
```

而使用 serialize 库的时候:

```js
var serialize = require('serialize-javascript');

serialize({
    str  : 'string',
    num  : 0,
    obj  : {foo: 'foo'},
    arr  : [1, 2, 3],
    bool : true,
    nil  : null,
    undef: undefined,
    inf  : Infinity,
    date : new Date("Thu, 28 Apr 2016 22:02:17 GMT"),
    map  : new Map([['hello', 'world']]),
    set  : new Set([123, 456]),
    fn   : function echo(arg) { return arg; },
    re   : /([^\s]+)/g,
    big  : BigInt(10),
});

// "{"str":"string","num":0,"obj":{"foo":"foo"},"arr":[1,2,3],"bool":true,"nil":null,"undef":undefined,"inf":Infinity,"date":new Date("2016-04-28T22:02:17.000Z"),"map":new Map([["hello","world"]]),"set":new Set([123,456]),"fn":function echo(arg) { return arg; },"re":new RegExp("([^\\\\s]+)", "g"),"big":BigInt("10")}"
```

反序列化，转换回来时候使用 eval 函数:

```js
function deserialize(serializedJavascript){
  return eval('(' + serializedJavascript + ')');
}
```

当然 eval 解析会有安全性问题，建议在当前项目是不需要考虑安全的项目(内部或者服务)时候使用。

源码解析：

```
'use strict';

// 从浏览器中获取随机字节
var randomBytes = require('randombytes');

// 生成一个内部唯一 ID 以使 regexp 模式更难猜测。
var UID_LENGTH = 16;
var UID = generateUID();
// 占位符
var PLACE_HOLDER_REGEXP = new RegExp('(\\\\)?"@__(F|R|D|M|S|A|U|I|B)-' + UID + '-(\\d+)__@"', 'g');

// 是否为原生方法
var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;

// 是否是纯函数
var IS_PURE_FUNCTION = /function.*?\(/;

// 是否箭头函数
var IS_ARROW_FUNCTION = /.*?=>.*?/;

// 不安全字符
var UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

// 保留富豪
var RESERVED_SYMBOLS = ['*', 'async'];

// 将不安全的HTML和无效的JavaScript行结束符字符映射到可以在JavaScript字符串中
// 以便安全使用的Unicode字符对应项。
var ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

/**
 * 转换不安全的字符
 * @param unsafeChar
 * @returns {*}
 */
function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}

/**
 * 生成唯一 id
 * @returns {string}
 */
function generateUID() {
  var bytes = randomBytes(UID_LENGTH);
  var result = '';
  for (var i = 0; i < UID_LENGTH; ++i) {
    result += bytes[i].toString(16);
  }
  return result;
}

/**
 * 删除对象中的方法
 * @param obj 对象
 */
function deleteFunctions(obj) {
  var functionKeys = [];
  for (var key in obj) {
    if (typeof obj[key] === "function") {
      functionKeys.push(key);
    }
  }
  for (var i = 0; i < functionKeys.length; i++) {
    delete obj[functionKeys[i]];
  }
}

module.exports = function serialize(obj, options) {
  /**
   * 设置配置
   */
  options || (options = {});

  // 如果传入第二哥参数是 数字或者字符，直接兼容为 空格
  if (typeof options === 'number' || typeof options === 'string') {
    options = {space: options};
  }

  var functions = [];
  var regexps = [];
  var dates = [];
  var maps = [];
  var sets = [];
  var arrays = [];
  var undefs = [];
  var infinities = [];
  var bigInts = [];

  /**
   * 返回函数和regexp的占位符（由索引标识）它们后来被它们的字符串表示所取代。
   * @param key
   * @param value
   * @returns {string|*}
   */
  function replacer(key, value) {

    // 配置中有忽略函数，则删除
    if (options.ignoreFunction) {
      deleteFunctions(value);
    }

    if (!value && value !== undefined) {
      return value;
    }

    // 如果该值是一个带有toJSON方法的对象，则在replacer运行之前调用toJSON，因此我们使用这个[key]来获取非toJSON值
    var origValue = this[key];
    var type = typeof origValue;

    if (type === 'object') {
      if (origValue instanceof RegExp) {
        return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';
      }

      if (origValue instanceof Date) {
        return '@__D-' + UID + '-' + (dates.push(origValue) - 1) + '__@';
      }

      if (origValue instanceof Map) {
        return '@__M-' + UID + '-' + (maps.push(origValue) - 1) + '__@';
      }

      if (origValue instanceof Set) {
        return '@__S-' + UID + '-' + (sets.push(origValue) - 1) + '__@';
      }

      if (origValue instanceof Array) {
        // 是否是稀疏数组
        var isSparse = origValue.filter(function () {
          return true
        }).length !== origValue.length;
        if (isSparse) {
          return '@__A-' + UID + '-' + (arrays.push(origValue) - 1) + '__@';
        }
      }
    }

    if (type === 'function') {
      return '@__F-' + UID + '-' + (functions.push(origValue) - 1) + '__@';
    }

    if (type === 'undefined') {
      return '@__U-' + UID + '-' + (undefs.push(origValue) - 1) + '__@';
    }

    if (type === 'number' && !isNaN(origValue) && !isFinite(origValue)) {
      return '@__I-' + UID + '-' + (infinities.push(origValue) - 1) + '__@';
    }

    if (type === 'bigint') {
      return '@__B-' + UID + '-' + (bigInts.push(origValue) - 1) + '__@';
    }

    return value;
  }

  /**
   *
   * @param fn
   * @returns {string}
   */
  function serializeFunc(fn) {
    var serializedFn = fn.toString();
    // 如果是原生函数，抛出错误
    if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
      throw new TypeError('Serializing native function: ' + fn.name);
    }

    // pure functions, example: {key: function() {}}
    if (IS_PURE_FUNCTION.test(serializedFn)) {
      return serializedFn;
    }

    // arrow functions, example: arg1 => arg1+5
    if (IS_ARROW_FUNCTION.test(serializedFn)) {
      return serializedFn;
    }

    //  参数开始的字符位置
    var argsStartsAt = serializedFn.indexOf('(');
    var def = serializedFn.substr(0, argsStartsAt)
      .trim()
      .split(' ')
      .filter(function (val) {
        return val.length > 0
      });

    var nonReservedSymbols = def.filter(function (val) {
      return RESERVED_SYMBOLS.indexOf(val) === -1
    });

    // enhanced literal objects, example: {key() {}}
    if (nonReservedSymbols.length > 0) {
      return (def.indexOf('async') > -1 ? 'async ' : '') + 'function'
        + (def.join('').indexOf('*') > -1 ? '*' : '')
        + serializedFn.substr(argsStartsAt);
    }

    // 箭头函数
    return serializedFn;
  }

  // 检查参数是否直接是函数
  if (options.ignoreFunction && typeof obj === "function") {
    obj = undefined;
  }

  // 防止`JSON.stringify（）`返回'undefined'，方法是序列化为文本字符串：“undefined”。
  if (obj === undefined) {
    return String(obj);
  }

  var str;

  // 如果是 json 且 没有空格
  if (options.isJSON && !options.space) {
    str = JSON.stringify(obj);
  } else {
    str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
  }

  // 防止`JSON.stringify（）`返回'undefined'，方法是序列化为文本字符串：“undefined”。
  if (typeof str !== 'string') {
    return String(str);
  }

  // 替换不安全的字符
  if (options.unsafe !== true) {
    str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
  }

  // 如果没有复杂类型，直接返回
  if (functions.length === 0 && regexps.length === 0 && dates.length === 0 && maps.length === 0 && sets.length === 0 && arrays.length === 0 && undefs.length === 0 && infinities.length === 0 && bigInts.length === 0) {
    return str;
  }

  // Replaces all occurrences of function, regexp, date, map and set placeholders in the
  // JSON string with their string representations. If the original value can
  // not be found, then `undefined` is used.
  return str.replace(PLACE_HOLDER_REGEXP, function (match, backSlash, type, valueIndex) {
    // The placeholder may not be preceded by a backslash. This is to prevent
    // replacing things like `"a\"@__R-<UID>-0__@"` and thus outputting
    // invalid JS.
    if (backSlash) {
      return match;
    }

    if (type === 'D') {
      return "new Date(\"" + dates[valueIndex].toISOString() + "\")";
    }

    if (type === 'R') {
      return "new RegExp(" + serialize(regexps[valueIndex].source) + ", \"" + regexps[valueIndex].flags + "\")";
    }

    if (type === 'M') {
      return "new Map(" + serialize(Array.from(maps[valueIndex].entries()), options) + ")";
    }

    if (type === 'S') {
      return "new Set(" + serialize(Array.from(sets[valueIndex].values()), options) + ")";
    }

    if (type === 'A') {
      return "Array.prototype.slice.call(" + serialize(Object.assign({length: arrays[valueIndex].length}, arrays[valueIndex]), options) + ")";
    }

    if (type === 'U') {
      return 'undefined'
    }

    if (type === 'I') {
      return infinities[valueIndex];
    }

    if (type === 'B') {
      return "BigInt(\"" + bigInts[valueIndex] + "\")";
    }

    var fn = functions[valueIndex];

    return serializeFunc(fn);
  });
}
```

<div style="float: right">更新时间: {docsify-updated}</div>
