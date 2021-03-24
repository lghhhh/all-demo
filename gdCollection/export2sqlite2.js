'use strict'; // 使用babel需要添加他们的运行环境

require("core-js/stable");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs');

var path = require('path');

var pgdb = require('./DAO/pgDAO');

var setting = require('./config/setting');

var GDAddrDAO = require('./DAO/SQLiteDAO_GD_Addr'); // 高德地址解析


var GDPoiDAO = require('./DAO/SQLiteDAO_GD_Poi'); // 高德POI解析


var MTAddrDAO = require('./DAO/SQLiteDAO_MT_Addr'); // 美团地址解析
// const exportAdcode = '30113,30105,30117,30109,30104,30112,30115,30106,30120,30151,30116,30114,30118,30107,30101,30110' // 上海
// const exportAdcode = '320506,320571,320508,320509,320583,320505,320581,320507,320585,320582' //苏州
// const sql = `select "Id","Adcode","District","RoadName","DoorPlate","X","Y","MergeId","MergeStatus" FROM "DoorPlateMergeResult_China"  WHERE "MergeStatus" !~ '0+'${''} AND  "Adcode" in(${exportAdcode})`
// const sql = `select "Id","Adcode","District","RoadName","DoorPlate" FROM "DoorPlateMergeResult_China"  WHERE "MergeStatus" !~ '0+'${''} AND  "Adcode" in(320506,320571,320508,320509,320583,320505,320581,320507,320585,320582)`
// const sql = 'select "Id","Adcode","District","RoadName","DoorPlate" FROM "DoorPlateMergeResult_China"'


var templateFileReflect = {
  sqliteGDAddr: 'GD-Addr-template.web.sqlite',
  sqliteGDPoi: 'GD-POI-template.web.sqlite',
  sqliteMTAddr: 'MT-Addr-template.web.sqlite'
};
var DAOReflect = {
  sqliteGDAddr: GDAddrDAO,
  sqliteGDPoi: GDPoiDAO,
  sqliteMTAddr: MTAddrDAO
}; // 根据setting文件中的文件名生成sqlite文件

function genFile2sqlite() {
  return _genFile2sqlite.apply(this, arguments);
}

function _genFile2sqlite() {
  _genFile2sqlite = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var sqlitePathSRC, sqlitePathDest;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sqlitePathSRC = path.resolve(__dirname, './sqlites/Template', templateFileReflect[setting.exportFileType]);
            sqlitePathDest = path.resolve(__dirname, './sqlites', templateFileReflect[setting.exportFileType].replace('template', setting.exportCityName));
            _context.prev = 2;
            fs.accessSync(sqlitePathSRC);
            _context.next = 10;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](2);
            console.error('模板文件不存在');
            return _context.abrupt("return", 0);

          case 10:
            fs.copyFileSync(sqlitePathSRC, sqlitePathDest);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 6]]);
  }));
  return _genFile2sqlite.apply(this, arguments);
}

function getSQL(_x) {
  return _getSQL.apply(this, arguments);
}

function _getSQL() {
  _getSQL = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(cityName) {
    var _result$rows;

    var getadcodeSql, result, data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            getadcodeSql = "SELECT \"City\", array_to_string(array_agg(\"DistrictID\"),',') as Adcodes FROM \"AdRegionCode\" Where \"City\" like '%".concat(cityName, "%'GROUP BY \"City\"");
            _context2.next = 3;
            return pgdb.findAdcode(getadcodeSql);

          case 3:
            result = _context2.sent;
            data = result === null || result === void 0 ? void 0 : (_result$rows = result.rows) === null || _result$rows === void 0 ? void 0 : _result$rows[0].adcodes;
            console.log(data);
            return _context2.abrupt("return", "select \"Id\",\"Adcode\",\"District\",\"RoadName\",\"DoorPlate\",\"X\",\"Y\",\"MergeId\",\"MergeStatus\" FROM \"DoorPlateMergeResult_China\"  WHERE \"MergeStatus\" !~ '0+'".concat(" AND  \"Adcode\" in(", data, ")"));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getSQL.apply(this, arguments);
}

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _DAOReflect$setting$e, _result$rows2;

    var fileState, sql, DAOModel, result, datalen, count, insertArrs, i, _result$rows3, ele, address, data;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return genFile2sqlite();

          case 2:
            fileState = _context3.sent;

            if (!(fileState === 0)) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return");

          case 5:
            _context3.next = 7;
            return getSQL(setting.exportCityName);

          case 7:
            sql = _context3.sent;
            DAOModel = (_DAOReflect$setting$e = DAOReflect[setting.exportFileType]) === null || _DAOReflect$setting$e === void 0 ? void 0 : _DAOReflect$setting$e.SearchParamModel;
            _context3.next = 11;
            return DAOModel.sync({
              force: true
            });

          case 11:
            _context3.next = 13;
            return pgdb.find(sql);

          case 13:
            result = _context3.sent;
            console.log('合成数组');
            datalen = result === null || result === void 0 ? void 0 : (_result$rows2 = result.rows) === null || _result$rows2 === void 0 ? void 0 : _result$rows2.length;
            console.log("*************************\u6570\u636E\u603B\u91CF\u6570---".concat(datalen, "**************"));
            count = 200000;
            insertArrs = [];
            i = 0;

          case 20:
            if (!(i < datalen)) {
              _context3.next = 43;
              break;
            }

            ele = result === null || result === void 0 ? void 0 : (_result$rows3 = result.rows) === null || _result$rows3 === void 0 ? void 0 : _result$rows3[i];
            address = ele.District + ele.RoadName + ele.DoorPlate;
            data = {
              OID: Number(ele.Id),
              OAdcode: ele.Adcode,
              Keyword: address,
              OX: ele.X,
              // 原始XY坐标
              OY: ele.Y,
              OMergeId: JSON.stringify(ele.MergeId),
              // 融合来源
              OMergeStatus: ele.MergeStatus,
              // 融合状态
              State: 0
            };

            if (!(count > 0)) {
              _context3.next = 29;
              break;
            }

            insertArrs.push(data);
            count--;
            _context3.next = 36;
            break;

          case 29:
            if (!(count === 0)) {
              _context3.next = 36;
              break;
            }

            _context3.next = 32;
            return DAOModel.bulkCreate(insertArrs);

          case 32:
            insertArrs = []; // 重置写入内容

            insertArrs.push(data);
            count = 200000 - 1;
            console.log("----------------------\u5206\u6279\u5199\u5165\u5B8C\u6210\uFF0C\u603B\u6570".concat(datalen, "-\u5F53\u524D\u4F4D\u7F6E").concat(i, "--------------------"));

          case 36:
            if (!(i === datalen - 1)) {
              _context3.next = 40;
              break;
            }

            _context3.next = 39;
            return DAOModel.bulkCreate(insertArrs);

          case 39:
            console.log('写入结束');

          case 40:
            i++;
            _context3.next = 20;
            break;

          case 43:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _main.apply(this, arguments);
}

main(); // getSQL('南京市')