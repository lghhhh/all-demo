const fs = require('fs')
const path = require('path')
const shapefile = require("shapefile");
const { RoadNetworkModel } = require('./DAO/mongooseDAO.js')
const filePath = path.resolve(__dirname, './shapefiles/shenzhenshi_BaseRoadInfo.shp')
const fileInfoPath = path.resolve(__dirname, './shapefiles/shenzhenshi_BaseRoadInfo.dbf')
// let featureArr = []
// let dataJSON = ''
// const file = fs.createWriteStream('广州.txt');

async function convert2mongo(path) {

}
let count = 0

shapefile.open(filePath, fileInfoPath, { encoding: 'GB2312' })
    .then(source => source.read()
        .then(async function log(result) {
            if (result.done) {
                // file.end()
                console.log('convert ok!!!')
                return;
            }
            if (result.value.properties.LinkName != '无名路') {
                const data = {
                    "CityId": result.value.properties.CityID + '',
                    "LinkName": result.value.properties.LinkName,
                    "Type": result.value.properties.Type,
                    "Level": result.value.properties.Level + '',
                    "GeometryType": result.value.geometry.type,
                    "GeometryCoordinates": result.value.geometry.coordinates,
                    "CollectionStatus": '0'
                }
                let res = await RoadNetworkModel.insertMany([data])
                if (res[0].id) {
                    console.log((count++) + ':' + res[0].id)
                }
                // RoadNetworkModel.save(data, (err, data) => {
                //     count++;
                //     console.log(count + '', data);
                // })
                // file.write(JSON.stringify(result.value))
                // file.write(',')

            }
            return source.read().then(log);
        })
    )
    .catch(error => console.error(error.stack));

