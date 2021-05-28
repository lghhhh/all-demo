$(function(){
    /*获取url中的参数(封装的方法)：*/
    function getUrlParam(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    let tab = getUrlParam("tab");//获取得到的参数
    let index = getUrlParam("index");//获取得到的参数
    if(tab){
		updateCss(".product li",tab,"product-hr");
		updateCss(".list_content",tab,"list_show");
        // $(".product li").eq(tab).addClass("product-hr").siblings().removeClass("product-hr");
        // $(".list_content").eq(tab).addClass("list_show").siblings().removeClass("list_show");
        if(index){
            switch (parseInt(tab)) {
                case 0:
                    updateCss(".content_left_first li a",index,"active_show");
                    updateCss(".content_right_first div",index,"content_show");
                    break;
                case 1:
                    updateCss(".content_left_second li a",index,"active_show");
                    updateCss(".content_right_second div",index,"content_show");
                    break;
                case 2:
                    updateCss(".content_left_third li a",index,"active_show");
                    updateCss(".content_right_third div",index,"content_show");
                    break;
            }
        }
    }
});


function updateCss(id,index,css){
    $(id).eq(index).addClass(css).siblings().removeClass(css);
}
$(".product li").click(function() {
    const listIndex=$(this).index();
    updateCss(".product li",listIndex,"product-hr");
    updateCss(".list_content",listIndex,"list_show");
});

$(".content_left_first li a").click(function() {
    const listIndex1=$(this).index();
    updateCss(".content_left_first li a",listIndex1,"active_show");
    updateCss(".content_right_first div",listIndex1,"content_show");
});

$(".content_left_second li a").click(function() {
    const listIndex1=$(this).index();
    updateCss(".content_left_second li a",listIndex1,"active_show");
    updateCss(".content_right_second div",listIndex1,"content_show");
});

$(".content_left_third li a").click(function() {
    const listIndex1=$(this).index();
    updateCss(".content_left_third li a",listIndex1,"active_show");
    updateCss(".content_right_third div",listIndex1,"content_show");
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