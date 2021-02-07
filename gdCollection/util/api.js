'use strict'
// const { service } = require('./request')

const Axioslimit = require('./request')

const axios20 = new Axioslimit(20, 2000)
const axios100 = new Axioslimit(100, 6000)

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
    offset: 20,
    page
  }
  const result = await axios20.get(url, { params })
  return result.data
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
  return result.data
}

module.exports = { getPOI, getAddressInfo }
