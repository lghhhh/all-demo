'use strict'
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const Config = require('../config/setting')
// DeprecationWarning: A boolean value was passed to options.operatorsAliases. This is a no-op with v5 and should be removed.
// 所以布尔值分别用'1'或替换'0'为true和false。
const filepath = path.resolve(__dirname, `../sqlites/${Config.sqliteGDAddr}`)
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
  // storage: `../sqlites/${Config.sqliteGDAddr}`,
  storage: filepath,
  operatorsAliases: '0'
})
// 地址解析结果模型
const AddressModel = sequelize.define('T_Web_Dat_GD_Address', {
  ID: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  OID: DataTypes.TEXT, // 原始ID
  OAdcode: DataTypes.INTEGER, // 原始城市编码
  Keyword: DataTypes.TEXT,
  OX: DataTypes.TEXT, // 原始XY坐标
  OY: DataTypes.TEXT,
  OMergeId: DataTypes.TEXT, // 融合来源
  OMergeStatus: DataTypes.TEXT, // 融合状态

  SID: DataTypes.TEXT,
  RegionID: DataTypes.BIGINT, // dacode
  X: DataTypes.DOUBLE,
  Y: DataTypes.DOUBLE,
  Name: DataTypes.TEXT, // 空着
  Address: DataTypes.TEXT, // 空着
  Tel: DataTypes.TEXT, // 空着
  CatalogID: DataTypes.TEXT, // 空着
  CatalogInfo: DataTypes.TEXT, // 空着
  ParentID: DataTypes.TEXT, // 空着
  country: DataTypes.TEXT, // 国家
  province: DataTypes.TEXT, // 省会
  citycode: DataTypes.TEXT, // 城市编码
  city: DataTypes.TEXT, // 城市
  district: DataTypes.TEXT, // 城区
  adcode: DataTypes.TEXT, // adcode
  street: DataTypes.TEXT, // ？？
  number: DataTypes.TEXT, // ？？
  level: DataTypes.TEXT, // 地址类别
  CreateTime: DataTypes.DATEONLY
}, {
  timestamps: false,
  tableName: 'T_Web_Dat_GD_Address'
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

// module.exports = { PoiModel, SearchParamModel, AddressModel }
module.exports = { SearchParamModel, AddressModel }
