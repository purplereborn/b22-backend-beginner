const mysql2 = require('mysql2')
const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env

const connection = mysql2.createConnection({
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS
})

connection.connect()

module.exports = connection
