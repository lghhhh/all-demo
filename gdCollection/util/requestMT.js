'use strict'
const axios = require('axios')
const LimitPromise = require('./RateLimiter')
const KEYs = [
  'e70f9052-d94d-44da-8aa1-567b6d08b3d8'
]

class Axioslimit {
  constructor (max, count = 6000) {
    this._limiP = new LimitPromise(max) // 并发限制次数
    this._keyCount = count // 每个key最大请求次数
    this._keyTimes = count // key 剩余可请求次数
    this._currentKeyIndex = 0

    this.instance = axios.create()
    // 拦截请求添加key
    this.instance.interceptors.request.use((config) => {
      if (this._keyTimes--) { // key还有请求余额
        console.log(`当前key-${this._currentKeyIndex}剩余量： ${this._keyTimes}`)
        config.params.key = KEYs[this._currentKeyIndex]
      } else if (++this._currentKeyIndex < KEYs.length) { // 还有可用的key
        console.log('更换key')
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

    this.instance.interceptors.response.use((response) => {
      const state = response.data.status
      //     const stateInfo = response.data.info
      if (state === '0') { // 日常访问量超出限制
        console.log('------------------------------------------------------------------------------------当前key方向已超出限制量------------------------------------------------------------------------------------')
        console.log('------------------------------------------------------------------------------------请求失败------------------------------------------------------------------------------------')
        if (++this._currentKeyIndex < KEYs.length) { // 还有可用的key
          // 重置可用key次数
          this._keyTimes = this._keyCount
        } else {
          console.log('接口无可以使用的key！！！！')
          return new Error('接口无可以使用的key！！！！')
        }
      }
      return response
    }, function (error) {
      return Promise.reject(error)
    })
  }

  // 包含retry的请求
  get (url, config) {
    return this._limiP.call(this.instance.get, url, config)
  }

  resetKEYSate () {
    this._keyTimes = this._keyCount
    this._currentKeyIndex = 0
  }
}

module.exports = Axioslimit
