const { response } = require('../helpers/standardResponse')
const { createUser, getUserByEmail3, getUserByNumber3 } = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const { APP_KEY } = process.env

exports.register = async (req, res) => {
  const data = req.body
  if (data.password.length < 7) {
    return response(res, 400, false, 'password length must be greater than 7')
  }
  data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
  const results1 = await getUserByEmail3(data.email)
  if (results1.length > 0) {
    return response(res, 400, false, 'Email is already in use')
  }
  const results2 = await getUserByNumber3(data.number)
  if (results2.length > 0) {
    return response(res, 400, false, 'Phone number is already in use')
  }
  await createUser(data)
  return response(res, 200, true, 'Register Successfully')
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  if (req.body.password.length < 7) {
    return response(res, 400, false, 'password length must be greater than 7')
  }
  try {
    // console.log(email)
    const results = await getUserByEmail3(email)
    if (results.length < 1) return response(res, 401, false, 'Email not found')
    const compare = await bcrypt.compare(password, results[0].password)
    if (compare) {
      const payload = { id: results[0].id, email: results[0].email }
      const token = jwt.sign(payload, process.env.APP_KEY, { expiresIn: '3 day' })
      return response(res, 200, { token }, 'Login success')
    } else {
      return response(res, 401, false, 'Wrong email or password')
    }
  } catch (err) {
    console.log(err)
    return response(res, 500, false, 'An error occured')
  }

  // getUserByEmail(email, async (err, results) => {
  //   if (err) throw err
  //   if (results.length < 1) return response(res, 401, false, 'Wrong username or password')
  //   const user = results[0]
  //   const compare = await bcrypt.compare(password, user.password)
  //   if (compare) {
  //     const token = jwt.sign({ id: user.id, email: user.email }, process.env.APP_KEY)
  //     return response(res, 200, { token }, 'Login success')
  //   } else {
  //     return response(res, 401, false, 'Wrong username or password')
  //   }
  // })
}

// try {
//   const results = getUserByEmail3(email)
//   if (!results) return response(res, 401, false, 'Wrong email or password')
//   const compare = await bcrypt.compare(password, results[0].password)
//   if (compare) {
//     const payload = { id: results[0].id, email: results[0].email }
//     const token = jwt.sign(payload, process.env.APP_KEY, { expiresIn: '3 day' })
//     return response(res, 200, { token }, 'Login success')
//   } else {
//     return response(res, 401, false, 'Wrong username or password')
//   }
// } catch (err) {
//   console.log(err)
//   return response(res, 500, false, 'An error occured')
// }
