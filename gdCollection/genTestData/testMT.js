const fs = require('fs')
const path = require('path')
const Axioslimit = require('./util/requestMT')
const axios20 = new Axioslimit(100)
const searchParams = require('./searchParams')

async function getAddress (address) {
  const result = await axios20.get('https://maf.meituan.com/geo', {
    params: {
      address
    }
  }).catch(e => console.log(e))

  const data = {
    X: Number(result.data.result[0].location.split(',')[0]),
    Y: Number(result.data.result[0].location.split(',')[1]),
    formatted_address: result.data.result[0].formatted_address,
    citycode: result.data.result[0].citycode,
    level: result.data.result[0].level,
    city: result.data.result[0].entity.city,
    road: result.data.result[0].entity.road,
    district: result.data.result[0].entity.district,
    township: result.data.result[0].entity.township,
    street_num: result.data.result[0].entity.street_num
  }
  return data
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
  const count = searchParams.length
  console.log('查询条件总量为：', count)
  // 条件数据集数量
  const resultData = []
  for (let i = 0; i < count; i++) {
    console.log(`--------采集条件：${i} 开始--------`)

    const params = searchParams[i]

    const data = await getAddress(params.keywords)
    // 添加原始数据
    resultData.push({ ...params, ...data })

    console.log(`--------采集条件：${i} 结束--------`)
  }
  console.log('数据，', resultData)
  // gencsv
  console.log('生成cvs文件ing。。。。。。。')
  const outputFileName = path.resolve(__dirname, './mtdata.csv')
  let csvContent = '\ufeffeid,name,address,longitude,latitude,gd_longitude,gd_latitude,keywords,X,Y,formatted_address,citycode,level,city,road,district,township,street_num,\n'
  resultData.forEach(item => {
    csvContent += `${item.eid},${item.name},${item.address},${item.longitude},${item.latitude},${item.gd_longitude},${item.gd_latitude},${item.keywords},${item.X},${item.Y},${item.formatted_address},${item.citycode},${item.level},${item.city},${item.road},${item.district},${item.township},${item.street_num},\n`
  })
  fs.writeFileSync(outputFileName, csvContent)
}

main()
