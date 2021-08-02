const db = require('../helpers/db')

const table = 'users'

exports.getUser = (id, cb) => {
  db.query(`
  SELECT id, name, firstName, lastName ,picture, email, address, number FROM ${table} WHERE id = ?
  `, [id], cb)
}

exports.updateUser = (data, id, cb) => {
  db.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id], cb)
}
