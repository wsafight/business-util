# 使用服务器时间修正限时工作

在前端进行限时工作时（例如考试），我们往往需要不断的使用定时器来提示用户，同时我们还需要提供断线重联机制来保证用户重新登陆后仍旧继续进行计时。此时如果我们通过前端提供的时间就会出现问题（存在用户自行修改本机时间的可能性）。

当然了，此类问题基本上都是前端展示的问题。但我们也需要进行一些处理。

这时候我们需要使用服务器提供的时间。浏览器在每次进行数据交互时都会在响应头提供时间选项。这样我们就可以修正前端时间。

```ts
let diffMillisecond: number = 0

export const syncServerTimeForDiffMillisecond = (time: string | Date) => {
    if (!time) {
        return
    }
    let localTime: number = new Date().getTime()
    let serverTime: number = localTime
    if (time instanceof Date) {
        serverTime = time.getTime()
    } else if (typeof time === 'string') {
        serverTime = Date.parse(time)
    }
    // 获取服务器和本地的时间差
    diffMillisecond = serverTime - localTime
}

export const now = () => {
    const localTime: number = (new Date()).getTime()
    return new Date(localTime + diffMillisecond)
}
```


这里也说一件趣事：之前我在上大学时候，抢课网页的课程选择项就是根据前端时间来确认 disabled，同时后端也没有进行限制，所以我们全班都如愿选到自己想要的课程。如果有还在大学的同学看到这篇文章也不妨试试学校网站的安全性。