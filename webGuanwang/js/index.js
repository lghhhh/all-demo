//banner轮播提参数
var i = 0;
var Timer;
//自定义地图参数
var cArr = ["custom-pic1", "custom-pic2", "custom-pic3", "custom-pic4", "custom-pic5"];
var index = 0;
//服务参数
var serverIndex = 0;
$(function () {
    //banner轮播图
    //默认第一张图片显示，其他的隐藏
    $(".banner-picImg").eq(0).show().siblings().hide();
    //自动轮播
    TimerBanner();
});

$("#banner-tabs li").hover(function () {  //鼠标移动上去
    clearInterval(Timer); //让计时器暂时停止   清除计时器
    i = $(this).index();    //获取该圈的索引
    showPic();            //调用显示图片的方法，显示该索引对应的图片
}, function () {          //鼠标离开
    TimerBanner();       //继续轮播   计时器开始
});
//自定义地图
//通过底下按钮点击切换
$(".thumbnail li").click(function () {
    const myindex = $(this).index();
    var b = myindex - index;
    if (b == 0) {
        return;
    }
    else if (b > 0) {
        /*
         * splice(0,b)的意思是从索引0开始,取出数量为b的数组
         * 因为每次点击之后数组都被改变了,所以当前显示的这个照片的索引才是0
         * 所以取出从索引0到b的数组,就是从原本的这个照片到需要点击的照片的数组
         * 这时候原本的数组也将这部分数组进行移除了
         * 再把移除的数组添加的原本的数组的后面
         */
        var newarr = cArr.splice(0, b);
        cArr = $.merge(cArr, newarr);
        $(".custom-pic li").each(function (i, e) {
            $(e).removeClass().addClass(cArr[i]);
        })
        index = myindex;
        show();
    }
    else if (b < 0) {
        /*
         * 因为b<0,所以取数组的时候是倒序来取的,也就是说我们可以先把数组的顺序颠倒一下
         * 而b现在是负值,所以取出索引0到-b即为需要取出的数组
         * 也就是从原本的照片到需要点击的照片的数组
         * 然后将原本的数组跟取出的数组进行拼接
         * 再次倒序,使原本的倒序变为正序
         */
        cArr.reverse();
        var oldarr = cArr.splice(0, -b)
        cArr = $.merge(cArr, oldarr);
        cArr.reverse();
        $(".custom-pic li").each(function (i, e) {
            $(e).removeClass().addClass(cArr[i]);
        })
        index = myindex;
        show();
    }
});

//服务
$(".server-func li").hover(function () {
    serverIndex = $(this).index();
    //移动下划光标
    showServerHr();
    //替换内容
    replaceContent();
});

//产品
$(".product-subtitle li").hover(function () {
    let productIndex = $(this).index();
    $(".product-subtitle li").eq(productIndex).addClass("hr-color").siblings().removeClass("hr-color");
    $(".content-detail ul").eq(productIndex).removeClass("detail-show").siblings().addClass("detail-show");
});

$("#dataProduct li").on("click", function () {
    let dataIndex = $(this).index();
    switch (dataIndex) {
        case 0:
            window.location.href = "https://www.careland.com.cn/Frontend/Product/pdlist.php?sort=15&iid=89";
            break;
        case 1:
            window.location.href = "https://www.careland.com.cn/Frontend/Product/pdlist.php?sort=15&iid=90";
            break;
        case 2:
            window.location.href = "https://www.careland.com.cn/Frontend/Product/pdlist.php?sort=16&iid=92";
            break;
        case 3:
            window.location.href = "https://www.careland.com.cn/Frontend/Product/pdlist.php?sort=15&iid=91";
            break;
        case 4:
            window.location.href = "https://www.careland.com.cn/Frontend/Product/pdlist.php?sort=16&iid=93";
            break;
    }
});

