exports.firstResponse = (res, status = 200, success = true, message = 'This is Message', results) => {
  return res.status(status).json({
    success,
    message,
    results
  })
}
