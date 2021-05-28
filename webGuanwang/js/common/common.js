var Common={
    //测试
    commomUrl :"http://test.careland.com.cn/dianshang/guanwang",
    //正式
    // commomUrl :"http://www.careland.com.cn",
    // 公共header
    commonHeader : {
        "Accept": "application/json",
    },

    //发送ajax请求
    sendAjax:function ajax(url, type, params, successfn, errorfn) {
        $.ajax({
            url: this.commomUrl + url,
            type: type,
            headers: this.commonHeader,
            data: params,
            // beforeSend:function(res){
            //     beforefn(res)
            //     console.log('看需要写不写,发送前的就是放加载图标的地方,这里显示,success和error函数里就隐藏');
            // },
            success: function (res) {
                successfn(res);
            },
            error: function (res) {
                errorfn(res);
            },
            // complete:function(){
            //     console.log('结束 看需要写不写');
            // }
        });
    }

};


