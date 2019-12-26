<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" type="image/x-icon" href="framework/img/smallIcon.png">
    <script type="text/javascript" src="framework/lib/sockjs.js"></script>
    <script type="text/javascript" src="framework/lib/stomp.js"></script>
    <script type="text/javascript" src="framework/lib/jquery.min.js"></script>
    <style type="text/css">
        @font-face {
            font-family: led;
            src: url('framework/ttf/LCDAT&TPhoneTimeDate.ttf'),
            url('framework/ttf/LCDAT&TPhoneTimeDate.ttf');
        }
    </style>
    <link href="framework/init/init.css?t=${time}" rel="stylesheet"/>
    <link href="dist/pc.css?t=${time}" rel="stylesheet"/>
    <title>天枢监控中心</title>
</head>
<body>
<div id="root"></div>
<script>
    window.sessionStorage.setItem("userId", '${(userId)?default("")}')
    var user = '${(user.name)?default("")}'
    var initResult = ${(initResult)?default("1")}
</script>
<script src="${jsPath}"></script>
</body>
</html>