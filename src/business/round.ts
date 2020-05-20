/**
 * 利用 Math.round 进行小数位的四舍五入
 *
 * 用于解决 0.1 + 0.2 = 0.30000000000000004
 *
 * 用 fixed 格式化, toFixed 本身有问题
 * (11.545).toFixed(2)  =>  "11.54"
 *
 *  https://mathjs.org/ 过于庞大，仅仅只用于格式化两位小数太过笨重
 *
 *  原理 Math.round() 函数返回一个数字四舍五入后最接近的整数。
 *   Math.round(3.44444444) => 3
 *   Math.round(3.55555) => 4
 *
 *   实现方式
 *   round(0.1 + 0.2, 2) => 0.3
 *
 *   计算过程 =>
 *   round(0.30000000000000004 * 100) / 100
 *   round(30.000000000000004) / 100
 *   30 / 100
 *   0.3
 */

/**
 *
 * @param number
 * @param precision
 */
export function round(number: number, precision: number = 2) {
	return Math.round(+(number + 'e' + precision)) / Math.pow(10, precision)
}
