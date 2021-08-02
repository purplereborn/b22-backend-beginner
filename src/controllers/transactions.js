const { firstResponse: response } = require('../helpers/firstResponse')
const { codeTransaction } = require('../helpers/transaction')
const { getMyItemsById } = require('../models/items')
const { createTransaction, createItemTransaction, getTransactionById } = require('../models/transactions')
const { getUserById2 } = require('../models/users')
const { APP_TRANSACTION_PREFIX } = process.env

// exports.createTransactions = (req, res) => {
//   const code = codeTransaction(APP_TRANSACTION_PREFIX, 1)
//   const data = req.body
//   if (typeof data.item_id === 'string') {
//     data.item_id = [data.item_id]
//     data.item_amount = [data.item_amount]
//   }
//   getMyItemsById(data.item_id.map(id => parseInt(id)), (err, items) => {
//     if (!err) {
//       const total = items.map((item, idx) => item.price * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
//       const tax = total * (10 / 100)
//       const shippingCost = 10000
//       const paymentMethod = data.payment_method
//       const idUser = req.authUser.id
//       getUserById2(idUser, (err, results) => {
//         if (!err) {
//           const shippingAddress = results[0].address
//           if (!shippingAddress) {
//             return response(res, 400, false, 'please add your address first')
//           }
//           const finalData = {
//             total, tax, shipping_cost: shippingCost, payment_method: paymentMethod, shipping_address: shippingAddress, code, id_user: idUser
//           }
//           createTransaction(finalData, (err, results) => {
//             if (!err) {
//               items.forEach((item, idx) => {
//                 const finalData = {
//                   name: item.name,
//                   price: item.price,
//                   amount: data.item_amount[idx],
//                   id_item: item.id,
//                   id_transactions: results.insertId
//                 }
//                 createItemTransaction(finalData, (err) => {
//                   if (!err) {
//                     console.log(`item ${item.id} inserted into item_transaction`)
//                   } else {
//                     return response(res, 500, false, 'An error Occurred')
//                   }
//                 })
//               })
//               return response(res, 200, true, 'Transaction SuccessFully', results)
//             }
//           })
//         }
//       })
//     }
//   })
// }
// exports.createTransactions = (req, res) => {
//   // const code = codeTransaction(APP_TRANSACTION_PREFIX, 0)
//   const data = (req.body)
//   if (typeof data.item_id === 'string') {
//     data.item_id = [data.item_id]
//     data.item_amount = [data.item_amount]
//     data.item_variant = [data.item_variant]
//     data.item_additional_price = [data.item_additional_price]
//     data.payment_method = [data.payment_method]
//   }
//   getMyItemsById(data.item_id.map(id => parseInt(id)), (err, items) => {
//     if (err) throw err
//     const code = codeTransaction(APP_TRANSACTION_PREFIX, 1)
//     const total = items.map((item, idx) => item.price * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
//     const tax = total * (10 / 100)
//     const shippingCost = 10000
//     const paymentMethod = data.payment_method
//     const userId = req.authUser.id
//     getUserById2(userId, (err, results) => {
//       if (err) throw err
//       const shippingAddress = results[0]
//       const finalData = {
//         code, total, tax, shipping_cost: shippingCost, shipping_address: shippingAddress, payment_method: paymentMethod, id_user: userId
//       }
//       createTransaction(finalData, (err, results) => {
//         if (err) throw err
//         items.forEach((item, idx) => {
//           const finalData = {
//             name: item.name,
//             price: item.price,
//             amount: data.item_amount[idx],
//             id_item: item.id,
//             id_transactions: results.insertId
//           }
//           createItemTransaction(finalData, (err) => {
//             if (err) throw err
//             console.log(`Item ${item.id} inserted to item_transactions`)
//           })
//         })
//         return response(res, 200, true, results)
//       })
//     })
//   })
//   // return standardResponse(res, 200, true, 'OK')
// }

exports.createTransactions = (req, res) => {
  const data = req.body
  if (typeof data.item_id === 'string') {
    data.item_id = [data.item_id]
    data.item_amount = [data.item_amount]
    data.item_variant = [data.item_variant]
    data.item_additional_price = [data.item_additional_price]
  }
  const additionalPrice = data.item_additional_price.map(elem => parseInt(elem))
  getMyItemsById(data.item_id.map(id => parseInt(id)), (err, items) => {
    if (err) throw err
    const idUser = req.authUser.id
    const code = codeTransaction(APP_TRANSACTION_PREFIX, idUser)
    const totalSub = []
    if (items.length === 1) {
      const total = data.item_variant.map((item, idx) => (items[0].price + additionalPrice[idx]) * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
      totalSub.push(total)
    }
    if (items.length > 1) {
      const total = items.map((item, idx) => (item.price + additionalPrice[idx]) * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
      totalSub.push(total)
    }
    const subTotal = parseInt(totalSub[0])
    const tax = subTotal * 10 / 100
    const shippingCost = 10000
    const paymentMethod = data.payment_method
    const total = subTotal + tax + shippingCost
    getUserById2(idUser, (err, results) => {
      if (err) throw err
      const shippingAddress = results[0].address
      if (!shippingAddress) {
        return response(res, 400, false, 'Address must be provided!')
      }
      const setData = {
        code, total, tax, shippingCost, shippingAddress, paymentMethod, idUser
      }
      createTransaction(setData, (err, results) => {
        if (err) throw err
        if (items.length === 1) {
          data.item_variant.forEach((v, i) => {
            const setData = {
              name: items[0].name,
              price: items[0].price + additionalPrice[i],
              variants: v,
              amount: data.item_amount[i],
              id_item: items[0].id,
              code: code
            }
            createItemTransaction(setData, (err, results) => {
              if (err) throw err
              console.log(`Item ${items[0].id} inserted to items_transactions`)
            })
          })
        }
        if (items.length > 1) {
          items.forEach((item, idx) => {
            const setData = {
              name: item.name,
              price: item.price + additionalPrice[idx],
              variants: data.item_variant[idx],
              amount: data.item_amount[idx],
              id_item: item.id,
              code: code
            }
            createItemTransaction(setData, (err, results) => {
              if (err) throw err
              console.log(`Item ${item.id} inserted to items_transactions`)
            })
          })
        }
        return response(res, 200, true, 'Success add transaction!')
      })
    })
  })
}

exports.historyTransaction = (req, res) => {
  const id = req.authUser.id
  getTransactionById(id, (err, results) => {
    if (err) throw err
    if (!err) {
      return response(res, 200, true, 'History Transactions', results)
    } else {
      return response(res, 500, false, 'History Transactions Failed')
    }
  })
}
