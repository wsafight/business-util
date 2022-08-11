# 有趣的安全补丁

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

