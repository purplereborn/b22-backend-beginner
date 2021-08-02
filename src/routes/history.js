const route = require('express').Router()

const itemController = require('../controllers/history')

route.get('/', itemController.getTransaction)

module.exports = route
