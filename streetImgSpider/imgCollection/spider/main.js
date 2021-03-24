'use strict'
const path = require('path')
const CPUsLen = require('os').cpus().length
const { fork } = require('child_process')

const CHECK_CRASH_INTERVAL = 60 * 1000 // 每 10s 检查一次
const CRASH_THRESHOLD = 15 * 1000 // 15s 超过15s没有心跳则认为已经 crash
const RETRY_TIMES = 3 // 任务重启次数
const threadStatus = {} // 存储线程心跳时间 pid:{time:xxx}
// 不同进程采集城市配置 假如cpu四个核心 最多同时设定4个进程
const collectionConfig = [
  {
    CityId: '44', // 采集的城市编码
    CollectionStatus: '0' // -2:无符合要求街景 -1:无街景 0：未采集  1：采集成功 2：采集未完整
  }
]
let Timer = null
// 创建子进程进行数据采集

// 检查进程状态threadStatus中的进程是否停止
function checkCrash () {
  if (!Object.keys(threadStatus)?.length) {
    clearInterval(Timer)
    return
  }
  console.log('-----------------------------检查子进程存活状态----------------------------')
  const now = Date.now()
  for (const [pid, threadS] of Object.entries(threadStatus)) {
    if ((now - threadS.time) > CRASH_THRESHOLD) {
      // 重启线程
      console.log(`子进程${pid}无响应,准备重启`)
      threadS.thread.kill()
      // 重启超过   3次 暂停
      if (threadS.retryTimes >= RETRY_TIMES) delete threadStatus[pid]
      startThread(threadS.config)
      threadS.retryTimes++
    }
  }
  console.log('检查结束')
}

async function startThread (config) {
  const childProcessPath = path.resolve(__dirname, './childSpider.js')
  // const childProcessPath = path.resolve(__dirname, './Spider2.js')
  const spider = fork(childProcessPath)
  console.log(`创建子进程${spider.pid}`)
  //   创建线程状态记录
  threadStatus[spider.pid] = { thread: spider, config, time: Date.now(), retryTimes: 0 }
  //   给子进程发送被配置
  const condition = {
    type: 'start',
    condition: config

  }
  spider.send(JSON.stringify(condition))
  // 监听子进程放回消息
  spider.on('message', msg => {
    const message = JSON.parse(msg)
    const msgType = message.type
    if (msgType === 'alive') {
      threadStatus[message.pid].time = message.time
      console.log(`子进程${message.pid}持活，心跳时间${message.time},`)
    } else if (msgType === 'close') {
      console.log(`！！！！！接受Close信号，终止进程${message.pid}！！！！！`)
      spider.kill()
      delete threadStatus[message.pid]
    }
  })
  // spider.on('close', (code, signal) => {
  //   console.log(`收到close事件，子进程收到信号${signal},退出码${code}`)
  //   spider.kill()
  // })
}
async function main () {
  // 根据配置数与核心数 CPUsLen 开启进程
  // 开启线程数量 为核心数-1
  const configLen = collectionConfig.length
  for (let i = 0; i < CPUsLen - 1 && i < configLen; i++) {
  // for (let i = 0; i < 1; i++) {
    console.log('配置序号', i)
    const config = collectionConfig[i]
    await startThread(config)
  }
  // 10s进行一次检测
  Timer = setInterval(checkCrash, CHECK_CRASH_INTERVAL)
}

main()
