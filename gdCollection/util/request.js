'use strict'
const axios = require('axios')
const LimitPromise = require('./RateLimiter')
const KEYs = [
  // '86c8755fb5ae082a71fe1a39df69d0e6',
  'dc4877fbfe57d847e0fca3d0d0c9f89b',
  'efed9dff9628f9ef28df9eedf5193325',
  '44ba0936659fda58c70af38e6bbe48df',
  'f91b2ef0486ed8467808bebbe231152a',
  '29a105d364702823fdd40a1bb34fffbe',
  'f74d75533934f2fbf452fb1c6d386258',
  'b4d612496c1bb400281b6c1d7078bd25',
  '204bf1a36ce870e9a4749480409216d6',
  '3268fb4eb81774ea259532e74d5c1b0f', // 刘志龙
  '52077c539bfc51019997f832f1b435c3', // 许其东
  'd0316a310fa9852c38ba0229be9e16a1', // 谌鹏飞
  '5dd968b0927e12a6317073cb902f5eaf', // 李叙林
  '14c20c52171167fad1c228cf8a009f91', // 谭晖
  'b1916a77f3e6e3ad5d660b1da5317b72', // 曾岚风
  'a828e37077f3b4e04f784564d48f791a', // 李玉华
  '04d2518c83018fffe8cbcab750b4c93a', // 彭红霞
  '89a4044548f113d22f3b7b4289544e00', // 黄磊
  '39deb4337c6b75e3af8a616e32bfd6b6', // 杨世毅
  'b324eea60adcd25ed5bd99e7b95d0c08', // 陈治强
  '100f4732fb660663e2229865ee343451', // 彭英豪
  '3eda9abcd20f9a21cce3caf826726b73', // 林克冰
  '9d77888f508f970dfa5b7dd45d5475aa',
  '6c5755dc7847851cef462aa9fa1083fd',
  '3f54db0620b9b4313cdb605f4d20a276',
  'affb1addfab4938f7043f4665d27ea28',
  'fc9fd06b8ab9a75992ba5640c93b8148',
  '73c1cf0462f21b25b333bd77e857aa78',
  '098560530a82d2cb49991334da14b74e',
  '7c05a73aed27d1e27d0f9399fe81b561',
  '6b2a5f18d363ccec62d40e1da3d52caf'
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
        return new Error('limit exceeded')
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
          return new Error('limit exceeded')
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
