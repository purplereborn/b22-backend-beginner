const { response } = require('../helpers/standardResponse')
const {
  // getUser,
  getUser2,
  updateUser,
  confirmPassword,
  updatePassword
  // updateUser2,
  // updateUser3
} = require('../models/profile')
// const { getUserByEmail3 } = require('../models/users')
const { APP_UPLOAD_ROUTE } = process.env
const bcrypt = require('bcrypt')

// exports.getUser = (req, res) => {
//   getUser2(req.authUser.id, (err, results) => {
//     if (!err) {
//       return response(res, 200, results[0], 'Profile Detail')
//     } else {
//       return response(res, 404, null, 'Profile not found')
//     }
//   })
// }

exports.getUser = async (req, res) => {
  const results = await getUser2(req.authUser.id)
  if (results.length > 0) {
    return response(res, 200, results[0], 'Profile Detail')
  } else {
    return response(res, 401, false, 'Profile Not found')
  }
}

const itemPicture = require('../helpers/upload').single('picture')

// exports.updateProfile2 = (req, res) => {
//   console.log(req.body)
//   getUser(req.authUser.id, (err, results, _fields) => {
//     console.log(err)
//     if (!err) {
//       if (results.length > 0) {
//         itemPicture(req, res, err => {
//           if (err) throw err
//           req.body.picture = req.file
//             ? `${APP_UPLOAD_ROUTE}/${req.file.filename}`
//             : null

//           const { name, email, address, number, picture, firstName, lastName } = req.body
//           console.log(req.body)
//           const updateData = { name, email, address, number, picture, firstName, lastName }
//           // console.log(updateData)
//           updateUser(updateData, req.authUser.id, (err, results, _fields) => {
//             console.log(err)
//             if (!err) {
//               return response(res, 200, null, 'Profile updated successfully')
//             } else {
//               return response(res, 400, null, 'An error occurred')
//             }
//           })
//         })
//       } else {
//         return response(res, 404, null, 'Profile not found!')
//       }
//     }
//   })
// }

exports.updateProfile = async (req, res) => {
  // console.log(req.body)
  const results = await getUser2(req.authUser.id)
  if (results.length > 0) {
    itemPicture(req, res, err => {
      if (err) throw err
      req.body.picture = req.file
        ? `${APP_UPLOAD_ROUTE}/${req.file.filename}`
        : null

      const { name, email, address, number, picture, firstName, lastName } = req.body
      // console.log(req.body)
      const updateData = { name, email, address, number, picture, firstName, lastName }
      // console.log(updateData)
      // updateUser(updateData, req.authUser.id)
      // return response(res, 200, null, 'Profile updated successfully')
      // return response(res, 400, null, 'An error occurred')

      updateUser(updateData, req.authUser.id)
      // console.log(err)
      // if (!err) {
      return response(res, 200, null, 'Profile updated successfully')
      // } else {
      //   return response(res, 400, null, 'An error occurred')
      // }
    })
  } else {
    // console.log(results)
    return response(res, 401, null, 'Profile Not found')
  }
}

exports.confirmPassword = async (req, res) => {
  const { password } = req.body
  if (password.length < 7) {
    return response(res, 401, null, 'password length must be greater than 7')
  }
  try {
    const { id } = req.authUser
    const results = await confirmPassword(id)
    const compare = await bcrypt.compare(password, results[0].password)
    // console.log(compare, 'result')
    if (!compare) return response(res, 401, null, 'Password not match')
    return response(res, 200, compare, 'Password Verification success')
  } catch (err) {
    return response(res, 401, null, 'An error occurred')
  }
}

exports.updatePassword = async (req, res) => {
  const setData = req.body
  const { id } = req.authUser
  const key = Object.keys(req.body)
  const lastColumn = key[0]
  if (setData.password.length < 7) return response(res, 400, null, 'password length must be greater than 7')
  if (setData.resendPassword !== setData.password) return response(res, 400, false, 'password not match')
  setData.password = await bcrypt.hash(setData.password, await bcrypt.genSalt())
  const updateData = { id, [lastColumn]: setData[lastColumn] }
  // console.log(updateData)

  await updatePassword(updateData)
  return response(res, 200, true, 'Success update password')
}
