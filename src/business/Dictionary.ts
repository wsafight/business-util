
export class Dictionary<T> {
	private _item: ({[key: string]: T}) | Map<string, T>

	private _count: number = 0

	public constructor(useES6Map: boolean = true) {
		this._item = useES6Map ? new Map<string, T>() : {}
	}

	public get length(): number {
		return  this._count
	}

	public contains(key: string) {
		if (this._item instanceof Map) {
			return this._item.has(key)
		} else {
			return (this._item[key] !== void 0)
		}
	}


	public find(key: string) {
		return this._item instanceof Map ? this._item.get(key) : this._item[key]
	}

	public insert(key: string, value: T): void {
		this._item instanceof Map ? this._item.set(key, value) : this._item[key] = value
		this._count ++
	}

	public remove(key: string): boolean {
		let ret: T | undefined = this.find(key)

		if (ret  === void 0) {
			return false
		}
		this._item instanceof Map ? this._item.delete(key) : delete this._item[key]
		this._count --
		return true
	}

	public get keys(): string[] {
		const keys: string[] = []
		if (this._item instanceof Map) {
			let kArray = this._item.keys()
			for(let key of kArray) {
				keys.push(key)
			}
		} else {
			for(let prop in this._item) {
				if (this._item.hasOwnProperty(prop)) {
					keys.push(prop)
				}
			}
		}

		return  keys
	}

	public get values(): T[] {
		const values: T[] = []
		if (this._item instanceof Map) {
			let vArray = this._item.values()
			for(let value of vArray) {
				values.push(value)
			}
		} else {
			for(let prop in this._item) {
				if (this._item.hasOwnProperty(prop)) {
					values.push(this._item[prop])
				}
			}
		}

		return  values
	}


	public toString(): string {
		return JSON.stringify(this._item as Map<string, T>)
	}




}
