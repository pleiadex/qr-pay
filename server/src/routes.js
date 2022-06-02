const MarketController = require("./controllers/MarketController")

module.exports = (app) => {
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