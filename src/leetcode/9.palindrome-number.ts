/**
 * 判断一个整数是否是回文数
 * */


function isPalindrome1(x: number) {
	const str: string = '' + x
	let left = 0, right = str.length - 1
	while(left > right) {
		if (str[left++] !== str[right--]) {
			return false
		}
	}
	return true
}


function isPalindrome2(x: number) {
	if (x < 0) {
		return false
	}

	if (x < 10) {
		return true
	}

	let temp: number = x
	let smallToBig = 0

	while (temp > 0) {
		smallToBig = (smallToBig * 10 + temp % 10)
		temp = parseInt('' + (temp / 10))
	}
	return smallToBig === x
}
