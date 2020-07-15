const {Router} = require('express')
const passport = require('passport')
const controllers = require('../controllers/position')
const router = Router()

router.get('/:categoryId', passport.authenticate('jwt', {session: false}), controllers.getByCategoryID)
router.post('/', passport.authenticate('jwt', {session: false}), controllers.create)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controllers.remove)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controllers.update)

module.exports = router