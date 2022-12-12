const Big = require('big.js')

const operatorReg = /[()+\-/* ]/g

const strToToken = (str: string): string[] => {
    const keys = str.split(operatorReg)
    const tokens: string[] = []
    let temp: string = str

    while (temp.length > 0) {
        if (keys.length > 0 && temp.startsWith(keys[0])) {
            temp = temp.replace(keys[0], '')
            tokens.push(keys.shift() || '')
        }
        else {
            tokens.push(temp[0])
            temp = temp.substring(1)
        }
    }
    return tokens.map(token => token.trim()).filter(Boolean)
}

/**
 * 中缀表达式转换成逆波兰表达式
 * @param {string[]} tokenList 中缀表达式 token 数组
 */
const tokenToRpn = (tokenList: string[]) => {
    if (!tokenList || tokenList.length <= 0) return []
    const operators: string[] = []

    const isTokenHighRank = (token: string) => {
        const operatorRand: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 }
        const topOperator = operators[operators.length - 1]

        return operators.length === 0 ||
            topOperator === '(' ||
            operatorRand[token] > operatorRand[topOperator]
    }

    const outputs = tokenList.reduce((outputs: string[], token: string) => {
        if (!token.match(operatorReg)) outputs.push(token)
        else if (token === '(') operators.push(token)
        else if (token === ')') {
            while (operators.length > 0) {
                const operator = operators.pop()
                if (operator === '(') break
                outputs.push(operator!)
            }
        }
        else {
            while (operators.length >= 0) {
                if (isTokenHighRank(token)) {
                    operators.push(token)
                    break
                }
                outputs.push(operators.pop()!)
            }
        }

        return outputs
    }, [])

    return [...outputs, ...operators]
}

/**
 * 运算符到实际操作的映射
 */
const calculators: Record<string, Function> = {
    '+': (num1: number, num2: number) => new Big(num1).plus(num2),
    '-': (num1: number, num2: number) => new Big(num1).minus(num2),
    '*': (num1: number, num2: number) => new Big(num1).times(num2),
    '/': (num1: number, num2: number) => new Big(num1).div(num2)
}

/**
 * 从数据集里获取对应的数据
 */
const getValues = (key: string, values: any) => {
    if (!key) return 0
    if (typeof key === 'string') {
        return values[key] || Number(key) || 0
    }
    return key
}

const calcRpn = function (tokens: string[], values: any) {
    let numList: string[] = []
    for (const token of tokens) {
        const calculator: Function = calculators[token]
        if (!calculator) {
            numList.push(token)
        } else {
            const val2 = getValues(numList.pop()!, values)
            const val1 = getValues(numList.pop()!, values)
            const result = calculator(val1, val2)
            numList.push(result.toNumber())
        }
    }
    return numList.pop()
}

const templateCalc = (template: string, values: Record<string, number>) => {
    const tokens = strToToken(template)
    const rpn = tokenToRpn(tokens)
    const result = calcRpn(rpn, values)

    return result
}