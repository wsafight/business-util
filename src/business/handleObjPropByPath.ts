/**
 * 适用于 JSON 等数据格式
 * path: 'a.b.c.d'
 * 查询
 *
 * 构建类型
 *
 * 根据路径获取 对象中的数据  getObjPropByPath
 * 设置对象中的路径 setPropByPath
 */

/**
 * 根据路径来获取 对象属性
 * @param obj
 * @param path
 *
 */
export function getObjPropByPath(obj: Record<string, any>, path: string) {
	let tempObj = obj
	const keyArr = path.split('.')
	let i = 0
	for (let len = keyArr.length; i <len - 1; ++i) {
		let key = keyArr[i]
		if (key in tempObj) {
			tempObj = tempObj[key]
		} else {
			return {}
		}
	}
	return  {
		o: tempObj,
		k: keyArr[i],
		v: tempObj[keyArr[i]]
	}
}

/**
 * 根据路径来设置属性
 * @param obj 对象
 * @param path 对象路径， 如果当前没有对象，继续设置空对象，添加
 * @param value 值
 */
export function setObjPropByPath(obj: Record<string, any>, path: string, value: any) {
	let tempObj = obj
	let keyArr = path.split('.')
	let i = 0, len = keyArr.length
	for (;i < len - 1; ++i) {
		const key = keyArr[i]
		const hasKey = key in tempObj
		if (!hasKey) {
			tempObj[key] = {}
		}
		tempObj = tempObj[key]
	}
	tempObj[keyArr[len - 1]] = value
}
