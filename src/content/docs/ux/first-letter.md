---
title: 妙用 localeCompare 获取汉字拼音首字母
description: 详解如何在前端使用 localeCompare API 获取汉字拼音首字母，实现中文排序与检索功能
---

在前端开发中，开发者通常会使用 `localeCompare` 来进行中文字符的排序比较。但 `localeCompare` 还有一种较为少见的应用场景 —— 通过获取中文字符的拼音首字母来实现检索功能。本文将详细介绍这一实用技巧及其应用。

## 原理

`localeCompare` 方法允许字符串按特定语言环境的排序规则进行比较。在中文环境下，它会默认按照汉字的拼音顺序进行排序。基于这一特性：

1. 准备一组具有代表性的汉字作为基准点（每个字代表一个拼音首字母的起始位置）
2. 将目标汉字与这些基准字进行 `localeCompare` 比较
3. 根据比较结果确定目标汉字的拼音首字母范围

这种方法无需依赖第三方拼音库，实现简单且轻量，适合大多数基础场景。

## 应用场景

获取汉字拼音首字母在中文应用开发中有广泛的应用场景：

- **联系人列表排序**：按拼音首字母对联系人进行分组排序
- **城市选择器**：按首字母索引快速定位城市
- **拼音搜索**：将拼音首字母存储到数据库中，用户输入拼音首字母即可检索相关内容
- **数据分类展示**：将中文数据按拼音首字母进行分类展示

## 核心代码

下面是获取汉字拼音首字母的核心函数实现：

```ts
/**
 * 获取汉字的拼音首字母
 * @param chineseChar 中文字符串，若传入多字符则只取第一个字符
 * @param useUpperCase 是否返回大写字母，默认为false（小写）
 * @returns 拼音首字母，若无法识别则返回空字符串
 */
export const getTheFirstLetterForPinyin = (chineseChar: string = '', useUpperCase: boolean = false): string => {
    // 兼容性检查：确保浏览器支持 localeCompare 方法
    if (!String.prototype.localeCompare) {
        return '';
    }

    // 参数验证：确保输入为有效字符串
    if (typeof chineseChar !== 'string' || !chineseChar.length) {
        return '';
    }

    // 准备用于比较的字母表和基准汉字
    // 注：这些基准汉字分别对应A、B、C...等拼音首字母的起始位置
    const letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('');
    const zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('');

    let firstLetter = '';
    const firstChar = chineseChar[0];

    // 处理字母和数字：直接返回原字符
    if (/^\w/.test(firstChar)) {
        firstLetter = firstChar;
    } else {
        // 处理汉字：通过比较确定拼音首字母范围
        letters.some((item, index) => {
            // 检查当前字符是否在当前基准汉字与下一个基准汉字之间
            if (firstChar.localeCompare(zh[index]) >= 0 && 
                (index === letters.length - 1 || firstChar.localeCompare(zh[index + 1]) < 0)) {
                firstLetter = item;
                return true;
            }
            return false;
        });
    }

    // 根据参数决定返回大写还是小写字母
    return useUpperCase ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
}
```

## 实用示例

### 获取单个汉字的拼音首字母

```ts
// 获取单个汉字的拼音首字母
getTheFirstLetterForPinyin('你'); // => 'n'
getTheFirstLetterForPinyin('好', true); // => 'H'
getTheFirstLetterForPinyin('123'); // => '1'
getTheFirstLetterForPinyin(''); // => ''
```

### 获取字符串的拼音首字母缩写

```ts
/**
 * 获取整个字符串的拼音首字母缩写
 * @param str 输入字符串
 * @returns 拼音首字母缩写
 */
function getPinyinInitials(str: string): string {
    return str.split('')
        .map(char => getTheFirstLetterForPinyin(char))
        .join('');
}

getPinyinInitials('你好世界'); // => 'nhsj'
getPinyinInitials('JavaScript中文教程'); // => 'javascriptzwjc'
getPinyinInitials('加油123'); // => 'jy123'
```

### 联系人列表按首字母分组

```ts
// 将联系人列表按拼音首字母分组
function groupContactsByInitial(contacts: {name: string}[]): Record<string, {name: string}[]> {
    const groups: Record<string, {name: string}[]> = {};
    
    // 按首字母分组
    contacts.forEach(contact => {
        const initial = getTheFirstLetterForPinyin(contact.name, true);
        if (!groups[initial]) {
            groups[initial] = [];
        }
        groups[initial].push(contact);
    });
    
    return groups;
}

const contacts = [
    {name: '张三'},
    {name: '李四'},
    {name: '王五'},
    {name: '赵六'}
];

// 按首字母分组
const groupedContacts = groupContactsByInitial(contacts);

// 还可以进一步通过 localeCompare 实现组内排序，此处暂时不做操作
/*
结果：
{
    'L': [{name: '李四'}],
    'W': [{name: '王五'}],
    'Z': [{name: '张三'}, {name: '赵六'}]
}
*/
```


## 局限性与替代方案

`localeCompare` 方法在现代浏览器中得到广泛支持（除了 IE11 前的版本不可用之外，其余浏览器均完全支持）。

### 局限性

1. **多音字问题**：该方法无法处理多音字情况，例如"音乐"会被识别为"yl"而非"yy"
2. **准确性限制**：对于一些生僻字，可能无法准确识别其拼音首字母
3. **依赖浏览器实现**：不同浏览器的 `localeCompare` 实现可能略有差异

### 替代方案

如果需要更强大的拼音处理功能，可以考虑使用以下第三方库：

- [pinyin-pro](https://github.com/zh-lx/pinyin-pro)：支持多音字识别、音调标注等高级功能
- [pinyinjs](https://github.com/hotoo/pinyin)：轻量级的拼音转换库


通过 localeCompare API，可以在不依赖第三方库的情况下，快速实现中文拼音首字母的获取功能，为您的应用添加更加友好的中文处理能力。