const route = require('express').Router()
const userController = require('../controllers/profile')
const auth = require('../middlewares/auth')

route.get('/profile', auth, userController.getUser)
route.put('/updateProfile', auth, userController.updateProfile)

module.exports = route
