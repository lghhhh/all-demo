'use strict'
const mongoose = require('mongoose')
// mongoose的Promise是mongoosse自己的 用ES6的进行替换
mongoose.Promise = global.Promise

// mongoose.connect('mongodb://admin:admin123@localhost:27017/StreetImgdb')
mongoose.connect('mongodb://admin:careland@192.168.87.250:27017/StreetImgdb')
// mongoose.connect('mongodb://admin:careland@192.168.87.250:27017/StreetImgdb', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', e => { console.error('connection error:', e) })
db.once('open', () => { console.log('connection succeeded.数据库连接成功！！') })

// 路网基本信息
const RoadNetwork = new mongoose.Schema(
  {
    CityId: { type: String, required: true },
    BlockId: { type: String, required: true },
    LinkName: { type: String, required: true },
    Type: { type: String, required: true },
    TypeNum: { type: String, required: true },
    Level: { type: String, required: true },
    GeometryType: { type: String, required: true },
    GeometryCoordinates: { type: Array, required: true },
    CollectionStatus: { type: String, required: true } // -2:无符合要求街景 -1:无街景 0：未采集  1：采集成功 2：采集未完整
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
  }
)
const RoadNetworkModel = mongoose.model('RoadNetwork', RoadNetwork, 'RoadNetwork')

// 符合规则街景model
const StreetImgInfo = new mongoose.Schema(
  {
    RoadId: { type: String, required: true }, // RoadNetwork collection中对应的id
    Sid: { type: String, required: true },
    Time: { type: String, required: true },
    X: { type: String, required: true }, // 国策局经纬度
    Y: { type: String, required: true },
    CityId: { type: String, required: true },
    BlockId: { type: String, required: true }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
  }
)
const StreetImgInfoModel = mongoose.model('StreetImgInfo', StreetImgInfo, 'StreetImgInfo')

module.exports = { RoadNetworkModel, StreetImgInfoModel }
