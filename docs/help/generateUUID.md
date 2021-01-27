# 生成唯一 id

可以参考 http://stackoverflow.com/a/8809472

https://css-tricks.com/lots-of-ways-to-use-math-random-in-javascript/


在需要生成随机值时，很多人会使用 Math.random ()。这个方法在浏览器中是以伪随机数生成器
（PRNG，PseudoRandom Number Generator）方式实现的。所谓 "伪" 指的是生成值的过程不是真的随机。
PRNG 生成的值只是模拟了随机的特性。浏览器的 PRNG 并未使用真正的随机源，只是对一个内部状态
应用了固定的算法。每次调用 Math.random ()，这个内部状态都会被一个算法修改，而结果会被转换
为一个新的随机值。例如，V8 引擎使用了一个名为 xorshift128+ 的算法来执行这种修改。


由于算法本身是固定的，其输入只是之前的状态，因此随机数顺序也是确定的。xorshift128+使用
128 位内部状态，而算法的设计让任何初始状态在重复自身之前都会产生 2128–1 个伪随机值。这种循环
被称为置换循环（permutation cycle），而这个循环的长度被称为一个周期（period）。很明显，如果攻击
者知道 PRNG 的内部状态，就可以预测后续生成的伪随机值。如果开发者无意中使用 PRNG 生成了私有
密钥用于加密，则攻击者就可以利用 PRNG 的这个特性算出私有密钥。

Web Cryptography API 描述了一套密码学工具，规范了 JavaScript 如何以安全和符合惯例的方式实现
加密。这些工具包括生成、使用和应用加密密钥对，加密和解密消息，以及可靠地生成随机数。

```ts
function randomFloat() { 
 // 生成 32 位随机值
 const fooArray = new Uint32Array(1); 
 // 最大值是 2^32 –1
 const maxUint32 = 0xFFFFFFFF; 
 // 用最大可能的值来除
 return crypto.getRandomValues(fooArray)[0] / maxUint32; 
} 
console.log(randomFloat()); // 0.5033651619458955
```

```ts
function generateUUID() {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
    (c ^ (crypto.getRandomValues(new Uint32Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}
```

但如果你需要兼容 IE 10 浏览器的话，就无法使用 crypto api。

```ts
const dec2hex: string[] = [];

for (let i=0; i<=15; i++) {
  dec2hex[i] = i.toString(16);
}

export function generateUUID(): string {
  let uuid: string = '';
  for (let i=1; i<=36; i++) {
    if (i===9 || i===14 || i===19 || i===24) {
      uuid += '-';
    } else if (i===15) {
      uuid += 4;
    } else if (i===20) {
      uuid += dec2hex[(Math.random()*4|0 + 8)];
    } else {
      uuid += dec2hex[(Math.random()*16|0)];
    }
  }
  return uuid;
}
```


<div style="float: right">更新时间: {docsify-updated}</div>
