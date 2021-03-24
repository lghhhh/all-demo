'use strict'
const { Client, Pool } = require('pg')
const connectionString = 'postgresql://postgres:123456@192.168.87.250:5432/AddressStruct'
// const connectionString2 = 'postgresql://postgres:123456@192.168.87.250:5432/POI_Merge'

async function find (sqlStr) {
  const client = new Client({
    connectionString
  })
  await client.connect()
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

async function findAdcode (sqlStr) {
  const pool = new Pool(
    {
      user: 'postgres',
      host: '192.168.87.250',
      database: 'POI_Merge',
      password: '123456',
      port: 5432
    }
  )

  try {
    const res = await pool.query(sqlStr)
    await pool.end()
    return res
  } catch (err) {
    console.log(err.stack)
  }
  await pool.end()
  return null
}
module.exports = { find, findAdcode }
