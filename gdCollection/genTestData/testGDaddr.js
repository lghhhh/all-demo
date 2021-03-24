const fs = require('fs')
const path = require('path')
const api = require('./util/api')
const searchParams2 = require('./searchParams2')
// console.log(searchParams2[461])
async function getAdressData (CityCode, Keyword, page) {
  console.log('根据条件 调用GDpoi 开始=======================')
  const result = await api.getAddressInfo(CityCode, Keyword, page)
    .catch(
      err => console.log(err)
    )
  // console.log(result)
  return result
}

// async function getSearchParams (offest = 0) {
//   // count：符合查询条件
//   const { count, rows } = await SearchParamModel
//     .findAndCountAll({
//       attributes: ['id', 'CityCode', 'Keyword', 'Type'],
//       where: {
//         State: 1,
//         type: '2'
//       },
//       offest,

//       limit: 3000
//     })
//   console.log({ count, rows })
//   return { count, rows }
// }
async function main () {
  // 条件数据集
  const count = searchParams2.length
  console.log('查询条件总量为：', count)
  // 条件数据集数量
  const resultData = []
  let csvContent = '\ufeffeid,name,address,longitude,latitude,gd_longitude,gd_latitude,keywords,X,Y,country,province,citycode,city,district,adcode,street,number,\n'

  for (let i = 0; i < count; i++) {
    console.log(`--------采集条件：${i} 开始--------`)

    const params = searchParams2[i]

    const data = await getAdressData(params.DistrictID, params.keywords)
    // 生成插入数据
    if (!data?.geocodes?.length) continue
    const geocodes = data?.geocodes?.[0]
    const saveData = {
      ...params,
      X: Number(geocodes.location.split(',')[0]),
      Y: Number(geocodes.location.split(',')[1]),
      Address: geocodes.formatted_address, //
      country: geocodes.country, // 国家
      province: geocodes.province, // 省会
      citycode: geocodes.citycode, // 城市编码
      city: geocodes.city, // 城市
      district: Array.isArray(geocodes.district) ? (geocodes.district?.[0] || '') : geocodes.district, // 城区
      adcode: geocodes.adcode, // adcode
      street: Array.isArray(geocodes.street) ? (geocodes.street?.[0] || '') : geocodes.street, //
      number: Array.isArray(geocodes.number) ? (geocodes.number?.[0] || '') : geocodes.number //
    }

    csvContent += `${saveData.eid},${saveData.name},${saveData.address},${saveData.longitude},${saveData.latitude},${saveData.gd_longitude},${saveData.gd_latitude},${saveData.keywords},${saveData.X},${saveData.Y},${saveData.country},${saveData.province},${saveData.citycode},${saveData.city},${saveData.district},${saveData.adcode},${saveData.street},${saveData.number},\n`
  }
  console.log('数据，', resultData)
  // gencsv
  console.log('生成cvs文件ing。。。。。。。')
  const outputFileName = path.resolve(__dirname, './GDaddrdata.csv')

  fs.writeFileSync(outputFileName, csvContent)
}

main()
