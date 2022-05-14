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


    if (letters.includes(firstChar)) {
        firstLetter = firstChar;
    } else {
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