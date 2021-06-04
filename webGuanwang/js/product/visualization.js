// 滑动滚动条
$(window).scroll(function () {
    // 滚动条距离顶部的距离 大于 200px时
    if ($(window).scrollTop() >= 1000) {
        $("#backTop").removeClass("hide");
    } else {
        $("#backTop").addClass("hide");
    }
});

layui.use(['layer', 'element'], function () {
    const element = layui.element;
    const layer = layui.layer;
    window.addEventListener('load', () => {
        const tbcDomArr = document.getElementsByClassName('to-be-continue')
        // const tbcArr=[...tbcDomArr]
        for (let i = 0; i < tbcDomArr.length; i++) {
            tbcDomArr[i].addEventListener('click', () => {
                // layer.msg('敬请期待'); 
                layer.open({
                    content: '敬请期待',
                    time: 3000,
                    btn: []
                });

            })
        }
    })
});
