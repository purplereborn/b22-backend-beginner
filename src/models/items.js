const db = require('../helpers/db')

exports.createItem = (data, cb) => {
  db.query(`INSERT INTO items (picture, name, price) 
  VALUES (?, ?, ?)
    
  `, [data.picture, data.name, data.price], cb)
}

exports.getItems = (cb) => {
  db.query(
    'SELECT name, price FROM items'
    , cb)
}

exports.getItemsById = (id, cb) => {
  db.query(`
  SELECT * FROM items WHERE id=${id}
  `, cb)
}

exports.updateItem = (data, cb) => {
  db.query(`
  UPDATE items SET picture=${data.picture ? `'${data.picture}'` : null} name='${data.name}', price=${data.price}, updated_at='${data.updated_at}' WHERE id=${data.id}
  `, cb)
}

exports.updateItemPartial = (data, cb) => {
  const key = Object.keys(data)
  const lastColumn = key[key.length - 1]
  console.log(data[lastColumn])
  db.query(`
    UPDATE items SET ${lastColumn} = ?, updated_at = ? WHERE id = ?
    `, [data[lastColumn], data.updated_at, data.id], cb)
}

exports.deleteItem = (id, cb) => {
  db.query(`
  DELETE FROM items WHERE id=?
  `, [id], cb)
}

exports.getItemsByCondition = (cond, cb) => {
  db.query(`
  SELECT items.id,items.price, items.name, items.description ,categories.name AS category_name,variants.name AS variant_name,
  items.created_at
  FROM items LEFT JOIN categories ON items.category_id = categories.id
  LEFT JOIN variants ON items.variant_id = variants.id WHERE items.name LIKE '%${cond.search}%' LIMIT ? OFFSET ?
  `, [cond.limit, cond.offset], cb)
}

exports.getMyItemsById = (id, cb) => {
  db.query(`
  SELECT id, name, price  FROM items WHERE id IN (?) 
  `, [id], cb)
}
