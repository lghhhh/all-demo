const http = require('http')
const path = require('path')
const fse = require('fse')
const multiparty = require('multiparty')
const server = http.createServer()

const UPLOAD_DIR = path.resolve(__dirname, './', 'target') // 大文件存储目录

const resolve_port = req => new Promise(resolve => {
  const chunk = ''
  req.on('data', data => {
    chunk += data
  })
  req.on('end', () => {
    resolve(JSON.parse(chunk))
  })
})

const pipeStream = (path, writeStream) => new Promise(resolve => {
  const readStream = fse.createReadStream(path)
  readStream.on('end', () => {
    fse.unlinkSync(path)
    resolve()
  })
  readStream.pipe(writeStream)
})
// 合并切片
const mergeFileChunk = async (filePath, filename, size) => {
  const chunkDir = path.resolve(UPLOAD_DIR, filename)
  const chunkPaths = await fse.readdir(chunkDir)
  // 根据切片下标进行排序
  // 否则直接读取目录的获得的顺序可能会错乱
  chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1])
}

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.status = 200
    res.end()
  }
  const multipart = new multiparty.Form()

  multipart.parse(req, async (err, fields, files) => {
    if (err) return
    const [chunk] = files.chunk
    const [hash] = files.hash
    const [filename] = files.filename
    const chunkDir = path.resolve(UPLOAD_DIR, filename)

    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir)
    }
    await fse.move(chunk.path, `${chunkDir}/${hash}`)
    res.end('received file chunk')
  })
})

server.listen(3000, () => { console.log('监听3000端口...') })
