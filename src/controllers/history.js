const { getTransByCondition, getTrans, deleteAll } = require('../models/history')
const { firstResponse: standardResponse } = require('../helpers/firstResponse')

exports.getTransaction = (req, res) => {
  const cond = req.query
  cond.search = cond.search || ''
  cond.limit = parseInt(cond.limit) || 15
  cond.offset = parseInt(cond.offset) || 0
  cond.page = parseInt(cond.page) || 1

  cond.offset = (cond.page * cond.limit) - cond.limit

  if (cond) {
    getTransByCondition(cond, (err, results, _fields) => {
      if (err) throw err
      return standardResponse(res, 200, true, 'List of items', results)
    })
  } else {
    getTrans((err, results, _fields) => {
      if (!err) {
        return standardResponse(res, 200, true, 'List of items', results)
      }
    })
  }
}

exports.deleteAllHistory = (req, res) => {
  deleteAll(req, (err, results) => {
    if (!err) {
      return standardResponse(res, 200, 'Delete Success', results)
    } else {
      return standardResponse(res, 404, 'Cant Delete', null)
    }
  })
}
