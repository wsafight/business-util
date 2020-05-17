export class ListNode<T> {
	public next: ListNode<T> | null;
	public prev: ListNode<T> | null
	public data: T | undefined
	public constructor(data: T | undefined = void 0) {
		this.next = this.prev = null
		this.data = data
	}
}


export class LinkedList<T> {
	private _headNode: ListNode<T>
	private _length: number

	public constructor() {
		this._headNode = new ListNode<T>()
		this._headNode.next = this._headNode
		this._headNode.prev = this._headNode
		this._length = 0
	}

	public empty(): boolean {
		return this._headNode.next === this._headNode
	}

	public get length(): number {
		return this._length
	}

	public begin(): ListNode<T> {
		if(this._headNode.next === null) {
			throw new Error('头节点之争为null')
		}

		return this._headNode.next
	}

	public end() {
		return this._headNode
	}

	public contains(data: T): boolean {
		for (let link: ListNode<T> | null = this._headNode.next;
		     link !== null && link != this._headNode;
		     link = (link as ListNode<T>).next) {
			if (link !== null) {
				return link.data !== void 0 && data === link.data
			}
		}
		return false
	}
}
