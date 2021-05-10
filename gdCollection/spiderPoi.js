'use strict'
const schedule = require('node-schedule')
// const { PoiModel, SearchParamModel, AddressModel } = require('./DAO/SQLiteDAO_GD_Addr')
const { SearchParamModel, PoiModel } = require('./DAO/SQLiteDAO_GD_Poi')
const api = require('./util/api')
const common = require('./util/common')

// ==========================↓↓↓ 数据库操作--数据采集条件获取 ↓↓↓================================
async function getSearchParams (offest = 0) {
  // count：符合查询条件
  const { count, rows } = await SearchParamModel
    .findAndCountAll({
      attributes: ['OID', 'OAdcode', 'Keyword', 'OX', 'OY', 'OMergeId', 'OMergeStatus'],
      where: {
        State: 0
        // Type: '2'
      },
      offest,
      // 一共27个key: 地址一次最多16万 poi 5400
      limit: 54000
    })
  console.log({ count, rows })
  return { count, rows }
}
// ==========================↓↓↓ poi数据采集入库 ↓↓↓===============================
// 调用高德api接口
async function getPOIData (CityCode, Keyword, page) {
  console.log('根据条件 调用GDpoi 开始=======================')
  const result = await api.getPOI(CityCode, Keyword, page)
    .catch(
      err => console.log(err)
    )
  // console.log(result)
  return result
}
// 批量存入poi数据进数据库
async function savePOIData (CityCode, Keyword, originalParams, data) {
  if (!data?.pois.length) return
  const pois = data.pois
  const GDAdcode = data.suggestion.cities.adcode
  // 同步表

  const setDataArrs = pois.map(ele => {
    return {
      OID: (originalParams.id).toString(),
      OAdcode: Number(CityCode),
      Keyword,
      OX: originalParams.OX, // 原始XY坐标
      OY: originalParams.OY,
      OMergeId: originalParams.OMergeId, // 融合来源
      OMergeStatus: originalParams.OMergeStatus, // 融合状态

      Adcode: ele.adcode.length ? Number(ele.adcode) : '',
      SID: ele?.id ? (ele.id).toString() : '',
      Longitude: ele.location.length ? Number(ele.location.split(',')[0]) : '',
      Latitude: ele.location.length ? Number(ele.location.split(',')[1]) : '',
      Name: Array.isArray(ele.name) ? (ele.name?.[0] || '') : (ele.name).toString(),
      address: Array.isArray(ele.address) ? (ele.address?.[0] || '') : (ele.address || '').toString(),
      Tel: Array.isArray(ele.tel) ? (ele.tel?.[0] || '') : (ele.tel).toString(),
      TypeCode: Array.isArray(ele.typecode) ? (ele.typecode?.[0] || '') : (ele.typecode).toString(),
      TypeName: Array.isArray(ele.type) ? (ele.type?.[0] || '') : (ele.type).toString(),
      Biz_Type: Array.isArray(ele.biz_type) ? (ele.biz_type?.[0] || '') : (ele.biz_type).toString(),
      SubType: Array.isArray(ele.childtype) ? (ele.childtype?.[0] || '') : (ele.childtype).toString(),
      Location: Array.isArray(ele.location) ? (ele.location?.[0] || '') : (ele.location).toString(),
      ParentID: Array.isArray(ele.parent) ? (ele.parent?.[0] || '') : (ele.parent).toString(),
      PName: Array.isArray(ele.pname) ? (ele.pname?.[0] || '') : (ele.pname).toString(),
      CityName: Array.isArray(ele.cityname) ? (ele.cityname?.[0] || '') : (ele.cityname).toString(),
      AdName: Array.isArray(ele.adname) ? (ele.adname?.[0] || '') : (ele.adname).toString(),
      IsPicture: Array.isArray(ele.photos) && ele.photos.length > 0 ? 1 : 0,
      CreateTime: common.getDateStmap()
    }
  })
  // 批量插入数据
  const status = await PoiModel.bulkCreate(setDataArrs)
  return status
}

