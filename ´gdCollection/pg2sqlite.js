'use strict'
const pgdb = require('./DAO/pgDAO')
const { SearchParamModel } = require('./DAO/SQLiteDAO')
const sql = `select "Id","Adcode","District","RoadName","DoorPlate" FROM "DoorPlateMergeResult_China"  WHERE "MergeStatus" ~ '^5+$'${''} `
// const sql = 'select "Id","Adcode","District","RoadName","DoorPlate" FROM "DoorPlateMergeResult_China"'

async function main () {
  await SearchParamModel.sync({ force: true })
  const result = await pgdb.find(sql)
  console.log(result.rows)
  const insertData = result.rows.map(ele => {
    const address = ele.District + ele.RoadName + ele.DoorPlate
    return {
      id: ele.Id,
      CityCode: ele.Adcode,
      Keyword: address,
      State: 0,
      Type: '2'
    }
  })
  const status = await SearchParamModel.bulkCreate(insertData)
  console.log('结束', status)
}

main()
