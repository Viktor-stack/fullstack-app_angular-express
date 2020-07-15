const {Router} = require('express')
const controllers = require('../controllers/analytics')
const router = Router()

router.get('/overview',  controllers.overview)

router.get('/analytics',  controllers.analytics)


module.exports = router