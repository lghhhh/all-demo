'use strict'
const { Sequelize, DataTypes } = require('sequelize')
// DeprecationWarning: A boolean value was passed to options.operatorsAliases. This is a no-op with v5 and should be removed.
// 所以布尔值分别用'1'或替换'0'为true和false。
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: './GD-POI-search.sqlite',
  operatorsAliases: '0'
})
// poi 模型
const PoiModel = sequelize.define('T_Web_GD_POI', {
  id: {
    primaryKey: '1',
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  },
  SID: DataTypes.TEXT,
  RegionID: DataTypes.BIGINT,
  Keyword: DataTypes.TEXT,
  X: DataTypes.DOUBLE,
  Y: DataTypes.DOUBLE,
  Name: DataTypes.TEXT,
  Address: DataTypes.TEXT,
  Tel: DataTypes.TEXT,
  CatalogID: DataTypes.TEXT,
  CatalogInfo: DataTypes.TEXT,
  ParentID: DataTypes.TEXT,
  CreateTime: DataTypes.DATE
}, { tableName: 'T_Web_GD_POI' })

// 地址解析结果模型
const AddressModel = sequelize.define('T_Web_GD_ADDRESS', {
  id: {
    primaryKey: '1',
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  },
  SID: DataTypes.TEXT,
  RegionID: DataTypes.BIGINT, // dacode
  Keyword: DataTypes.TEXT, // 查询地址
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
  CreateTime: DataTypes.DATE
}, { tableName: 'T_Web_GD_ADDRESS' })

const SearchParamModel = sequelize.define('T_Web_GD_ExcuteParam', {
  id: {
    primaryKey: '1',
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  },
  CityCode: DataTypes.TEXT,
  CityName: DataTypes.TEXT,
  Keyword: DataTypes.TEXT,
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
  CreateCollTime: DataTypes.DATE,
  CompleteCollTime: DataTypes.DATE,
  Type: DataTypes.TEXT,
  State: { type: DataTypes.INTEGER, unique: true }
}, {
  timestamps: '0',
  tableName: 'T_Web_GD_ExcuteParam'
})

module.exports = { PoiModel, SearchParamModel, AddressModel }
