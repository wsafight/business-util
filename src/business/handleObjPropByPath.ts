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
 * 根据路径来获取 对象内部属性
 * @param obj 对象
 * @param path 路径 a.b[1].c
 *
 */
export function getObjPropByPath(obj: Record<string, any>, path: string) {
	let tempObj = obj
	const keyArr = path.split('.').map(x => x.trim())
	let i: number = 0
	for (let len = keyArr.length; i <len - 1; ++i) {
		let key = keyArr[i]
		// 简单判断是否是数组数据，如果 以 ] 结尾的话
		const isFormArray = key.endsWith(']')
		let index: number = 0
		if (isFormArray) {
			const data = key.split('[') ?? []
			key = data[0] ?? ''
			// 对于 parseInt('12]') => 12
			index = parseInt(data[1], 10)
		}

		if (key in tempObj) {
			tempObj = tempObj[key]
			if (isFormArray && Array.isArray(tempObj)) {
				tempObj = tempObj[index]
				if (!tempObj) {
					return {}
				}
			}
		} else {
			return {}
		}
	}
	if (!tempObj) {
		return {}
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
