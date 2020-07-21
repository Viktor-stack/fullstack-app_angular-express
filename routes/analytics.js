const {Router} = require('express')
const controllers = require('../controllers/analytics')
const passport = require("passport");
const router = Router()

router.get('/overview', passport.authenticate('jwt', {session: false}), controllers.overview)

router.get('/analytics',  passport.authenticate('jwt', {session: false}), controllers.analytics)


module.exports = router