const LEVELS = ['debug', 'info', 'warn', 'error']
const config = {minLevel: 99}

function shouldLog(level: number) {
  return config.minLevel <= level
}

export function debug(message: string, ...data: string[]) {
  if (shouldLog(0)) {
    console.debug(message, ...data)
  }
}

export function info(message: string, ...data: string[]) {
  if (shouldLog(1)) {
    console.info(message, ...data)
  }
}

export function warn(message: string, ...data: string[]) {
  if (shouldLog(2)) {
    // eslint-disable-next-line no-console
    console.warn(message, ...data)
  }
}

export function error(message: string, ...data: string[]) {
  if (shouldLog(3)) {
    // eslint-disable-next-line no-console
    console.error(message, ...data)
  }
}

export function setLogLevel(level: number | string) {
  config.minLevel = typeof (level) === 'string' ? LEVELS.indexOf(level) : level
}
