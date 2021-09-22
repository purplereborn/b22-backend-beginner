const itemModel = require('../models/items')
const timeHelper = require('../helpers/time')
const { firstResponse: standardResponse } = require('../helpers/firstResponse')
const { APP_URL } = process.env

exports.getItems = async (req, res) => {
  const cond = req.query
  cond.search = cond.search || ''
  cond.sort = cond.sort || {}
  cond.sort.name = cond.sort.name || 'asc'
  cond.limit = parseInt(cond.limit) || 8
  cond.offset = parseInt(cond.offset) || 0
  cond.page = parseInt(cond.page) || 1
  cond.offset = (cond.page * cond.limit) - cond.limit
  const pageInfo = {}

  try {
    const result = await itemModel.getAllItems(cond)
    result.map((e) => {
      if (e.picture !== null) {
        e.picture = `${APP_URL}${e.picture}`
      }
      return e
    })
    const resultCount = await itemModel.getAllItems2(cond)
    // console.log(resultCount)
    const totalData = resultCount[0].count
    const totalPage = Math.ceil(totalData / cond.limit)
    pageInfo.totalData = totalData
    pageInfo.currentPage = cond.page
    pageInfo.totalPage = totalPage
    pageInfo.limitPage = cond.limit
    pageInfo.nextPage = cond.page < totalPage ? `${APP_URL}/items?page=${cond.page + 1}` : null
    pageInfo.prevPage = cond.page <= totalPage || cond.page === 1 ? `${APP_URL}/items?page=${cond.page - 1}` : null
    if (pageInfo.prevPage.endsWith('0')) {
      pageInfo.prevPage = null
    }
    if (result.length === 0) {
      return standardResponse(res, true, 'Empty Item', 200)
    }
    return res.status(200).json({
      success: true,
      message: 'Item list',
      results: result,
      pageInfo: pageInfo
    })
  } catch (err) {
    return standardResponse(res, 400, false, 'Item not found!')
  }
}

// exports.getItems = (req, res) => {
//   const cond = req.query
//   cond.search = cond.search || ''
//   cond.limit = parseInt(cond.limit) || 12
//   cond.offset = parseInt(cond.offset) || 0
//   cond.page = parseInt(cond.page) || 1

//   cond.offset = (cond.page * cond.limit) - cond.limit

//   if (cond) {
//     itemModel.getItemsByCondition(cond, (err, results, _fields) => {
//       if (err) throw err
//       return standardResponse(res, 200, true, 'List of items', results)
//     })
//   } else {
//     itemModel.getItems((err, results, _fields) => {
//       if (!err) {
//         return standardResponse(res, 200, true, 'List of items', results)
//       }
//     })
//   }
// }

const itemPicture = require('../helpers/uploads2').single('picture')

exports.createItem = (req, res) => {
  itemPicture(req, res, err => {
    if (err) throw err
    // req.body.picture = `${process.env.APP_UPLOAD_ROUTE}/${req.file.filename}`
    req.body.picture = req.file ? `${process.env.APP_UPLOAD_ROUTE}/${req.file.filename}` : null
    itemModel.createItem(req.body, (err, results) => {
      if (err) throw err
      if (results.affectedRows) {
        return standardResponse(res, 200, true, 'Item created successfully')
      } else {
        return standardResponse(res, 400, false, 'failed to create items')
      }
    })
  })
}

exports.updateItemPartially = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  itemModel.getItemsById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const key = Object.keys(req.body)
        if (key.length > 1) {
          return res.status(400).json({
            success: false,
            message: 'System just need only one column'
          })
        } else {
          const firstColumn = key[0]
          const updateData = { id, updated_at: timeHelper.now(), [firstColumn]: req.body[firstColumn] }
          itemModel.updateItemPartial(updateData, (err, results, _fields) => {
            if (!err) {
              return res.status(200).json({
                success: true,
                message: 'Item updated successfully'
              })
            } else {
              console.log(err)
              return res.status(500).json({
                success: false,
                message: 'An error accurred'
              })
            }
          })
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        })
      }
    }
  })
}

exports.updateItem = (req, res) => {
  const { id } = req.params
  itemModel.getItemsById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const { name, price } = req.body
        const updateData = { id, name, price, updated_at: timeHelper.now() }
        itemModel.updateItem(updateData, (err, results, _fields) => {
          if (!err) {
            return res.status(200).json({
              success: true,
              message: 'Item updated successfully'
            })
          }
        })
      }
    }
  })
}

exports.deleteItem = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  itemModel.getItemsById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        itemModel.deleteItem(id, (err, results, _fields) => {
          if (!err) {
            return res.status(200).json({
              success: true,
              message: 'Item has been deleted'
            })
          }
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        })
      }
    }
  })
}

exports.getDetailItem = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  itemModel.getItemsById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length === 1) {
        const item = results[0]
        if (item.picture !== null && !item.picture.startsWith('http')) {
          item.picture = `${process.env.APP_URL}${item.picture}`
        }
        return res.status(200).json({
          success: true,
          message: 'Detail item',
          results: item
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'item not found'
        })
      }
    }
  })
}