async function updatePoiStatus (id) {
  const result = await SearchParamModel.update({ State: 1 }, {
    where: {
      OID: id
    }
  })
  return result
}
// 处理一个组合条件下的全部poi
async function POIProcess (CityCode, Keyword, originalParams) {
  // console.log('poi采集开始')
  const firstData = await getPOIData(CityCode, Keyword)
  if (firstData?.message === 'limit exceeded') return 0
  if (firstData?.status === '0') return 1// 返回结果 status为0  表示查询失败
  await savePOIData(CityCode, Keyword, originalParams, firstData)
  // // 当前条件下，查询到的poi总数
  // const poiCount = firstData.count
  // const pageCount = Number(poiCount / 20)

  // let currentPage = 1 // 第一次获取默认0
  // // if (currentPage > pageCount) continue
  // while (currentPage <= pageCount) {
  //   const poiData = await getPOIData(CityCode, Keyword, currentPage)
  //   // 存储第一次的数据
  //   savePOIData(CityCode, Keyword, id, poiData)
  //   currentPage++
  // }
  await updatePoiStatus(originalParams.id)
  // console.log('poi采集结束')
  return 1
}
// ==========================↓↓↓ 地址数据数据采集入库 ↓↓↓===============================
// 解析地址
// async function getAdressData (CityCode, Keyword) {
//   const result = await api.getAddressInfo(CityCode, Keyword)
//   return result
// }
// // 批量存入poi数据进数据库
// async function saveAddressData (CityCode, Keyword, id, data) {
//   // console.log('id,', id, data)
//   if (!data.geocodes.length) return
//   const geocodes = data.geocodes[0]
//   // 同步表
//   const saveData = {
//     SID: id,
//     RegionID: CityCode, // dacode
//     Keyword, // 查询地址
//     X: Number(geocodes.location.split(',')[0]),
//     Y: Number(geocodes.location.split(',')[1]),
//     Name: Keyword,
//     Address: geocodes.formatted_address, //
//     country: geocodes.country, // 国家
//     province: geocodes.province, // 省会
//     citycode: geocodes.citycode, // 城市编码
//     city: geocodes.city, // 城市
//     district: Array.isArray(geocodes.district) && geocodes.district.length > 0 ? (geocodes.district?.[0] || '') : geocodes.district, // 城区
//     adcode: geocodes.adcode, // adcode
//     street: Array.isArray(geocodes.street) && geocodes.street.length > 0 ? (geocodes.street?.[0] || '') : geocodes.street, // ？？
//     number: JSON.stringify(geocodes.number), // ？？
//     level: geocodes.level, // 地址类别
//     CreateTime: common.getDateStmap()
//   }
//   // 批量插入数据
//   const status = await AddressModel.bulkCreate([saveData])
//   return status
// }
// async function updateAddressStatus (id) {
//   console.log('解析完成，修改查询状态', id)
//   const result = await SearchParamModel.update({ State: 1 }, {
//     where: {
//       id: id
//     }
//   })
//   return result
// }
// async function addreessProcess (CityCode, Keyword, id) {
//   console.log('开始地址解析')
//   const firstData = await getAdressData(CityCode, Keyword)
//   if (firstData.status === '0') return // 返回结果 status为0  表示查询失败
//   await saveAddressData(CityCode, Keyword, id, firstData)
//   await updateAddressStatus(id)
// }
// -----------------------------------主程序-------------------------------------------
async function main () {
  // await PoiModel.sync({ force: true })
  // await AddressModel.sync({ force: true })

  // await PoiModel.sync({ alter: true })
  // await AddressModel.sync({ alter: true })
  // await SearchParamModel.sync({ alter: true })
  // 获取前10条 查询条件 和总数
  const result = await getSearchParams(0)
  // 条件数据集
  const waitingRows = result.rows
  console.log('查询条件总量为：', waitingRows.length)
  // 条件数据集数量
  const waitingRowsLen = waitingRows.length

  for (let i = 0; i < waitingRowsLen; i++) {
    const id = waitingRows[i].OID
    const cityCode = waitingRows[i].OAdcode
    const keyWord = waitingRows[i].Keyword?.replace(/`/g, '')
    const originalParams = {
      id,
      OX: waitingRows[i].OX, // 原始XY坐标
      OY: waitingRows[i].OY,
      OMergeId: waitingRows[i].OMergeId, // 融合来源
      OMergeStatus: waitingRows[i].OMergeStatus // 融合状态
    }
    console.log(`--------采集条件：${i} 开始 id:${id}--------`)

    const processState = await POIProcess(cityCode, keyWord, originalParams)
    if (!processState) {
      console.log('超出KEY最大调用量')
      break
    }
    console.log(`--------采集条件：${i} 结束--------`)
  }
}

// 添加定时任务  每天8点执行任务
const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, new schedule.Range(0, 6)] // 0 是周日从周日开始计算
rule.hour = 8
rule.minute = 30

schedule.scheduleJob(rule, function () {
  api.resetPoiKey()
  main()
})

main()
