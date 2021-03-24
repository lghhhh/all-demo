'use strict'
const { mysqlExec } = require('./DAO/mysqlDAO')
const { AddressModel } = require('./DAO/SQLiteDAO')
const QUERYLIMIT = 1000
async function getAddress (offest = 0) {
  // count：符合查询条件
  const { count, rows } = await AddressModel
    .findAndCountAll({
    //   attributes: ['id', 'CityCode', 'Keyword', 'Type'],
    //   where: {
    //     State: ,
    //     type: '2'
    //   },
      offset: offest
      // limit: QUERYLIMIT
    })
  console.log({ count, rows })
  return { count, rows }
}
async function savedata (data) {
  if (!data.rows.length) return
  let values = ''
  data.rows.forEach(ele => {
    values += `(${ele.SID}','${ele.RegionID}','${ele.Keyword}','${ele.X}','${ele.Y}','${ele.Address}','${ele.country}','${ele.province}','${ele.citycode}','${ele.city}','${ele.district}','${ele.adcode}','${ele.street}','${ele.number}','${ele.level}','${ele.CreateTime}'),`
  })
  values = values.substring(0, values.length - 1)
  values.replace(/"/g, '')
  //   values.replace(/\(中国标准时间\)/g, '')/
  const sql = `INSERT INTO T_Web_Dat_GD_Address (SID,RegionID,Keyword,OX,OY,Address,country,province,citycode,city,district,adcode,street,number,level,CreateTime) VALUES ${values}`
  //   console.log(sql)
  const insertStatus = await mysqlExec(sql)
  console.log(insertStatus)
  return insertStatus
}

async function main () {
  const data = await getAddress()
  const count = data.count
  let offsetIdx = 0
  const pageCount = Number(count / QUERYLIMIT)
  while (offsetIdx <= pageCount) {
    console.log(`第${offsetIdx}批数据`)
    const data1000 = await getAddress(offsetIdx * QUERYLIMIT)
    // 存储第一次的数据
    const status = await savedata(data1000)
    console.log('插入状态', status)
    offsetIdx++
  }
}
main()
