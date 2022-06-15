const {
  sequelize,
  User,
  Market,
  Transaction
} = require('../src/models')

const Promise = require('bluebird')
const users = require('./users.json')
const markets = require('./markets.json')
const transactions = require('./transactions.json')

module.exports = () => {
sequelize.sync({force: true})
  .then(async function () {
    await Promise.all(
      markets.map(market => {
        Market.create(market)
      })
    )

    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )
    await Promise.all(
      transactions.map(transaction => {
        Transaction.create(transaction)
      })
    )
  })
  .then(() => console.log('The initial data is created'))
}