var url = {};
url['index'] = "";
url['aboutUs'] = "../";
url['information'] = "../";
url['navigationProduct'] = "../../";
url['visualization'] = "../../";
url['upgrade'] = "../../";
url['product'] = "../../";
url['register'] = "../../";
url['service'] = "../../";
url['freightOnline'] = "../../";
url['faq'] = "../../";
url['dataProduct'] = "../../";
url['genuineVerification'] = "../../";
url['securityCode'] = "../../";
url['getVersion'] = "../../";
url['getSignature'] = "../../";
// 取当前页面名称(不带后缀名
// 取当前页面名称(不带后缀名)
function pageName() {
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length - 1, b.length).toString(String).split(".");
    return c.slice(0, 1)[0];
}
var pagename = pageName();
var head_url = url[pagename];
const htmlTemplate=`
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>头部</title>
    <link rel='stylesheet' href='${head_url}css/common/head.css' type='text/css'>
    <script src='${head_url}js/jar/jquery-1.10.2.min.js'></script>
</head>
<body>
<div id='container_head' class='container_head'>
    <div class='sub'>
    <ul>
        <li class='pic-company'><a href='${head_url}index.html' ><img border='0' src='${head_url}images/common/carelandLogo.png' alt='回到首页'/></a></li>
        <li class='sub-menu2'>
            <ul class='menu-first'>
                <li class='func'>
                    <a  href='${head_url}html/product/product.html' >产品中心</a>
                    <div>
                        <ul class='sub-func'>
                            <!--<em></em>-->
                            <li class='product-1'>
                                <span>地图服务</span>
                                <ul class='detail'>
                                    <li><a href='${head_url}html/product/product.html?#tab=1' >地图渲染</a></li>
                                    <li><a href='${head_url}html/product/product.html?#tab=2' >定位</a></li>
                                    <li><a href='${head_url}html/product/product.html?#tab=3' >搜索</a></li>
                                    <li><a href='${head_url}html/product/product.html?#tab=4' >路径规划</a></li>
                                    <li><a href='${head_url}html/product/product.html?#tab=5' >轨迹</a></li>
                                    <li><a href='${head_url}html/product/product.html?#tab=6' >路况</a></li>
                                    <li><a href='${head_url}html/product/product.html?#tab=7' >自定义地图</a></li>
                                    <li><a href='${head_url}html/product/product.html?#tab=8' >数据可视化</a></li>
                                </ul>
                            </li>
                            <li >
                                <span>数据产品</span>
                                <ul class='detail'>
                                    <li><a href='${head_url}html/product/dataProduct.html?tab=0' >高精度数据产品</a></li>
                                    <li><a href='${head_url}html/product/dataProduct.html?tab=1' >综合数据产品</a></li>
                                    <li><a href='${head_url}html/product/dataProduct.html?tab=2' >专题数据产品</a></li>
                                    <li><a href='${head_url}html/product/dataProduct.html?tab=3'  >网点数据产品</a></li>
                                </ul>
                            </li>
                            <li>
                                <span>导航产品</span>
                                <ul class='detail'>
                                    <li><a href='${head_url}html/product/navigationProduct.html#tradition' >传统导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#precision' >高精度导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#phone' >手机导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#parking' >停车场导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#dashboard' >仪表盘导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#AR' >AR导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#passengerCar' >乘用车导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#freight' >货运导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#energy' >新能源汽车导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#cerv' >特种车导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#mudTruck' >泥头车导航</a></li>
                                    <li><a href='${head_url}html/product/navigationProduct.html#wear' >智能穿戴设备导航</a></li>
                                </ul>
                            </li>
                            
                        </ul>
                    </div>
                </li>
                <li class='func '>
                    <a  href='${head_url}html/service/service.html' >服务与支持</a>
                    <div class=' choice func-1'>
                        <ul class='detail'>
                            <!--<em></em>-->
                            <li><a href='${head_url}html/service/faq.html' >常见问题解答</a></li>
                        </ul>
                    </div>
                </li>
                <li class='func'>
                    <a  href='${head_url}html/register/register.html' >注册与激活</a>
                    <div class='choice func-2'>
                        <ul class='detail'>
                            <!--<em></em>-->
                            <li><a href='${head_url}html/register/genuineVerification.html' target='_blank'>产品正版验证</a></li>
                            <li><a href='http://channel.careland.com.cn/do.php?m=user&a=login' target='_blank'>渠道专区</a></li>
                            <li><a href='http://boss.careland.com.cn/oem/index2.php' target='_blank'>OEM厂商</a></li>
                            <li><a href='https://map.careland.com.cn/?usercancel=1' target='_blank'>账号注销</a></li>
                        </ul>
                    </div>
                </li>
                <li class='func'><a  href='${head_url}html/information.html?tab=0' >资讯与公告</a>
                    <div class='choice func-3'>
                        <ul class='detail'>
                            <!--<em></em>-->
                            <li><a href='${head_url}html/information.html?tab=1' >凯立德资讯</a></li>
                            <li><a href='${head_url}html/information.html?tab=2' >凯立德公告</a></li>
                            <li><a href='${head_url}html/information.html?tab=3' >行业资讯</a></li>
                        </ul>
                    </div>
                </li>
                <li class='func' >
                    <a  href='${head_url}html/aboutUs.html' >关于我们</a>
                    <div class='choice func-4'>
                        <ul class='detail'>
                            <!--<em></em>-->
                            <li><a href='${head_url}html/aboutUs.html#companyProfile' >公司简介</a></li>
                            <li><a href='${head_url}html/aboutUs.html#corporateCulture' >企业文化</a></li>
                            <li><a href='${head_url}html/aboutUs.html#advantage' >优势</a></li>
                            <li><a href='${head_url}html/aboutUs.html#contactUs' >联系我们</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </li>
        <li class='sub-menu3'><a href='https://open.careland.com.cn/docs/' target='_blank'>开放平台</a></li>
    </ul>
</div>
</div>
</body>
</html>
`
document.write(htmlTemplate)
