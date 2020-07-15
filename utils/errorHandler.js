module.exports = (res, error) => {
  res.status(500).json({
    session: false,
    message: error.message ? error.message : error
  })
}