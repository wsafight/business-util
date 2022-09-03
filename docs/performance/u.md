# JSON 简化工具库 u

[u](https://github.com/ananthakumaran/u) 可以让数据在网络传输变得更加快捷。为 JSON 数据定义一个规范，基于该规范完成数据的压缩和解压。

```js
var spec = {
  // 参数 lookingFor 选择其中一个
  lookingFor: ['oneOf', 'bride', 'groom'],
  // 元组 定义最大和最小
  age: ['tuple', ['integer'] /* min */, ['integer'] /* max */],
  // 同 lookingFor
  religion: ['oneOf', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Parsi', 'Jain', 'Buddhist', 'Jewish', 'No Religion', 'Spiritual', 'Other'],
  // 同 lookingFor
  motherTongue: ['oneOf', 'Assamese', 'Bengali', 'English', 'Gujarati', 'Hindi', 'Kannada', 'Konkani', 'Malayalam', 'Marathi', 'Marwari', 'Odia', 'Punjabi', 'Sindhi', 'Tamil', 'Telugu', 'Urdu'],
  // 布尔类型
  onlyProfileWithPhoto: ['boolean']
};

// 当前规范的版本号
var v1 = fromJson(1, spec);

const params = {
  lookingFor: 'bride',
  age: [25, 30], 
  religion: 'Hindu', 
  motherTongue: 'Bengali', 
  onlyProfileWithPhoto: true,
}

// 编码对象，获取字符串 bHhc9I-aqa
var encodedv1 = encode(v1, params);
//=> 'bHhc9I-aqa'

//  解码数据返回之前对象
decode([v1], encodedv1) //=> {lookingFor: 'bride', age: [25, 30], religion: 'Hindu', motherTongue: 'Bengali', onlyProfileWithPhoto: true});
```

随着时间的迁移，我们有些数据需要升级。

```js
// 扩展原来的规范到新的规范，添加 maritialStatus
var newSpec = _.extend({}, spec, {
  maritialStatus: ['oneOf', "Doesn't Matter", 'Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled']
});

// 参数为 版本，规范，迁移函数，为之前的参数添加 maritialStatus
var v2 = fromJson(2, newSpec, function (old) {
  old.maritialStatus = "Doesn't Matter";
  return old;
});

// 获取之前的对象 + maritialStatus：'Doesn't Matter'
decode([v1, v2], encodedv1) 
```

规范可以是元组、对象以及数组等。当然我们一方面可以压缩请求参数，同是我们也可以利用该库在 URL 序列化 json 数据。

下面我们开始分析源代码:





