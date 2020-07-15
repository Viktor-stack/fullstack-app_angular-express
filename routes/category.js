const {Router} = require('express')
const passport = require('passport')
const category = require('../controllers/category')
const upload = require('../middleware/uploads')
const router = Router()

router.get('/', passport.authenticate('jwt', {session: false}), category.getAll)
router.get('/:id', passport.authenticate('jwt', {session: false}), category.getByID)
router.delete('/:id', passport.authenticate('jwt', {session: false}), category.remove)
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), category.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), category.update)

module.exports = router