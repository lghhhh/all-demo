'use strict'
const fs = require('fs')
const path = require('path')
const { StreetImgInfoModel } = require('./DAO/mongooseDAO.js')

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
  const csvdir = path.resolve(__dirname, './mergeImg', condition.CityId, condition.Time, condition.BlockId, csvFilename)

  let csvContent = '\ufeff设备名,经度,纬度,时间戳,图片名\n'

  resultData.forEach(item => {
    csvContent += `${item.BlockId},${item.X},${item.Y},${item.Time},${item.Sid}\n`
  })
  fs.writeFileSync(csvdir, csvContent)
  console.log(`File generated successfully. cityId:${condition.CityId} --- time:${condition.Time} ----BlockId:${condition.BlockId}`)
}
async function mian () {
  await StreetImgInfoModel.findOne({}).lean() // 不预先请求后续会连接失败？？ 不知道为什么么
  const mergeImgDirPath = path.resolve(__dirname, './mergeImg')
  const mergeDirObj = readFileDirList(mergeImgDirPath)
  const outputCondition = flatDeepObj(mergeDirObj)
  console.log('全部输出条件', outputCondition)
  const outputLen = outputCondition.length
  for (let i = 0; i < outputLen; i++) {
    const data = outputCondition[i]
    const Arrs = data.split('+')
    const condition = {
      CityId: Arrs[0],
      Time: Arrs[1],
      BlockId: Arrs[2]
    }
    console.log(`开始循环生成csv文件,总数${outputLen}，当前： ${i + 1}`)
    await gengCSV(condition)
    console.log('===============END===============')
  }
}
mian()
