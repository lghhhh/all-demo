'use strict'
// const fs = require('fs');
// const path = require('path');
// const Axios = require('axios');
const mongoose = require('mongoose')
const { RoadNetworkModel, StreetImgInfoModel } = require('./DAO/mongooseDAO.js')
const CoordinatesConvert = require('./util/CoordinatesConvert')
const Api = require('./util/api')
const ImgApi = require('./util/mergeImg')

// const HEARTBEAT_INTERVAL = 1000 * 10 //10

function main (condition) {
  // 获取全部路网原始数据  -2:无符合要求街景 -1:无街景 0：未采集  1：采集成功 2：采集未完整
// RoadNetworkModel.find({ LinkName: /深南/, CollectionStatus: '0' }).limit().lean()
  RoadNetworkModel.find(condition).limit().lean().exec(mongoCb)
}

async function mongoCb (err, docs) {
  if (err) {
    // console.log('====== 路网数据获取失败  ======', err)
  } else if (docs.length > 0) {
    // console.log('====== 路网数据获取完成  ======')
    let count = 0
    // 继发执行
    for (const doc of docs) {
      console.log(`*********************路网数据采集开始PID:${process.pid}   总数${docs.length}-当前序号:${count} **********`)
      await mainStart(doc)
      count++
      sendheartBeat()
      // // 休眠10秒
      // await new Promise((resolve, reject) => {
      //   try {
      //     setTimeout(() => {
      //       resolve()
      //     }, 0)
      //   } catch (error) {
      //     reject(error)
      //   }
      // })
    }
    console.log(`！！！！！！！！！！！！！！PID:${process.pid} 爬取结束----！！！！！！！！！！！！！！！`)
    // 并发执行
    // docs.forEach((element, index) => {

    //   mainStart(element);
    // });
  }
}

// 开始一段道路节点街景采集 该方法不可为异步
async function mainStart (data) {
  if (!data) {
    console.log(`PID:${process.pid} 无数据跳过`, data)
    return
  }
  const coordinates = data.GeometryCoordinates
  const RoadNetworkId = data._id
  const CityId = data.CityId
  const BlockId = data.BlockId
  const p1Marsx = coordinates[0][0]
  const p1Marsy = coordinates[0][1]
  const p2Marsx = coordinates[1][0]
  const p2Marsy = coordinates[1][1]
  // 获得路段百度mc坐标数组
  const p1mc = CoordinatesConvert.mars2DBMC(p1Marsx, p1Marsy)
  const p2mc = CoordinatesConvert.mars2DBMC(p2Marsx, p2Marsy)

  // 判断道路是否有街景
  // let sid1 = await Api.getRoadInfoByXY(p1[0], p1[1])
  // let sid2 = await Api.getRoadInfoByXY(p2[0], p2[1])

  // ---------------------------------------------------------- 1. 判断首尾是否有街景，全没有判断该路没有街景  范围30个一的 国测局坐标点
  const coordinateArrs = await Promise.all([Api.getRoadInfoByXY(p1mc[0], p1mc[1]), Api.getRoadInfoByXY(p2mc[0], p2mc[1])])
    .then(sidArrs => {
      const [sid1, sid2] = sidArrs
      // 因为可能存在断头路 只要有一头有id 就认为该段有路
      if (sid1 || sid2) {
        const coordinateArrs = CoordinatesConvert.coordinatesSplit({ lng: p1Marsx, lat: p1Marsy }, { lng: p2Marsx, lat: p2Marsy })
        return coordinateArrs
      }
      return []
    })

  if (coordinateArrs.length === 0) {
    RoadNetworkModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(RoadNetworkId).toString() }, { $set: { CollectionStatus: '-1' } }, { new: true, upsert: true })
      .lean().exec(err => {
        if (err) console.log(`PID:${process.pid} 路网数据更新失败id:`, mongoose.Types.ObjectId(RoadNetworkId).toString(), err)
        console.log(`PID:${process.pid} 路网信息更新完成， 路网id`, mongoose.Types.ObjectId(RoadNetworkId).toString())
      })
  }
  // ---------------------------------------------------------- 2.根据分割的 mc坐标 获取对应的sid和对应的原始国测局坐标
  const promises = coordinateArrs.map(async data => {
    const [x, y] = CoordinatesConvert.mars2DBMC(data[0], data[1])
    const sid = await Api.getRoadInfoByXY(x, y)
    if (sid) {
      const result = {}
      // result[sid] = [ data[0], data[1] ];  //国测局坐标
      result[sid] = CoordinatesConvert.gcj02towgs84(data[0], data[1]) // 存储84坐标
      return result
    }
    return null
  })
  // 返回一个对象数组， 对象以sid为key、84XY为value
  const streetIds = await Promise.all(promises)
  // sid去重
  const sidSet = new Set() // 用于记录以存在的sid
  const streetDeduplication = {} // 存储去重后的对象 街景曲线入库需要
  // if()
  for (const obj of streetIds) {
    if (obj === null) continue
    const sid = Object.getOwnPropertyNames(obj)[0]
    if (!sidSet.has(sid)) {
      sidSet.add(sid)
      streetDeduplication[sid] = { XY: obj[sid] }
    }
  }

  const idGt2019 = []// 存放时间大于2019的sid
  const sidDeDuplicate = Array.from(sidSet)
  for (let i = 0; i < sidDeDuplicate.length; i++) {
    const id = sidDeDuplicate[i]
    const result = await Api.getRoadDetalInfoById(id)
    if (result) {
      idGt2019.push(id)
      streetDeduplication[id].Time = result
    }
  }
  const roadInfo = {}
  if (idGt2019.length > 0) {
    // console.log('==获取街景图片开始====未获取sid：', idGt2019)
    // 返回idGt2019 数组sid图像的合成情况
    const mergeStatus = await Promise.all(idGt2019.map(id => downloadMergeImgBySid(id, CityId, BlockId, streetDeduplication[id].Time)))
    idGt2019.forEach((sid, index) => {
      if (mergeStatus[index]) {
        saveImgData2Mongodb(RoadNetworkId, sid, CityId, BlockId, streetDeduplication[sid].Time, streetDeduplication[sid].XY)
      }
    })
    // console.log('=====================街景数据入库开始')

    if (mergeStatus.findIndex(data => data === false) === -1) {
      roadInfo.CollectionStatus = '1' // 采集完成
    } else {
      roadInfo.CollectionStatus = '2' // 采集未完整
    }
  } else {
    roadInfo.CollectionStatus = '-2' // 无符合要求街景
  }
  RoadNetworkModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(RoadNetworkId).toString() }, { $set: roadInfo }, { new: true, upsert: true })
    .lean().exec(err => {
      if (err) console.log(`PID:${process.pid} 路网数据更新失败id:`, mongoose.Types.ObjectId(RoadNetworkId).toString(), err)
      console.log(`PID:${process.pid}路网信息更新完成， 路网id`, mongoose.Types.ObjectId(RoadNetworkId).toString())
    })
}

