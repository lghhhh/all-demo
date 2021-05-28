$(".product li").click(function() {
    const listIndex=$(this).index();
    $(".product li").eq(listIndex).addClass("product-hr").siblings().removeClass("product-hr");
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