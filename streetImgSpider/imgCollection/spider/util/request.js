'use strict'
// 并发控制

// 1，请实现如下的函数，可以批量请求数据，所有的URL地址在urls参数中，同时可以通过max参数 控制请求的并发度。当所有的请求结束后，需要执行callback回调。发请求的函数可以直接使用fetch。

function sendRequest (urls, max, callback) {
  const len = urls.length
  const index = 0
  let counter = 0

  function _request () {
    while (index < len && max > 0) {
      max--
      fatch(urls[index]).finally(() => {
        max++
        counter++
        if (counter == len) {
          return callback()
        }
        _request()
      })
    }
  }
  _request()
}
