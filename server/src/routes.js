const AuthenticationController = require("./controllers/AuthenticationController")
const MarketController = require("./controllers/MarketController")

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
  // TODO: bypass authentication controller
  app.delete('/markets/:marketId', 
    MarketController.delete
  )
}