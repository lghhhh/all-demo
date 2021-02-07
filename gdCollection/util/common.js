'use strict'

function getTimeStmap () {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

  const timestmap = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  console.log(timestmap)
  return timestmap
}

module.exports = { getTimeStmap }
