const connection = require('../helpers/db')

exports.getTransByCondition = (cond, cb) => {
  connection.query(`
  SELECT item_transactions.id,item_transactions.name, item_transactions.price
  FROM item_transactions  WHERE item_transactions.name LIKE '%${cond.search}%' LIMIT ? OFFSET ?
  `, [cond.limit, cond.offset], cb)
}

exports.getTrans = (cb) => {
  connection.query(
    'SELECT name,price FROM item_transactions'
    , cb)
}

exports.deleteAll = (cb) => {
  connection.query(`
  truncate item_transactions
  `, cb)
}
