const net = require('net')

const client = net.createConnection({ host: 'localhost', port: 8124 }, () => {
  // 'connect' listener
  console.log('connected to server!')
  client.write('world!')
})
  .on('data', (data) => {
    console.log(data.toString())
    // client.end()
  })
  .on('end', () => {
    console.log('disconnected from server')
  })
