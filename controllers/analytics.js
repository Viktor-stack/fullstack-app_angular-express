const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function (req, res) {
  try {
    const allOrders = await Order.find({user: req.user.id}).sort({data: 1})
    const ordersMap = getOrdersMap(allOrders)
    const yesterdayOrders = ordersMap[
      moment().add(-1, 'd').format('DD.MM.YYYY')
      ] || []

    // Количество заказов вчера
    const yesterdayOrdersNumber = yesterdayOrders.length
    // Количество заказов
    const totalsOrdersNumber = allOrders.length
    // Количество Дней всего
    const daysNumber = Object.keys(ordersMap).length
    // Заказов в день
    const ordersPerDat = (totalsOrdersNumber / daysNumber).toFixed(0)
    // ((заказов всера \ количество заказов в дунь) -1) * 100
    // Процент для количество заказов
    const ordersPercent = (((totalsOrdersNumber / ordersPerDat) - 1) * 100).toFixed(2)
    // Общая выручка
    const totalGain = calculatePrice(allOrders)
    // Выручка в день
    const gainPerDay = totalGain / daysNumber
    // Выручка зп вчера
    const yesterdayGain = calculatePrice(yesterdayOrders)
    // Процент выручки
    const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
    // Сровнение выручки
    const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
    // Сравнение количество заказов
    const compareNumber = (yesterdayOrdersNumber - ordersPerDat).toFixed(2)

    res.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+compareGain),
        yesterday: +yesterdayGain,
        isHigher: gainPercent > 0
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: ordersPercent > 0
      }
    })

  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.analytics = function (req, res) {

}


function getOrdersMap(orders = []) {
  const daysOrder = {}
  orders.forEach(order => {
    const date = moment(order.data).format('DD.MM.YYYY')

    if (date === moment().format('DD.MM.YYYY')) {
      return
    }
    if (!daysOrder[date]) {
      daysOrder[date] = []
    }
    daysOrder[date].push(order)
  })
  return daysOrder
}


function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return orderTotal += item.cost * item.quantity
    }, 0)
    return total += orderPrice
  }, 0)
}