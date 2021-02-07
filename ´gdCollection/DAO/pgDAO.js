'use strict'
const { Client } = require('pg')
const connectionString = 'postgresql://postgres:123456@192.168.87.250:5432/AddressStruct'

async function find (sqlStr) {
  const client = new Client({
    connectionString
  })
  client.connect()
  try {
    const res = await client.query(sqlStr)
    await client.end()
    return res
  } catch (err) {
    console.log(err.stack)
  }
  await client.end()
  return null
}

module.exports = { find }
