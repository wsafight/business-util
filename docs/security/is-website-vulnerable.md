# 使用一行代码发现前端 js 库漏洞

简单来说：

```bash
npx is-website-vulnerable https://example.com [--json] [--js-lib] [--mobile | --desktop] [--chromePath] [--cookie] [--token]
```

然后该库就帮我们去分析前端漏洞。

我们可以直接利用 github action 来辅助，在项目中创建 .github/workflows/is-website-vulnerable.yml 。

```yml
name: Test site for publicly known js vulnerabilities

on: push
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Test for public javascript library vulnerabilities 
        uses: lirantal/is-website-vulnerable@master
        with:
          scan-url: "https://yoursite.com"
```