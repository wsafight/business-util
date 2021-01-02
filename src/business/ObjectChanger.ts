type ChangeReason = 'modified' | 'deleted'

type visitorFun = (key: string, value: any, reason: ChangeReason) => boolean

function isEmpty (value: any) {
  return value === null || value === undefined || value === ''
}

function getObjOwnKeys(object: Record<string, any>) {
    if (!object) return []
    return Object.keys(object).filter(key =>
      object.hasOwnProperty(key))
}

export class ObjectChanger {
  /**
   *  当前对象可变
   * */
  private readonly obj: Record<string, any>
  private initial: Record<string, any> = {}
  constructor (obj: Record<string, any>) {
    this.obj = obj
    this.acceptChange()
  }
  acceptChange () {
    this.initial = {}
    const currentObj = this.obj
    getObjOwnKeys(currentObj).forEach(key => {
      const value = currentObj[key]
      this.initial[key] = value ? JSON.stringify(value) : value
    })
  }
  cancelChange () {
    const initialKeys: string[] = getObjOwnKeys(this.initial)
    initialKeys.forEach(key => {
      const value = this.initial[key]
      this.obj[key] = value ? JSON.parse(value) : value
    })
    getObjOwnKeys(this.obj).forEach(key => {
      if (!initialKeys.includes(key)) {
        delete this.obj[key]
      }
    })
  }
  isChanged () {
    return !this._visitChangedItem()
  }
  getChangedObject () {
    const changedObject: Record<string, any> = {}
    this._visitChangedItem((key, value, reason) => {
      if (reason === 'modified') {
        changedObject[key] = value
      } else {
        changedObject[key] = value ? JSON.parse(value) : value
      }
      return true
    })
    return changedObject
  }

  /**
   * 过滤空数据
   */
  filterEmpty () {
    const ret: Record<string, any> = {}
    getObjOwnKeys(this.obj).forEach(key => {
      const newValue = this.obj[key]
      if (!isEmpty(newValue)) {
        ret[key] = newValue
      }
    })
    return ret
  }

  /**
   * 遍历已修改的项目
   * @param visitor 为NULL或返回false时，终止执行
   * @returns {boolean} 遍历过程中终止的场合返回false，否则返回true
   * @private
   */
  _visitChangedItem (visitor?: visitorFun) {
    const checkedKeys: Record<string, any> = {}
    const keys = getObjOwnKeys(this.obj)
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]
      checkedKeys[key] = true

      let newValue = this.obj[key]
      newValue = newValue ? JSON.stringify(newValue) : newValue
      if (newValue !== this.initial[key]) {
        if (!visitor || !visitor(key, this.obj[key], 'modified')) {
          return false
        }
      }
    }
    const initialKeys = getObjOwnKeys(this.initial)
    for (let i = 0, len = initialKeys.length; i < len; i++) {
      const key = initialKeys[i]
      if (!checkedKeys[key]) {
        if (!visitor || !visitor(key, this.initial[key], 'deleted')) {
          return false
        }
      }
    }
    return true
  }

}
