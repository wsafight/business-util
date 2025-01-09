// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from 'starlight-image-zoom'


// https://astro.build/config
export default defineConfig({
  site: "https://wsafight.github.io",
  base: "business-util",
  redirects: {
    "/": "/business-util/business/currency",
  },
  integrations: [
    starlight({
      title: "实用工具集",
      social: {
        github: "https://github.com/wsafight/business-util",
      },
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      sidebar: [
        {
          label: "业务工具",
          items: [
            { label: "简单货币格式化", slug: "business/currency" },
            {
              label: "通过 Dinero 和 Intl 处理货币数据",
              slug: "business/dinero",
            },
            {
              label: "文件大小格式化 (简单版)",
              slug: "business/format-file-size",
            },
            { label: "文件格式化库 filesize", slug: "business/filesize" },
            { label: "根据数组构建树", slug: "business/build-tree" },
            { label: "树组件查询", slug: "business/array-tree-filter" },
            { label: "计算博客阅读时长", slug: "business/reading-time" },
            {
              label: "根据背景色自适应文本颜色",
              slug: "business/contrast-text-color",
            },
            { label: "输入错误提示 —— 模糊集", slug: "business/fuzzy-set" },
            { label: "阿拉伯数字与中文数字的相互转换", slug: "business/nzh" },
            { label: "网页公式排版工具 KaTeX", slug: "business/katex" },
            { label: "颜色排序算法", slug: "business/color-sort" },
            {
              label: "交互式医学图像工具 Cornerstone",
              slug: "business/cornerstone",
            },
            { label: "快速制作出响应式邮件的框架 Mjml", slug: "business/mjml" },
            { label: "超长定时器 long-timeout", slug: "business/long-timeout" },
            {
              label: "基于内存的全文搜索引擎 MiniSearch",
              slug: "business/mini-search",
            },
            { label: "机器人工具集合", slug: "business/robot-tools" },
          ],
        },
        {
          label: "功能扩展",
          items: [
            { label: "js 手写生成 pdf", slug: "extends/jspdf" },
            { label: "查找解析祖先文件工具 find-up", slug: "extends/find-up" },
            { label: "聊聊 Unicode 编码", slug: "extends/unicode" },
            { label: "打印", slug: "extends/printer" },
          ],
        },
        {
          label: "用户体验",
          items: [
            { label: "自然语言日期解析器 Chrono", slug: "ux/chrono" },
            { label: "使用 escape 解决 HTML 空白折叠", slug: "ux/escape" },
            { label: "组合键提升用户体验", slug: "ux/key-manage" },
            { label: "提升交互体验的 web Observer", slug: "ux/web-observer" },
            { label: "切换中文简繁字体", slug: "ux/font-east" },
            { label: "使用 gsap 操纵动画序列", slug: "ux/gsap" },
            { label: "获取汉字拼音首字母", slug: "ux/first-letter" },
            { label: "禁止浏览器进行表单填充", slug: "ux/disable-auto-fill" },
            {
              label: "手写一个同步服务端时间的小工具",
              slug: "ux/sync-server-time",
            },
            { label: "使用凭证优化登录流程", slug: "ux/credential-api" },
          ],
        },
        {
          label: "开发工具",
          items: [
            { label: "快速调试编辑器 RunJS", slug: "develop-tools/runjs" },
            { label: "TypeScript 代码执行工具", slug: "develop-tools/ts-node" },
            { label: "自动切换故障 CDN 工具", slug: "develop-tools/freecdn" },
            {
              label: "LocalCDN 插件提升网站加载速度",
              slug: "develop-tools/location-cdn",
            },
            {
              label: "静态代码分析工具 Understand",
              slug: "develop-tools/understand",
            },
            {
              label: "漂亮的专业排版软件 TeXMacs",
              slug: "develop-tools/texmacs",
            },
            {
              label: "跨平台的音乐播放器 Listen1",
              slug: "develop-tools/listen1",
            },
            {
              label: "开发者的边车辅助工具 DevSidecar",
              slug: "develop-tools/dev-sidecar",
            },
            { label: "字符串化对象结构库 qs", slug: "develop-tools/qs" },
            {
              label: "使用 Lighthouse 审查网络应用",
              slug: "develop-tools/lighthouse",
            },
            {
              label: "sourcemap 可视化工具",
              slug: "develop-tools/source-map-visualization",
            },
          ],
        },
        {
          label: "效率工具",
          items: [
            {
              label: "搜索和更改代码结构的工具 comby",
              slug: "efficiency-tools/comby",
            },
            {
              label: "大文件版本控制工具 git lfs",
              slug: "efficiency-tools/git-lfs",
            },
            {
              label: "计算项目代码行数工具 cloc",
              slug: "efficiency-tools/cloc",
            },
            { label: "影刀 RPA", slug: "efficiency-tools/yingdao-rpa" },
            { label: "git 图形化工具 lazygit", slug: "efficiency-tools/lazygit"}
          ],
        },
        {
          label: "辅助开发",
          items: [
            { label: "开发助力 mermaid 绘制图表", slug: "help/mermaid" },
            { label: "文件类型检测", slug: "help/file-type" },
            { label: "小数位计算的四舍五入", slug: "help/round" },
            { label: "项目版本比对", slug: "help/compare-version" },
            { label: "url 构造", slug: "help/url-cat" },
            { label: "stub 函数", slug: "help/stub" },
            { label: "生成唯一 id", slug: "help/generate-uuid" },
            { label: "微任务延迟调度", slug: "help/next-tick" },
            {
              label: "根据对象路径安全获取对象值",
              slug: "help/get-value-by-key",
            },
            { label: "根据复杂对象路径操作对象", slug: "help/wild-wild-utils" },
            { label: "不可变数据工具库", slug: "help/immutability-helper" },
            { label: "优秀的不可变状态库 immer", slug: "help/immer" },
            { label: "前端构建工具配置生成器", slug: "help/create-app" },
            { label: "tsconfig.json 生成器", slug: "help/tsconfiger" },
            {
              label: "利用 XState(有限状态机) 编写易于变更的代码",
              slug: "help/x-state",
            },
            {
              label: "使用 better-queue 管理复杂的任务",
              slug: "help/better-queue",
            },
            {
              label: "跳转页面时可靠的发送埋点信息",
              slug: "help/navigator-beacon",
            },
            { label: "web 多线程开发工具 comlink", slug: "help/comlink" },
            { label: "Service Worker 工具箱 workbox", slug: "help/workbox" },
            { label: "前端开发中的依赖注入 awilix", slug: "help/awilix" },
            {
              label: "前端存储工具库 storage-tools",
              slug: "help/storage-tools",
            },
            { label: "小型 js 压缩工具", slug: "help/roadroller" },
            { label: "自动注入关系的依赖注入", slug: "help/ioc-controller" },
            { label: "通用微型状态管理器 nanostores", slug: "help/nanostores" },
            { label: "更强大的超文本标记语言 htmx", slug: "help/htmx" }
          ],
        },
        {
          label: "正则匹配工具",
          items: [
            {
              label: "用编程的方式清晰的构建正则表达式",
              slug: "regex/super-expressive",
            },
            {
              label: "高度优化的 glob 匹配库 micromatch",
              slug: "regex/micromatch",
            },
            {
              label: "基于数字范围生成高性能正则",
              slug: "regex/to-regex-range",
            },
            { label: "基于字符串生成 DFA 正则表达式", slug: "regex/regexgen" },
          ],
        },
        {
          label: "实用工具",
          items: [
            { label: "文件下载", slug: "util/down-file" },
            {
              label: "JSON 的超集 serialize-javascript",
              slug: "util/serialize-javascript",
            },
            { label: "JSON 超级序列化工具", slug: "util/superjson" },
            { label: "数据扁平化工具 normalizr", slug: "util/normalizr" },
            { label: "微小的 bus 库 mitt", slug: "util/mitt" },
            { label: "检测图像 (视频) 加载完成库", slug: "util/egjs-imready" },
            { label: "专业的深拷贝库", slug: "util/deep-clone" },
            { label: "强大的业务缓存库 memoizee", slug: "util/memoizee" },
            { label: "请求限流", slug: "util/query-limit" },
            { label: "强大的异步库 async", slug: "util/async" },
            {
              label: "启发式缓存库 proxy-memoizee",
              slug: "util/proxy-memoizee",
            },
            { label: "过去（未来）时间格式化", slug: "util/timeago" },
            { label: "函数响应式开发库 RxJS", slug: "util/rxjs" },
          ],
        },
        {
          label: "web 安全",
          items: [
            { label: "安全三要素", slug: "security/point" },
            { label: "使用 HTTPS", slug: "security/https" },
            { label: "css 键盘记录器", slug: "security/css-key-logging" },
            { label: "xss 过滤器 DOMPurify", slug: "security/dom-purify" },
            { label: "CSP 内容安全策略", slug: "security/csp" },
            { label: "防御 ReDoS 攻击", slug: "security/regexploit" },
            {
              label: "使用 HttpOnly 解决 XSS Cookie 劫持",
              slug: "security/httponly",
            },
            { label: "浏览器原生 xss 过滤器", slug: "security/sanitizer" },
            {
              label: "文件名替换非法字符串",
              slug: "security/normalize-file-name",
            },
            { label: "前端 CORS 工具 XDomain", slug: "security/x-domain" },
            {
              label: "使用一行代码发现前端 js 库漏洞",
              slug: "security/is-website-vulnerable",
            },
            { label: "URL 验证", slug: "security/url-check" },
            { label: "有趣的安全补丁", slug: "security/fun" },
          ],
        },
        {
          label: "性能优化",
          items: [
            {
              label: "压缩传递对象的 JavaScript 工具库 u-node",
              slug: "performance/u-node",
            },
            { label: "使用 Bun 提升代码运行效率", slug: "performance/bun" },
            {
              label: "高性能的 JavaScript 运行时 just-js",
              slug: "performance/just-js",
            },
            {
              label: "单例 Promise 缓存！",
              slug: "performance/single-promise-cache",
            },
            { label: "图片压缩服务 tiny-png", slug: "performance/tiny-png" },
            { label: "动态加载脚本与样式！", slug: "performance/down-script" },
            { label: "利用 gpu 加速数据运算", slug: "performance/gpu" },
            {
              label: "通过批处理避免布局抖动 fastDom",
              slug: "performance/fastdom",
            },
            {
              label: "提高转化率的预请求库 instant.page",
              slug: "performance/instant-page",
            },
            {
              label: "提高转化率的预渲染库 quicklink",
              slug: "performance/quicklink",
            },
            {
              label: "跳过 v8 pre-Parse 优化代码性能库 optimize-js",
              slug: "performance/optimize-js",
            },
            { label: "通过重用减少垃圾回收", slug: "performance/reusify" },
            { label: "AVIF 图片格式", slug: "performance/avif" },
            {
              label: "利用 'ts' 编译 WebAssembly",
              slug: "performance/assembly-script",
            },
            {
              label: "通过扁平字符串提升输出性能",
              slug: "performance/flatstr",
            },
            { label: "网络性能监控库 Perfume", slug: "performance/perfume" },
            {
              label: "加快执行速度的编译缓存工具 v8-compile-cache",
              slug: "performance/v8-compile-cache",
            },
            {
              label: "让 React 拥有更快的虚拟 DOM",
              slug: "performance/million",
            },
            {
              label: "复杂的主线程调度工具库",
              slug: "performance/main-thread-scheduling",
            },
          ],
        },
        {
          label: "测试",
          items: [
            { label: "服务端性能测试工具 JMeter", slug: "test/jmeter" },
            { label: "流量复制工具 GoReplay", slug: "test/goreplay" },
            { label: "使用 Pollyjs 进行 HTTP 请求测试", slug: "test/polly-js" },
            { label: "新的端到端测试框架 cypress", slug: "test/cypress" },
            { label: "猴子测试工具 gremlins", slug: "test/gremlins" },
          ],
        },
        {
          label: "调试",
          items: [
            { label: "修改 window 上的变量", slug: "debug/win-char-change" },
            { label: "使用代理查看对象调用", slug: "debug/proxy" },
            { label: "查找调试 JS 全局变量", slug: "debug/global-check" },
          ],
        },
        {
          label: "js 语言解析",
          items: [
            {
              label: "New Function 创建异步函数",
              slug: "language/new-async-function",
            },
            { label: "函数拷贝", slug: "language/clone-function" },
            { label: "取得范围数据", slug: "language/range" },
            { label: "通向地狱的 ES1995", slug: "language/es1995" },
            {
              label: "对比 switch (true) 和 if else 判断",
              slug: "language/switch-true",
            },
            { label: "奇怪的 parseInt(0.0000005)", slug: "language/parse-int" },
            { label: "使用宏扩展 JavaScript 语言", slug: "language/macro" },
            {
              label: "玩转 AbortController 控制器",
              slug: "language/abort-controller",
            },
            { label: "ponyfills", slug: "language/ponyfills" },
            { label: "esm 动态引入", slug: "language/esm-import" },
          ],
        },
        {
          label: "面向未来的浏览器 API",
          items: [
            { label: "浏览器文件操作", slug: "browser/browser-fs-access" },
            {
              label: "压缩 API Compression Streams",
              slug: "browser/compression-streams",
            },
            {
              label: "浏览器中的取色器 API EyeDropper",
              slug: "browser/eye-dropper",
            },
          ],
        },
        {
          label: "工程化工具",
          items: [
            {
              label: "利用增量构建工具 Preset 打造自己的样板库",
              slug: "engineering/preset",
            },
            { label: "依赖库本地调试 yalc", slug: "engineering/yalc" },
            {
              label: "构建工具统一插件工具 unplugin",
              slug: "engineering/unplugin",
            },
            { label: "高性能 Web 渲染引擎 kraken", slug: "engineering/kraken" },
          ],
        },
        {
          label: "脚本工具",
          items: [
            {
              label: "使用 JS 编写脚本的工具 zx",
              slug: "script/zx",
            },
            { label: "通过灭霸脚本学 shell", slug: "script/thanos_sh" },
            { label: "使用 corn 实现定时任务", slug: "script/cron" },
            { label: "纠正控制台错误命令工具", slug: "script/thefuck" },
          ],
        },
        {
          label: '实用数据结构',
          items: [
            { label: "前缀树", slug: "data-structure/trie-tree" },
            { label: "并查集", slug: "data-structure/union-find" }, 
            { label: "哈希表", slug: "data-structure/hash-table" },
            { label: "优先队列", slug: "data-structure/priority-queue" }, 
            { label: "跳表", slug: "data-structure/skip-table" },
            { label: "参考 C++ STL 实现的的数据结构库 js-sdsl", slug: "data-structure/js-sdsl" }, 
          ]
        },
        {
          label: "开源游戏&框架",
          items: [
            { label: "群侠传，启动！", slug: "games/jyqxz" },
            { label: "网页端视觉小说引擎 WebGAL", slug: "games/webgal" },
          ],
        },
      ],
      plugins: [
        starlightImageZoom()
      ],
      customCss: [
        './src/styles/custom.css',
      ],
    }),
  ],
  compressHTML: true,
});
