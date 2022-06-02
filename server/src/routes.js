const AuthenticationController = require("./controllers/AuthenticationController")
const MarketController = require("./controllers/MarketController")
const isAuthenticated = require('./policies/isAuthenticated')

module.exports = (app) => {
  app.post('/markets/:marketId', 
  AuthenticationController.login
)
  app.get('/markets', 
    MarketController.index
  )
  app.post('/markets',
    MarketController.post
  )
  app.delete('/markets/:marketId', 
    isAuthenticated,
    MarketController.delete
  )
}