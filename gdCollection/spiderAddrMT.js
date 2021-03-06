'use strict'
// // 使用babel需要添加他们的运行环境
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'

const schedule = require('node-schedule')
const { SearchParamModel, AddressModel } = require('./DAO/SQLiteDAO_MT_Addr')
const api = require('./util/apiMT')
const common = require('./util/common')

// ==========================↓↓↓ 数据库操作--数据采集条件获取 ↓↓↓================================
async function getSearchParams (offest = 0) {
  // count：符合查询条件
  const { count, rows } = await SearchParamModel
    .findAndCountAll({
      attributes: ['OID', 'OAdcode', 'Keyword', 'OX', 'OY', 'OMergeId', 'OMergeStatus'],
      where: {
        State: 0
      },
      offest,
      // 一共1个key: 地址一次最多查询 300万 次
      limit: 400000
    })
  console.log({ count, rows })
  return { count, rows }
}
// ==========================↓↓↓ 地址数据数据采集入库 ↓↓↓===============================
// 解析地址
async function getAdressData (Keyword) {
  const result = await api.getMTAddressInfo(Keyword)
  return result
}

/**
 * 解析单条数据并入库
 * @param {Object} data 必须是一个对象数组
 * @returns
 */
async function saveAddressData (data) {
  // 批量插入数据
  const status = await AddressModel.bulkCreate(data)
  return status
}
// 解析单条数据并入库
async function getAddressInsertData (CityCode, Keyword, originalParams, data) {
  // console.log('id,', id, data)
  // if (!data.geocodes.length) return
  const geocodes = data?.result?.[0]
  if (!geocodes) return
  // 同步表
  const saveData = {
    OID: (originalParams.id).toString(),
    OAdcode: Number(CityCode),
    Keyword,
    OX: originalParams.OX, // 原始XY坐标
    OY: originalParams.OY,
    OMergeId: originalParams.OMergeId, // 融合来源
    OMergeStatus: originalParams.OMergeStatus, // 融合状态
    SID: (originalParams.id).toString(),
    // RegionID: CityCode, // dacode
    X: Number(geocodes.location.split(',')[0]),
    Y: Number(geocodes.location.split(',')[1]),
    Name: Keyword,
    Address: geocodes.formatted_address, //
    citycode: geocodes.citycode,
    city: geocodes?.entity?.city, // 城市
    district: geocodes?.entity?.district,
    road: geocodes?.entity?.road,
    township: geocodes?.entity?.township,
    street_num: geocodes?.entity?.street_num,
    level: geocodes.level,
    CreateTime: common.getDateStmap()
  }
  // 批量插入数据
  // const status = await AddressModel.bulkCreate([saveData])
  return saveData
}

// 批量更新 查询数据 状态
async function updateAddressStatusInBulk (ids) {
  console.log('解析完成，批量修改查询状态', ids)
  const result = await SearchParamModel.update({ State: 1 }, {
    where: {
      OID: ids
    }
  })
  return result
}

//  处理单条数据 返回包含数据的一个对象
async function InsertDataProcess (CityCode, Keyword, originalParams) {
  const firstData = await getAdressData(Keyword)
  // if (firstData.status === '0') return // 返回结果 status为0  表示查询失败
  const result = await getAddressInsertData(CityCode, Keyword, originalParams, firstData)
  return result
}
// -----------------------------------主程序-------------------------------------------
async function main () {
  // 第一次初始化才调用
  // await AddressModel.sync({ force: true }) // 删除表后重建
  // await AddressModel.sync({ alter: true }) //修改 同步字段
  // 获取前10条 查询条件 和总数
  const result = await getSearchParams(0)
  // 条件总数
  // 条件数据集
  const waitingRows = result.rows

  const waitingRowsLen = waitingRows.length
  if (waitingRowsLen === 0) {
    console.log('!!!!!地址解析已完成，无待解析数据!!!!!')
    return
  }
  console.log('查询条件总量为：', waitingRowsLen)
  // 条件数据集数量
  let insertDatas = []
  let batchId = []
  for (let i = 0; i < waitingRowsLen; i++) {
    const id = waitingRows[i].OID
    const cityCode = waitingRows[i].OAdcode
    const keyWord = waitingRows[i].Keyword
    const originalParams = {
      id,
      OX: waitingRows[i].OX, // 原始XY坐标
      OY: waitingRows[i].OY,
      OMergeId: waitingRows[i].OMergeId, // 融合来源
      OMergeStatus: waitingRows[i].OMergeStatus // 融合状态
    }
    console.log(`--------采集条件总量：${waitingRowsLen},当前：${i}  id:${id}--------`)
    // await addressProcess(cityCode, keyWord, originalParams)

    const data = await InsertDataProcess(cityCode, keyWord, originalParams)
    insertDatas.push(data)
    batchId.push(id)
    if (!((i + 1) % 1000) || i === waitingRowsLen - 1) {
      console.log(`数据批量入库，当前index${i}`)
      await saveAddressData(insertDatas)
      await updateAddressStatusInBulk(batchId)
      insertDatas = []
      batchId = []
    }
    // console.log(`--------采集条件：${i} 结束--------`)
  }
  console.log('结束时间', Date.now())
}

// 添加定时任务  每天8点执行任务
const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, new schedule.Range(0, 6)] // 0 是周日从周日开始计算
rule.hour = 8
rule.minute = 30

const job = schedule.scheduleJob(rule, function () {
  main()
})

main()

// job.cancel（） 取消定时任务
