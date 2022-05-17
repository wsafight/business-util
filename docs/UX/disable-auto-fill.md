# 禁止浏览器进行表单填充

某些情况下，用户需要浏览器不提供填充功能，尤其是登陆界面的密码填充。这时候我们就需要基于表单做一些特殊处理。这是非常麻烦的。
而 [disableautofill.js](https://github.com/terrylinooo/disableautofill.js) 提供了这个功能。我们可以这样使用：

```html

<form id="testForm" method="get" action="/">
    <div class="input-group">
        <label>Username</label>
        <input type="text" name="username">
    </div>
    <div class="input-group">
        <label>Password</label>
        <input type="text" name="password" class="test-pass">
    </div>
    <div class="input-group">
        <label>Confirm password</label>
        <input type="text" name="confirm_password" class="test-pass2">
    </div>
    <div class="button-section">
        <button type="submit">Submit</button>
    </div>
</form>

<script>
function checkForm() {
    form = document.getElementById('login-form');
    if (form.password.value == '' || form.confirm_password.value == '') {
        alert('Cannot leave Password field blank.');
        form.password.focus();
        return false;
    }
    if (form.username.value == '') {
        alert('Cannot leave User Id field blank.');
        form.username.focus();
        return false;
    }
    return true;
}

 var daf = new disableautofill({
    'form': '#testForm',
    'fields': [
        '.test-pass',  // password
        '.test-pass2'  // confirm password
    ],
    'debug': true,
    'callback': function() {
        return checkForm();
    }
});

daf.init();
</script>
```

这个库做了以下几件事

- 替换type="password"为type="text"
- 用星号替换密码文本
- 在表单上添加一个属性 autocomplete="off"
- 随机化属性 name 以防止 Google Chrome 记住您填写的内容

这也就意味着，当前界面表现的数据和真实输入的数据不一致。这时候如果我们用的前端框架，需要把表单项作为非受控组件组件。

后续发现了一个更加简单的方式。

- 替换type="password"为type="text" 并且使用字体文件 font-family
- 在表单上添加一个属性 autocomplete="off"

```css
@font-face {
    /* 该字体只有显示密码的字符 */
    src: url(../../assets/css/PasswordEntry.ttf);
    font-family: "password";
}

/* 我们使用 password 字体，这样展示就没有问题了  */
.pwd-input {
    font-family: "password";
}
```

这个方案其实也有问题：如果用户在 input text 中进行复制，是会把真实密码给复制出来的。这取决于用户是否能够接受。

事实上，字体文件甚至可以在一定程度上防御爬虫，例如旅游或者电商网站，涉及到金额等信息时候，完全可以通过数字字符集来进行变化处理，例如 json 数据或者 dom 结构上都会展示 1234(此处去除了货币格式)，但事实上，用户实际看到的却是另外的数字（6754）。
