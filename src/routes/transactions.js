const itemController = require('../controllers/transactions')
const auth = require('../middlewares/auth')
const route = require('express').Router()

route.post('/transactions', auth, itemController.createTransactions)
route.get('/history', auth, itemController.historyTransaction)

module.exports = route
