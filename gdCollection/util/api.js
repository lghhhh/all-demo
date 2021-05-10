'use strict'
// const { service } = require('./request')

const Axioslimit = require('./request')

const axios20 = new Axioslimit(20, 2000)
const axios100 = new Axioslimit(100, 6000)
// const axios100Loaction = new Axioslimit(20, 6000)

/**
 *请求高德api 接口
 * @param {*} citycode 城市码
 * @param {*} keyword 关键字，多个关键字用|隔开
 * @param {*} page 分页页面
 */
async function getPOI (citycode, keyword, page = 0) {
  const url = 'https://restapi.amap.com/v3/place/text'
  const params = {

    keywords: keyword,
    city: citycode,
    citylimit: true,
    extensions: 'all',
    offset: 20,
    page
  }
  const result = await axios20.get(url, { params })
  return result instanceof Error ? result : result.data
}

/**
 *请求高德api 接口
 * @param {*} citycode 城市码
 * @param {*} keyword 关键字，多个关键字用|隔开
 * @param {*} page 分页页面
 */
async function getAddressInfo (citycode, keyword) {
  const url = 'https://restapi.amap.com/v3/geocode/geo'
  const params = {
    address: keyword,
    city: citycode
  }
  const result = await axios100.get(url, { params })
  return result instanceof Error ? result : result.data
}
// /**
//  *逆地理编码
//  * @param {*} location 经纬度

//  */
// async function getLocationInfo (location) {
//   const url = 'https://restapi.amap.com/v3/geocode/regeo'
//   const params = {
//     location,
//     radius: 0
//   }
//   const result = await axios100Loaction.get(url, { params })
//   return result instanceof Error ? result : result.data
// }

function resetAddrKey () {
  axios100.resetKEYSate()
}
function resetPoiKey () {
  axios20.resetKEYSate()
}
module.exports = { getPOI, getAddressInfo, resetAddrKey, resetPoiKey }
