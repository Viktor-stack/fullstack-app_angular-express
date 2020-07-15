const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({email: req.body.email})
  if (candidate) {
    // Проверка пороля Пользователь существует!!
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
    if (passwordResult) {
      // Генирацыя токина!
      const token = jwt.sign({
        email: candidate.email,
        userID: candidate._id
      }, keys.jwt, {expiresIn: 60 * 60})
      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      //Пароли не совпадают
      res.status(401).json({
        message: 'Пароли не совпадает Порробуйте снова'
      })
    }
  } else {
    // Ползоывтель не  найден
    res.status(404).json({
      message: 'Пользователь не найден с таким email'
    })
  }
}

module.exports.register = async function (req, res) {
  const candidate = await User.findOne({email: req.body.email})
  if (candidate) {
    // пользотватель сушеструет нужно дать ошибку
    res.status(409).json({
      message: 'Такой Email уже занят!'
    })
  } else {
    // Нужно создать пользователя
    const salt = await bcrypt.genSaltSync(10)
    const password = req.body.password
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    })
    try {
      await user.save()
      res.status(201).json({
        message: 'Пользователь создан',
        user
      })
    } catch (e) {
      // Обработать ошибку
      errorHandler(res, e)
    }
  }
}