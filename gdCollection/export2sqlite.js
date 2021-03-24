'use strict'
const pgdb = require('./DAO/pgDAO')
const { SearchParamModel } = require('./DAO/SQLiteDAO_GD_Addr') // 高德地址解析
// const { SearchParamModel } = require('./DAO/SQLiteDAO_GD_Poi') // 高德POI解析
// const { SearchParamModel } = require('./DAO/SQLiteDAO_MT_Addr') // 美团地址解析
const exportAdcode = '30113,30105,30117,30109,30104,30112,30115,30106,30120,30151,30116,30114,30118,30107,30101,30110' // 上海
// const exportAdcode = '320506,320571,320508,320509,320583,320505,320581,320507,320585,320582' //苏州
const sql = `select "Id","Adcode","District","RoadName","DoorPlate","X","Y","MergeId","MergeStatus" FROM "DoorPlateMergeResult_China"  WHERE "MergeStatus" !~ '0+'${''} AND  "Adcode" in(${exportAdcode})`
// const sql = `select "Id","Adcode","District","RoadName","DoorPlate" FROM "DoorPlateMergeResult_China"  WHERE "MergeStatus" !~ '0+'${''} AND  "Adcode" in(320506,320571,320508,320509,320583,320505,320581,320507,320585,320582)`
// const sql = 'select "Id","Adcode","District","RoadName","DoorPlate" FROM "DoorPlateMergeResult_China"'

async function main () {
  await SearchParamModel.sync({ force: true })
  const result = await pgdb.find(sql)
  // console.log(result.rows)
  console.log('合成数组')
  // const insertData = result.rows.map(ele => {
  //   const address = ele.District + ele.RoadName + ele.DoorPlate
  //   return {
  //     OID: Number(ele.Id),
  //     OAdcode: ele.Adcode,
  //     Keyword: address,
  //     OX: ele.X, // 原始XY坐标
  //     OY: ele.Y,
  //     OMergeId: JSON.stringify(ele.MergeId), // 融合来源
  //     OMergeStatus: ele.MergeStatus, // 融合状态
  //     State: 0
  //   }
  // })
  // console.log('开始写入')
  // const status = await SearchParamModel.bulkCreate(insertData)
  // =============================分批写入数据库
  const datalen = result?.rows?.length
  console.log(`*************************数据总量数---${datalen}**************`)
  let count = 200000
  let insertArrs = []

  for (let i = 0; i < datalen; i++) {
    const ele = result?.rows?.[i]
    const address = ele.District + ele.RoadName + ele.DoorPlate
    const data = {
      OID: Number(ele.Id),
      OAdcode: ele.Adcode,
      Keyword: address,
      OX: ele.X, // 原始XY坐标
      OY: ele.Y,
      OMergeId: JSON.stringify(ele.MergeId), // 融合来源
      OMergeStatus: ele.MergeStatus, // 融合状态
      State: 0
    }

    if (count > 0) {
      insertArrs.push(data)
      count--
    } else if (count === 0) {
      await SearchParamModel.bulkCreate(insertArrs)
      insertArrs = []// 重置写入内容
      insertArrs.push(data)
      count = 200000 - 1
      console.log(`----------------------分批写入完成，总数${datalen}-当前位置${i}--------------------`)
    }

    if (i === datalen - 1) {
      await SearchParamModel.bulkCreate(insertArrs)
      console.log('写入结束')
    }
  }
}

main()
