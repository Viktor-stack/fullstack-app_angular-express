const {Router} = require('express')
const router = Router()

// Заглушка на сервер!!
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Сервер на Node.JS работает!!!!'
  })
})


module.exports = router