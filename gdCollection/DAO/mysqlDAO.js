const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 10,
  host: '192.168.87.250',
  user: 'root',
  password: 'careland',
  database: 'IC_WebCollResult'
})

// pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error
//   console.log('The solution is: ', results[0].solution)
// })
const mysqlExec = function (sql, values) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}
module.exports = { mysqlExec }