$("#navProduct li").on("click", function () {
    let navIndex = $(this).index();
    switch (navIndex) {
        case 0:
            window.location.href = "html/product/navigationProduct.html#passenger";
            break;
        case 1:
            window.location.href = "html/product/navigationProduct.html#freight";
            break;
        case 2:
            window.location.href = "html/product/navigationProduct.html#energy";
            break;
        case 3:
            window.location.href = "html/product/navigationProduct.html#AR";
            break;
        case 4:
            window.location.href = "html/product/navigationProduct.html#precision";
            break;
    }
});

//解决方案
$(".choice li").hover(function () {
    const programmeIndex = $(this).index();
    var arr = new Array(0, 1, 2, 3, 4, 5);
    arr.splice($.inArray(programmeIndex, arr), 1);
    $(".content-programme .choice li").eq(programmeIndex).addClass("choice-hr").siblings().removeClass("choice-hr");
    $(".content-programme .choice li img").eq(programmeIndex).attr("src", "images/index/solve_" + programmeIndex + ".png");
    $(".content-programme .pic li").eq(programmeIndex).removeClass("pic-hide").siblings().addClass("pic-hide");
    for (let i = 0; i < arr.length; i++) {
        $(".content-programme .choice li img").eq(arr[i]).attr("src", "images/index/solve_" + arr[i] + "_c.png");
    }
});

// 滑动滚动条
$(window).scroll(function () {
    // 滚动条距离顶部的距离 大于 200px时
    if ($(window).scrollTop() >= 1000) {
        $("#backTop").removeClass("hide");
    } else {
        $("#backTop").addClass("hide");
    }
});


layui.use('layer', function () {
    var layer = layui.layer;
    $("#map_customized").on("click", function () {
        layer.msg('开发中');
    });
});

//轮播部分
function TimerBanner() {
    Timer = setInterval(function () {
        i++;
        if (i == 3) {
            i = 0;
        }
        showPic()
    }, 6000);
}
//显示图片
function showPic() {
    $(".banner-picImg").eq(i).show().siblings().hide();
    $(".banner-tabs li").eq(i).addClass("bg").siblings().removeClass("bg");
}

//改变选择字体颜色
function show() {
    $(".content-custom .thumbnail li").eq(index).addClass("thumbnail-color").siblings().removeClass("thumbnail-color");
}

//改变产品选择字体下划线
function showServerHr() {
    $(".server-func li").eq(serverIndex).addClass("func-underline").siblings().removeClass("func-underline");
}

//上一张
function previmg() {
    cArr.unshift(cArr[4]);
    cArr.pop();
    //i是元素的索引，从0开始
    //e为当前处理的元素
    //each循环，当前处理的元素移除所有的class，然后添加数组索引i的class
    $(".custom-pic li").each(function (i, e) {
        $(e).removeClass().addClass(cArr[i]);
    })
    index--;
    if (index < 0) {
        index = 4;
    }
    show();
}

//下一张
function nextimg() {
    cArr.push(cArr[0]);
    cArr.shift();
    $(".custom-pic li").each(function (i, e) {
        $(e).removeClass().addClass(cArr[i]);
    })
    index++;
    if (index > 4) {
        index = 0;
    }
    show();
}

//点击class为p2的元素触发上一张照片的函数
$(document).on("click", ".custom-pic4", function () {
    previmg();
    return false;//返回一个false值，让a标签不跳转
});

//点击class为p4的元素触发下一张照片的函数
$(document).on("click", ".custom-pic2", function () {
    nextimg();
    return false;
});

