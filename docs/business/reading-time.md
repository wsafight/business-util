# 计算文章阅读时长

我们在浏览博客网站时候，博文上方往往会显示阅读时长(xx 分钟)。这个可以参考开源库 [reading-time](https://github.com/ngryman/reading-time/blob/master/lib/reading-time.js
)。

```ts
function ansiWordBound(c: string) {
  return (
    (' ' === c) ||
    ('\n' === c) ||
    ('\r' === c) ||
    ('\t' === c)
  )
}

interface ReadingTimeOptions {
  /** 每分钟阅读单词 */
  wordsPerMinute?: number;
  /** 文字限制 */
  wordBound?: any
}

function readingTime(text: string, options: ReadingTimeOptions = {
wordsPerMinute: 200
}) {
  let words = 0, start = 0, end = text.length - 1, wordBound, i


  wordBound = options.wordBound ?? ansiWordBound

  // 清除 文本中的空白数据
  while (wordBound(text[start])) start++
  while (wordBound(text[end])) end--

  // 计算多少文字
  for (i = start; i <= end;) {
    for (; i <= end && !wordBound(text[i]); i++) ;
    words++
    for (; i <= end && wordBound(text[i]); i++) ;
  }

  // 每分钟阅读多少文字
  const minutes = words / options.wordsPerMinute
  const time = minutes * 60 * 1000
  const displayed = Math.ceil(+minutes.toFixed(2))

  return {
    text:  `${displayed} 分钟阅读`,
    minutes: minutes,
    time: time,
    words: words
  }
}
```

实际上，对于不同类型，不同深度的博文，以及不同知识程度的读者，往往很难根据字数来判定阅读时长。所以这种数据也仅供参考。

<div style="float: right">更新时间: {docsify-updated}</div>
