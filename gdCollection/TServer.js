const net = require('net')

const server = net.createServer({
  allowHalfOpen: true
}, socket => {
  console.log('socket connected')

  const data = []
  socket.on('data', (chunk) => {
    data.push(chunk)
  })

  socket.write(':')
  socket.on('end', () => {
    socket.end('Hello ' + data.toString())
    console.log('socket disconnected')
  })
})
  .on('error', (err) => {
    console.error(err)
    throw err
  })
  .listen(8124, () => {
    console.log('server bound: 8124.')
  })
