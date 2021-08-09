require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const { APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH))

app.get('/', (req, res) => {
  const data = {
    success: true,
    message: 'backend is running well'
  }
  return res.json(data)
})

const itemRoute = require('./src/routes/items')
const authRoute = require('./src/routes/auth')
const transactionRoute = require('./src/routes/transactions')
const profileRoute = require('./src/routes/profile')
const auth = require('./src/middlewares/auth')
const historyRoute = require('./src/routes/history')

app.use('/items', itemRoute)
app.use('/auth', authRoute)
app.use('/', auth, transactionRoute)
app.use(auth, profileRoute)
app.use('/history', historyRoute)

const port = process.env.APP_PORT || 8080

app.listen(port, () => {
  console.log(`app running on port ${port}`)
})
