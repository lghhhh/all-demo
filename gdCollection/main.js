'use strict'
const { PoiModel, SearchParamModel, AddressModel } = require('./DAO/SQLiteDAO')
const api = require('./util/api')
const common = require('./util/common')

// ==========================↓↓↓ 数据库操作--数据采集条件获取 ↓↓↓================================
async function getSearchParams (offest = 0) {
  // count：符合查询条件
  const { count, rows } = await SearchParamModel
    .findAndCountAll({
      attributes: ['id', 'CityCode', 'Keyword', 'Type'],
      where: {
        State: 0,
        type: '2'
      },
      offest,
      limit: 40000
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
  console.log(result)
  return result
}
// 批量存入poi数据进数据库
async function savePOIData (CityCode, Keyword, data) {
  const pois = data.pois
  // 同步表

  const setDataArrs = pois.map(ele => {
    return {
      SID: ele.id,
      RegionID: Number(CityCode),
      Keyword,
      X: Number(ele.location.split(',')[0]),
      Y: Number(ele.location.split(',')[1]),
      Name: ele.name,
      Tel: (ele.tel).toString(),
      CatalogID: ele.typecode,
      CatalogInfo: ele.type,
      CreateTime: common.getTimeStmap()
    }
  })
  // 批量插入数据
  const status = await PoiModel.bulkCreate(setDataArrs)
  return status
}

async function updatePoiStatus (id) {
  const result = await SearchParamModel.update({ State: 1 }, {
    where: {
      id
    }
  })
  return result
}
// 处理一个组合条件下的全部poi
async function POIProcess (CityCode, Keyword, id) {
  console.log('poi采集开始')
  const firstData = await getPOIData(CityCode, Keyword)
  savePOIData(CityCode, Keyword, firstData)

  // 当前条件下，查询到的poi总数
  const poiCount = firstData.count
  const pageCount = Number(poiCount / 20).toFixed()

  let currentPage = 1 // 第一次获取默认0
  // if (currentPage > pageCount) continue
  while (currentPage <= pageCount) {
    const poiData = await getPOIData(CityCode, CityCode, currentPage)
    // 存储第一次的数据
    savePOIData(CityCode, CityCode, poiData)
    currentPage++
  }
  await updatePoiStatus(id)
  console.log('poi采集结束')
}
// ==========================↓↓↓ 地址数据数据采集入库 ↓↓↓===============================
// 解析地址
async function getAdressData (CityCode, Keyword) {
  const result = await api.getAddressInfo(CityCode, Keyword)
    .catch(
      err => console.log(err)
    )
  console.log(result)
  return result
}
// 批量存入poi数据进数据库
async function saveAddressData (CityCode, Keyword, id, data) {
  // console.log('id,', id, data)
  const geocodes = data.geocodes[0]
  // 同步表
  const saveData = {
    SID: id,
    RegionID: CityCode, // dacode
    Keyword, // 查询地址
    X: Number(geocodes.location.split(',')[0]),
    Y: Number(geocodes.location.split(',')[1]),

    Address: geocodes.formatted_address, // 空着

    country: geocodes.country, // 国家
    province: geocodes.province, // 省会
    citycode: geocodes.citycode, // 城市编码
    city: geocodes.city, // 城市
    district: geocodes.district, // 城区
    adcode: geocodes.adcode, // adcode
    street: JSON.stringify(geocodes.street), // ？？
    number: JSON.stringify(geocodes.number), // ？？
    level: geocodes.level, // 地址类别
    CreateTime: common.getTimeStmap()
  }
  // 批量插入数据
  const status = await AddressModel.bulkCreate([saveData])
  return status
}
async function updateAddressStatus (id) {
  console.log('解析完成，修改查询状态', id)
  const result = await SearchParamModel.update({ State: 1 }, {
    where: {
      id: id
    }
  })
  return result
}
async function addreessProcess (CityCode, Keyword, id) {
  console.log('开始地址解析')
  const firstData = await getAdressData(CityCode, Keyword)
  await saveAddressData(CityCode, Keyword, id, firstData)
  await updateAddressStatus(id)
  console.log('地址解析结束')
}
// -----------------------------------主程序-------------------------------------------
async function main () {
  // await PoiModel.sync({ force: true })
  // await AddressModel.sync({ force: true })

  // await PoiModel.sync({ alter: true })
  // await AddressModel.sync({ alter: true })
  // await SearchParamModel.sync({ alter: true })
  // 获取前10条 查询条件 和总数
  const result = await getSearchParams(0)
  // 条件总数
  const waitingCount = result.count
  // 条件数据集
  const waitingRows = result.rows
  console.log('查询条件总量为：', waitingCount)
  // 条件数据集数量
  const waitingRowsLen = waitingRows.length

  for (let i = 0; i < waitingRowsLen; i++) {
    console.log(`--------采集条件：${i} 开始--------`)

    const id = waitingRows[i].id
    const cityCode = waitingRows[i].CityCode
    const keyWord = waitingRows[i].Keyword
    const type = waitingRows[i].Type

    if (type === '1') {
      POIProcess(cityCode, keyWord, id)
    } else if (type === '2') {
      addreessProcess(cityCode, keyWord, id)
    }

    console.log(`--------采集条件：${i} 结束--------`)
  }
}

main()
