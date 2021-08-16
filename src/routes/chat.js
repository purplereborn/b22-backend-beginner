const route = require('express').Router()

const chatController = require('../controllers/chat')
// const auth = require('../middlewares/auth')

route.post('/', chatController.createChat)
route.get('/', chatController.getChat)
route.get('/allChat', chatController.getAllChat)
route.get('/search', chatController.searchUser)

module.exports = route
