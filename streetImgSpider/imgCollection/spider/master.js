'use strict'
const CPUsLen = require('os').cpus.length

const { fork } = require('child_process')

const CHECK_CRASH_INTERVAL = 10 * 1000 // 每 10s 检查一次
const CRASH_THRESHOLD = 15 * 1000 // 15s 超过15s没有心跳则认为已经 crash
const threadStatus = {} // 存储线程心跳时间 pid:{time:xxx}
// 不同进程采集城市配置
const collectionConfig = [{
  CityId: '44', // 采集的城市编码
  CollectionStatus: '0' // -2:无符合要求街景 -1:无街景 0：未采集  1：采集成功 2：采集未完整
}]
// 创建子进程进行数据采集

// 检查是任务是否停止
function checkCrash () {
  const now = Date.now()
  for (const threadS in threadStatus) {
    if ((now - threadS.time) > CRASH_THRESHOLD) {
      // 重启线程
      threadS.thread.kill()
      startThread()
    }
  }
}

function startThread (config) {
  const spider = fork('./spider.js')
  console.log('开启新的子进程')
  //   创建线程状态记录
  threadStatus[spider.pid] = { thread: spider, config, time: Date.now() }
  //   给子进程发送被配置
  spider.send(JSON.stringify(config))

  spider.on('message', msg => {
    const message = JSON.parse(msg)
    const msgType = message.type
    if (msgType === 'alive') {
      threadStatus[message.pid].time = message.time
    } else if (msgType === 'close') {
      delete threadStatus[message.pid]
      spider.kill()
    }
  })
  spider.on('close', (code, signal) => {
    console.log(`收到close事件，子进程收到信号${signal},退出码${code}`)
    spider.kill()
  })
}

function main () {

}

main()
