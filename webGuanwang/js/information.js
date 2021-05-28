$(function(){
    /*获取url中的参数(封装的方法)：*/
   function getUrlParam(name) {
       let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
       let r = window.location.search.substr(1).match(reg);  //匹配目标参数
       if (r != null) return unescape(r[2]);
       return null; //返回参数值
   }

    let tab = getUrlParam("tab");//获取得到的参数
    $("#show-tab").text($(".content-choice li").eq(tab).find("span").text());
    $(".content-choice li").eq(tab).addClass("li-underline").siblings().removeClass("li-underline");
    if(tab){
        switch (parseInt(tab)) {
            case 0:
                getList(0);
                break;
            case 1:
                getList(1);
                break;
            case 2:
                getList(3);
                break;
            case 3:
                getList(2);
                break;
        }
    }else{
        getList(0);
    }

});

//咨询列表动态切换
let listIndex;
$(".content-choice li").on("click",function() {
    listIndex=$(this).index();
    let content=$(this).find("span").text();
    $("#show-tab").text(content);
    $('#show-tab').attr('href','information.html?tab='+listIndex);
    $(".content-choice li").eq(listIndex).addClass("li-underline").siblings().removeClass("li-underline");
    switch (listIndex) {
        case 0:
            getList(0);
            break;
        case 1:
            getList(1);
            break;
        case 2:
            getList(3);
            break;
        case 3:
            getList(2);
            break;
    }
});

//查询列表
function getList(id,page) {
    initList();
    var param = {};
    param.iid=id;
    if(page==null){
        page=1;
    }
    param.page=page;
    var url = "/Frontend/Information/InfoListApi.php"; // 接口
    // 调用公共ajax
    Common.sendAjax(url, "get", param, function(data) {
        data=JSON.parse(data);
        let tabList =data.list;
        if(tabList){
            for(let res in tabList){
                let ids=tabList[res].Iid;
                let title=tabList[res].IiTitle;
                let li="<li>\n" +
                    '<div onclick="getDetail('+ids+',\''+title+'\');">\n' +
                    "<span class=\"left\">"+title+"</span>\n" +
                    "<span class=\"right\">"+tabList[res].IiDates+"</span>\n" +
                    "</div>\n" +
                    "</li>";
                $('#detail_list').append(li);
            }

            //分页
            laypage.render({
                elem: 'page'
                , count: data.pagecount*15
                , limit: 15
                , first: '首页'
                , last: '尾页'
                , curr: page
                , prev: '<em>←</em>'
                , next: '<em>→</em>'
                ,jump: function(obj, first) {
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
        }
    });
}

//初始化列表
function initList() {
    $('#detail_list').html("");
    let title="<li class=\"list-title\"><div>\n" +
        "<span class=\"left\">标题</span>\n" +
        "<span class=\"right\">发布时间</span>\n" +
        "</div></li>";
    $('#detail_list').append(title);
}

//查询详情
function getDetail(ids,title){
    if(ids){
        $("#content").addClass("hide");
        $("#page").addClass("hide");
        $("#detail").removeClass("hide");
        $("#show_title").removeClass("hide");
        $("#show_title").text(">"+title);
        var url = "/Frontend/Information/InfoContentApi.php"; // 接口
        //调用公共ajax
        Common.sendAjax(url, "get", {ids:ids}, function(data) {
            data=JSON.parse(data);
            let info=data.info;
            let back=data.back;
            let next=data.next;
            $("#title").text(info.IiTitle);
            $("#author").text(info.IiAuthor);
            $("#date").text(info.IiDates);
            $("#mainContent").html(info.IiContent);
            $("#prev").text(back.IiTitle);
            $("#next").text(next.IiTitle);
            $("#prevId").val(back.Iid);
            $("#nextId").val(next.Iid);
        });
    }
}

$("#prev").on("click",function () {
    let ids=$("#prevId").val();
    let title=$("#prev").text();
    getDetail(ids,title);
});

$("#next").on("click",function () {
    let ids=$("#nextId").val();
    let title=$("#next").text();
    getDetail(ids,title);
});

// 滑动滚动条
$(window).scroll(function(){
// 滚动条距离顶部的距离 大于 1000px时
    if($(window).scrollTop() >= 1000){
        $("#backTop").removeClass("hide");
    } else{
        $("#backTop").addClass("hide");
    }
});

//自定义首页、尾页、上一页、下一页文本
var laypage;
layui.use('laypage', function() {
    laypage = layui.laypage;
});
