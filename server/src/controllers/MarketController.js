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
        "SELECT Markets.id, title, COUNT(Users.id) AS numOfUsers FROM Users JOIN Markets ON Users.marketId = Markets.id GROUP BY title"
      )
      res.send(markets)
    } catch (err) {
      console.log('ERR: fetching markets', err)
      res.status(500).send({
        error: '시장 목록을 가져오는 중 서버에 문제가 생겼습니다. 다시 시도해주세요.'
      })
    }
  },
  async search (req, res) {
    try {
      const market = await Market.findOne({
        where: {
          id: req.params.marketId
        }
      })
      const marketJson = market.toJSON()
      res.send(marketJson)
    } catch (err) {
      res.status(400).send({
        error: '요청하신 시장은 존재하지 않습니다.'
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
          error: '동일한 이름의 시장이 존재합니다. 이름을 바꾸어주세요.'
        })
      }
      const newMarket = await Market.create(marketData)

      // Check if there is any duplicate user name in the same market
      const user = await User.findAll({
        where: {
          name: req.body.name,
          marketId: newMarket.id
        }
      })
      if (!user) {
        return res.status(400).send({
          error: '해당 시장에 같은 아이디가 이미 존재합니다.'
        })
      }

      // Construct new user information; marketId
      const newUserData = {
        name: req.body.name,
        password: req.body.password,
        marketId: newMarket.id,
        isAdmin: true
      }

      // Create the user
      const newUser = await User.create(newUserData)
      const newUserJson = newUser.toJSON()
      // Send the created market info and jwt token back (User Id, JWT token)
      res.send({
        market: newMarket,
        user: newUserJson,
        token: jwtSignUser(newUserJson)
      })
    } catch (err) {
      console.log('Create market error', err)
      res.status(500).send({
        error: '시장을 개설하는 중 서버에 문제가 생겼습니다. 다시 시도해주세요.'
      })
    }
  },

  async delete (req, res) {
    try {
      // Extract the user info from jwt token
      const userId = req.user.id
      const userMarketId = req.user.marketId.toString()
      const marketId = req.params.marketId.toString()

      // Check if the user is authroized from jwt token
      const isAuthorized = (await User.findOne({
        where: {
          id: userId,
          marketId: userMarketId
        }
      })).isAdmin

      // Compare market id from token and url parameter market id

      if (!(userMarketId === marketId) || !isAuthorized) {
        return res.status(401).send({
          error: '해당 시장에 권한이 없습니다.'
        })
      }

      const market = await Market.findByPk(userMarketId)
      
      if (!market) {
        return res.status(401).send({
          error: '해당 시장이 존재하지 않습니다.'
        })
      }
      await market.destroy()
      res.send(market)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "시장을 삭제하는 중 서버에 에러가 발생했습니다."
      })
    }
  }
}