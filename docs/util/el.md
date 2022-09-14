# 极简 webComponent 库 el

个人想要开发 WebComponent 库很久了，但是很多库要么就功能不足，要么就需要编译以及依赖较大的功能。大家可以参考 WebComponent 组件对比博客 [All the Ways to Make a Web Component - Feb 2022 Update](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/)。

不过最近我发现了让我心动的库 [el](https://github.com/frameable/el)。

## WebComponent 使用

我们同样以上述博客作为例子，来看一看如何实现功能

```js
// 创建需要的模板
const template = document.createElement('template');
template.innerHTML = `
  <style>
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }
  </style>
  <button id="dec">-</button>
  <span id="count"></span>
  <button id="inc">+</button>`;

class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // 获取 dom 节点然后
    this.shadowRoot.getElementById('inc').onclick = () => this.inc();
    this.shadowRoot.getElementById('dec').onclick = () => this.dec();
    this.update(this.count);
  }

  inc() {
    this.update(++this.count);
  }

  dec() {
    this.update(--this.count);
  }

  update(count) {
    this.shadowRoot.getElementById('count').innerHTML = count;
  }
}

customElements.define('my-counter', MyCounter);
```

一方面原生 WebComponent 很原始，开发者需要进行 DOM 操作，同时随着组件状态的增加，connectedCallback 变得非常巨大，难以维护。


## 使用 el 完成开发

如果相同的功能用 el 开发呢？代码如下所示。

```ts
import { El } from './el.js'

class MyCounter extends El {
  created() {
    this.state = this.$observable({ count: 0 });
  }

  inc() {
    this.state.count += 1;
  }

  dec() {
    this.state.count -= 1;
  }


  render(html) {
    return html`
      <button onclick=${this.increment}>-</button>
      <span>${this.state.count}</span>
      <button onclick=${this.increment}>+</button>
    `
  }

  styles(css) {
    return css`
    * {
      font-size: 200%;
    }

    span {
      width: 4rem;
      display: inline-block;
      text-align: center;
    }

    button {
      width: 4rem;
      height: 4rem;
      border: none;
      border-radius: 10px;
      background-color: seagreen;
      color: white;
    }`
  }
}

customElements.define('my-counter', MyCounter);
```

非常棒，它有着非常好的功能！


## 源代码解析

这里我们使用 0.7.3 版本的代码。

