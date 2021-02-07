'use strict'
const { Sequelize, DataTypes } = require('sequelize')
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
  operatorsAliases: false
})
// poi 模型
const PoiModel = sequelize.define('T_Web_GD_POI', {
  // ID: {
  //   type: DataTypes.UUID,
  //   defaultValue: Sequelize.UUIDV4 // 或 Sequelize.UUIDV1
  // },
  SID: DataTypes.TEXT,
  RegionID: DataTypes.BIGINT,
  Keyword: DataTypes.TEXT,
  StreetID: DataTypes.TEXT,
  PrimaryUID: DataTypes.TEXT,
  X: DataTypes.DOUBLE,
  Y: DataTypes.DOUBLE,
  NaviX: DataTypes.DOUBLE,
  NaviY: DataTypes.DOUBLE,
  Name: DataTypes.TEXT,
  Alias: DataTypes.TEXT,
  Address: DataTypes.TEXT,
  Tel: DataTypes.TEXT,
  CatalogID: DataTypes.TEXT,
  CatalogInfo: DataTypes.TEXT,
  NewCatalogID: DataTypes.TEXT,
  BrandID: DataTypes.TEXT,
  BrandName: DataTypes.TEXT,
  Tag: DataTypes.TEXT,
  StdTag: DataTypes.TEXT,
  ParentID: DataTypes.TEXT,
  HasChildren: DataTypes.INTEGER,
  ChildCatalog: DataTypes.TEXT,
  TabCatalog: DataTypes.TEXT,
  ImageState: DataTypes.TEXT,
  CreateTime: DataTypes.DATE
}, { tableName: 'T_Web_GD_POI' })

// 地址解析结果模型
const AddressModel = sequelize.define('T_Web_GD_ADDRESS', {

}, { tableName: 'T_Web_GD_ADDRESS' })

const SearchParamModel = sequelize.define('T_Web_GD_ExcuteParam', {
  ID: {
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
  State: DataTypes.INTEGER
}, { tableName: 'T_Web_GD_ExcuteParam' })

module.exports = { PoiModel, SearchParamModel, AddressModel }
