const multer = require('multer')
const path = require('path')
const { response: stdResponse } = require('../helpers/standardResponse')

const storage = multer.diskStorage({
  destination: (req, file, callbback) => {
    callbback(null, './assets/images')
  },
  filename: (req, file, callbback) => {
    console.log(file)
    let filetype = ''
    if (file.mimetype === 'image/png') {
      filetype = 'png'
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg'
    }
    callbback(null, 'image-' + Date.now() + '.' + filetype)
  }
})
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024 * 2
  }
}).single('images')

const uploadFilter = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return stdResponse(res, 400, false, err.message)
    } else if (err) {
      return stdResponse(res, 500, false, err.message)
    }
    next()
  })
}

module.exports = uploadFilter
