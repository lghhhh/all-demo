var laypage;

layui.use(['element','laypage'], function(){
    laypage = layui.laypage;
    var element = layui.element;

});

$(function () {
    //初始化问题解答列表
    getList(5);
});

let nav_index=0;
$(".detail_nav li").on("click",function () {
    nav_index=$(this).index();
    let text=$(this).text();
    let id=$(this).val();
    $("#show_nav").text(text);
    $(".detail_nav li").eq(nav_index).addClass("choose_this").siblings().removeClass("choose_this");
    let content=$("#input_search").val().replace (/\s*/g,"") ;
    getList(id,null,content);
});

$(".choose_word").on("click",function () {
    let key=$(this).text() ;
    getList(nav_index,null,null,key);
});

$("#btn_search").on("click",function () {
    let content=$("#input_search").val().replace (/\s*/g,"") ;
    let id=$(".choose_this").val();
    getList(id,null,content);
});

//查询列表
function getList(id,page,content,key) {
    $('.layui-collapse').html("");
    var param = {};
    param.fids=id;
    param.content=content;
    param.page=page;
    param.key=key;
    if(!page){
        page=1;
    }
    var url = "/Frontend/FAQ/faqJson.php"; // 接口
    // 调用公共ajax
    Common.sendAjax(url, "get", param, function(res) {
        res=JSON.parse(res);
        let tabList = res.list;
        let page_count = res.page_count;
        if (laypage) {
            layui.use('laypage', function () {
                laypage = layui.laypage;
            });
        }
        if (page_count > 0) {
            for (let i = 0; i < tabList.length; i++) {
                let ids = i + 1;
                let title = tabList[i].FiIssue;
                let content = tabList[i].FiContent;
                let div = "<div class=\"layui-colla-item\">\n" +
                    "<h2 class=\"layui-colla-title\">" + ids + ".&nbsp;&nbsp;" + title + "</h2>\n" +
                    "<div class=\"layui-colla-content\">\n" +
                    "答：\n" +
                    content +
                    "</div>\n" +
                    "</div>\n" +
                    "</div>";
                $('.layui-collapse').append(div);
            }

            //分页
            laypage.render({
                elem: 'page'
                , count: res.page_count * 15
                , limit: 15
                , first: '首页'
                , last: '尾页'
                , curr: page
                , prev: '<em>←</em>'
                , next: '<em>→</em>'
                , jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    /*console.log(obj.curr);*/ //得到当前页，以便向服务端请求对应页的数据。
                    /*console.log(obj.limit); //得到每页显示的条数*/
                    //首次不执行
                    if (!first) {
                        //do something
                        getList(id, obj.curr);
                    }
                }
            });
            layui.element.init();//初始化
        } else {
            let div = "<div class='no_data'>暂无信息..." +
                "</div>";
            $('.layui-collapse').append(div);
            //分页
            laypage.render({
                elem: 'page'
                , count: 0
                , limit: 15
                , first: '首页'
                , last: '尾页'
                , curr: page
                , prev: '<em>←</em>'
                , next: '<em>→</em>'
            });
        }
    });
}


