/**
 * 缺失数字
 * 给定一个包含 0, 1, 2, ..., n 中 n 个数的序列，找出 0 .. n 中没有出现在序列中的那个数
 * @param nums
 */

function missingNumber(nums: number[]) {
  let i = 0
  let len = nums.length
  let ans = 0
  for (i = 0; i <= len; i++) {
    ans ^= i;
  }
  for (i = 0; i < len; i++) {
    ans ^= nums[i];
  }
  return ans;
}
