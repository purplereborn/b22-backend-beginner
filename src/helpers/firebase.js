const admin = require('firebase-admin')

const serviceAccount = require('../config/backend-coffeeshop-firebase-adminsdk-q84ra-eb419143e7.json')

// const firebase = admin.initializeApp({
//   credential: serviceAccount
// })

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = { messaging: firebase.messaging() }
