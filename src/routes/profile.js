const route = require('express').Router()
const userController = require('../controllers/profile')
const auth = require('../middlewares/auth')
const itemPicture = require('../helpers/upload')
// const multer = require('multer')
// const path = require('path')

// const maxSize = 1024 * 1024 * 2

// const storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, path.join(process.cwd(), 'assets', 'picture'))
//   },
//   filename: function (_req, file, cb) {
//     const ext = file.originalname.split('.')[1]
//     const date = new Date()
//     cb(null, `${date.getTime()}.${ext}`)
//   }
// })

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: maxSize }
// })
route.get('/profile', auth, userController.getUser)
route.patch('/updateProfile', auth, itemPicture, userController.updateProfile)
route.post('/confirm', auth, userController.confirmPassword)
route.patch('/updatePassword', auth, userController.updatePassword)

module.exports = route
