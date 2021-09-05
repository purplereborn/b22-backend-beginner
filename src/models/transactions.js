const connection = require('../helpers/db')

const table = 'transactions'
const { promisify } = require('util')
const execPromise = promisify(connection.query).bind(connection)

exports.getProductsByIdAsync = (id) => {
  return execPromise(
    `
    SELECT id, name, price FROM items WHERE id IN (?)`,
    [id]
  )
}

exports.createTransactionAsync = (data) => {
  return execPromise(
    `
    INSERT INTO ${table} (code, total, tax, shipping_cost, shipping_address, payment_method, id_user)
  VALUES (?,?,?,?,?,?,?)`,
    [data.code,
      data.total,
      data.tax,
      data.shippingCost,
      data.shippingAddress,
      data.paymentMethod,
      data.idUser]
  )
}

exports.createProductTransactionAsync = (data) => {
  return execPromise(
    `
    INSERT INTO item_transactions (name, price, variants, amount, id_item, id_transactions) VALUES (?,?,?,?,?,?)`,
    [data.name, data.price, data.variants, data.amount, data.id_item, data.code]
  )
}

exports.createTransaction = (data, cb) => {
  connection.query(`
  INSERT INTO ${table} (code, total, tax, shipping_cost, shipping_address, payment_method, id_user) VALUES (?,?,?,?,?,?,?)
  `, [data.code, data.total, data.tax, data.shippingCost, data.shippingAddress, data.paymentMethod, data.idUser], cb)
}

exports.createItemTransaction = (data, cb) => {
  connection.query(`
  INSERT INTO item_transactions (name, price, variants, amount, id_item, id_transactions) VALUES (?,?,?,?,?,?)
  `, [data.name, data.price, data.variants, data.amount, data.id_item, data.code], cb)
}

exports.getTransactionById = (id, cb) => {
  connection.query(`
    SELECT * FROM transactions WHERE id_user = ?
  `, [id], cb)
}

exports.getTransactionById2 = (id) => {
  return execPromise(
    `
    SELECT * FROM transactions WHERE id_user = ?
    `, [id]
  )
}

exports.deleteTransactionById = (id, cb) => {
  connection.query(`
  DELETE FROM transactions WHERE id = ?
  `, [id], cb)
}

exports.getTransactionId = (id) => {
  return execPromise(
    `
    SELECT id, code, total, tax, shipping_cost, shipping_address, payment_method FROM transactions
  WHERE id = ?`,
    [id]
  )
}

exports.deleteHistory2 = (id) => {
  return execPromise(
    `
    DELETE FROM transactions WHERE id_user=?`,
    [id]
  )
}

// exports.deleteHistory2 = (id) => {
//   connection.query(`
//   DELETE FROM transactions WHERE id = ?
//   `, [id])
// }
