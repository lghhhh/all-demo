const Axioslimit = require('./util/request')

const axios20 = new Axioslimit(20)

// async function sleep (t) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, t)
//   })
// }
async function test (count) {
  const result = await axios20.get('https://restapi.amap.com/v3/place/text', {
    params: {
      key: '86c8755fb5ae082a71fe1a39df69d0e6',
      keywords: '便利店',
      city: '440300',
      citylimit: true,
      offset: 20,
      page: 0
    }
  }).catch(e => console.log(e))
  console.log('完成任务序号--------', count)
  return result
}
// 并发30条
function main () {
  let count = 20
  while (count--) {
    // await sleep(3000)
    test(count)
    console.log(`${count}  -start-`)
  }
}

main()

// const date = new Date()
// const year = date.getFullYear()
// const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
// const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
// const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
// const minutes = date.getMinutes() < 10 ? '0' + (date.getMinutes() + 1) : (date.getMinutes() + 1)
// const seconds = date.getSeconds() < 10 ? '0' + (date.getSeconds() + 1) : (date.getSeconds() + 1)

// const timestmap = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
// console.log(timestmap)
