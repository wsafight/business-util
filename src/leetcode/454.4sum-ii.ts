/**
 * 四数相加
 * @param A
 * @param B
 * @param C
 * @param D
 */
function fourSumCount(A: number[], B: number[], C: number[], D: number[]): number {
  const newMap: Record<string, number> = {};
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B.length; j++) {
      const total =  A[i] + B[j]
      newMap[total] = newMap[total] ? newMap[total] + 1 : 1
    }
  }
  let count: number = 0
  for (let i = 0; i < C.length; i++) {
    for (let j = 0; j < D.length; j++) {
      const total = - ( C[i] + D[j])
      count += (newMap['' + total] || 0)
    }
  }

  return count;
};

