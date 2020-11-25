/**
 * 获得扁平的数据
 * @param data
 */

function getFlatterObjKeys(data: Record<string, any>) {
  const keys: string[] = []
  function getKeys(obj: Record<string, any>, beforeKeys: string[] = []) {
    for(let key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        getKeys(obj[key], [...beforeKeys, key])
      } else {
        keys.push([...beforeKeys, key].join('.'))
      }
    }
  }
  getKeys(data)
  return keys
}