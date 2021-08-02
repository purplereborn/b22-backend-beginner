exports.response = (res, status = 200, results, message) => {
  let success = true
  if (status >= 400) {
    success = false
  }
  return res.status(status).json({
    success,
    results,
    message

  })
}
