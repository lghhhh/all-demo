'use strict'
function main () {
  setInterval(sendheartBeat, 9000)
  sendheartBeat()
}
// 入库完成后发送心跳包
function sendheartBeat () {
  const msg = {
    pid: process.pid,
    type: 'alive',
    time: Date.now()
  }
  process.send(JSON.stringify(msg))
}

// =======监听父进程传递的参数======
process.on('message', (msg) => {
  console.log('子进程收到数据啦')
  const message = JSON.parse(msg)
  const msgType = message.type
  if (msgType === 'start') main(message.condition)
})
