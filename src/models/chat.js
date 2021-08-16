const db = require('../helpers/db')

exports.createChat = (data, cb) => {
  db.query('INSERT INTO chats (sender, recipient, message, isLastest) VALUES (?,?,?,?) ', [data.sender, data.recipient, data.message, 1], cb)
}

exports.updateChat = (data, cb) => {
  db.query('UPDATE chats set isLastest=0 where sender IN (?,?) and recipient IN (?,?)',
    [data.sender1, data.sender2, data.recipient1, data.recipient2], cb)
}

exports.getUserChat = (data, cb) => {
  db.query('SELECT chats.id, chats.sender, chats.recipient, chats.message, users.picture, users.name, users.firstName, users.lastName, users.number from chats LEFT JOIN users ON (chats.sender=users.number or recipient=users.number) where (sender=? or recipient=?) and isLastest= 1', [data.sender, data.recipient], cb)
}

exports.getAllUserChat = (data, cb) => {
  db.query('SELECT chats.id, chats.sender, chats.recipient, chats.message, users.picture, users.name, users.firstName, users.lastName, users.number from chats LEFT JOIN users ON (chats.sender=users.number or recipient=users.number) WHERE sender IN (?,?) AND recipient IN (?,?)'
    , [data.sender1, data.sender2, data.recipient1, data.recipient2], cb)
}
