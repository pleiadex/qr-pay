const { Transaction, User } = require('../models')
const { Op } = require('sequelize')
const QRCode = require('qrcode')
// const { totp, authenticator } = require('otplib')

// const secret = authenticator.generateSecret()

module.exports = {
  async index (req, res) {
    try {
      // Get all the transactions that belong to the user
      // Extract the user info from jwt token
      const userId = req.user.id
      const userMarketId = req.user.marketId.toString()
      const marketId = req.params.marketId.toString()

      if (userMarketId !== marketId) {
        return res.status(400).send({
          error: '잘못된 시장에서 거래 내역을 요청하고 있습니다. 다시 로그인해주세요.'
        })
      }

      let transactions = []
      transactions = await Transaction.findAll({
        attributes: [
          'id', 'goods', 'amount', 'updatedAt', 'marketId', 'sender.name', 'receiver.name'
        ],
        include: [
          { 
            model: User, 
            as: 'sender',
            attributes: ['name']
          },
          {
            model: User, 
            as: 'receiver',
            attributes: ['name']
          }
        ],
        where: {
          [Op.and]: [
            {marketId: marketId},
            {
              [Op.or]: [
                { senderId: userId },
                { receiverId: userId }
              ]
            }
          ]
        }
      })

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
    // transaction과 balance -> json wrapping 해서 넘기기
    res.send({
      balance: balance,
      transactions
    })
    } catch (err) {
      res.status(500).send({
        error: '모든 거래 내역을 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.'
      })
    }
  },
  async putMoney (req, res) {
    try {
      // Extract the user info from jwt token
      const userId = req.user.id
      const userMarketId = req.user.marketId.toString()
      const marketId = req.params.marketId.toString()
      const selectedUsers = req.body.selectedUsers
      const amount = req.body.amount
      let successUsers = []

      // Check if amount variable is not NAN and over 0
      if (isNaN(amount)) {
        return res.status(400).send({
          error: '입금 가격이 숫자가 아닙니다.'
        })
      }
      if (amount <= 0) {
        return res.status(400).send({
          error: '입금 가격은 0원 보다 커야합니다.'
        })
      }

      // Check the requesting user is authorized
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

      // Check if each user in selectedUser list is valid
      // If valid, make a record (ADMIN -> each user, amount)
      // TODO: All or nothing으로 구현하려면 어떻게 해야 할까? 모든 유저에게 지급되거나 아예 지급이 안 되거나; 현재는 중간에 문제가 있으면 생략하게 된다.
      /*
      주어진 selectedUsers의 이름 명단으로 query 결과의 튜플 수와 selectedUsers의 길이와 동일할 때만 for 문을 돌아간다.
      그런데 오류가 나더라도 없어진 유저에게 돈을 못 넣어도 다른 유저한테 넣어지는 게 더 사용자가 편할 것 같다.
      */
      for (const selectedUser of selectedUsers) {
        const user = await User.findOne({
          where: {
            name: selectedUser.name,
            marketId: marketId
          }
        })
        // Skip if the user does not exist
        if (!user) continue

        try {
          await Transaction.create({
            senderId: userId,
            receiverId: user.id,
            amount: amount,
            marketId: marketId,
            goods: '관리자 지급'
          })
          successUsers.push(selectedUser.name)
        } catch (err) {
          console.log(err)
          continue
        }
      }

      res.send(successUsers)
      
    } catch (err) {
      res.status(500).send({
        error: '선택된 사용자에게 입금하는 과정에서 문제가 발생했습니다.'
      })
      console.log(err)
    }
  },
  async sell (req, res) {
    // 판매자 확인
    // req.body: goods, price, identifier(qr-pay://)
    try {
      const userName = req.user.name
      const marketId = req.user.marketId
      const { goods, price } = req.body
      const identifier = 'qr-pay://'

      // body data type 확인
      if (isNaN(price)) {
        return res.status(400).send({
          error: '가격은 숫자로 입력해주세요.'
        })
      }
  
      // topt 발행: 사용자 QR코드 생성 시간 기준이 아닌 서버 시간 기준으로 30초씩 초기화해서 원하는 방식이 아님; 삭제함.
      // const token = totp.generate(secret)
      // console.log(token)
  
      const url = `${identifier}sellerName=${userName}&marketId=${marketId}&goods=${goods}&price=${price}`
      const encodedUrl = encodeURIComponent(url)
  
      // QRCode 생성
      const qrCodeUrl = await QRCode.toDataURL(encodedUrl)
      res.send(qrCodeUrl)

    } catch (err) {
      res.status(500).send({
        error: 'QR 코드를 생성하는 중 서버에 문제가 생겼습니다.'
      })
    }
  },
  async purchase (req, res) {
    try {
      const userId = req.user.id
      const userName = req.user.name
      const userMarketId = req.user.marketId
      const {sellerName, marketId, goods, price} = req.body

      // body data type 다 확인하기
      if (isNaN(price)) return res.status(400).send({error: '가격은 숫자이어야 합니다.'})

      if (userName.toString() === sellerName.toString()) return res.status(400).send({error: '판매자와 구매자가 동일합니다.'})

      if (!(userMarketId.toString() === marketId.toString())) return res.status(400).send({error: '잘못된 시장에 접속했습니다. 다시 로그인 해주세요.'})

      // totp 확인하기
      // const isValid = totp.check(otp, `secret`)
      // if (!isValid) return res.status(400).send({error: '유효하지 않은 QR 코드입니다. QR 코드를 다시 생성해주세요.'})

      // Search seller by name
      const seller = await User.findOne({
        where: {
          marketId: marketId,
          name: sellerName
        }
      })
      if (!seller) return res.status(400).send({error: '판매자를 확인할 수 없습니다.'})

      // 구매자 잔고 확인하기
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
      if (balance < price) return res.status(400).send({error: '잔고가 부족합니다.'})

      // Create transaction
      const transaction = await Transaction.create({
        senderId: userId,
        receiverId: seller.id,
        amount: price,
        marketId: marketId,
        goods: goods
      })
      res.send(transaction)

    } catch (err) {
      res.status(500).send({
        error: '구매를 하는 과정에서 서버에 문제가 생겼습니다.'
      })
    }
  }
}