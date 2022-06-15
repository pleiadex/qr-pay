const {User, Transaction} = require('../models')
const { Op } = require('sequelize')
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
          marketId: marketId
        }
      })
      // If the user exists, check password
      if (user) {
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
          return res.status(403).send({
            error: '해당 아이디는 존재하나, 비밀번호가 일치하지 않습니다.'
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
          marketId: marketId,
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
        error: "시장에 입장하는 중 서버에 문제가 생겼습니다. 다시 시도해주세요."
      })
    }    
  },
  async changePassword (req, res) {
    try {
      const userId = req.user.id
      const {oldPassword, newPassword} = req.body
  
      // Check user info is correct
      const user = await User.findByPk(userId)

      // If the user does not exsit
      if (!user) {
        return res.status(400).send({
          error: '현재 사용중인 계정을 찾을 수 없습니다.'
        })
      }
  
      // The old password is not correct
      if (! await user.comparePassword(oldPassword)) {
        return res.status(400).send({
          error: "기존 비밀번호가 일치하지 않습니다."
        })
      }
  
      // Update the user's password
      const newUser = await user.update({
        password: newPassword
      })
      res.send(newUser)
    } catch (err) {
      res.status(500).send({
        error: '비밀번호 변경 중 문제가 발생했습니다. 다시 시도해주세요.'
      })
    }
  },
  async resetMultiplePasswords (req, res) {
    try {
      const adminUserId = req.user.id
      const userMarketId = req.user.marketId.toString()
      const marketId = req.params.marketId.toString()
      const selectedUsers = req.body
      let affectedUsers = []

      const isAuthorized = (await User.findOne({
        where: {
          id: adminUserId,
          marketId: userMarketId
        }
      })).isAdmin

      // Compare market id from token and url parameter market id
      if (!(userMarketId === marketId) || !isAuthorized) {
        return res.status(401).send({
          error: '해당 시장에 권한이 없습니다.'
        })
      }

      for (const selectedUser of selectedUsers) {
        const user = await User.findOne({
          where: {
            marketId: marketId,
            name: selectedUser.name
          }
        })
        // 유저가 존재하지 않으면 제외
        if (!user) continue

        await user.update({
          password: '1234'
        })
        affectedUsers.push(selectedUser.name)
      }
      res.send(affectedUsers)

    } catch (err) {
      return res.status(500).send({
        error: '비밀번호를 초기화 중 서버에 문제가 생겼습니다.'
      })
    }
  },
  async deleteUsers (req, res) {
    try {
      const adminUserId = req.user.id
      const userMarketId = req.user.marketId.toString()
      const marketId = req.params.marketId.toString()
      const selectedUsers = req.body
      let deletedUsers = []

      // Check if the user is authroized from jwt token
      const isAuthorized = (await User.findOne({
        where: {
          id: adminUserId,
          marketId: userMarketId
        }
      })).isAdmin

      // Compare market id from token and url parameter market id
      if (!(userMarketId === marketId) || !isAuthorized) {
        return res.status(401).send({
          error: '해당 시장에 권한이 없습니다.'
        })
      }

      // Get each user and delete
      for (const selectedUser of selectedUsers) {
        // 만약 삭제하려는 이름이 관리자 자신일 경우 제외하기
        if (selectedUser.name.toString() === req.user.name.toString()) continue
        const user = await User.findOne({
          where: {
            name: selectedUser.name,
            marketId: marketId
          }
        })
        // 사용자가 존재하지 않을 경우 제외하기
        if (!user) {
          continue
        }
        await user.destroy()
        deletedUsers.push(selectedUser.name)
      }
      res.send(deletedUsers)

    } catch (err) {
      console.log(err)
      return res.status(500).send({
        error: '사용자 삭제 중 서버에 문제가 생겼습니다.'
      })
    }
  },
  async getAllUsersOfMarket(req, res) {
    try {
      // verify the admin
      const adminUserId = req.user.id
      const userMarketId = req.user.marketId.toString()
      const marketId = req.params.marketId.toString()
      let userList = []

      // Check if the user is authroized from jwt token
      const isAuthorized = (await User.findOne({
        where: {
          id: adminUserId,
          marketId: userMarketId
        }
      })).isAdmin

      // Compare market id from token and url parameter market id
      if (!(userMarketId === marketId) || !isAuthorized) {
        return res.status(401).send({
          error: '해당 시장에 권한이 없습니다.'
        })
      }

      // Get all users in the market
      const users = await User.findAll({
        where: {
          marketId: marketId,
          isAdmin: false
        }
      })

      // Loop through the result users array and get its balance
      for (const user of users) {
        const userName = user.dataValues.name
        const userId = user.dataValues.id

        // balance 계산
        const balance = await Transaction.sum(
          'amount',
          {
            where: {
              [Op.and]: [
                { marketId: marketId },
                { receiverId: userId }
              ]
            }
          }
        )
        -
        await Transaction.sum(
          'amount',
          {
            where: {
              [Op.and]: [
                { marketId: marketId },
                { senderId: userId }
              ]
            }
          }
        )
        userList.push({
          name: userName,
          balance: balance
        })
      }

      res.send(userList)

    } catch (err) {
      return res.status(400).send({
        error: '해당 시장에 사용자가 존재하지 않습니다.'
      })
    }
  },
  async isTokenValid (req, res) {
    const userId = req.user.id

    try {
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(400).send({
          error: '토큰이 유효하지 않습니다.'
        })
      }
      res.send(true)
    } catch (err) {
      res.status(500).send({
        error: '해당 사용자를 찾는 도중 서버에 문제가 생겼습니다.'
      })
    }
  }
}

