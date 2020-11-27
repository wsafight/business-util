function print2DArr(arr: string[][]) {
  let leftUpRow = 0
  let leftUpCol = 0
  let rightDownRow = arr.length -1
  let rightDownCol = arr.length -1
  while (leftUpCol <= rightDownCol && leftUpRow <= rightDownRow) {
    let r = leftUpRow, c =leftUpCol
    while (c < rightDownCol) {
      console.log(arr[r][c++])
    }
    c = rightDownCol
    r++
    while (r < rightDownRow) {
      console.log(arr[r++][c])
    }
    r = rightDownRow
    c--
    while (c >= leftUpRow) {

    }

    while (true) {

    }


  }

}