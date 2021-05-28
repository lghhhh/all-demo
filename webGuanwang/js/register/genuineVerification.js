var code_public;
// jQuery(function($){

/**生成一个随机数**/
function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
/**生成一个随机色**/
function randomColor(min, max) {
	var r = randomNum(min, max);
	var g = randomNum(min, max);
	var b = randomNum(min, max);
	return "rgb(" + r + "," + g + "," + b + ")";
}
code_public = drawPic();
document.getElementById("changeImg").onclick = function(e) {
	e.preventDefault();
	code_public = drawPic();
}
/**绘制验证码图片**/
function drawPic() {
	var canvas = document.getElementById("canvas");
	var width = canvas.width;
	var height = canvas.height;
	//获取该canvas的2D绘图环境 
	var ctx = canvas.getContext('2d');
	ctx.textBaseline = 'bottom';
	/**绘制背景色**/
	ctx.fillStyle = randomColor(180, 240);
	//颜色若太深可能导致看不清
	ctx.fillRect(0, 0, width, height);
	/**绘制文字**/
	// var str ='ABCEFGHJKLMNPQRSTWXY123456789';
	var str = '123456789';
	var code = "";
	//生成四个验证码
	for (var i = 1; i <= 4; i++) {
		var txt = str[randomNum(0, str.length)];
		code = code + txt;
		ctx.fillStyle = randomColor(50, 160);
		//随机生成字体颜色
		ctx.font = randomNum(15, 40) + 'px SimHei';
		//随机生成字体大小
		// var x =10 +i *25;
		var x = i * 25;
		var y = randomNum(35, 35);
		var deg = randomNum(-45, 45);
		//修改坐标原点和旋转角度
		ctx.translate(x, y);
		ctx.rotate(deg * Math.PI / 180);
		ctx.fillText(txt, 0, 0);
		//恢复坐标原点和旋转角度
		// ctx.rotate(-deg * Math.PI /180);
		ctx.rotate(-deg * Math.PI / 180);
		ctx.translate(-x, -y);
	}

	/**绘制干扰线**/
	for (var i = 0; i < 1; i++) {
		ctx.strokeStyle = randomColor(40, 180);
		ctx.beginPath();
		ctx.moveTo(randomNum(0, width / 2), randomNum(0, height / 2));
		ctx.lineTo(randomNum(0, width / 2), randomNum(0, height));
		ctx.stroke();
	}
	/**绘制干扰点**/
	for (var i = 0; i < 50; i++) {
		ctx.fillStyle = randomColor(255);
		ctx.beginPath();
		ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
		ctx.fill();
	}
	return code;
}
// });


layui.use('form', function() {
	var form = layui.form;
	//监听提交
	// layer.open({//提交成功
	// 	type:1,
	// 	title: '提示',
	// 	content: "<div style='width:420px;height:200px;text-align:center'><img src='../../images/register/successful_icon.png' width='60' height='60' style='margin:30px 0 10px 0' /><ul style='font-size:18px;color:#333333'>提交成功</ul><ul style='width:420px;height:50px;margin-top:25px'><button style='width:110px;height:32px;margin:0 auto;line-height:32px;color:#fff;background:#0091FF;border-radius: 4px;font-size:14px' class='layui-layer-ico layui-layer-close layui-layer-close1' href='javascript:layer.close();'>返回</button></ul></div>"
	// });
	// layer.open({//提交失败
	// 	type:1,
	// 	title: '提示',
	// 	content: "<div style='width:420px;height:200px;text-align:center'><img src='../../images/register/failure_icon.png' width='60' height='60' style='margin:30px 0 10px 0' /><ul style='font-size:18px;color:#DA4F4F'>提交失败</ul><ul style='width:420px;height:50px;margin-top:25px'><button style='width:110px;height:32px;margin:0 auto;line-height:32px;color:#fff;background:#0091FF;border-radius: 4px;font-size:14px' class='layui-layer-ico layui-layer-close layui-layer-close1' href='javascript:layer.close();'>返回</button></ul></div>"
	// });
	form.on('submit(formDemo)', function(data) {
		// layer.msg(JSON.stringify(data.field));
		var data = JSON.parse(JSON.stringify(data.field))
		// console.log(data)
		if (data.agreement == 'on') {
			formValidate(data);
			// post()
		} else {
			layer.msg('需同意协议！');
			return
		}
		return false;
	});
});
// 滑动滚动条
$(window).scroll(function() {
	// 滚动条距离顶部的距离 大于 200px时
	if ($(window).scrollTop() >= 1000) {
		$("#backTop").removeClass("hide");
	} else {
		$("#backTop").addClass("hide");
	}
});


//悬停特征码时触发
function open_onmouseover() {
	$(".signatureCode_img").css({
		'display': 'block'
	})
	$(".signatureCode_text").css({
		'display': 'none'
	})
}

