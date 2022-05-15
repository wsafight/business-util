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
    font-family: "password";
    src: url(../../assets/css/PasswordEntry.ttf);
}

.pwd-input {
    font-family: "password";
}
```
