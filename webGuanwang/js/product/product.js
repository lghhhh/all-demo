$(function(){
    /*获取url中的参数(封装的方法)：*/
    function getUrlParam(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    let tab = getUrlParam("tab");//获取得到的参数
    if(tab){
        $(".detail-government .choice li").eq(tab).addClass("choice-title").siblings().removeClass("choice-title");
        $(".detail-government .choice-detail iframe").eq(tab).removeClass("hidden").siblings().addClass("hidden");
    }
});

//tabs
$("#product  li").click(function() {
    const tabsIndex=$(this).index();
    $(".page-content .head .product li").eq(tabsIndex).addClass("product-hr").siblings().removeClass("product-hr");
});
//政企产品
$(".detail-government .choice li").click(function() {
    const productIndex=$(this).index();
    $(".detail-government .choice li").eq(productIndex).addClass("choice-title").siblings().removeClass("choice-title");
    $(".detail-government .choice-detail iframe").eq(productIndex).removeClass("hidden").siblings().addClass("hidden");
});

$("#data_detail>li").on("click",function () {
    let dataIndex=$(this).index();
    switch (dataIndex) {
        case 0:
            window.location.href = "dataProduct.html?tab=0";
            break;
        case 1:
            window.location.href = "dataProduct.html?tab=1";
            break;
        case 2:
            window.location.href = "dataProduct.html?tab=2";
            break;
    }
});

$(".productDetail>li").on("click",function () {
    let productIndex=$(this).index();
    switch (productIndex) {
        case 0:
            window.location.href = "../../html/product/navigationProduct.html#passenger";
            break;
        case 1:
            window.location.href = "../../html/product/navigationProduct.html#freight";
            break;
        case 2:
            window.location.href = "../../html/product/navigationProduct.html#energy";
            break;
        case 3:
            window.location.href = "../../html/product/navigationProduct.html#AR";
            break;
        case 4:
            window.location.href = "../../html/product/navigationProduct.html#precision";
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

layui.use('element', function(){
    var element = layui.element;
    //获取hash来切换选项卡，假设当前地址的hash为lay-id对应的值
    var layid = location.hash.replace(/^#tab=/, '');
    element.tabChange('mapService', layid);

    window.addEventListener('hashchange',()=>{
        var layid = location.hash.replace(/^#tab=/, '');
        element.tabChange('mapService', layid); 
        // document.getElementById(hash).scrollIntoView()
    },false)
});