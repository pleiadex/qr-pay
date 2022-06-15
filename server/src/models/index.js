const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options,
)

fs
    .readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.js'
    )
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })



// Define joinedMarketId foreign key from Market table
// db['Market'].hasMany(db['User'], {
//     allowNull: false,
//     contraints: true,
//     onDelete: 'set null',
//     onUpdate: 'cascade'
// })
db['User'].belongsTo(db['Market'], {as: 'market'})

// Transaction 'marketId' references Market 'id' (One to Many)
// db['Market'].hasMany(db['Transaction'], {
//     allowNull: false,
//     contraints: true,
//     onDelete: 'set null',
//     onUpdate: 'cascade'
// })
db['Transaction'].belongsTo(db['Market'], {as: 'market'})

// Transaction 'senderId' and 'receiverId' reference User 'id' (Many to One)
db['Transaction'].belongsTo(db['User'], {as: 'sender'})
db['Transaction'].belongsTo(db['User'], {as: 'receiver'})



Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db)
    }
})

console.log('db', db)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
