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
    const element = layui.element;
    // const tab1Arr=['tradition','precision','phone','parking','dashboard','AR']
    // const tab2Arr=['passengerCar','freight','energy','cerv','mudTruck','wear']
    // //获取hash来切换选项卡，假设当前地址的hash为lay-id对应的值
    // const hash = location.hash.replace(/^#/, '');
    // let tabIndex= tab2Arr.includes(hash)?'index2':'index1'
    // element.tabChange('navigationProductTab', tabIndex); //假设当前地址为：http://a.com#test1=222，那么选项卡会自动切换到“发送消息”这一项

    // window.addEventListener('hashchange',()=>{
    //     const hash = location.hash.replace(/^#/, '');
    //     let tabIndex= tab2Arr.includes(hash)?'index2':'index1'
    //     element.tabChange('navigationProductTab', tabIndex); 
    //     document.getElementById(hash).scrollIntoView()
    // },false)
    
});
