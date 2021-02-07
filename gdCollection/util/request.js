'use strict'
const axios = require('axios')
const LimitPromise = require('./RateLimiter')
const KEYs = [
  'dc4877fbfe57d847e0fca3d0d0c9f89b',
  'efed9dff9628f9ef28df9eedf5193325',
  '44ba0936659fda58c70af38e6bbe48df',
  'f91b2ef0486ed8467808bebbe231152a',
  '29a105d364702823fdd40a1bb34fffbe',
  'f74d75533934f2fbf452fb1c6d386258',
  'b4d612496c1bb400281b6c1d7078bd25',
  '204bf1a36ce870e9a4749480409216d6'
]

class Axioslimit {
  constructor (max, count = 2000) {
    this._limiP = new LimitPromise(max) // 并发限制次数
    this._keyCount = count // 每个key最大请求次数
    this._keyTimes = count // key 剩余可请求次数
    this._currentKeyIndex = 0

    // 拦截请求添加key
    axios.interceptors.request.use((config) => {
      if (this._keyTimes--) { // key还有请求余额
        config.params.key = KEYs[this._currentKeyIndex]
      } else if (++this._currentKeyIndex < KEYs.length) { // 还有可用的key
        // 重置可用key次数
        this._keyTimes = this._keyCount
        config.params.key = KEYs[this._currentKeyIndex]
      } else {
        return new Error('接口无可以使用的key！！！！')
      }
      return config
    }, function (error) {
      return Promise.reject(error)
    })

    axios.interceptors.response.use((response) => {
      const state = response.data.status
      const stateInfo = response.data.info
      if (!state && stateInfo === '10003') { // 日常访问量超出限制
        if (++this._currentKeyIndex < KEYs.length) { // 还有可用的key
          // 重置可用key次数
          this._keyTimes = this._keyCount
        } else {
          return new Error('接口无可以使用的key！！！！')
        }
      }
      console.log(response)
      return response
    }, function (error) {
      return Promise.reject(error)
    })
  }

  // 包含retry的请求
  get (url, config) {
    return this._limiP.call(axios.get, url, config)
  }
}

module.exports = Axioslimit
