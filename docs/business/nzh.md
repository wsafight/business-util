# 阿拉伯数字与中文数字的相互转换

[Nzh](https://blog.whyoop.com/nzh/docs/#/) 适用于需要转换阿拉伯数字与中文数字的场景。

特点如下:

- 以字符串的方式转换，没有超大数及浮点数等问题(请自行对原数据进行四舍五入等操作)
- 支持科学记数法字符串的转换
- 支持口语化
- 支持自定义转换(不论是兆,京还是厘都可以用)
- 对超大数支持用争议少的万万亿代替亿亿
- 中文数字转回阿拉伯数字

api：
- encodeS(num,options) 转中文小写
- encodeB(num,options) 转中文大写
- toMoney(num,options) 转中文金额
- decodeS(zh_num) 中文小写转数字
- decodeB(zh_num) 中文大写转数字

```ts
// options.tenMin

// encodeS默认true
nzhcn.encodeS("13.5");                 // 十三点五
nzhcn.encodeS("13.5", {tenMin:false}); // 一十三点五
// encodeB默人false
nzhcn.encodeB("13.5");                 // 壹拾叁點伍
nzhcn.encodeB("13.5", {tenMin:true});  // 拾叁點伍

// options.ww

//Nzh.cn和Nzh.hk未引入兆、京等单位，超千万亿位时，默认以争议较少的万万亿为单位
nzhcn.encodeS(1e16);                // 一万万亿
nzhcn.encodeS(1e16, {ww: false});   // 一亿亿

// options.complete

nzhcn.toMoney("1");                        //人民币壹元整
nzhcn.toMoney("1",{complete:true});        //人民币壹元零角零分
nzhcn.toMoney("0.1");                      //人民币壹角
nzhcn.toMoney("0.1",{complete:true});      //人民币零元壹角零分

//outSymbol  默认 true
nzhcn.toMoney("1");                        //人民币壹元整
nzhcn.toMoney("1",{outSymbol:false});      //壹元整
```