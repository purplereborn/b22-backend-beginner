const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'practice',
  user: 'root',
  password: ''
})

connection.connect()

module.exports = connection
