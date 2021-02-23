# 过去（未来）时间格式化

[timeago.js](https://github.com/hustcc/timeago.js) 是一个非常好用的格式化库。

## 简单使用

```ts
import { format } from 'timeago.js';

// format timestamp
format(1544666010224);
// => '2 years ago'

// format date instance
format(new Date(1544666010224));
// => '2 years ago'

// format date string
format('2018-12-12');
// => '2 years ago'

// format with locale
format(1544666010224, 'zh_CN');
// => '2 years ago'

// format with locale and relative date
format(1544666010224, 'zh_CN', { relativeDate: '2018-11-11' });
// => '1 个月后'

// e.g.
format(Date.now() - 11 * 1000 * 60 * 60); // returns '11 hours ago'
// '11 hours ago'
```

该库支持国际化，你可以自行注册语言环境。

```ts
import { format, register } from 'timeago.js';

const localeFunc = (number: number, index: number, totalSec: number): [string, string] => {
  // number: the timeago / timein number;
  // index: the index of array below;
  // totalSec: total seconds between date to be formatted and today's date;
  return [
    ['just now', 'right now'],
    ['%s seconds ago', 'in %s seconds'],
    ['1 minute ago', 'in 1 minute'],
    ['%s minutes ago', 'in %s minutes'],
    ['1 hour ago', 'in 1 hour'],
    ['%s hours ago', 'in %s hours'],
    ['1 day ago', 'in 1 day'],
    ['%s days ago', 'in %s days'],
    ['1 week ago', 'in 1 week'],
    ['%s weeks ago', 'in %s weeks'],
    ['1 month ago', 'in 1 month'],
    ['%s months ago', 'in %s months'],
    ['1 year ago', 'in 1 year'],
    ['%s years ago', 'in %s years']
  ][index];
};
// register your locale with timeago
register('my-locale', localeFunc);

// use it
format('2016-06-12', 'my-locale');
```

## dom 结构

```html
<div class="timeago" datetime="2016-06-30 09:20:00"></div>
```

```ts
import { render, cancel } from 'timeago.js';

const nodes = document.querySelectorAll('.timeago');

// use render method to render nodes in real time
render(nodes, 'zh_CN')

```

当然 render 携带了配置，在第三个参数中

```ts
export type Opts = {
  /** 相对时间，什么时间作为对比时间 */
  readonly relativeDate?: TDate;
  /** 在页面中可以实时刷新，单位为秒 */
  readonly minInterval?: number;
};
```

同时也有 React 版本和 Python 版本: [timeago-react](https://github.com/hustcc/timeago-react) 和 [timeago](https://github.com/hustcc/timeago)

如果你当前做博客平台或者时间不敏感的系统中，可以完全使用。

当然，真实的业务场景不仅仅会表现时间格式化，同时在某些情况下超过一定的时间就显示具体的日期。

例如: 企业系统往往需要的是确切的时间。我们可以在 1 天内显示格式化时间， 100 天内显示格式化的时间 + 月日，超过 100 天显示年月日。