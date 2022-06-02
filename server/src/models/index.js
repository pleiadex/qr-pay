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
db['Market'].hasMany(db['User'], {
    allowNull: false,
    contraints: true,
    onDelete: 'set null',
    onUpdate: 'cascade'
})
db['User'].belongsTo(db['Market'])


Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db)
    }
})

console.log('db', db)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
