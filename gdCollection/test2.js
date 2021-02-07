const axios = require('axios')

axios.interceptors.request.use(function (config) {
  console.log(config)
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  console.log(response)
  return response
}, function (error) {
  return Promise.reject(error)
})

axios.get('https://restapi.amap.com/v3/place/text', {
  params: {
    key: '86c8755fb5ae082a71fe1a39df69d0e6',
    keywords: '便利店',
    city: '440300',
    citylimit: true,
    offset: 20,
    page: 0
  }
})
