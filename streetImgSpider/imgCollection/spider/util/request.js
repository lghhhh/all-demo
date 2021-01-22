'use strict';
// 并发控制

// 1，请实现如下的函数，可以批量请求数据，所有的URL地址在urls参数中，同时可以通过max参数 控制请求的并发度。当所有的请求结束后，需要执行callback回调。发请求的函数可以直接使用fetch。

// function sendRequest (urls: string[], max: number, callback: () => void) {

// }


class Queue {
  constructor() {
    this._queue = [];
  }
  push(value) {
    return this._queue.push(value);
  }
  shift() {
    return this._queue.shift();
  }
  isEmpty() {
    return this._queue.length === 0;
  }
}
