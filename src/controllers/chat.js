// const { response } = require('../helpers/standardResponse')
const { firstResponse: response } = require('../helpers/firstResponse')
const { getUserByPhone, getUser, searchUser, getUserByIdChat } = require('../models/profile')
const { createChat, updateChat, getUserChat, getAllUserChat, deleteChat, updateLastChat, deleteChatById, uploadFile } = require('../models/chat')
const { APP_URL } = process.env
const { findToken } = require('../models/tokenFCM')
const firebase = require('../helpers/firebase')

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
                      return response(res, 200, true, 'Send Message Successfully', finalData)
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

exports.deleteChat = (req, res) => {
  getUser(req.authUser.id, (err, results) => {
    if (!err) {
      if (results.length > 0) {
        const { id: stringId } = req.params
        const id = parseInt(stringId)
        const data = { sender: results[0].number, recipient: results[0].number, id }
        deleteChat(data, (err, results) => {
          if (!err) {
            if (results.affectedRows > 0) {
              return response(res, 200, true, 'Delete Chat Successfully', results)
            } else {
              return response(res, 404, false, 'Chat Not Found')
            }
          } else {
            return response(res, 404, false, 'Chat Not Found')
          }
        })
      } else {
        return response(res, 404, false, 'You not logged')
      }
    } else {
      return response(res, 500, false, 'An error Ocurred')
    }
  })
}

exports.deleteChat2 = (req, res) => {
  const { id } = req.params
  const { recipient } = req.body
  getUser(req.authUser.id, (err, results, _fields) => {
    if (!err) {
      const sender = results[0].number
      deleteChatById(id, (err, results, _fields) => {
        if (!err) {
          const form = {
            sender: sender,
            recipient: recipient
          }
          updateLastChat(form, (err, result, _fields) => {
            if (!err) {
              return response(
                res, 200, true, 'Delete Chat Successfully', result
              )
            } else {
              return response(res, 404, false, 'Chat Not Found')
            }
          })
        } else {
          return response(res, 404, false, 'Chat Not Found')
        }
      })
    } else {
      return response(res, 404, false, 'Chat Not Found')
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

exports.createUpload = (req, res) => {
  const data = req.body
  const subData = { number: data.recipient }
  getUserByPhone(subData, (err, results) => {
    if (!err) {
      if (results.length > 0) {
        getUserByIdChat(req.authUser.id, (err, results) => {
          if (!err) {
            if (results.length > 0) {
              const newSender = results[0].number
              const updateData = { sender1: newSender, sender2: data.recipient, recipient1: data.recipient, recipient2: results[0].number }
              updateChat(updateData, (err, results) => {
                if (!err) {
                  req.body.images = req.file ? `${process.env.APP_UPLOAD_ROUTE}/${req.file.filename}` : null
                  const finalData = { sender: newSender, recipient: data.recipient, images: data.images }
                  uploadFile(finalData, (err, results) => {
                    if (!err) {
                      req.socket.emit(data.recipient, {
                        message: data.images,
                        sender: newSender
                      })
                      return response(res, 200, true, 'File Send Successfully', results)
                    } else {
                      return response(res, 500, false, 'An error Ocurred')
                    }
                  })
                }
              })
            } else {
              return response(res, 404, false, 'You need to login first')
            }
          } else {
            return response(res, 500, false, 'An error Ocurred')
          }
        })
      } else {
        return response(res, 404, false, 'User Destination Not Found')
      }
    } else {
      return response(res, 500, false, 'An error Ocurred')
    }
  })
}

// exports.createChat = (req, res) => {
//   const data = req.body
//   const subData = { number: data.recipient }
//   getUserByPhone(subData, (err, results_) => {
//     if (!err) {
//       if (results_.length > 0) {
//         getUser(req.authUser.id, (err, results) => {
//           if (!err) {
//             if (results.length > 0) {
//               const newSender = results[0].number
//               const updateData = { sender1: newSender, sender2: data.recipient, recipient1: data.recipient, recipient2: results[0].number }
//               console.log(newSender, data.recipient, results[0].number)
//               updateChat(updateData, (err, results2) => {
//                 if (!err) {
//                   const finalData = { sender: newSender, recipient: data.recipient, message: data.message }
//                   createChat(finalData, (err, results3) => {
//                     if (!err) {
//                       req.socket.emit(data.recipient, {
//                         message: data.message,
//                         sender: newSender
//                       })
//                       findToken(data.recipient, (err, results4) => {
//                         if (!err) {
//                           console.log(results4)
//                           firebase.messaging.sendToDevice(results4.token, {
//                             notification: {
//                               title: 'History Coffee',
//                               body: `${results[0].name}: ${data.message}`
//                             }
//                           })
//                           return response(res, 200, true, 'Send Message Successfully', finalData)
//                         } else {
//                           return response(res, 200, true, 'Send Message Successfully without notification', finalData)
//                         }
//                       })
//                     } else {
//                       return response(res, 500, false, 'error 1')
//                     }
//                   })
//                 } else {
//                   return response(res, 500, false, 'error 2')
//                 }
//               })
//             } else {
//               return response(res, 404, false, 'You not logged')
//             }
//           } else {
//             return response(res, 404, false, 'Need login first')
//           }
//         })
//       } else {
//         return response(res, 404, false, 'User Destination Not Found')
//       }
//     } else {
//       return response(res, 500, false, 'error 0')
//     }
//   })
// }
