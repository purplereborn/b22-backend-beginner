const { response } = require('../helpers/standardResponse')
const { getUser, updateUser } = require('../models/profile')
const { APP_UPLOAD_ROUTE } = process.env

exports.getUser = (req, res) => {
  getUser(req.authUser.id, (err, results) => {
    if (!err) {
      return response(res, 200, results[0], 'Profile Detail')
    } else {
      return response(res, 404, null, 'Profile not found')
    }
  })
}

const itemPicture = require('../helpers/upload').single('picture')

exports.updateProfile = (req, res) => {
  console.log(req.body)
  getUser(req.authUser.id, (err, results, _fields) => {
    console.log(err)
    if (!err) {
      if (results.length > 0) {
        itemPicture(req, res, err => {
          if (err) throw err
          req.body.picture = req.file
            ? `${APP_UPLOAD_ROUTE}/${req.file.filename}`
            : null

          const { name, email, address, number, picture, firstName, lastName } = req.body
          console.log(req.body)
          const updateData = { name, email, address, number, picture, firstName, lastName }
          // console.log(updateData)
          updateUser(updateData, req.authUser.id, (err, results, _fields) => {
            console.log(err)
            if (!err) {
              return response(res, 200, null, 'Profile updated successfully')
            } else {
              return response(res, 400, null, 'An error occurred')
            }
          })
        })
      } else {
        return response(res, 404, null, 'Profile not found!')
      }
    }
  })
}
