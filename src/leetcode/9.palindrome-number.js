"use strict";
/**
 * 判断一个整数是否是回文数
 * */
function isPalindrome1(x) {
    var str = '' + x;
    var left = 0, right = str.length - 1;
    while (left > right) {
        if (str[left++] !== str[right--]) {
            return false;
        }
    }
    return true;
}
function isPalindrome2(x) {
    if (x < 0) {
        return false;
    }
    if (x < 10) {
        return true;
    }
    var temp = x;
    var smallToBig = 0;
    while (temp > 0) {
        smallToBig = (smallToBig * 10 + temp % 10);
        temp = parseInt('' + (temp / 10));
    }
    return smallToBig === x;
}
