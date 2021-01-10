'use strict';
// const fs = require('fs');
// const path = require('path');
// const Axios = require('axios');
const { RoadNetworkModel } = require('./DAO/mongooseDAO.js');
const CoordinatesConvert = require('./util/CoordinatesConvert');
const Api = require('./util/api');


// 获取全部路网原始数据
RoadNetworkModel.find({ LinkName: /滨海/ }).limit(1).lean()
  .exec(mongoCb);

function mongoCb(err, docs) {
  if (err) {
    console.log(err);
  } else if (docs.length > 0) {
    console.log('====================query complete');
    docs.forEach((element, index) => {
      console.log('====================mainStart', index);
      mainStart(element);
    });
  }
  console.log('爬取结束。');
}
// function mongoCb(err, docs) {
//     if (err) {
//         console.log(err)
//     } else if (docs) {
//         console.log('====================query complete')
//         mainStart(docs)
//     }
//     console.log('爬取结束。')
// }

// // 根据路网线段坐标(84坐标 转百度坐标)获取两个端点数据 判断是否有街景

// 根据获得的百度 地点id 判断 街景时间是否大于2019

// 符合采集规范 获取前后八张图

// 合并图片入库本地 数据图片id存入数据库


// // 下载图片
// async function getimg() {
//     const fileName = path.resolve(__dirname, './originImg', '22.jpeg')
//     const wStream = fs.createWriteStream(fileName)

//     const response = await Axios({
//         url: imgurl2,
//         method: 'GET',
//         responseType: 'stream' //使用返回的数据是字节流的形式。
//     })
//     response.data.pipe(wStream)
//     return new Promise((resolve, reject) => {
//         wStream.on('finish', resolve);
//         wStream.on('error', reject);
//     })
// }

// // 合成街景 前/后视图
// async function mergeIma() {

// }


// 开始一段道路节点街景采集 该方法不可为异步
async function mainStart(data) {

  if (!data) return;
  const coordinates = data.GeometryCoordinates;
  const p1Marsx = coordinates[0][0];
  const p1Marsy = coordinates[0][1];
  const p2Marsx = coordinates[1][0];
  const p2Marsy = coordinates[1][1];
  // 获得路段百度mc坐标数组
  const p1mc = CoordinatesConvert.mars2DBMC(p1Marsx, p1Marsy);
  const p2mc = CoordinatesConvert.mars2DBMC(p2Marsx, p2Marsy);

  // 判断道路是否有街景
  // let sid1 = await Api.getRoadInfoByXY(p1[0], p1[1])
  // let sid2 = await Api.getRoadInfoByXY(p2[0], p2[1])


  // 1. 判断首尾是否有街景，全没有判断该路没有街景
  const coordinateArrs = await Promise.all([ Api.getRoadInfoByXY(p1mc[0], p1mc[1]), Api.getRoadInfoByXY(p2mc[0], p2mc[1]) ])
    .then(sidArrs => {
      const [ sid1, sid2 ] = sidArrs;
      // 因为可能存在断头路 只要有一头有id 就认为该段有路
      if (sid1 || sid2) {
        const coordinateArrs = CoordinatesConvert.coordinatesSplit({ lng: p1Marsx, lat: p1Marsy }, { lng: p2Marsx, lat: p2Marsy });
        return coordinateArrs;
      }
      return [];

    });


  const promises = coordinateArrs.map(data => Api.getRoadInfoByXY(data[0], data[1]));
  const streetIds = await Promise.all(promises);
  // 街景id去重
  const streetDeduplication = Array.from(new Set(streetIds));
  // 查询时间是否大于2019    后续判断
  const timeIsGt2019s = streetDeduplication.map(id => Api.getRoadDetalInfoById(id));
  // 第一个reject的实例返回只返回给 timeGt2019
  const timeGt2019 = await Promise.all(timeIsGt2019s);

  // ？？？ id 处理逻辑 未完

  // 09005700011608231314358109P
  // 同段道路并发请求，并过滤相同街景sid
  const downloadFinish = await Api.getImageById('09005700011608231314358109P');


}