// 下载、合并图片
/**
 *传入sid 下载并合并图片
 * @param {*} id sid
 * @param {*} CityId  城市id
 * @param {*} BlockId 图幅id
 * @param {*} Time 时间
 * @return {*} 返回
 */
async function downloadMergeImgBySid (id, CityId, BlockId, Time) {
  // 同段道路并发请求，并过滤相同街景sid
  const frontArrs = ['1_0', '1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '2_0', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7']
  const imgRequests = frontArrs.map(pos => Api.getImageByIdPos(id, pos))
  // 获取图片流
  const imgStreams = await Promise.all(imgRequests)
  const saveImgStatus = imgStreams.map(dataObj => ImgApi.saveImg(id, dataObj.pos, dataObj.data))
  // 保存图片
  const saveStatus = await Promise.all(saveImgStatus)
  const saveAllImg = saveStatus.find(e => e !== true)
  // 所有图片下载完成才进行合成
  if (!saveAllImg) {
    // console.log('开始合并图片=============================================id：', id)
    const mergeStatus = await ImgApi.mergeImg(id, CityId, BlockId, Time)
    // console.log('！！！！！！！！！！！合并结束！！！！！！！！！！！！！：', id)
    return mergeStatus
  }
  console.log(`PID:${process.pid}保存图片失败====id：`, id)
}

//  完成合成数据入库
function saveImgData2Mongodb (RoadId, Sid, CityId, BlockId, Time, obj) {
  const data = {
    RoadId: mongoose.Types.ObjectId(RoadId).toString(), // RoadNetwork collection中对应的id
    Sid,
    CityId,
    BlockId,
    Time,
    X: obj[0], // 国策局经纬度
    Y: obj[1]
  }
  // console.log('保存街景数据，入库开始。')
  StreetImgInfoModel.findOneAndUpdate({ Sid }, { $set: data }, { upsert: true })
    .lean().exec(err => {
      if (err) console.log(`PID:${process.pid} 街景图像相关信息入库失败，sid:${Sid}, 路网id:${mongoose.Types.ObjectId(RoadId).toString()} 错误信息===>`, err)
      console.log(`PID:${process.pid} 街景图像相关信息入库成功， 路网id:${mongoose.Types.ObjectId(RoadId).toString()}--sid:${Sid}`)
    })
}

// 入库完成后发送心跳包
function sendheartBeat () {
  const msg = {
    pid: process.pid,
    type: 'alive',
    time: Date.now()
  }
  process.send(JSON.stringify(msg))
}

// =======监听父进程传递的参数======
process.on('message', (msg) => {
  const message = JSON.parse(msg)
  const msgType = message.type
  if (msgType === 'start') main(message.condition)
})
