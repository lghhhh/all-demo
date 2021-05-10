'use strict'
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const Config = require('../config/setting')
// DeprecationWarning: A boolean value was passed to options.operatorsAliases. This is a no-op with v5 and should be removed.
// 所以布尔值分别用'1'或替换'0'为true和false。
const filepath = path.resolve(__dirname, `../sqlites/${Config.sqliteGDPoi}`)
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // dialectOptions: {
  //   useUTC: false // for reading from database
  // },
  // timezone: '', // for writing to database
  storage: filepath,
  operatorsAliases: '0'
})
// poi 模型
const PoiModel = sequelize.define('T_Web_GD_POI', {
  ID: {
    primaryKey: '1',
    type: DataTypes.INTEGER
  },
  OID: DataTypes.TEXT, // 原始ID
  OAdcode: DataTypes.INTEGER, // 原始城市编码
  Keyword: DataTypes.TEXT,
  OX: DataTypes.TEXT, // 原始XY坐标
  OY: DataTypes.TEXT,
  OMergeId: DataTypes.TEXT, // 融合来源
  OMergeStatus: DataTypes.TEXT, // 融合状态
  SID: DataTypes.TEXT, // 高德poiID
  Adcode: DataTypes.INTEGER, // 高德的城市编码
  RegionID: DataTypes.BIGINT, // null
  Longitude: DataTypes.DOUBLE, // X
  Latitude: DataTypes.DOUBLE, // Y
  Name: DataTypes.TEXT, // 高德接口name
  Alias: DataTypes.TEXT, // null
  Address: DataTypes.TEXT, // 高德接口address
  Tel: DataTypes.TEXT, // 高德接口 tel
  TypeCode: DataTypes.TEXT, // 高德接口 typecode
  TypeName: DataTypes.TEXT, // 高德接口 type
  Biz_Type: DataTypes.TEXT, // 高德接口 biz_type
  SubType: DataTypes.TEXT, // 高德接口 childtype
  Location: DataTypes.TEXT, // 高德接口 location
  ParentID: DataTypes.TEXT, // 高德接口  parent
  PName: DataTypes.TEXT, // 高德接口  pname
  CityName: DataTypes.TEXT, // 高德接口  cityname
  AdName: DataTypes.TEXT, // 高德接口  adname
  IsPicture: DataTypes.INTEGER, // 有图片为1 没有为0
  CreateTime: DataTypes.DATEONLY
}, {
  timestamps: false,
  tableName: 'T_Web_GD_POI'
})

const SearchParamModel = sequelize.define('T_Web_GD_ExcuteParam', {
  ID: {
    primaryKey: '1',
    type: DataTypes.INTEGER
  },
  OID: DataTypes.TEXT, // 原始ID
  OAdcode: DataTypes.INTEGER, // 原始城市编码
  Keyword: DataTypes.TEXT,
  OX: DataTypes.TEXT, // 原始XY坐标
  OY: DataTypes.TEXT,
  OMergeId: DataTypes.TEXT, // 融合来源
  OMergeStatus: DataTypes.TEXT, // 融合状态
  CityName: DataTypes.TEXT,
  Level: DataTypes.TEXT,
  MinX: DataTypes.DOUBLE,
  MinY: DataTypes.DOUBLE,
  MaxX: DataTypes.DOUBLE,
  MaxY: DataTypes.DOUBLE,
  RequsetCount: DataTypes.BIGINT,
  NullRequsetCount: DataTypes.BIGINT,
  SpiltRequsetCount: DataTypes.BIGINT,
  NullSpiltRequsetCount: DataTypes.BIGINT,
  CollDataCount: DataTypes.BIGINT,
  RangeCount: DataTypes.BIGINT,
  CreateCollTime: DataTypes.DATEONLY,
  CompleteCollTime: DataTypes.DATEONLY,
  State: DataTypes.INTEGER
}, {
  timestamps: false,
  tableName: 'T_Web_GD_ExcuteParam'
})

module.exports = { PoiModel, SearchParamModel }
// module.exports = { SearchParamModel, AddressModel }
