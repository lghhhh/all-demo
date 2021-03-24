const fs = require('fs')
const path = require('path')
const api = require('./util/api')
const searchParams2 = require('./searchParams2')
// console.log(searchParams2[461])
async function getPOIData (CityCode, Keyword, page) {
  console.log('根据条件 调用GDpoi 开始=======================')
  const result = await api.getPOI(CityCode, Keyword, page)
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
  let csvContent = '\ufeffeid,name,address,longitude,latitude,gd_longitude,gd_latitude,keywords,SID,Longitude,Latitude,Name,Address,Tel,TypeCode,TypeName,Biz_Type,SubType,Location,ParentID,PName,CityName,AdName,IsPicture,\n'

  for (let i = 0; i < count; i++) {
    console.log(`--------采集条件：${i} 开始--------`)

    const params = searchParams2[i]

    const data = await getPOIData(params.DistrictID, params.keywords)
    // 生成插入数据
    if (!data?.pois?.length) continue
    const pois = data.pois
    const setDataArrs = pois.map(ele => {
      return {
        ...params,
        SID: ele?.id ? (ele.id).toString() : '',
        Longitude: ele.location.length ? Number(ele.location.split(',')[0]) : '',
        Latitude: ele.location.length ? Number(ele.location.split(',')[1]) : '',
        Name: Array.isArray(ele.name) ? (ele.name?.[0] || '') : (ele.name).toString(),
        Address: Array.isArray(ele.address) ? (ele.address?.[0] || '') : (ele.address || '').toString(),
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
        IsPicture: Array.isArray(ele.photos) && ele.photos.length > 0 ? 1 : 0
      }
    })
    setDataArrs.forEach(item => {
      csvContent += `${item.eid},${item.name},${item.address},${item.longitude},${item.latitude},${item.gd_longitude},${item.gd_latitude},${item.keywords},${item.SID},${item.Longitude},${item.Latitude},${item.Name},${item.Address},${item.Tel},${item.TypeCode},${item.TypeName},${item.Biz_Type},${item.SubType},${item.Location},${item.ParentID},${item.PName},${item.CityName},${item.AdName},${item.IsPicture},\n`
    })
  }
  console.log('数据，', resultData)
  // gencsv
  console.log('生成cvs文件ing。。。。。。。')
  const outputFileName = path.resolve(__dirname, './GDaddrdata.csv')

  fs.writeFileSync(outputFileName, csvContent)
}

main()
