<template>
  <div id="app">
    <input type="file" @change="handleFileChange">
    <el-button @click="handleUpload">上传</el-button>

  </div>
</template>

<script>
const SIZE = 10 * 1024 * 1024 // 切片大小 10 mb
export default {
  name: 'App',
  data () {
    return {
      container: {
        file: null
      },
      data: []
    }
  },
  components: {
  },
  methods: {
    // 发送切片请求
    request ({
      url,
      method = 'post',
      data,
      headers = {},
      requestList
    }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key])
        })
        xhr.send(data)
        xhr.onload = (e) => {
          resolve({ data: e.target.response })
        }
      })
    },
    // 合并切片请求
    async mergeRequest () {
      await this.request({
        url: 'http://localhost:3000',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({ filename: this.container.file.name })
      })
    },
    // 获取上传的图片
    handleFileChange (e) {
      const [file] = e.target.files
      if (!file) return
      Object.assign(this.$data, this.$options.data())
      this.container.file = file
    },
    // 切割文件
    createFileChunk (file, size = SIZE) {
      let cur = 0
      const fileSize = file.size
      const fileChunkList = []
      while (cur < fileSize) {
        fileChunkList.push({ file: file.slice(cur, cur + SIZE) })
        cur += SIZE
      }
      return fileChunkList
    },
    async uploadChunks () {
      const requestList = this.data.map(({ chunk, hash }) => {
        const fromData = new FormData()
        fromData.append('chunk', chunk)
        fromData.append('hash', hash)
        fromData.append('filename', this.container)
        return { fromData }
      })
        .map(async ({ fromData }) =>
          this.request({
            url: 'http://localhost:3000',
            data: FormData
          })
        )
      await Promise.all(requestList) // 并发发送图片
      // 通知服务器合并图片
      await this.mergeRequest()
    },
    async handleUpload () {
      if (!this.container.data) return
      const fileChunkList = this.createFileChunk(this.container.file)
      this.data = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        hash: this.container.file.name + '-' + index
      }))
      await this.uploadChunks()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
