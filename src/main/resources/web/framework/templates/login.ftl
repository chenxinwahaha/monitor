<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/framework/style/login.css">
    <title>天枢监控中心</title>
</head>
<body>
    <img class="bg-img" src="../../framework/img/login_bg.png" alt="背景图"}/>
    <div class="left-img">
        <img src="../../framework/img/left_bg.png"/>
        <span class="img-center">天枢监控中心</span>
    </div>
    <form action="/login.do" method="post">
        <div class="login">
            <img class="logo" src="../../framework/img/logo.png"/>
            <span>天枢监控中心</span>
        </div>
        <div class="input-group">
            <img class="input-icon" src="../../framework/img/user.png"/>
            <input class="username" autocomplete="off" type="text" name="userId" placeholder="用户名">
        </div>
        <div class="input-group">
            <img class="input-icon" src="../../framework/img/password.png"/>
            <input class="password" type="password" name="password" placeholder="密码">
        </div>
        <div id="error">${error!""}</div>
        <button type="submit"><span>登</span><span>录</span></button>
    </form>
</body>
</html>