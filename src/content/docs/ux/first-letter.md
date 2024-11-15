---
title: 获取汉字拼音首字母
description: 获取汉字拼音首字母
---

前端可以直接可以根据 localeCompare API 来进行中文按照拼音排序。我们也可以根据 localeCompare 来确认当前中文的拼音首字母(常用于地址、手机号等联系人排序功能)。

```ts
// 获取可以使用的英文，去除 iuv 等不能作为拼音首字母的字符
const letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('')
// 中文对应拼音的首位
const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')

export const getTheFirstLetterForPinyin = (chineseChar = '', useUpperCase = false) => {
    // 如果没有 localeCompare， 直接返回空字符串
    if (!String.prototype.localeCompare) {
        return ''
    }

    // 获取的中文如果不是字符串或者长度为 0， 直接返回
    if (typeof chineseChar !== 'string' || !chineseChar.length) {
        return ''
    }

    let firstLetter = ''
    const firstChar = chineseChar[0]
    // 如果是字母或者数字，直接返回当前字符
    if (/^\w/.test(firstChar)) {
        firstLetter = firstChar;
    } else {
        // 否则去对比按照排序决定当前汉子的位置，然后确认拼音首字母
        letters.some((item, index) => {
            if (firstChar.localeCompare(zh[index]) >= 0 && firstChar.localeCompare(zh[index + 1]) < 0) {
                firstLetter = item
                return true
            }
            return false
        })
    }

    return useUpperCase ? firstLetter.toUpperCase() : firstLetter.toLowerCase()
}
```

进一步来看，我们可以根据该函数获取整个拼音：

```ts
'你好世界'.split('').map(item => getTheFirstLetterForPinyin(item)).join('')
// => nhsj
```

如此，我们可以把首字母数据存储到数据库用于数据库检索(用户只输入拼音首字母是非常简单的)。当然，中文的多音字也会让其发生部分错误如：音乐会变成 “yl”。但是大部分情况下，该方案简单有效。如果涉及到多音字以及更加精细的匹配可以使用 [pinyin-pro](https://github.com/zh-lx/pinyin-pro) 库。