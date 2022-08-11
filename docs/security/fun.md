# 有趣的安全问题

## struct2 

发现者提供了案例如下:

```html
xxx.action?<script>alert(1)</script>test
```

官方修补代码:

```JAVA
String result = link.toString();

if (result.indexOf("<script>") >= 0) {
  result = result.replaceAll("<script>", "script")
}
```

提交案例:

```html
xxx.action?<<script>>alert(1)</script>test
```

官方修补代码:

```JAVA
String result = link.toString();

while (result.indexOf("<script>") > 0) {
  result = result.replaceAll("<script>", "script")
}
```

提交案例：

```html
xxx.action?<<script test='2'>alert(1)</script>test
```

## localStorage

localStorage 在不同端口下是不同源的，所以可以在服务端开启多个端口后在客户端使用 iframe 向 localStorage 写入数据。具体可以参考 [作为一个前端，可以如何机智地弄坏一台电脑？](https://imweb.io/topic/559b49bccfa459b41b0905f1)
