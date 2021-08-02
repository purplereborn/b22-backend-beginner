const { response } = require('../helpers/standardResponse')
const { createUser, getUserByEmail } = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  const data = req.body
  if (data.password.length < 7) {
    return response(res, 400, false, 'password length must be greater than 7')
  }
  data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
  createUser(data, (err, results) => {
    if (err) throw err
    if (results.affectedRows) {
      return response(res, 200, true, 'Register Successfully')
    }
  })
}

exports.login = (req, res) => {
  const { email, password } = req.body
  getUserByEmail(email, async (err, results) => {
    if (err) throw err
    if (results.length < 1) return response(res, 401, false, 'Wrong username or password')
    const user = results[0]
    const compare = await bcrypt.compare(password, user.password)
    if (compare) {
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.APP_KEY)
      return response(res, 200, { token }, 'Login success')
    } else {
      return response(res, 401, false, 'Wrong username or password')
    }
  })
}
