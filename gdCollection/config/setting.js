'use strict'
// 模板文件
// const sqliteGDAddr = 'Template/GD-Addr-template.web.sqlite'
// const sqliteGDPoi = 'Template/GD-POI-template.web.sqlite'
// const sqliteMTAddr = 'Template/MT-Addr-template.web.sqlite'
//
const sqliteGDAddr = 'GD-Addr-上海.web.sqlite'
const sqliteGDPoi = 'GD-POI-苏州.web.sqlite'
const sqliteMTAddr = 'MT-Addr-南京.web.sqlite'

// --------------设置导入时生成Sqlite的文件名----------------
const exportCityName = '南京'
const exportFileType = 'sqliteMTAddr' // 根据 exportFileType 的值 获取对应的
module.exports = { exportCityName, exportFileType, sqliteGDAddr, sqliteGDPoi, sqliteMTAddr }

// 已经完成  高德地址  高德poi  美团地址

// 上海市  N  N  Y
// 南京市  N  N  Y，ing
// 无锡市
// 常州市
// 苏州市
// 南通市
// 盐城市
// 扬州市
// 镇江市
// 泰州市
// 杭州市
// 宁波市
// 嘉兴市
// 湖州市
// 绍兴市
// 金华市
// 舟山市
// 台州市
// 合肥市
// 芜湖市
// 马鞍山市
// 铜陵市
// 安庆市
// 滁州市
// 池州市
// 宣城市
// 广州市
// 佛山市
// 肇庆市
// 深圳市
// 东莞市
// 惠州市
// 珠海市
// 中山市
// 江门市
// 北京市
// 天津市
// 石家庄市
// 唐山市
// 保定市
// 沧州市
// 沈阳市
// 大连市
// 济南市
// 青岛市
// 烟台市
// 秦皇岛市
// 葫芦岛市
// 成都市
// 襄阳市
