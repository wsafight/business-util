# 前端分页工具

前端分页是相对愚蠢的，但是对于少量或者难以分割(后端计算，难以多次获取)的数据项来说，它具有一定的价值与意义。


下面是一个基础版本分页代码，我们可以在获取数据源或者增删改查之后修改数据源在此进行调用：

```js
export function getPageDataForSplitPage (dataSource = [], pageNum = 1, pageSize = PAGE_SIZE) {
    if (!Array.isArray(dataSource) || dataSource.length === 0) {
        return {
            pageData: [],
            pageIndex: [],
            pageNum: 1
        }
    }

    if (typeof pageNum !== 'number') {
        throw new Error('params pageNum must be a number')
    }
    
    if (typeof pageSize !== 'number') {
        throw new Error('params pageSize must be a number')
    }
    
    const dataCount = dataSource.length
    
   
    const maxPageNumber = Math.ceil(dataCount / pageSize)
   
    // 修正 pageNumber, 当前传入的pageNum 大于最大页，把最大页数修改为正常页数
    if (pageNum > maxPageNumber) {
        pageNum = maxPageNumber
    }
    
    const startIndex = (pageNum - 1) * pageSize;
    let endIndex = startIndex + pageSize - 1;

    // 修正 endIndex, 当前结束 index 大于数据最大数量，把最大数据修改为正常数据数量
    if (endIndex > dataSource.length - 1) {
        endIndex = dataSource.length - 1;
    }

    const pageData = [];
    const pageIndex = [];
    for (let i = startIndex; i <= endIndex; i++) {
        pageData.push(dataSource[i]);
        pageIndex.push(i + 1);
    }

    return {
        pageData,
        pageIndex,
        pageNum
    };
}

```