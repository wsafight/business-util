// https://raw.githubusercontent.com/openexchangerates/accounting.js/master/accounting.js

interface CurrencySetting {
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  group: string;
  precision: number;
  decimal: string;
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

class Currency {
  private settings: CurrencySetting
  constructor(name: string) {
    if (!CURRENCIES[name]) {
      throw new Error('unknown currency \'' + name + '\'')
    }
    this.settings = CURRENCIES[name]
  }

  /**
   * @param value 数值
   * @param precision 小数点后精确位数
   * @returns {string} 格式化后的  价格
   * 例如  -1111.2 => -$1,111.2
   */
  format(value: number, precision: number) {
    precision = this.normalizePrecision(precision)
    value = this.parse(value)
    const isNegative = value < 0
    value = isNegative ? -value : value
    let formated = this.toFixed(value, precision).replace(/(\d)(?=(\d{3})+\.)/g, '$1' + this.settings.group)
    if (this.settings.decimal !== '.') {
      formated = formated.substring(0, formated.length - precision - 1) + this.settings.decimal + formated.substring(formated.length - precision)
    }
    return (isNegative ? '-' : '') + (this.settings.symbolPosition === 'before' ? (this.settings.symbol + formated) : (formated + this.settings.symbol))
  }

  /**
   * Implementation of toFixed() that treats floats more like decimals
   *
   * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
   * problems for accounting- and finance-related software.
   */
  toFixed(value: number, precision: number) {
    precision = this.normalizePrecision(precision)
    if (!precision && (precision < 0 || precision > 6)) {
      throw new Error('invalid precision \'' + precision + '\'')
    }
    value = this.parse(value) + 0.00000001
    return value.toFixed(precision)
  }

  normalizePrecision(precision: number | string) {
    if (typeof (precision) === 'number') {
      return precision
    }
    precision = Number(precision)
    if (isNaN(precision)) {
      precision = this.settings.precision
    }
    return precision
  }

  /**
   * 格式化value
   * @param value 字符串 或者 number
   * @returns {*}
   */
  parse(value: number | string) {
    value = value || 0
    if (typeof value === 'number') return value

    // 适用于小数点不为 . 的货币类型
    // 正则 0-9 - 小数点符号
    const regex = new RegExp('[^0-9-' + this.settings.decimal + ']', 'g')
    const unformatted = parseFloat(
      ('' + value)
        .replace(/\((?=\d+)(.*)\)/, '-$1') // replace bracketed values with negatives
        .replace(regex, '')         // strip out any cruft
        .replace(this.settings.decimal, '.')      // make sure decimal point is standard
    )

    // This will fail silently which may cause trouble, let's wait and see:
    return !isNaN(unformatted) ? unformatted : 0
  }
}

const CURRENCY_CACHE = new Map()

export function getCurrency(name: string) {
  let currency = CURRENCY_CACHE.get(name)
  if (!currency) {
    currency = new Currency(name)
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
