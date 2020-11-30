// https://github.com/ngryman/reading-time/blob/master/lib/reading-time.js

function ansiWordBound(c: string) {
  return (
    (' ' === c) ||
    ('\n' === c) ||
    ('\r' === c) ||
    ('\t' === c)
  )
}

interface ReadingTimeOptions {
  wordsPerMinute?: number;
  wordBound?: any
}

function readingTime(text: string, options: ReadingTimeOptions) {
  let words = 0, start = 0, end = text.length - 1, wordBound, i

  options = options || {}

  // use default values if necessary
  options.wordsPerMinute = options.wordsPerMinute || 200

  // use provided function if available
  wordBound = options.wordBound || ansiWordBound

  // fetch bounds
  while (wordBound(text[start])) start++
  while (wordBound(text[end])) end--

  // calculate the number of words
  for (i = start; i <= end;) {
    for (; i <= end && !wordBound(text[i]); i++) ;
    words++
    for (; i <= end && wordBound(text[i]); i++) ;
  }

  // reading time stats
  const minutes = words / options.wordsPerMinute
  const time = minutes * 60 * 1000
  const displayed = Math.ceil(+minutes.toFixed(2))

  return {
    text: displayed + ' min read',
    minutes: minutes,
    time: time,
    words: words
  }
}

export default readingTime