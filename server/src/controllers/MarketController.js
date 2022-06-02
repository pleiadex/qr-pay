const {Market, User, sequelize} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
      expiresIn: ONE_WEEK
  })
}


module.exports = {
  async index (req, res) {
    try {
      // Get the # of users in each market
      const [markets, ] = await sequelize.query(
        "SELECT title, COUNT(Users.id) AS NumOfUsers FROM Users JOIN Markets ON Users.MarketId = Markets.id GROUP BY title"
      )
      res.send(markets)
    } catch (err) {
      console.log('ERR: fetching markets', err)
      res.status(500).send({
        error: 'An error has occured trying to fetch all the markets'
      })
    }
  },
  async post (req, res) {
    try { 
      // Divide req body into market data and user data
      const marketData = {
        title: req.body.title
      }

      const market = await Market.findOne({
        where: {
          title: marketData.title
        }
      })
      if (market) {
        return res.status(400).send({
          error: 'The title of market is already in use'
        })
      }
      const newMarket = await Market.create(marketData)

      // Check if there is any duplicate user name in the same market
      const user = await User.findAll({
        where: {
          name: req.body.name,
          MarketId: newMarket.id
        }
      })
      if (!user) {
        return res.status(400).send({
          error: 'This id is already in use'
        })
      }

      // Construct new user information; marketId
      const newUserData = {
        name: req.body.name,
        password: req.body.password,
        MarketId: newMarket.id,
        isAdmin: true
      }

      // Create the user
      const newUser = await User.create(newUserData)
      const newUserJson = newUser.toJSON()
      // TODO: Send the created market info and jwt token back (User Id, JWT token)
      res.send({
        market: newMarket,
        user: newUserJson,
        token: jwtSignUser(newUserJson)
      })


    } catch (err) {
      console.log('Create market error', err)
      res.status(500).send({
        error: 'An error has occured trying to create a market'
      })
    }
  },
  async delete (req, res) {
    try {
      const {marketId} = req.params
      const market = await Market.findOne({
        where: {
          id: marketId
        }
      })
      
      if (!market) {
        return res.status(401).send({
          error: 'You do not have access to delete this market'
        })
      }
      console.log(market)
      await market.destroy()
      res.send(market)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured trying to delete the market"
      })
    }
  }
}