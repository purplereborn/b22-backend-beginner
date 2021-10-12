const db = require('../helpers/db')
// const { promisify } = require('util')

// const execPromise = promisify(db.query).bind(db)

// const execPromise = promisify(db.query).bind(db)

// module.exports = {

//   createFCMToken: function (data) {
//     return execPromise('INSERT INTO token_fcms (token, userId) VALUE (?, ?)', [data.token, data.userId])
//   },

//   findToken: function (data) {
//     return execPromise('SELECT * FROM token_fcms LEFT JOIN users ON users.id = token_fcms.userId WHERE userId=?', [data])
//   }

// }

exports.createFCMToken = (data, cb) => {
  db.query('INSERT INTO token_fcms (token, userId) VALUES (?, ?)', [data.token, data.userId], cb)
}

exports.findToken = (data, cb) => {
  db.query('SELECT * FROM token_fcms LEFT JOIN users ON users.id = token_fcms.userId WHERE userId=?', [data], cb)
}

// exports.findToken = (data) => {
//   return execPromise(
//     `
//     SELECT * FROM token_fcms LEFT JOIN users ON users.id = token_fcms.userId WHERE userId=?
//   `,
//     [data]
//   )
// }
