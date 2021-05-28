$("#detail li").on("click",function () {
    let serviceIndex=$(this).index();
    switch (serviceIndex) {
        case 0:
            window.location.href = "faq.html";
            break;
        case 1:
            window.location.href = "https://www.careland.com.cn/Frontend/Product/plist.php?sort=10";
            break;
        case 2:
            window.location.href = "https://www.careland.com.cn/Frontend/Product/plist.php?sort=11";
            break;
        case 3:
            window.location.href = "https://www.careland.com.cn/Frontend/FAQ/faq.php?fids=0";
            break;
        case 4:
            window.location.href = "https://www.careland.com.cn/Frontend/Upgrade/user_upgrade.php?gname=car_warning";
            break;
        case 5:
            window.location.href = "https://www.careland.com.cn/Frontend/Upgrade/user_upgrade.php?gname=car_photo";
            break;
        case 6:
            window.location.href = "https://www.careland.com.cn/Frontend/Upgrade/user_upgrade.php?gname=car_mirror";
            break;
        case 7:
            window.location.href = "https://www.careland.com.cn/Frontend/sim/sim_data_buy.php";
            break;
    }
});

// 滑动滚动条
$(window).scroll(function(){
// 滚动条距离顶部的距离 大于 200px时
    if($(window).scrollTop() >= 1000){
        $("#backTop").removeClass("hide");
    } else{
        $("#backTop").addClass("hide");
    }
});