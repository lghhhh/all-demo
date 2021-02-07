'use strict'
const path = require('path')
const shapefile = require('shapefile')
const { RoadNetworkModel } = require('./DAO/mongooseDAO.js')

// 存储待解析文件名 文件名为字符窜，需要用 ‘ 包裹
const fileNames = ['shenzhenshi_BaseRoadInfo']

function convert (filePath, fileInfoPath) {
  console.log('开始解析', filePath)
  let count = 0
  shapefile.open(filePath, fileInfoPath, { encoding: 'GB2312' })
    .then(source => source.read()
      .then(async function log (result) {
        if (result.done) {
        // file.end()
          console.log('convert ok!!!')
          return
        }
        if (result.value.properties.LinkName !== '无名路') {
          const data = {
            CityId: result.value.properties.CityID + '',
            BlockId: result.value.properties.BlockID + '',
            LinkName: result.value.properties.LinkName,
            Type: result.value.properties.Type + '',
            TypeNum: result.value.properties.TypeNum + '',
            Level: result.value.properties.Level + '',
            GeometryType: result.value.geometry.type,
            GeometryCoordinates: result.value.geometry.coordinates,
            CollectionStatus: '0'
          }
          const res = await RoadNetworkModel.insertMany([data])
          if (res[0].id) {
            console.log((count++) + ':' + res[0].id)
          }
        }
        return source.read().then(log)
      })
    )
    .catch(error => console.error(error.stack))
}

// 执行--解析所有的文件名入库
fileNames.forEach(name => {
  const filePath = path.resolve(__dirname, `./shapefiles/${name}.shp`)
  const fileInfoPath = path.resolve(__dirname, `./shapefiles/${name}.dbf`)
  convert(filePath, fileInfoPath)
})
