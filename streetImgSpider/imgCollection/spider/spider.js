'use strict';
// const fs = require('fs');
// const path = require('path');
// const Axios = require('axios');
const { RoadNetworkModel } = require('./DAO/mongooseDAO.js');
const CoordinatesConvert = require('./util/CoordinatesConvert');
const Api = require('./util/api');
const ImgApi = require('./util/mergeImg');


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


  // 1. 判断首尾是否有街景，全没有判断该路没有街景  范围30个一的 国测局坐标点
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

  // 2.根据分割的 mc坐标 获取对应的sid 并去重
  const promises = coordinateArrs.map(data => {
    const [ x, y ] = CoordinatesConvert.mars2DBMC(data[0], data[1]);
    Api.getRoadInfoByXY(x, y);
  });
  const streetIds = await Promise.all(promises);
  // id去重
  const streetDeduplication = Array.from(new Set(streetIds));
  // 3. 查询时间是否大于2019    过滤时间小于2019的数据
  // const timeIsGt2019s = await streetDeduplication.filter(async id => {
  //   const gt2019 = await Api.getRoadDetalInfoById(id);
  //   return gt2019;
  // });
  const idGt2019 = [];
  for (let i = 0; i < streetDeduplication.length; i++) {
    const id = streetDeduplication[i];
    const isGt2019 = await Api.getRoadDetalInfoById(id);
    if (isGt2019) {
      idGt2019.push(id);
    }
  }
  // 第一个reject的实例返回只返回给 timeGt2019
  // const timeGt2019 = await Promise.all(timeIsGt2019s);

  console.log('=====获取街景图片start======', idGt2019);
  // idGt2019.forEach(id => downloadMergeImgBySid(id));
  streetDeduplication.forEach(id => downloadMergeImgBySid(id));
  console.log('=====获取街景图片END======');

  // 完成合成 数据写入库
}


// 下载、合并图片
async function downloadMergeImgBySid(id) {
  // 同段道路并发请求，并过滤相同街景sid
  const frontArrs = [ '1_0', '1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '2_0', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7' ];
  const imgRequests = frontArrs.map(pos => Api.getImageByIdPos(id, pos));
  // 获取图片流
  const imgStreams = await Promise.all(imgRequests);
  const saveImgStatus = imgStreams.map(dataObj => ImgApi.saveImg(id, dataObj.pos, dataObj.data));
  // 保存图片
  const saveStatus = await Promise.all(saveImgStatus);
  const saveAllImg = saveStatus.find(e => e !== true);
  // 所有图片下载完成才进行合成
  if (!saveAllImg) {
    console.log('开始合并图片=====id：', id);
    const mergeStatus = await ImgApi.mergeImg(id);
    return mergeStatus;
  }
  console.log('保存图片失败====id：', id);
}
