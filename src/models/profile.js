const db = require('../helpers/db')

const table = 'users'

exports.getUser = (id, cb) => {
  db.query(`
  SELECT id, picture, name, firstName, lastName , email, address, number FROM ${table} WHERE id = ?
  `, [id], cb)
}

exports.updateUser = (data, id, cb) => {
  db.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id], cb)
}

// exports.getUserByPhone = (data, cb) => {
//   db.query(`SELECT * from ${table} WHERE number = ?`, [data.number], cb)
// }

exports.getUserByPhone = (data, cb) => {
  db.query('SELECT * from users WHERE number=?', [data.number], cb)
}

exports.searchUser = (data, cb) => {
  db.query(`SELECT id, name, firstName, lastName, number, picture, email, address FROM users WHERE ${data.column} LIKE '%${data.search}%' `, cb)
}
