const AuthenticationController = require("./controllers/AuthenticationController")
const MarketController = require("./controllers/MarketController")
const TransactionController = require('./controllers/TransactionController')
const isAuthenticated = require('./policies/isAuthenticated')

module.exports = (app) => {
  app.post('/markets/:marketId/login', 
    AuthenticationController.login
  )
  app.post('/markets/:marketId/change-password',
    isAuthenticated,
    AuthenticationController.changePassword
  )
  app.get('/markets/:marketId/admin',
    isAuthenticated,
    AuthenticationController.getAllUsersOfMarket
  )
  app.put('/markets/:marketId/reset-passwords',
    isAuthenticated,
    AuthenticationController.resetMultiplePasswords
  )
  app.delete('/markets/:marketId/delete-users',
    isAuthenticated,
    AuthenticationController.deleteUsers
  )
  app.get('/user',
    isAuthenticated,
    AuthenticationController.isTokenValid
  )
  app.get('/markets', 
    MarketController.index
  )
  app.post('/markets',
    MarketController.post
  )
  app.get('/markets/:marketId',
    MarketController.search
  )
  app.delete('/markets/:marketId', 
    isAuthenticated,
    MarketController.delete
  )
  app.get('/markets/:marketId/transactions',
    isAuthenticated,
    TransactionController.index
  )
  app.post('/markets/:marketId/transactions',
    isAuthenticated,
    TransactionController.putMoney
  )
  app.post('/markets/:marketId/sell',
    isAuthenticated,
    TransactionController.sell
  )
  app.post('/markets/:marketId/purchase',
    isAuthenticated,
    TransactionController.purchase
  )
}