const connection = require('../helpers/db')

const table = 'transactions'

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

exports.deleteTransactionById = (id, cb) => {
  connection.query(`
  DELETE FROM transactions WHERE id = ?
  `, [id], cb)
}
