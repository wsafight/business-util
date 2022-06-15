# 确保从列表中获取可用值

对于某些项目来说，某些配置项或查询条件是必需的。当用户缺失配置数据或项目下线配置项，都会导致错误，这时候，我们需要一些兜底策略，如当前列表查不到数据时候默认使用第一项的值。

```ts
interface EnsureGetValFromListParams<ItemType, ValueType> {
    /** 列表数据 **/
    items: ItemType[]
    /** 值 **/
    value?: ValueType | undefined
    /** 列表中数据值的提取方法 **/
    getVal?: (item: ItemType) => ValueType
    /** 查询不到数据时候返回值的位置 **/
    pos?: 'frist' | 'last'
}

// ValueType extends ItemType = ItemType
// 如果不提供 ValueType, 则 ValueType 默认为 ItemType
export const ensureGetValFromList = <ItemType, ValueType extends ItemType = ItemType>({
    items,
    value,
    getVal = item => item as ValueType,
    pos = 'frist'
}: EnsureGetValFromListParams<ItemType, ValueType>): ValueType | null => {
    // 当前不是数组直接返回 null
    if (!Array.isArray(items)) {
        return null
    }

    const count = items.length
    // 当前为空数组直接返回 null
    if (count === 0) {
        return null;
    }

    // 没有传递数值或者当前列表长度为1，直接返回列表唯一数据
    if (!value || count === 1) {
        return getVal(items[0])
    }

    // 查询列表，是否有数值等于传入数值
    if (items.some(item => getVal(item) === value)) {
        return value
    }
    // 返回列表第一条还是最后一条数据
    const index = pos === 'frist' ? 0 : count - 1
    return getVal(items[index])
}
```