// const { response } = require('../helpers/standardResponse')
const { firstResponse: response } = require('../helpers/firstResponse')
const { getUserByPhone, getUser, searchUser } = require('../models/profile')
const { createChat, updateChat, getUserChat, getAllUserChat } = require('../models/chat')
const { APP_URL } = process.env

exports.createChat = (req, res) => {
  const data = req.body
  const subData = { number: data.recipient }
  getUserByPhone(subData, (err, results) => {
    if (!err) {
      if (results.length > 0) {
        getUser(req.authUser.id, (err, results) => {
          if (!err) {
            if (results.length > 0) {
              const newSender = results[0].number
              const updateData = { sender1: newSender, sender2: data.recipient, recipient1: data.recipient, recipient2: results[0].number }
              console.log(newSender, data.recipient, results[0].number)
              updateChat(updateData, (err, results) => {
                if (!err) {
                  const finalData = { sender: newSender, recipient: data.recipient, message: data.message }
                  createChat(finalData, (err, results) => {
                    if (!err) {
                      req.socket.emit(data.recipient, {
                        message: data.message,
                        sender: newSender
                      })
                      return response(res, 200, true, 'Send Message Successfully', results)
                    } else {
                      return response(res, 500, false, 'error 1')
                    }
                  })
                } else {
                  return response(res, 500, false, 'error 2')
                }
              })
            } else {
              return response(res, 404, false, 'You not logged')
            }
          } else {
            return response(res, 404, false, 'Need login first')
          }
        })
      } else {
        return response(res, 404, false, 'User Destination Not Found')
      }
    } else {
      return response(res, 500, false, 'error 0')
    }
  })
}

exports.getChat = (req, res) => {
  getUser(req.authUser.id, (err, results) => {
    if (!err) {
      const newSender = results[0].number
      const newName = results[0].name
      const data = { sender: newSender, recipient: newSender }
      getUserChat(data, (err, results) => {
        if (!err) {
          if (results.length > 0) {
            results.forEach((pic, index) => {
              results[index].picture = `${APP_URL}${results[index].picture}`
            })

            let index = results.length - 1
            while (index >= 0) {
              if (results[index].name === newName) {
                results.splice(index, 1)
              }
              index -= 1
            }

            return response(res, 200, true, 'List Chat', results)
          } else {
            return response(res, 404, false, 'You Dont Have Any Conversation')
          }
        } else {
          return response(res, 500, false, 'error 1')
        }
      })
    } else {
      return response(res, 500, false, 'error 2')
    }
  })
}

exports.getAllChat = (req, res) => {
  getUser(req.authUser.id, (err, results) => {
    if (!err) {
      const newUserName = results[0].name
      const data = { sender1: results[0].number, sender2: req.query.users, recipient1: req.query.users, recipient2: results[0].number }
      getAllUserChat(data, (err, results) => {
        if (!err) {
          if (results.length > 0) {
            results.forEach((pic, index) => {
              results[index].picture = `${APP_URL}${results[index].picture}`
            })
            let index = results.length - 1
            while (index >= 0) {
              if (results[index].name === newUserName) {
                results.splice(index, 1)
              }
              index -= 1
            }

            return response(res, 200, true, 'List All User Chat', results)
          } else {
            return response(res, 404, false, 'You Dont Have Any Conversation')
          }
        } else {
          return response(res, 500, false, 'An error occured')
        }
      })
    } else {
      return response(res, 500, false, 'An error occured')
    }
  })
}

// exports.getAllChat = (req, res) => {
//   getUser(req.authUser.id, (err, results) => {
//     if (!err) {
//       const newName = results[0].name
//       const query = req.query.users
//       const data = { sender1: results[0].number, sender2: query, recipient1: query, recipient2: results[0].number }
//       getAllUserChat(data, (err, results) => {
//         if (!err) {
//           if (results.length > 0) {
//             results.forEach((pic, index) => {
//               results[index].picture = `${APP_URL}${results[index].picture}`
//             })
//             let index = results.length - 1
//             while (index >= 0) {
//               if (results[index].name === newName) {
//                 results.splice(index, 1)
//               }
//               index -= 1
//             }

//             return response(res, 200, true, 'List All Chat', results)
//           } else {
//             return response(res, 404, false, 'You Dont Have Any Conversation')
//           }
//         } else {
//           return response(res, 500, false, 'error 1')
//         }
//       })
//     } else {
//       return response(res, 500, false, 'error 2')
//     }
//   })
// }

exports.searchUser = (req, res) => {
  const data = req.query
  data.column = data.column || 'name'
  data.search = data.search || ''
  searchUser(data, (err, results) => {
    if (!err) {
      if (results.length > 0) {
        results.forEach((pic, index) => {
          results[index].picture = `${APP_URL}${results[index].picture}`
        })
        return response(res, 200, true, 'List User', results)
      } else {
        return response(res, 404, false, 'User Not Found')
      }
    } else {
      return response(res, 500, false, 'An error Occured')
    }
  })
}
