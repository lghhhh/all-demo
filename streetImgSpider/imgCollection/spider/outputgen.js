'use strict'
const fs = require('fs')
const { Error } = require('mongoose')
const path = require('path')
const { StreetImgInfoModel } = require('./DAO/mongooseDAO.js')

// =============================================================================================
// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  根据本地文件夹的以已经存在的文件结构生成csv文件    ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// 遍历mergeImg文件夹名;
function readFileDirList (dir, fileDirList = {}) {
  const files = fs.readdirSync(dir)
  //   console.log(files);
  files.forEach(item => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      fileDirList[item] = readFileDirList(fullPath)
    }
  })
  return fileDirList
}
// 根据遍历出来的文件夹结果 获得cityId+time+blockid的字符串 数组
function flatDeepObj (obj, flatArrs = []) {
  if (typeof obj === 'object' && !(Object.keys(obj).length)) return null

  for (const key of Object.keys(obj)) {
    const faltarr = flatDeepObj(obj[key])
    if (!faltarr) {
      flatArrs.push(`${key}`)
    } else {
      faltarr.forEach(item => {
        flatArrs.push(`${key}+${item}`)
      })
    }
  }
  return flatArrs
}

// =============================================================================================
// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  根据数据库以已经存在的数据生成csv文件    ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
async function getGrouupDataInDB (CityId) {
  if (!CityId) {
    throw Error('CityId is undefined !')
  }
  const data = await StreetImgInfoModel.aggregate([
    { $match: { CityId: CityId } },
    {
      $group: {
        _id: '$CityId',
        Data: { $addToSet: { CityId: '$CityId', BlockId: '$BlockId', Time: '$Time' } }
      }
    }
  ])
  return data[0].Data.map(d => {
    return {
      CityId: d.CityId,
      BlockId: d.BlockId,
      Time: d.Time.slice(0, 4)
    }
  })
}

// =============================================================================================
// 根据cityid、BlockId、 Time 获取对应的数据生成csv文件
async function gengCSV (condition) {
  const searchCondition = {
    CityId: condition.CityId,
    BlockId: condition.BlockId,
    Time: { $lt: `${condition.Time + 1}00`, $gt: `${condition.Time}00` }
  }

  // CityId  Time BlockId 拆分导csv到 对应文件夹
  const resultData = await StreetImgInfoModel.find(searchCondition).lean()
  //   console.log('查询的数据集', resultData);
  const csvFilename = `${condition.CityId}-${condition.Time}-${condition.BlockId}.csv`
  // -----------------------
  const csvdir = path.resolve(__dirname, './mosaicImg', condition.CityId, condition.Time, condition.BlockId, csvFilename)
  const outputdirCity = path.resolve(__dirname, './mosaicImg', condition.CityId)
  try {
    fs.accessSync(outputdirCity)
  } catch (e) {
    fs.mkdirSync(outputdirCity)
  }
  // 创建时间文件夹
  const outputdirTime = path.resolve(__dirname, './mosaicImg', condition.CityId, condition.Time)
  try {
    fs.accessSync(outputdirTime)
  } catch (e) {
    fs.mkdirSync(outputdirTime)
  }
  // 创建图幅
  const outputdirBlock = path.resolve(__dirname, './mosaicImg', condition.CityId, condition.Time, condition.BlockId)
  try {
    fs.accessSync(outputdirBlock)
  } catch (e) {
    fs.mkdirSync(outputdirBlock)
  }
  // -------

  let csvContent = '\ufeff设备名,经度,纬度,时间戳,图片名\n'

  resultData.forEach(item => {
    csvContent += `${item.BlockId},${item.X},${item.Y},${item.Time},${item.Sid}\n`
  })
  fs.writeFileSync(csvdir, csvContent)
  console.log(`File generated successfully. cityId:${condition.CityId} --- time:${condition.Time} ----BlockId:${condition.BlockId}`)
}

// // 根据本地文件夹结构生成对应的csv
// async function mian () {
//   await StreetImgInfoModel.findOne({}).lean() // 不预先请求后续会连接失败？？ 不知道为什么么
//   const mergeImgDirPath = path.resolve(__dirname, './mergeImg')
//   const mergeDirObj = readFileDirList(mergeImgDirPath)
//   const outputCondition = flatDeepObj(mergeDirObj)
//   console.log('全部输出条件', outputCondition)
//   const outputLen = outputCondition.length
//   for (let i = 0; i < outputLen; i++) {
//     const data = outputCondition[i]
//     const Arrs = data.split('+')
//     const condition = {
//       CityId: Arrs[0],
//       Time: Arrs[1],
//       BlockId: Arrs[2]
//     }
//     console.log(`开始循环生成csv文件,总数${outputLen}，当前： ${i + 1}`)
//     await gengCSV(condition)
//     console.log('===============END===============')
//   }
// }

// 根据给定城市id 生成对应文件夹结构的csv
async function mian (cityId) {
  await StreetImgInfoModel.findOne({}).lean() // 不预先请求后续会连接失败？？ 不知道为什么么,可能是node 的commonJS加载的过程导致为连接就查询
  const conditionArrs = await getGrouupDataInDB((cityId).toString())
  console.log(`待写入数组${conditionArrs.length}`)
  for (const condition of conditionArrs) {
    await gengCSV(condition)
  }
  console.log('===============END===============')
}
mian(277)