function open_onmouseout() {
	$(".signatureCode_img").css({
		'display': 'none'
	})
	$(".signatureCode_text").css({
		'display': 'block'
	})
}
//输入版本号时触发
$(document).ready(function() {
	$("#versionFirst").on('input', function(e) {
		var versionFirst = $('#versionFirst').val();
		if (versionFirst.length == 5) {
			$('#versionSecond').focus()
		}
	});
	$("#versionSecond").on('input', function(e) {
		var versionSecond = $('#versionSecond').val();
		if (versionSecond.length == 5) {
			$('#versionThird').focus()
		}
	});
	$("#versionThird").on('input', function(e) {
		var versionThird = $('#versionThird').val();
		if (versionThird.length == 8) {
			$('#safetyCode').focus()
		}
	});
});
// 验证中文名称
// function isChinaName(name) {
// 	var pattern = /^[\u4E00-\u9FA5]{1,6}$/;
// 	return pattern.test(name);
// }

// 验证手机号
function isPhoneNo(phone) {
	var pattern = /^1[34578]\d{9}$/;
	return pattern.test(phone);
}

// 验证固定电话
function isFixedPhoneNo(phone) {
	// var pattern = /^0\d{2,3}-?\d{7,8}$/;
	var pattern = /^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/;
	return pattern.test(phone);
}

// 验证邮箱
function isEMail(email) {
	var pattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	return pattern.test(email);
}


function formValidate(data) {
	var str = '';
	// 判断名称
	if ($.trim($('#name').val()).length == 0) {
		str += '名称不能为空\n';
		$('#name').focus();
	} else {
		if ($.trim($('#name').val()) == false) {
			str += '名称不合法\n';
			// $('#name').focus();
			layer.msg(str);
			return
		}
	}

	// 判断电话号码
	if ($.trim($('#phone').val()).length == 0) {
		str += '手机号码不能为空\n';
		$('#phone').focus();
	} else {
		if (isPhoneNo($.trim($('#phone').val())) == false) {
			str += '手机号码不正确\n';
			layer.msg(str);
			return
		}
	}

	// 判断邮箱
	if ($.trim($('#eMail').val()).length == 0) {
		str += '邮箱不能为空\n';
		$('#eMail').focus();
	} else {
		if (isEMail($.trim($('#eMail').val())) == false) {
			str += '邮箱不合法\n';
			layer.msg(str);
			return
		}
	}

	// 如果没有错误则提交
	// if (str != '') {
	if (str == '') {
		if (data.verificationCode == code_public) {
			post(data)
		} else {
			layer.msg('验证码错误！');
		}
		return false;
	} else {
		$('.auth-form').submit();
	}
}

function post(data) {
	var timestamp = (new Date()).getTime();
	var param = {
		devtype: data.type,
		fea: data.signatureCode,
		act: data.activationCode,
		safecode: data.safetyCode,
		ver1: data.versionFirst,
		ver2: data.versionSecond,
		ver3: data.versionThird,
		name: data.name,
		tele: data.phone,
		email: data.eMail,
		time: timestamp
		// sign:'123'
	};
	var success_icon = '../../images/register/successful_icon.png'
	var fail_icon = '../../images/register/failure_icon.png'
	var tip = '提示'
	var url = "/service/checksn/action2_new.php"; // 接口
	// 调用公共ajax
	Common.sendAjax(url, "get", param, function(data_string) {
		code_public = drawPic()
		var data = JSON.parse(data_string)
		console.log(data);
		if (data.code == 1) { //成功
			if (data.navupdate) { //需要升级
				layer.open({
					type: 1,
					title: tip,
					content: "<div style='width:420px;height:240px;text-align:center'><img src='" + success_icon +
						"' width='60' height='60' style='margin:30px 0 10px 0' /><ul style='font-size:18px;color:#333333'>" + data.msg +
						"</ul><ul style='margin-top:10px;'><a style='color:#0091FF' href='http://shop.careland.com.cn/external_navupdate.php' target='_self'>前往升级</a></ul><ul style='width:420px;height:50px;margin-top:25px'><button style='width:110px;height:32px;margin:0 auto;line-height:32px;color:#fff;background:#0091FF;border-radius: 4px;font-size:14px' class='layui-layer-ico layui-layer-close layui-layer-close1' href='javascript:layer.close();'>返回</button></ul></div>"
				});
			} else {
				layer.open({
					type: 1,
					title: tip,
					content: "<div style='width:420px;height:200px;text-align:center'><img src='" + success_icon +
						"' width='60' height='60' style='margin:30px 0 10px 0' /><ul style='font-size:18px;color:#333333'>" + data.msg +
						"</ul><ul style='width:420px;height:50px;margin-top:25px'><button style='width:110px;height:32px;margin:0 auto;line-height:32px;color:#fff;background:#0091FF;border-radius: 4px;font-size:14px' class='layui-layer-ico layui-layer-close layui-layer-close1' href='javascript:layer.close();'>返回</button></ul></div>"
				});
			}
		} else if (data.code == -1) { //失败
			layer.open({
				type: 1,
				title: tip,
				content: "<div style='width:420px;height:200px;text-align:center'><img src='" + fail_icon +
					"' width='60' height='60' style='margin:30px 0 10px 0' /><ul style='font-size:18px;color:#DA4F4F'>" + data.msg +
					"</ul><ul style='width:420px;height:50px;margin-top:25px'><button style='width:110px;height:32px;margin:0 auto;line-height:32px;color:#fff;background:#0091FF;border-radius: 4px;font-size:14px' class='layui-layer-ico layui-layer-close layui-layer-close1' href='javascript:layer.close();'>返回</button></ul></div>"
			});
		}
	}, function(e) {
		console.log('数据异常，请刷新后重试...', 'warning');
	})
}
