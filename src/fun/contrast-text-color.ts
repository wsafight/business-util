// http://stackoverflow.com/a/3943023/112731
// https://codepen.io/znak/pen/aOvMOd

const colorByBgColor = new Map()

/**
 * 根据当前的背景颜色确认文本颜色
 * @param backgroundHexColor
 */
export function contrastTextColor(backgroundHexColor: string) {
  if (colorByBgColor.has(backgroundHexColor)) {
    return colorByBgColor.get(backgroundHexColor)
  }

  let hex = backgroundHexColor
  if (hex.indexOf('#') === 0) {
    hex = hex.substring(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid hex color.' + backgroundHexColor);
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  const textColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF'
  colorByBgColor.set(backgroundHexColor, textColor)
  return textColor
}
