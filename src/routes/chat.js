const route = require('express').Router()

const chatController = require('../controllers/chat')
const itemPicture = require('../helpers/upload3')
// const auth = require('../middlewares/auth')

route.delete('/:id', chatController.deleteChat2)
route.post('/upload', itemPicture, chatController.createUpload)
route.post('/', chatController.createChat)
route.get('/', chatController.getChat)
route.get('/allChat', chatController.getAllChat)
route.get('/search', chatController.searchUser)

module.exports = route
