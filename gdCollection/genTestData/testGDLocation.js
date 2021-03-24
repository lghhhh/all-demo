const fs = require('fs')
const path = require('path')
const api = require('./util/api')
const searchParams2 = require('./searchParams2')
// console.log(searchParams2[461])
async function getAdressData (loaction) {
  console.log('根据条件 调用GDpoi 开始=======================')
  const result = await api.getLocationInfo(loaction)
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
  let csvContent = '\ufeffeid,name,address,longitude,latitude,gd_longitude,gd_latitude,keywords,formatted_address\n'

  for (let i = 0; i < count; i++) {
    console.log(`--------采集条件：${i} 开始--------`)

    const params = searchParams2[i]

    const data = await getAdressData(`${params.gd_longitude},${params.gd_latitude}`)
    // 生成插入数据
    const formatted_address = data?.regeocode?.formatted_address
    if (!formatted_address) continue

    const saveData = {
      ...params,
      formatted_address
    }

    csvContent += `${saveData.eid},${saveData.name},${saveData.address},${saveData.longitude},${saveData.latitude},${saveData.gd_longitude},${saveData.gd_latitude},${saveData.keywords},${saveData.formatted_address},\n`
  }
  console.log('数据，', resultData)
  // gencsv
  console.log('生成cvs文件ing。。。。。。。')
  const outputFileName = path.resolve(__dirname, './GDLocationinfo.csv')

  fs.writeFileSync(outputFileName, csvContent)
}

main()
