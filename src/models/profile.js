const db = require('../helpers/db')
const { promisify } = require('util')

const execPromise = promisify(db.query).bind(db)

const table = 'users'

exports.getUser = (id, cb) => {
  db.query(`
  SELECT id, picture, name, firstName, lastName , email, address, number FROM ${table} WHERE id = ?
  `, [id], cb)
}

exports.getUser2 = (id) => {
  return execPromise(
  `
  SELECT id, picture, name, firstName, lastName , email, address, number FROM ${table} WHERE id = ?
  `,
  [id]
  )
}

exports.updateUser = (data, id, cb) => {
  db.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id], cb)
}

exports.updateUser5 = (data, cb) => {
  db.query(`
  UPDATE users SET name=?, firstName=?, lastName=?, email=?,  number=?, address=? WHERE id=?
  `, [data.name, data.firstName, data.lastName, data.email, data.number, data.address, data.id], cb)
}

exports.updateUser2 = (data, id) => {
  return execPromise(
    `UPDATE ${table} SET name=? WHERE id = ?`, [data, id]
  )
}

exports.updateUser6 = (data, cb) => {
  db.query(`
  UPDATE users SET name=?, firstName=?, lastName=?, email=?, number=?, address=?, picture=? WHERE id=?
  `, [data.name, data.firstName, data.lastName, data.email, data.number, data.address, data.picture, data.id], cb)
}

exports.updateUser3 = (data, id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE users SET ? WHERE id=?', [data, id], function (err, res) {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  })
}

exports.confirmPassword = (id) => {
  return execPromise('SELECT * from users WHERE id=?', id)
}

exports.updateUser4 = (data, id) => {
  db.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id])
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

exports.updatePassword = (data) => {
  return new Promise((resolve, reject) => {
    const key = Object.keys(data)
    const lastColumn = key[key.length - 1]
    db.query(`UPDATE users SET ${lastColumn}=? WHERE id=?`, [[data[lastColumn]], data.id], function (err, res) {
      if (data > 1) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
