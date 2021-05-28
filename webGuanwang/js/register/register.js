$("#detail li").on("click",function () {
    let registerIndex=$(this).index();
    let newWeb=window.open('_blank');
    switch (registerIndex) {
        case 0:
            // newWeb.location = "https://www.careland.com.cn/service/checksn/action1.php";//旧官网页面
            newWeb.location = "genuineVerification.html";
            break;
        case 1:
            newWeb.location = "http://channel.careland.com.cn/do.php?m=user&a=login";
            break;
        case 2:
            newWeb.location = "http://boss.careland.com.cn/oem/index2.php";
            break;
        case 3:
            newWeb.location = "https://www.careland.com.cn/service/oembindzone/oemactivate.php";
            break;
        case 4:
            newWeb.location = "https://www.careland.com.cn/service/xugang/action1.php";
            break;
        case 5:
            newWeb.location = "https://www.careland.com.cn/service/hangsheng/server.php?act=action";
            break;
    }
});