```js
export class El extends HTMLElement {
  static els = {}
  static stash = {}
  static tags = {}
  static keys = new WeakMap
  static styles = {}
  static deps = {}
  static Raw = class Raw extends String {}
  constructor() {
    super()
    this._id = `${this.tagName}:${this.getAttribute('key') || Math.random().toString(36).slice(2)}`
    El.style = El.style || El.importStyle()
    this.$html = Object.assign(this.$html.bind(this), { raw: x => new El.Raw(x) })
    this._cache = { d: {}, clear: _ => this._cache.d = {} }
    this._memoize()
    this.$update = this.$update.bind(this)
  }
  connectedCallback() {
    El._contextId = this._id
    this._unstash()
    this.created && !this._created && this.created()
    this._created = true
    El.els[this._id] = this
    this._update()
    this.mounted && this.mounted()
    if (El.tags[this.tagName] && !this.getAttribute('key'))
      console.warn(`Each ${this.tagName} should have a unique \`key\` attribute`)
    El.tags[this.tagName] = true
  }
  disconnectedCallback() {
    this.unmounted && this.unmounted()
  }
  _memoize() {
    const descriptors = Object.getOwnPropertyDescriptors(this.constructor.prototype)
    for (const [key, d] of Object.entries(descriptors).filter(x => x[1].get))
      Object.defineProperty(this.constructor.prototype, key, {
        get() {
          return (key in this._cache.d) ? this._cache.d[key] : (this._cache.d[key] = d.get.call(this))
        }
      })
    this.constructor.prototype._memoize = new Function;
  }
  $update() {
    this._queued = this._queued || requestAnimationFrame(_ => this._update() || delete this._queued)
  }
  _update() {
    El._contextId = this._id
    this._cache.clear();
    this._unstash()
    const html = this.render && this.render(this.$html);
    const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' })
    El.styles[this.tagName] = El.styles[this.tagName] ||
      `<link rel="stylesheet" href="data:text/css;base64,${btoa(El.style + (this.styles && this.styles(El.zcss)) || '')}">`
    El.morph(shadow, document.createRange().createContextualFragment(El.styles[this.tagName] + html))
    this._unstash()
    El._contextId = null
  }
  _unstash() {
    const camel = s => s.replace(/-\w/g, c => c[1].toUpperCase())
    const _contextId = El._contextId;
    El._contextId = this._id;
    for (const el of [...(this.shadowRoot || this).querySelectorAll('*'), this])
      for (const attr of el.attributes)
        if (attr.value in El.stash) el[camel(attr.name)] = El.stash[attr.value]
        else if (attr.name in el.__proto__) {}
        else try { el[camel(attr.name)] = attr.value } catch {}
    El._contextId = _contextId
  }
  get $refs() {
    return new Proxy({}, { get: (obj, key) => this.shadowRoot.querySelector(`[ref="${key}"]`) });
  }
  $watch(_, fn) {
    if (!El.dep._path) return;
    El.deps[El.dep._path] = El.deps[El.dep._path] || {};
    El.deps[El.dep._path][Math.random()] = fn;
    El.dep._path = null;
  }
  $observable() {
    return El.observable(...arguments);
  }
  async $nextTick() {
    return await El.nextTick();
  }
  $html(strings, ...vals) {
    for (const [i] of strings.entries()) {
      if ((typeof vals[i]).match(/object|function/) && strings[i].endsWith('=')) {
        vals[i] = typeof vals[i] == 'function' ? vals[i].bind(this) : vals[i]
        const key = El.keys.get(vals[i].__target__ || vals[i]) || 'el:' + Math.random().toString(36).slice(2)
        El.keys.set(vals[i].__target__ || vals[i], key)
        El.stash[key] = vals[i]
        vals[i] = JSON.stringify(key)
      }
      else if (strings[i].endsWith('=')) vals[i] = JSON.stringify(vals[i])
      else if (vals[i] instanceof Array) vals[i] = vals[i].join('')
      else vals[i] = El.escape(vals[i])
    }
    return new El.Raw(strings.map((s, i) => [s, vals[i]].join``).join``)
  }
  static importStyle() {
    let src = ''
    for (const el of document.querySelectorAll('style, link[rel="stylesheet"]'))
      src += el.tagName == 'STYLE' ? el.innerHTML : `\n@import url(${el.href});\n`
    return src;
  }
  static notify(path) {
    for (const id in El.deps[path] || {}) setTimeout(_ => El.deps[path][id]())
  }
  static dep(path) {
    El.dep._path = !El._contextId && path
    if (!El._contextId) return true
    const contextId = El._contextId
    El.deps[path] = El.deps[path] || {}
    return El.deps[path][El._contextId] = _ => El.els[contextId].$update()
  }
  static observable(x, path = Math.random().toString(36).slice(2)) {
    if ((typeof x != 'object' || x === null) && El.dep(path)) return x
    return new Proxy(x, {
      set(x, key) {
        return El.notify(path + '/' + key) || Reflect.set(...arguments);
      },
      get(x, key) {
        return x.__target__ ? x[key]
          : typeof key == "symbol" ? Reflect.get(...arguments)
          : (key in x.constructor.prototype && El.dep(path + '/' + key)) ? x[key]
          : (key == '__target__') ? x
          : El.observable(x[key], path + '/' + key);
      }
    });
  }
  static morph(l, r) {
    let ls = 0, rs = 0, le = l.childNodes.length, re = r.childNodes.length
    const lc = [...l.childNodes], rc = [...r.childNodes]
    const content = e => e.nodeType == 3 ? e.textContent : e.nodeType == 1 ? e.outerHTML : ''
    const key = e => e.nodeType == 1 && customElements.get(e.tagName.toLowerCase()) && e.getAttribute('key') || NaN

    for (const a of r.attributes || [])
      if (l.getAttribute(a.name) != a.value) {
        l.setAttribute(a.name, a.value)
        if (l.constructor.prototype.hasOwnProperty(a.name) && typeof l[a.name] == 'boolean') l[a.name] = true
        l.$update && l.$update()
      }
    for (const a of l.attributes || [])
      if (!r.hasAttribute(a.name)) {
        l.removeAttribute(a.name)
        if (l.constructor.prototype.hasOwnProperty(a.name) && typeof l[a.name] == 'boolean') l[a.name] = false
      }

    while (ls < le || rs < re)
      if (ls == le) l.insertBefore(lc.find(l => key(l) == key(rc[rs])) || rc[rs], lc[ls]) && rs++
      else if (rs == re) l.removeChild(lc[ls++])
      else if (content(lc[ls]) == content(rc[rs])) ls++ & rs++
      else if (content(lc[le - 1]) == content(rc[re - 1])) le-- & re--
      else if (lc[ls] && rc[rs].children && lc[ls].tagName == rc[rs].tagName) El.morph(lc[ls++], rc[rs++])
      else lc[ls++].replaceWith(rc[rs++])
  }
  static async nextTick(f) {
    await new Promise(r => setTimeout(_ => requestAnimationFrame(_ => { f && f(); r() })))
  }
  static zcss(...args) {
    let lines = [], stack = [], open, opened, close
    const src = args.join('').replace(/,\n/gs, ',')
    for (let line of src.split(/\n/)) {
      line = line.replace(/(.+,.+){/, ":is($1){")
      if (line.match(/^\s*@[msdk].*\{/))
        opened = open = close = (opened && !lines.push('}')) || lines.push(line) & 0
      else if (line.match(/\{\s*$/)) open = stack.push(line.replace('{','').trim()) | 1
      else if (line.match(/\s*\}\s*$/)) close = (!stack.pop() && lines.push('}')) | 1
      else {
        if (!line.trim()) continue
        if (opened && (open || close)) opened = close = lines.push('}') & 0
        if (open || close) opened = !(open = lines.push(stack.join` `.replace(/ &/g, '') + '{') & 0)
        lines.push(line)
      }
    }
    return close && lines.push('}') && lines.join('\n')
  }
  static escape(v) {
    return v instanceof El.Raw ? v : v === 0 ? v : String(v || '').replace(/[<>'"]/g, c => `&#${c.charCodeAt(0)}`)
  }
}
```

完美！

## 其他

添加 [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 方便用户使用即可！