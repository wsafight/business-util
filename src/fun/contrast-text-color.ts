// http://stackoverflow.com/a/3943023/112731
// https://codepen.io/znak/pen/aOvMOd
/**
 * 根据当前的背景颜色确认适合背景色的文本颜色 (文本仅仅支持黑 和 白)
 */

const colorByBgColor = new Map()

const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/

const hex = (x: string) => ("0" + parseInt(x).toString(16)).slice(-2);

function convertRGBToHex(rgb: string): string {
  const bg = rgb.match(rgbRegex);
  if (!bg) {
    return ''
  }
  return ("#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3])).toUpperCase();
}

/**
 * @param backgroundColor 字符串  #FFFBBC | rgb(222,33,44) 均可
 */
export function contrastTextColor(backgroundColor: string) {
  // 均转换为 hex 格式
  const backgroundHexColor = backgroundColor.length > 7 ? convertRGBToHex(backgroundColor) : backgroundColor

  if (colorByBgColor.has(backgroundHexColor)) {
    return colorByBgColor.get(backgroundHexColor)
  }

  let hex = backgroundHexColor
  if (hex.startsWith('#')) {
    hex = hex.substring(1);
  }
  if (hex.length === 3) {
    hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]].join('')
  }

  if (hex.length !== 6) {
    throw new Error('Invalid hex color.' + backgroundHexColor);
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#FFF'
  colorByBgColor.set(backgroundHexColor, textColor)
  return textColor
}
