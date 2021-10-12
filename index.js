require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const { APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH))

const server = require('http').createServer(app)
const socket = require('./src/middlewares/socket')

const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

// const io = require('socket.io')(server, {
//   cors: {
//     origin: 'http://localhost:3000'
//   }
// })

// const io = require('socket.io')(server, {
//   cors: {
//     origin: 'https://sandi-coffeeshop-react.netlify.app'
//   }
// })

// const io = require('socket.io')(server, {
//   cors: {
//     origin: 'http://localhost:8081'
//   }
// })

app.use(socket(io))

io.on('connection', () => {
  console.log('socket connection is exist')
})

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
// const historyRoute = require('./src/routes/history')
const ChatRoute = require('./src/routes/chat')

app.use('/items', itemRoute)
app.use('/auth', authRoute)
app.use('/', auth, transactionRoute)
app.use('/', auth, profileRoute)
// app.use('/history', historyRoute)
app.use('/chat', auth, ChatRoute)

const port = process.env.PORT || 8080

server.listen(port, () => {
  console.log(`app running on port ${port}`)
})
