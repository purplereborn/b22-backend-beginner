const db = require('../helpers/db')

exports.createChat = (data, cb) => {
  db.query('INSERT INTO chats (sender, recipient, message, isLastest) VALUES (?,?,?,?) ', [data.sender, data.recipient, data.message, 1], cb)
}

exports.updateChat = (data, cb) => {
  db.query('UPDATE chats set isLastest=0 where sender IN (?,?) and recipient IN (?,?)',
    [data.sender1, data.sender2, data.recipient1, data.recipient2], cb)
}

exports.updateLastChat = (data, cb) => {
  const newdata = db.query(`
  UPDATE chats SET isLastest=1 WHERE sender in (?,?) and recipient in (?,?) order by chats.createdAt desc limit 1
  `, [data.sender, data.recipient, data.recipient, data.sender], cb)
  console.log(newdata)
}

exports.getUserChat = (data, cb) => {
  db.query('SELECT chats.id, chats.sender, chats.recipient, chats.message, chats.images, users.picture, users.name, users.firstName, users.lastName, users.number from chats LEFT JOIN users ON (chats.sender=users.number or recipient=users.number) where (sender=? or recipient=?) and isLastest= 1', [data.sender, data.recipient], cb)
}

exports.getAllUserChat = (data, cb) => {
  db.query('SELECT chats.id, chats.sender, chats.recipient, chats.message, chats.images, users.picture, users.name, users.firstName, users.lastName, users.number from chats LEFT JOIN users ON (chats.sender=users.number or recipient=users.number) WHERE sender IN (?,?) AND recipient IN (?,?)'
    , [data.sender1, data.sender2, data.recipient1, data.recipient2], cb)
}

exports.deleteChat = (data, cb) => {
  db.query('DELETE FROM chats WHERE (sender=? or recipient=?) and id=? ', [data.sender, data.recipient, data.id], cb)
}

exports.deleteChatById = (id, cb) => {
  db.query(`
  DELETE FROM chats WHERE chats.id=?
  `, [id], cb)
}

exports.uploadFile = (data, cb) => {
  db.query('INSERT INTO chats (sender, recipient, images,isLastest ) VALUES (?,?,?,?)'
    , [data.sender, data.recipient, data.images, 1], cb)
}

// exports.updateLastChat2 = (data, cb) => {
//   db.query('UPDATE chats set isLastest=0 where sender IN (?,?) and recipient IN (?,?) and isLastest=1',
//     [data.sender1, data.sender2, data.recipient1, data.recipient2], cb)
// }
