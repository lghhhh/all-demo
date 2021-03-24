'use strict'; // 使用babel需要添加他们的运行环境

require("core-js/stable");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var schedule = require('node-schedule');

var _require = require('./DAO/SQLiteDAO_MT_Addr'),
    SearchParamModel = _require.SearchParamModel,
    AddressModel = _require.AddressModel;

var api = require('./util/apiMT');

var common = require('./util/common'); // ==========================↓↓↓ 数据库操作--数据采集条件获取 ↓↓↓================================


function getSearchParams() {
  return _getSearchParams.apply(this, arguments);
} // ==========================↓↓↓ 地址数据数据采集入库 ↓↓↓===============================
// 解析地址


function _getSearchParams() {
  _getSearchParams = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var offest,
        _yield$SearchParamMod,
        count,
        rows,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            offest = _args.length > 0 && _args[0] !== undefined ? _args[0] : 0;
            _context.next = 3;
            return SearchParamModel.findAndCountAll({
              attributes: ['OID', 'OAdcode', 'Keyword', 'OX', 'OY', 'OMergeId', 'OMergeStatus'],
              where: {
                State: 0
              },
              offest: offest,
              // 一共1个key: 地址一次最多查询 300万 次
              limit: 0
            });

          case 3:
            _yield$SearchParamMod = _context.sent;
            count = _yield$SearchParamMod.count;
            rows = _yield$SearchParamMod.rows;
            console.log({
              count: count,
              rows: rows
            });
            return _context.abrupt("return", {
              count: count,
              rows: rows
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getSearchParams.apply(this, arguments);
}

function getAdressData(_x) {
  return _getAdressData.apply(this, arguments);
}
/**
 * 解析单条数据并入库
 * @param {Object} data 必须是一个对象数组
 * @returns
 */


function _getAdressData() {
  _getAdressData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(Keyword) {
    var result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return api.getMTAddressInfo(Keyword);

          case 2:
            result = _context2.sent;
            return _context2.abrupt("return", result);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getAdressData.apply(this, arguments);
}

function saveAddressData(_x2) {
  return _saveAddressData.apply(this, arguments);
} // 解析单条数据并入库


function _saveAddressData() {
  _saveAddressData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
    var status;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return AddressModel.bulkCreate(data);

          case 2:
            status = _context3.sent;
            return _context3.abrupt("return", status);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _saveAddressData.apply(this, arguments);
}

function getAddressInsertData(_x3, _x4, _x5, _x6) {
  return _getAddressInsertData.apply(this, arguments);
} // 更新单条 查询数据 状态


function _getAddressInsertData() {
  _getAddressInsertData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(CityCode, Keyword, originalParams, data) {
    var _data$result, _geocodes$entity, _geocodes$entity2, _geocodes$entity3, _geocodes$entity4, _geocodes$entity5;

    var geocodes, saveData;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // console.log('id,', id, data)
            // if (!data.geocodes.length) return
            geocodes = data === null || data === void 0 ? void 0 : (_data$result = data.result) === null || _data$result === void 0 ? void 0 : _data$result[0];

            if (geocodes) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return");

          case 3:
            // 同步表
            saveData = {
              OID: originalParams.id.toString(),
              OAdcode: Number(CityCode),
              Keyword: Keyword,
              OX: originalParams.OX,
              // 原始XY坐标
              OY: originalParams.OY,
              OMergeId: originalParams.OMergeId,
              // 融合来源
              OMergeStatus: originalParams.OMergeStatus,
              // 融合状态
              SID: originalParams.id.toString(),
              // RegionID: CityCode, // dacode
              X: Number(geocodes.location.split(',')[0]),
              Y: Number(geocodes.location.split(',')[1]),
              Name: Keyword,
              Address: geocodes.formatted_address,
              //
              citycode: geocodes.citycode,
              city: geocodes === null || geocodes === void 0 ? void 0 : (_geocodes$entity = geocodes.entity) === null || _geocodes$entity === void 0 ? void 0 : _geocodes$entity.city,
              // 城市
              district: geocodes === null || geocodes === void 0 ? void 0 : (_geocodes$entity2 = geocodes.entity) === null || _geocodes$entity2 === void 0 ? void 0 : _geocodes$entity2.district,
              road: geocodes === null || geocodes === void 0 ? void 0 : (_geocodes$entity3 = geocodes.entity) === null || _geocodes$entity3 === void 0 ? void 0 : _geocodes$entity3.road,
              township: geocodes === null || geocodes === void 0 ? void 0 : (_geocodes$entity4 = geocodes.entity) === null || _geocodes$entity4 === void 0 ? void 0 : _geocodes$entity4.township,
              street_num: geocodes === null || geocodes === void 0 ? void 0 : (_geocodes$entity5 = geocodes.entity) === null || _geocodes$entity5 === void 0 ? void 0 : _geocodes$entity5.street_num,
              level: geocodes.level,
              CreateTime: common.getDateStmap()
            }; // 批量插入数据
            // const status = await AddressModel.bulkCreate([saveData])

            return _context4.abrupt("return", saveData);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getAddressInsertData.apply(this, arguments);
}

function updateAddressStatus(_x7) {
  return _updateAddressStatus.apply(this, arguments);
} // 批量更新 查询数据 状态


function _updateAddressStatus() {
  _updateAddressStatus = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(id) {
    var result;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log('解析完成，修改查询状态', id);
            _context5.next = 3;
            return SearchParamModel.update({
              State: 1
            }, {
              where: {
                OID: id
              }
            });

          case 3:
            result = _context5.sent;
            return _context5.abrupt("return", result);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _updateAddressStatus.apply(this, arguments);
}

function updateAddressStatusInBulk(_x8) {
  return _updateAddressStatusInBulk.apply(this, arguments);
} // 处理单条数据并入库


function _updateAddressStatusInBulk() {
  _updateAddressStatusInBulk = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(ids) {
    var result;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log('解析完成，批量修改查询状态', ids);
            _context6.next = 3;
            return SearchParamModel.update({
              State: 1
            }, {
              where: {
                OID: ids
              }
            });

          case 3:
            result = _context6.sent;
            return _context6.abrupt("return", result);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _updateAddressStatusInBulk.apply(this, arguments);
}

function addressProcess(_x9, _x10, _x11) {
  return _addressProcess.apply(this, arguments);
} //  处理单条数据 返回包含数据的一个对象


function _addressProcess() {
  _addressProcess = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(CityCode, Keyword, originalParams) {
    var firstData, data;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log('开始地址解析');
            _context7.next = 3;
            return getAdressData(Keyword);

          case 3:
            firstData = _context7.sent;
            _context7.next = 6;
            return getAddressInsertData(CityCode, Keyword, originalParams, firstData);

          case 6:
            data = _context7.sent;
            _context7.next = 9;
            return saveAddressData([data]);

          case 9:
            _context7.next = 11;
            return updateAddressStatus(originalParams.id);

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _addressProcess.apply(this, arguments);
}

function InsertDataProcess(_x12, _x13, _x14) {
  return _InsertDataProcess.apply(this, arguments);
} // -----------------------------------主程序-------------------------------------------


function _InsertDataProcess() {
  _InsertDataProcess = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(CityCode, Keyword, originalParams) {
    var firstData, result;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return getAdressData(Keyword);

          case 2:
            firstData = _context8.sent;
            _context8.next = 5;
            return getAddressInsertData(CityCode, Keyword, originalParams, firstData);

          case 5:
            result = _context8.sent;
            return _context8.abrupt("return", result);

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _InsertDataProcess.apply(this, arguments);
}

function main() {
  return _main.apply(this, arguments);
} // 添加定时任务  每天8点执行任务


function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var result, waitingRows, waitingRowsLen, insertDatas, batchId, i, id, cityCode, keyWord, originalParams, data;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return getSearchParams(0);

          case 2:
            result = _context9.sent;
            // 条件总数
            // 条件数据集
            waitingRows = result.rows;
            waitingRowsLen = waitingRows.length;

            if (!(waitingRowsLen === 0)) {
              _context9.next = 8;
              break;
            }

            console.log('!!!!!地址解析已完成，无待解析数据!!!!!');
            return _context9.abrupt("return");

          case 8:
            console.log('查询条件总量为：', waitingRowsLen); // 条件数据集数量

            insertDatas = [];
            batchId = [];
            i = 0;

          case 12:
            if (!(i < waitingRowsLen)) {
              _context9.next = 37;
              break;
            }

            id = waitingRows[i].OID;
            cityCode = waitingRows[i].OAdcode;
            keyWord = waitingRows[i].Keyword;
            originalParams = {
              id: id,
              OX: waitingRows[i].OX,
              // 原始XY坐标
              OY: waitingRows[i].OY,
              OMergeId: waitingRows[i].OMergeId,
              // 融合来源
              OMergeStatus: waitingRows[i].OMergeStatus // 融合状态

            };
            console.log("--------\u91C7\u96C6\u6761\u4EF6\u603B\u91CF\uFF1A".concat(waitingRowsLen, ",\u5F53\u524D\uFF1A").concat(i, "  id:").concat(id, "--------")); // await addressProcess(cityCode, keyWord, originalParams)

            _context9.next = 20;
            return InsertDataProcess(cityCode, keyWord, originalParams);

          case 20:
            data = _context9.sent;

            if (!(!((i + 1) % 1000) || i === waitingRowsLen - 1)) {
              _context9.next = 32;
              break;
            }

            insertDatas.push(data);
            batchId.push(id);
            console.log("\u6570\u636E\u6279\u91CF\u5165\u5E93\uFF0C\u5F53\u524Dindex".concat(i));
            _context9.next = 27;
            return saveAddressData(insertDatas);

          case 27:
            _context9.next = 29;
            return updateAddressStatusInBulk(batchId);

          case 29:
            insertDatas = [];
            batchId = [];
            return _context9.abrupt("continue", 34);

          case 32:
            insertDatas.push(data);
            batchId.push(id); // console.log(`--------采集条件：${i} 结束--------`)

          case 34:
            i++;
            _context9.next = 12;
            break;

          case 37:
            console.log('结束时间', Date.now());

          case 38:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _main.apply(this, arguments);
}

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)]; // 0 是周日从周日开始计算

rule.hour = 8;
rule.minute = 30;
var job = schedule.scheduleJob(rule, function () {
  main();
});
main(); // job.cancel（） 取消定时任务