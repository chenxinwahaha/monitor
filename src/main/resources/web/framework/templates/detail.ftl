<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no,minimum-scale=0.5,maximum-scale=0.5">
    <meta http-fequiv="X-UA-Compatible" content="ie=edge">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <link href="../dist/detail.css?t=${time}" rel="stylesheet"/>
    <link rel="icon" type="image/x-icon" href="framework/img/smallIcon.png">
    <title>天枢监控中心</title>
    <style>
        html, body {
            height: 100%;
            font-size: 62.5% !important;
            font-family: -apple-system, BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            "Helvetica Neue",
            Helvetica,
            "PingFang SC",
            "Hiragino Sans GB",
            "Microsoft YaHei",
            SimSun, sans-serif;
            margin: 0;
        }
        #root {
            font-size: 2.8rem;
        }
    </style>
</head>
<body>
<div id="root">
</div>
</body>
<script>
    window.sessionStorage.setItem("id", '${(id)?default("")}')
</script>
<script src="${jsPath}"></script>
<script>
</script>
</html>