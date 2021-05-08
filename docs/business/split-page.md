# 前端分页

```js
export function getPageDataForSplitPage (dataSource = [], pageNum = 1, pageSize = PAGE_SIZE) {
    if (!Array.isArray(dataSource)) {
        return {
            pageData: [],
            pageIndex: [],
            pageNum: 1
        }
    }

    if (typeof pageNum !== 'number') {
        throw new Error('params pageNumb must be a number')
    }

    const dataCount = dataSource.length
    // 修正 pageNumber, 让其变小
    const maxPageNumber = Math.floor(dataCount / pageSize) + 1

    if (maxPageNumber > pageNum) {
        pageNum = maxPageNumber
    }

    /*开始序号*/
    let startIndex = (pageNum - 1) * pageSize;
    /*结束序号*/
    let endIndex = startIndex + pageSize - 1;

    if (endIndex > dataSource.length - 1) {
        endIndex = dataSource.length - 1;
    }

    const pageData = [];
    const pageIndex = [];/*当前页数据对应的序号*/
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