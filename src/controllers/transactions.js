const { firstResponse: response } = require('../helpers/firstResponse')
const { codeTransaction } = require('../helpers/transaction')
const { getMyItemsById } = require('../models/items')
const {
  createProductTransactionAsync, getProductsByIdAsync,
  createTransaction, createItemTransaction, getTransactionById,
  createTransactionAsync, getTransactionById2, deleteHistory2
} = require('../models/transactions')
const { getUserById2 } = require('../models/users')
const { APP_TRANSACTION_PREFIX } = process.env
const { getUser2 } = require('../models/profile')

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

exports.historyTransaction = async (req, res) => {
  // const idUser = req.authUser.id
  const { id } = req.authUser
  const results = await getTransactionById2(id)
  if (results.length > 0) {
    return response(res, 200, true, 'History Transactions', results)
  } else {
    return response(res, 500, false, 'History Transactions not found')
  }
}

// exports.createTransactions = async (req, res) => {
//   const data = req.body
//   if (typeof data.item_id === 'string') {
//     data.item_id = [data.item_id]
//     data.item_amount = [data.item_amount]
//     data.item_variant = [data.item_variant]
//     data.item_additional_price = [data.item_additional_price]
//   }
//   const additionalPrice = data.item_additional_price
//   // .map(elem => parseInt(elem))
//   const items = await getProductsByIdAsync(data.item_id.map(id => parseInt(id)))
//   if (items.length > 0) {
//     const idUser = req.authUser.id
//     const code = codeTransaction(APP_TRANSACTION_PREFIX, idUser)
//     const totalSub = []
//     if (items.length === 1) {
//       const total = data.item_variant.map((item, idx) => (items[0].price + additionalPrice[idx]) * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
//       totalSub.push(total)
//     }
//     // if (items.length > 1) {
//     //   const total = items.map((item, idx) => (item.price + additionalPrice[idx]) * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
//     //   totalSub.push(total)
//     // }
//     const subTotal = parseInt(totalSub[0])
//     const tax = subTotal * 10 / 100
//     const shippingCost = 10000
//     const paymentMethod = data.payment_method
//     const total = subTotal + tax + shippingCost
//     const results = await getUser2(idUser)
//     if (results.length > 0) {
//       const shippingAddress = results[0].address
//       const setData = {
//         code, total, tax, shippingCost, shippingAddress, paymentMethod, idUser
//       }
//       if (!shippingAddress) {
//         return response(res, 400, false, 'you must complete the address data')
//       } else {
//         const successCreateTrx = await createTransactionAsync(setData)
//         if (successCreateTrx.affectedRows === 1) {
//           data.item_variant.forEach((v, i) => {
//             const setData = {
//               name: items[0].name,
//               price: items[0].price + additionalPrice[i],
//               variants: v,
//               amount: data.item_amount[i],
//               id_item: items[0].id,
//               code: code
//             }
//             createProductTransactionAsync(setData)
//             // console.log(`Item ${items[0].id} inserted to items_transactions`)
//           })

//           return response(res, 200, true, 'transaction successfully created')
//         }
//         // if (items.length > 1) {
//         //   items.forEach((item, idx) => {
//         //     const setData = {
//         //       name: item.name,
//         //       price: item.price + additionalPrice[idx],
//         //       variants: data.item_variant[idx],
//         //       amount: data.item_amount[idx],
//         //       id_item: item.id,
//         //       code: code
//         //     }
//         //     createProductTransactionAsync(setData)
//         //     // console.log(`Item ${items[0].id} inserted to items_transactions`)
//         //   })
//         // } return response(res, 200, true, 'Success add transaction!')
//       }
//     } else {
//       return response(res, 404, false, 'User not found')
//     }
//   } else {
//     return response(res, 404, false, 'id item not found')
//   }
// }

exports.deleteHistory = async (req, res) => {
  const { id } = req.authUser
  const results = await getTransactionById2(id)
  if (results.length > 0) {
    // console.log(results)
    await deleteHistory2(id)
    return response(res, 200, true, 'history has been deleted!')
  } else {
    return response(res, 404, false, 'history not found!')
  }
}

// exports.createTransaction = async (req, res) => {
//   const data = req.body
//   if (typeof data.item_id === 'string') {
//     data.item_id = [data.item_id]
//   }
//   if (typeof data.item_amount === 'string') {
//     data.item_amount = [data.item_amount]
//   }
//   if (typeof data.item_variant === 'string') {
//     data.item_variant = [data.item_variant]
//   }
//   const items = await getItemsByIdAsync(data.item_id.map(id => parseInt(id)))
//   if (items.length > 0) {
//     const code = codeTransaction(process.env.APP_TRANSACTION_PREFIX, 1)
//     const total = items.map((item, idx) => item.price * data.item_amount[idx]).reduce((acc, curr) => acc + curr)
//     const tax = total * (10 / 100)
//     const shippingCost = 1000
//     const paymentMethod = data.payment_method
//     const idUser = req.authUser.id
//     const results = await getUserByIdAsync(idUser)
//     if (results.length > 0) {
//       const shippingAddress = results[0].address
//       const finalData = {
//         code,
//         total,
//         tax,
//         shipping_cost: shippingCost,
//         shipping_address: shippingAddress,
//         payment_method: paymentMethod,
//         id_user: idUser
//       }
//       if (!shippingAddress) {
//         return response(res, 400, null, 'address must be filled')
//       } else {
//         const successCreateTrx = await createTransactionAsync(finalData)
//         if (successCreateTrx.affectedRows > 0) {
//           items.forEach((item, idx) => {
//             const dataFinal = {
//               name: item.name,
//               price: item.price,
//               amount: data.item_amount[idx],
//               id_item: item.id,
//               id_transactions: successCreateTrx.insertId,
//               variants: data.item_variant[idx]
//             }
//             createItemsTransaction(dataFinal)
//           })
//           return response(res, 200, null, 'transaction successfully created')
//         }
//       }
//     } else {
//       return response(res, 404, null, 'user not found!')
//     }
//   } else {
//     return response(res, 404, null, 'id product not found!')
//   }
// }