function replaceContent() {
    switch (serverIndex) {
        case 0:
            $(".content-server .desc-title span").html("具有多种定位方式融合处理的能力");
            $(".content-server .desc-detail span").html("支持北斗、GPS、GLONASS三种模式的定位，支持无信号时的惯性模式，支持利用wifi和基站以及蓝牙信息进行定位");
            $(".content-server").css("background-image", "url('images/index/bcg_location.png')");
            break;
        case 1:
            $(".content-server .desc-title span").html("关键字及周边搜索");
            $(".content-server .desc-detail span").html("可通过输入关键字查询POI（兴趣点），通过中心点、半径、关键字、分类码查询周边的兴趣点，沿途搜索");
            $(".content-server").css("background-image", "url('images/index/bcg_search.png')");
            break;
        case 2:
            $(".content-server .desc-title span").html("提供多种路径规划，满足不同场景需求");
            $(".content-server .desc-detail span").html("乘用车路线服务，如系统推荐、高速优先、躲避拥堵等多种计算原则的驾车线路规划服务；货车路线服务避开限行、限高、" +
                "限长、限宽等不适合货车行驶的道路；步行路线服务提供行人步行线路规划服务，公交换乘服提供公交换乘、公交线路穿服务");
            $(".content-server").css("background-image", "url('images/index/bcg_routePlan.png')");
            break;
        case 3:
            $(".content-server .desc-title span").html("提供漫游提醒、路线引导服务");
            $(".content-server .desc-detail span").html("漫游提醒包括电子提醒、安全信息提示、限速提示、路况提示；路线引导包括转弯提示、实景图、放大路口图、路况、电子眼、安全提示" +
                "限速提示、限行提示等。");
            $(".content-server").css("background-image", "url('images/index/bcg_navigation.png')");
            break;
        case 4:
            $(".content-server .desc-title span").html("车辆行驶轨迹有迹可查");
            $(".content-server .desc-detail span").html("提供位置接入、实时位置查询、轨迹查询、轨迹纠偏、精准里程计算、轨迹分析等服务。");
            $(".content-server").css("background-image", "url('images/index/bcg_trajectory.png')");
            break;
        case 5:
            $(".content-server .desc-title span").html("实时交通服务，路况信息实时更新");
            $(".content-server .desc-detail span").html("信源丰富，真实权威；先进的数据处理融合模型，路况提供方式灵活多样。");
            $(".content-server").css("background-image", "url('images/index/bcg_realTime.png')");
            break;
        case 6:
            $(".content-server .desc-title span").html("地图数据加工服务");
            $(".content-server .desc-detail span").html("高精度地图、室内地图、三维高精度地图、二三维高精度标注");
            $(".content-server").css("background-image", "url('images/index/bcg_mapDataProcessing.png')");
            break;
        case 7:
            $(".content-server .desc-title span").html("其它服务");
            $(".content-server .desc-detail span").html("乘用车ETA和货运ETA；限速服务动态超速报警，限行服务终端预警及平台监管；配送服务提供单车多点和多车多点配送优化模式。");
            $(".content-server").css("background-image", "url('images/index/index_50.png')");
            break;
    }
}

layui.use(['carousel', 'element'], function () {
    var $ = layui.jquery
        , element = layui.element //Tab的切换功能，切换事件监听等，需要依赖element模块
        , carousel = layui.carousel;
    //设定各种参数
    carousel.render({
        elem: '#test1'
        , width: '100%'
        , height: '540px'
        , anim: 'default'
        , interval: 7000
    });

    // 只会交通 tab切换修改背景
    element.on('tab(traffic)', function () {
        document.getElementById('tab-active-background').style.backgroundImage = `url('./images/index/indexnew/traffic${this.getAttribute('lay-id')}.png')`
        // location.hash = 'test1='+ this.getAttribute('lay-id');
    });
});


// 质询按钮

document.getElementById('consult-btn').addEventListener('click', function () {
    layer.open({
        title: '请您留言',
        type: 1,
        content: $('#consult-content'),
        area: '420px',
        resize:false,
        btn: ['提交'],
        btn1: function (index, layero) {
            alert('11111');
            console.log('2222');
        },
        cancel: function(index, layero){ 
            layer.open({
                title:'   ',
                content:'您还未提交信息，确定要退出吗?',
               btn:['yes','no'],
                btn1:function(index2,layero){
                    layer.close(index2)
                    layer.close(index)
                }
            })
            return false; 
          }   
    });


})
