// https://raw.githubusercontent.com/openexchangerates/accounting.js/master/accounting.js

/** 币种设置 */
interface CurrencySetting {
  /** 币种名称 */
  name: string;
  /** 币种符号 */
  symbol: string;
  /** 符号位置 */
  symbolPosition: 'before' | 'after';
  /** 小数点 符号 */
  decimal: string;
  /** 分组字符串 */
  group: string;
  /** 小数点保留位数 */
  precision: number;
}


/** 分组字符串正则 */
const groupRegex = /(\d)(?=(\d{3})+\.)/g

class Currency {
  /** 币种设置信息 */
  constructor(private readonly setting: CurrencySetting) {
  }

  /**
   * @param value 数值
   * @param precision 小数点后精确位数(不传递则使用配置)
   * @returns {string} 格式化后的 价格
   * 例如  -1111.2 => -$1,111.2
   */
  format(value: number, precision?: number): string {
    precision = this.normalizePrecision(precision)
    value = this.parse(value)
    const isNegative = value < 0
    // 获取绝对值
    value = Math.abs(value)
    let formatted = this.toFixed(value, precision).replace(groupRegex, '$1' + this.setting.group)
    // 如果当前的 小数点符号 不是 '.', 就进行修改
    if (this.setting.decimal !== '.') {
      formatted = formatted.substring(0, formatted.length - precision - 1) + this.setting.decimal + formatted.substring(formatted.length - precision)
    }
    return (isNegative ? '-' : '') + (this.setting.symbolPosition === 'before' ? (this.setting.symbol + formatted) : (formatted + this.setting.symbol))
  }

  /**
   * 四舍五入数据
   * @param value 传入数字
   * @param precision 小数点后精确位数(不传递则使用配置)
   * @private
   */
  private toFixed(value: number, precision?: number): string {
    precision = this.normalizePrecision(precision)
    if (!precision && (precision < 0 || precision > 6)) {
      throw new Error('invalid precision \'' + precision + '\'')
    }
    value = this.parse(value) + 0.00000001
    return value.toFixed(precision)
  }

  /**
   * 格式化小数点位数
   * @param precision 小数点位数
   * @private
   */
  private normalizePrecision(precision: number | string | undefined): number {
    if (typeof (precision) === 'number') {
      return precision
    }
    precision = Number(precision)
    if (isNaN(precision)) {
      precision = this.setting.precision
    }
    return precision
  }

  /**
   * 格式化value
   * @param value 字符串 或者 number
   * @returns {*}
   */
  parse(value: number | string): number {
    value = value || 0
    if (typeof value === 'number') return value

    const regex = new RegExp('[^0-9-' + this.setting.decimal + ']', 'g')
    const unformatted: number = parseFloat(
      ('' + value)
        .replace(/\((?=\d+)(.*)\)/, '-$1') // replace bracketed values with negatives
        .replace(regex, '')         // strip out any cruft
        .replace(this.setting.decimal, '.')      // make sure decimal point is standard
    )
    return !isNaN(unformatted) ? unformatted : 0
  }
}

const DEFAULT_CURRENCY_SETTINGS: Partial<CurrencySetting> = {
  precision: 2,
  decimal: '.',
  group: ',',
  symbolPosition: 'before'
}

export const CURRENCIES: Record<string, CurrencySetting> = {
  CNY: {
    ...DEFAULT_CURRENCY_SETTINGS,
    name: 'CNY',
    symbol: '¥'
  } as CurrencySetting,
  USD: {
    ...DEFAULT_CURRENCY_SETTINGS,
    name: 'USD',
    symbol: '$'
  } as CurrencySetting,
  EUR: {
    ...DEFAULT_CURRENCY_SETTINGS,
    name: 'EUR',
    symbol: '€',
    decimal: ',',
    group: '.',
    symbolPosition: 'after'
  } as CurrencySetting,
  HKD: {
    ...DEFAULT_CURRENCY_SETTINGS,
    name: 'HKD',
    symbol: 'HK$'
  } as CurrencySetting,
  JPY: {
    ...DEFAULT_CURRENCY_SETTINGS,
    name: 'JPY',
    symbol: '円',
    symbolPosition: 'after'
  } as CurrencySetting,
  KRW: {
    ...DEFAULT_CURRENCY_SETTINGS,
    name: 'KRW',
    symbol: '₩',
    symbolPosition: 'after'
  } as CurrencySetting,
  THB: {
    ...DEFAULT_CURRENCY_SETTINGS,
    name: 'THB',
    symbol: '฿'
  } as CurrencySetting,
}


const CURRENCY_CACHE = new Map()

export function getCurrency(name: string) {
  let currency = CURRENCY_CACHE.get(name)
  if (!currency) {
    currency = new Currency(CURRENCIES[name])
    CURRENCY_CACHE.set(name, currency)
  }
  return currency
}

export function getCurrencySettings(name: string) {
  if (!CURRENCIES[name]) {
    throw new Error('not supported currency \'' + name + '\'')
  }
  return CURRENCIES[name]
}
