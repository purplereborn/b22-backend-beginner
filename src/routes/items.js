const route = require('express').Router()

const itemController = require('../controllers/items')
const auth = require('../middlewares/auth')
const itemPicture = require('../helpers/upload')

route.get('/', itemController.getItems)
route.post('/', auth,itemPicture, itemController.createItem)
route.get('/:id', itemController.getDetailItem)
route.patch('/:id', auth, itemController.updateItemPartially)
route.put('/:id', auth, itemController.updateItem)
route.delete('/:id', auth, itemController.deleteItem)

module.exports = route
