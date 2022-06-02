const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser (user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
  async login (req, res) {
    try {
      const {name, password} = req.body
      const marketId = req.params.marketId

      const user = await User.findOne({
        where: {
          name: name,
          MarketId: marketId
        }
      })
      // If the user exists, check password
      if (user) {
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
          return res.status(403).send({
            error: 'The login information was incorrect'
          })
        }
        
        // Send user info back
        const userJson = user.toJSON()
        res.send({
          user: userJson,
          token: jwtSignUser(userJson)
        })
      }
      // Else register the user
      else {
        const newUserData = {
          name: name,
          password: password,
          MarketId: marketId,
          isAdmin: false
        }
        const newUser = await User.create(newUserData)
        const newUserJson = newUser.toJSON()
        res.send({
          user: newUserJson,
          token: jwtSignUser(newUserJson)
        })
      }
    } catch (err) {
      res.status(500).send({
        error: "An error has occured trying to enter the market"
      })
    }    
  }
}

