'use strict'
// const { service } = require('./request')

const Axioslimit = require('./requestMT')

const axios500 = new Axioslimit(1000, 3000000)

/**
 *请求美团api 接口
 * @param {*} keyword 关键字，多个关键字用|隔开
 */
async function getMTAddressInfo (keyword) {
  const url = 'https://maf.meituan.com/geo'
  const params = {
    address: keyword
  }
  const result = await axios500.get(url, { params })
  return result instanceof Error ? result : result.data
}
module.exports = { getMTAddressInfo }
